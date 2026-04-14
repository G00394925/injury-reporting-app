from flask import Blueprint, request, jsonify
from services.database_service import DatabaseService
from services.scheduler_service import SchedulerService
from health_status import HealthStatus
import logging
from datetime import datetime, timedelta
import os


admin_bp = Blueprint('admin', __name__)
db_service = DatabaseService()

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)


@admin_bp.route('/trigger_reminders', methods=['POST'])
def trigger_reminders():
    """
    An endpoint to be triggered by GitHub Actions, sending reminder notifications
    to athletes who have not submitted their daily report.
    """

    # Get secret from request headers
    auth_header = request.headers.get('Authorization')
    secret = os.environ.get('SCHEDULER_SECRET')

    # Assert the secret exists and matches the expected value
    if not auth_header or auth_header != f"Bearer {secret}":
        logger.warning("Unauthorized access to trigger_reminders endpoint")
        return jsonify(error="Unauthorized"), 401

    try:
        logger.info("Triggering scheduler to send daily reminders")
        # Invoke scheduler to send notifications
        scheduler_service = SchedulerService()
        scheduler_service._send_daily_reminders()

        logger.info("Daily reminders triggered successfully")
        return jsonify(message="Daily reminders triggered successfully"), 200
    except Exception as e:
        logger.error(f"Error triggering daily reminders: {e}")
        return jsonify(error=str(e)), 500


@admin_bp.route('/all_athletes', methods=['GET'])
def get_all_athletes():
    """Fetches all athlete data from database for admin interface"""
    try:
        response = db_service.fetch(
            table="athletes"
        )
        if response and response.data:
            logger.info("Fetched athlete data for admin")
            healthy = 0
            at_risk = 0
            injured = 0
            reports_due = 0
            reports_submitted = 0

            # Summarise athlete health status and report submission stats
            for athlete in response.data:
                if athlete.get('status') == HealthStatus.GREEN:
                    healthy += 1
                elif athlete.get('status') == HealthStatus.AMBER:
                    at_risk += 1
                elif athlete.get('status') == HealthStatus.RED:
                    injured += 1

                if athlete.get('report_due'):
                    reports_due += 1
                else:
                    reports_submitted += 1

            return jsonify({
                "num_athletes": len(response.data),
                "healthy": healthy,
                "at_risk": at_risk,
                "injured": injured,
                "reports_due": reports_due,
                "reports_submitted": reports_submitted
            }), 200
        else:
            logger.warning("No athlete data found")
            return jsonify(message="No athlete data found"), 200

    except Exception as e:
        logger.error(f"Error fetching athletes for admin: {e}")
        return jsonify(error=str(e)), 500


@admin_bp.route('/all_coaches', methods=['GET'])
def get_all_coaches():
    """Fetches all coach data from database for admin interface"""
    try:
        response = db_service.fetch(
            table="coaches"
        )

        if response and response.data:
            logger.info("Fetched coaches for admin")
            return jsonify({"num_coaches": len(response.data)}), 200
        else:
            logger.warning("No coach data found")
            return jsonify(message="No coach data found"), 200

    except Exception as e:
        logger.error(f"Error fetching coaches from database: {e}")
        return jsonify(error=str(e)), 500


@admin_bp.route('/all_reports/', methods=['GET'])
def get_all_reports():
    """
    Fetches all report data from database for admin interface,
    providing a summary of report outcomes over the past week
    """
    days = request.args.get('days', default=7, type=int)

    now = datetime.now()
    today = datetime.today()
    threshold = now - timedelta(days=days)
    reports_summary = {}

    try:
        response = db_service.fetch(
            table="reports",
            filters={"created_at": f"gte.{threshold}"},
            modifiers={"order": {"column": "created_at", "desc": True}},
            select="*,athletes(users(dob,gender))"
        )

        if response and response.data:
            logger.info("Fetched reports for admin")
            # For each of the past number of days...
            for i in range(0, days):
                # Start from today, proceed backwards
                day = (now - timedelta(days=i)).strftime("%Y-%m-%d")
                reports_summary[day] = {
                    "Healthy": 0, "At Risk": 0, "Injured": 0}

                # Acquire all reports created on that day
                reports = [
                    r for r in response.data if r['created_at'].startswith(day)]

                # Summarise outcomes of the reports
                for report in reports:
                    if report.get('new_availability') == HealthStatus.AMBER:
                        reports_summary[day]["At Risk"] += 1
                    elif report.get('new_availability') == HealthStatus.RED:
                        reports_summary[day]["Injured"] += 1
                    else:
                        reports_summary[day]["Healthy"] += 1

                    # Calculate athlete age from dob
                    dob = report.get('athletes').get('users').get('dob')
                    age = (today - datetime.strptime(dob, "%Y-%m-%d")).days // 365
                    report['athlete_age'] = age

                    # Include athlete's gender
                    report['gender'] = report.get(
                        'athletes').get('users').get('gender')

            return jsonify({
                "num_reports": len(response.data),
                "reports": response.data,
                "reports_summary": reports_summary
            }), 200

        else:
            logger.warning("No report data found")
            return jsonify(message="No report data found"), 200

    except Exception as e:
        logger.error(f"Error fetching reports from database: {e}")
        return jsonify(error=str(e)), 500


@admin_bp.route('/all_followup_reports/', methods=['GET'])
def get_all_followups():
    """Fetches follow-up report submissions for admin interface."""
    days = request.args.get('days', default=60, type=int)
    now = datetime.now()
    threshold = now - timedelta(days=days)

    try:
        response = db_service.fetch(
            table='followup_reports',
            filters={'created_at': f"gte.{threshold}"},
            modifiers={'order': {"column": "created_at", "desc": True}},
            select="*,athletes(users(dob,gender))"
        )
        if response and response.data:
            logger.info("Fetched follow-up reports for admin")

            return jsonify({
                "num_followups": len(response.data),
                "followups": response.data
            }), 200
        else:
            logger.warning("No follow-up report data found")
            return jsonify(message="No follow-up report data found"), 200
    except Exception as e:
        logger.error(f"Error fetching follow-up reports: {e}")
        return jsonify(error=str(e)), 500


@admin_bp.route('/activity_data', methods=['GET'])
def get_activity_data():
    """Fetches activity data, i.e. users who opened the app on a given day"""
    now = datetime.now()
    threshold = now - timedelta(days=7)
    weekly_activity = {}

    try:
        # Fetch session events of type 'app_open_daily' from the past week
        response = db_service.fetch(
            table="session_events",
            filters={"event_type": "app_open_daily",
                     "timestamp": f"gte.{threshold}"},
            modifiers={"order": {"column": "timestamp", "desc": True}}
        )
        if response and response.data:
            for i in range(0, 7):
                day = (now - timedelta(days=i)).strftime("%Y-%m-%d")
                weekly_activity[day] = 0

                items = [
                    i for i in response.data if i['timestamp'].startswith(day)]
                weekly_activity[day] = len(items)
            logger.info(f"Weekly activity: {weekly_activity}")
            return jsonify(weekly_activity=weekly_activity), 200
        else:
            logger.warning("No activity data found")
            return jsonify(message="No activity data found"), 200
    except Exception as e:
        logger.error(f"Error retrieving activity data: {e}")
        return jsonify(error=str(e)), 500


@admin_bp.route('/export_reports', methods=['GET'])
def export_reports():
    """Triggers export of report data to CSV for admin interface"""
    try:
        # Fetch all reports as well as associated athlete names
        response = db_service.fetch(
            table="reports",
            select="*,athletes(users(dob,gender))"
        )
        if response and response.data:
            logger.info("Fetched reports for export")
            return jsonify({"reports": response.data}), 200
        else:
            logger.warning("No report data found for export")
            return jsonify(message="No report data found for export"), 200
    except Exception as e:
        logger.error(f"Error retrieving reports for export: {e}")
        return jsonify(error=str(e)), 500
