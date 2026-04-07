from flask import Blueprint, request, jsonify
from services.database_service import DatabaseService
from services.notification_service import NotificationService
from services.session_service import SessionService
import logging
from health_status import HealthStatus
from datetime import datetime, timedelta, timezone
import re
from injury_codes import generate_code

db_service = DatabaseService()
session_service = SessionService()
notification_service = NotificationService()

health_bp = Blueprint('health', __name__)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)


@health_bp.route('/report', methods=['POST'])
def health_report():
    """
    Handles new report submissions from athletes, updating their health status
    wherever required before inserting report data into database. If the athlete
    is injured, their respective coach recieves a push notification.

    Returns:
        JSON response indicating success or failure of report submission.
    """

    try:
        report = request.get_json()
        report_data = {
            "user": report.get('user_id'),
            "user_data": report.get('user_data'),
            "session": report.get('session'),
            "answers": report.get('answers_list'),
        }
        logger.info(f"Received new health report: {report_data}")

        estimated_recovery_date = None

        # Healthy athlete's submission
        proposed_status = HealthStatus.GREEN
        injury_code = None
        side = "N/A"

        # Acquire injury location and type, generate injury code
        if report_data['answers'].get('injured'):
            if report_data['answers'].get('expected_outage'):

                # Extract days from string
                outage_days = int(
                    re.split(r'[+\s]+', report_data['answers'].get('expected_outage'))[0])
                restriction = report_data['answers'].get('missed_activity')
                estimated_recovery_date = (
                    datetime.now() + timedelta(days=outage_days)).isoformat()

                if restriction == "Competing Only":
                    proposed_status = HealthStatus.AMBER
                elif restriction == "Training & Competing":
                    proposed_status = HealthStatus.RED

                # Fetch coaches associated with athlete's teams
                athlete_response = db_service.fetch(
                    table="athlete_teams",
                    filters={"athlete_id": report_data['user']},
                    select="teams(coach_id)"
                )

                if athlete_response and athlete_response.data:
                    coach_ids = set()
                    for item in athlete_response.data:
                        if item.get('teams') and item['teams'].get('coach_id'):
                            coach_ids.add(item['teams']['coach_id'])

                    # Fetch push tokens of each coach                    
                    if coach_ids:
                        coach_response = db_service.fetch(
                            table="users",
                            modifiers={"in_": ("id", list(coach_ids))},
                            select="push_token"
                        )
                        
                        # Notify coaches of athlete's injury
                        if coach_response and coach_response.data:
                            for coach in coach_response.data:
                                push_token = coach.get("push_token")
                                if push_token:
                                    notification_service.send_notification(
                                        push_token=push_token,
                                        title="An athlete is injured!",
                                        body=f"{report_data.get('user_data').get('name')} suffered an injury and is expecting absence. Tap to view more details."
                                    )

            injury_location = report_data['answers'].get('injury_location')
            injury_type = report_data['answers'].get('injury_type')

            # Account for injuries that may occur on either left or right side
            if injury_location and (injury_location.startswith("Left") or injury_location.startswith("Right")):
                split_str = injury_location.split(' ', 1)
                if len(split_str) == 2:
                    side = split_str[0]
                    location = split_str[1]
                else:
                    location = split_str[0]
            else:
                side = "N/A"
                location = injury_location
            injury_code = generate_code(location, injury_type)

            # Set code to M for illness cases
            if report_data['answers'].get('ill'):
                injury_code = 'M'

            # Update athlete's health status based on report data
            update_data = {
                "status": proposed_status.value,
                "report_due": False
            }

            if proposed_status in [HealthStatus.AMBER, HealthStatus.RED]:
                update_data["injury_date"] = datetime.now().isoformat()
                if estimated_recovery_date:
                    update_data["estimated_recovery_date"] = estimated_recovery_date

            else:
                # Clear injury data if status is green
                update_data["estimated_recovery_date"] = None

            try:
                # Update athlete's health status in the database
                db_service.update(
                    table="athletes", 
                    data=update_data, 
                    filters={"id": report_data['user']})
                
                logger.info(
                    f"Updated athlete's status: Recovery date: {estimated_recovery_date}, Proposed status: {proposed_status.value}")

            except Exception as e:
                logger.error(f"Error updating athlete's health status: {e}")
                return jsonify(error="Failed to update health status"), 500

            try:
                # Log to session events
                session = report_data.get('session')
                session_service.log_event(
                    session_id=session,
                    event_type="report_submission",
                    event_data={
                        "athlete_id": report_data['user'],
                    },
                    endpoint="/health/report",
                )
                logger.info(
                    f"Logged report submission event for session {session}")
            except Exception as e:
                logger.error(f"Error logging session event: {e}")

            # Insert health report into database
            submission_data = {
                "athlete_id": report_data['user'],
                "injured": report_data['answers'].get('injured'),
                "rpe": report_data['answers'].get('rpe'),
                "ill": report_data['answers'].get('ill'),
                "injury_code": injury_code,
                "timeloss": report_data['answers'].get('timeloss'),
                "injury_side": side,
                "injury_onset": report_data['answers'].get('injury_onset'),
                "new_availability": proposed_status,
                "consulted": report_data['answers'].get('consulted'),
                "comments": report_data['answers'].get('comments'),
            }
            db_service.insert("reports", data=submission_data)

            logger.info("Inserted new report to database")
            return jsonify(message="Health report submitted successfully"), 201

    except Exception as e:
        logger.error(f"Error submitting health report: {e}")
        return jsonify(error=str(e)), 500


@health_bp.route('/followup_report', methods=['POST'])
def followup_report():
    """
    Handles submission of follow-up reports; an athlete providing their
    recovery progress following an injury.
    """
    report = request.get_json()
    report_data = {
        "user": report.get('user_id'),
        "user_data": report.get('user_data'),
        "session": report.get('session'),
        "answers": report.get('answers_list'),
    }

    try:
        # Athlete ready to return
        if report_data["answers"].get("availability") == "Fully available":
            update_data = {
                "status": HealthStatus.GREEN,
                "report_due": False
            }
            db_service.update(
                table="athletes",
                data=update_data,
                filters={"id": report_data['user']})

        # Otherwise get expected return date if provided
        else:
            # New expected return date
            if report_data['answers'].get('expected_return'):
                expected_return = int(
                    re.split(r'[+\s]+', report_data['answers'].get('expected_return'))[0])
                estimated_recovery_date = (
                    datetime.now() + timedelta(days=expected_return)).isoformat()

                update_data = {
                    "report_due": False,
                    "status": report_data['answers'].get('availability'),
                    "estimated_recovery_date": estimated_recovery_date
                }

            # No return date submited, keep as is
            else:
                update_data = {
                    "report_due": False,
                    "status": report_data['answers'].get('availability')
                }
            db_service.update(
                table="athletes",
                data=update_data,
                filters={"id": report_data["user"]})

    except Exception as e:
        logger.error(f"Error updating athlete data upon follow-up report: {e}")
        return jsonify(error=str(e)), 500

    try:
        # Get original report that notified of initial injury
        original_report = db_service.fetch(
            table="reports",
            filters={"athlete_id": report_data['user'], "timeloss": True},
            modifiers={
                "order": {"column": "created_at", "desc": True},
                "limit": 1
            },
            select={"report_id"}
        )
        logger.info(original_report)

        submission_data = {
            "report_id": original_report.data[0].get("report_id") if original_report.data else None,
            "athlete_id": report_data["user"],
            "rpe": report_data['answers'].get('rpe'),
            "recovery_progress": report_data['answers'].get('recovery_progress'),
            "practitioner_contact": report_data['answers'].get('practitioner_contact'),
            "new_availability": report_data['answers'].get('availability'),
            "comments": report_data['answers'].get('comments')
        }

        # Submit follow-up report to database
        try:
            db_service.insert(
                table="followup_reports",
                data=submission_data
            )
            logger.info("Follow-up report submitted successfully")
            return jsonify(message="Follow-up report submitted successfully"), 200

        except Exception as e:
            logger.error(f"Error submitting follow-up report: {e}")
            return jsonify(error=str(e)), 500

    except Exception as e:
        logger.error(f"Error fetching original report: {e}")
        return jsonify(error=str(e)), 500


@health_bp.route('/status/<user_id>', methods=['GET'])
def get_status(user_id):
    """
    Retrieves the health status of an athlete from Supabase by user ID

    Args:
        user_id (str): The UUID of the athlete.

    Returns:
        JSON response with the athlete's health status or error message.
    """
    try:
        user = db_service.fetch("athletes", filters={"id": user_id})

        if user.data:
            reports = db_service.fetch(
                table="reports",
                filters={"athlete_id": user_id}
            )
            health_status_value = user.data[0].get('status')
            injury_date = user.data[0].get('injury_date')
            report_streak = user.data[0].get('report_streak')
            date_obj = user.data[0].get('estimated_recovery_date')

            estimated_recovery_date = None
            if date_obj:
                estimated_recovery_date = date_obj.split('T')[0]
                estimated_recovery_date = datetime.strptime(
                    estimated_recovery_date, '%Y-%m-%d')
                estimated_recovery_date = estimated_recovery_date.strftime(
                    "%d %B")

            return jsonify(
                user_id=user_id,
                reports_count=len(reports.data) if reports.data else 0,
                health_status=health_status_value,
                injury_date=injury_date,
                estimated_recovery_date=estimated_recovery_date,
                report_streak=report_streak,
            ), 200

        else:
            logger.warning(f"User of ID {user_id} not found.")
            return jsonify(message="User not found"), 404

    except Exception as e:
        logger.error(f"Error retrieving health status for user {user_id}: {e}")
        return jsonify(error=str(e)), 500


@health_bp.route('/check_due/<user_id>', methods=['GET'])
def check_report_due(user_id):
    """
    Checks database for a boolean value for whether a report by an athlete is 
    due. Value is recurringly updated by a cron job on Supabase at 7am daily.

    Parameters:
        user_id (uuid): User to be queried.

    Returns:
        JSON object with boolean value or message.    
    """

    try:
        response = db_service.fetch("athletes", filters={"id": user_id})

        if response and response.data:
            due = response.data[0].get('report_due')

            logger.info(f"Report due status for user {user_id}: {due}")
            return jsonify(due), 200
        else:
            logger.warning(f"User of ID {user_id} not found.")
            return jsonify(message="User not found"), 404

    except Exception as e:
        logger.error(
            f"Error retrieving report_due value for user {user_id}: {e}")
        return jsonify(error=str(e)), 500


@health_bp.route('/get_recent_report/<user_id>', methods=['GET'])
def get_recent_report(user_id):
    """
    Acquires the most recent report and calculate the time difference 
    between now and submission time. Submission time is shown to coaches
    when viewing their team overview.

    Parameters:
        user_id (uuid): The athlete to be queried

    Returns:
        JSON response with the time difference or error.
    """
    try:
        response = db_service.fetch(
            "reports",
            filters={"athlete_id": user_id},
            modifiers={"order": {"column": "created_at", "desc": True}}
        )
        if response and response.data:
            logger.info("Fetching most recent report for each athlete")
            now = datetime.now()
            recent = datetime.fromisoformat(
                # Account for timezone formatting
                response.data[0].get('created_at').replace('+00:00', ''))
            time_since = ""

            # Report submitted today - measure in hours/minutes
            if now.date() == recent.date():
                time_diff = now - recent
                total_minutes = int(time_diff.total_seconds() / 60)

                if total_minutes < 60:
                    time_since = f"{total_minutes} minutes ago"
                else:
                    hours = total_minutes // 60
                    time_since = f"{hours} hour{'s' if total_minutes != 1 else ''} ago"

            # More than a day ago - measure in days
            else:
                time_since = f"{(now.date() - recent.date()).days} days ago"

            logger.info(f"Fetched recent reports")
            return jsonify(time_since), 200
        else:
            logger.warning(f"No reports for user {user_id}")
            return jsonify(f"None submitted"), 200

    except Exception as e:
        logger.error(f"Error retrieving recent report for user {user_id}: {e}")
        return jsonify(error=str(e)), 500
