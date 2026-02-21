from flask import Blueprint, request, jsonify
from services.database_service import DatabaseService
import logging
from health_status import HealthStatus
from datetime import datetime, timedelta
import re

db_service = DatabaseService()
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
    wherever required before inserting report data into database.

    Returns:
        JSON response indicating success or failure of report submission.
    """

    proposed_status = HealthStatus.GREEN

    try:
        report = request.get_json()
        report_data = {
            "user": report.get('user_id'),
            "answers": report.get('answers_list'),
        }
        logger.info(f"Received new health report: {report_data}")

        estimated_recovery_date = None
    
        if report_data['answers'].get('expected_outage'):
            # Extract days from string 
            outage_days = int(re.split(r'[+\s]+', report_data['answers'].get('expected_outage'))[0])
            restriction = report_data['answers'].get('missed_activity')
            estimated_recovery_date = (datetime.now() + timedelta(days=outage_days)).isoformat()

            if restriction == "Competing Only":
                proposed_status = HealthStatus.AMBER
            elif restriction == "Training & Competing":
                proposed_status = HealthStatus.RED

        # Update athlete's health status based on report data
        update_data = {
            "status": proposed_status.value
        }

        if proposed_status in [HealthStatus.AMBER, HealthStatus.RED]:
            update_data["injury_date"] = datetime.now().isoformat()
            if estimated_recovery_date:
                update_data["estimated_recovery_date"] = estimated_recovery_date
        
        else:
            # Clear injury data if status is green
            update_data["injury_date"] = None
            update_data["estimated_recovery_date"] = None

        try:
            # Update athlete's health status in the database
            db_service.update("athletes", data=update_data, filters={"id": report_data['user']})
            logger.info(f"Updated athlete's status: Recovery date: {estimated_recovery_date}, Proposed status: {proposed_status.value}")

        except Exception as e:
            logger.error(f"Error updating athlete's health status: {e}")
            return jsonify(error="Failed to update health status"), 500
        
        # Insert health report into database
        report_insert_data = {
            "athlete_id": report_data['user'],
            "injured": report_data['answers'].get('injured'),
            "ill": report_data['answers'].get('ill'),
            "injury_type": report_data['answers'].get('injury_type'),
            "timeloss": report_data['answers'].get('timeloss'),
            "injury_location": report_data['answers'].get('injury_location'),
            "injury_onset": report_data['answers'].get('injury_onset'),
            "consulted": report_data['answers'].get('consulted'),
            "comments": report_data['answers'].get('comments'),
        }
        db_service.insert("reports", data=report_insert_data)

        logger.info("Inserted new report to database")
        return jsonify(message="Health report submitted successfully"), 201

    except Exception as e:
        logger.error(f"Error submitting health report: {e}")
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
            health_status_value = user.data[0].get('status')
            injury_date = user.data[0].get('injury_date')
            estimated_recovery_date = user.data[0].get('estimated_recovery_date')

            return jsonify(
                user_id=user_id,
                health_status=health_status_value,
                injury_date=injury_date,
                estimated_recovery_date=estimated_recovery_date
            ), 200
        
        else:
            logger.warning(f"User of ID {user_id} not found.")
            return jsonify(message="User not found"), 404

    except Exception as e:
        logger.error(f"Error retrieving health status for user {user_id}: {e}")
        return jsonify(error=str(e)), 500
    

@health_bp.route('/stats/<athlete_id>', methods=['GET'])
def get_athlete_stats(athlete_id):
    """
    Retreives health statistics for an athlete, providing insights on 
    reported injuries, streaks, recovery dates, etc.
    """

    try:
        # Fetch reports for the given athlete.
        reports = db_service.fetch("reports", filters={"athlete_id": athlete_id})

        # Calculate consecutive submitted reports
        consecutive_days = 0
        if reports.data:
            report_dates = sorted([r.get("created_at") for r in reports.data])

            for i, date_str in enumerate(report_dates):
                # Compare current report's creation date with expected date, being i days 
                # prior to today. Break if there's any mismatch
                report_date = datetime.fromisoformat(date_str)
                expected_date = datetime.now().date() - timedelta(days=i)

                if report_date == expected_date:
                    consecutive_days += 1
                else:
                    consecutive_days = 0
                    break

        return jsonify(
            report_count=len(reports.data) if reports.data else 0,
            consecutive_reports=consecutive_days
        ), 200
    
    except Exception as e:
        logger.error(f"Error when fetching athlete stats: {e}")
        return jsonify(error=str(e)), 500
