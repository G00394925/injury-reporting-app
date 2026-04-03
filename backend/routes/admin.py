from flask import Blueprint, request, jsonify
from services.database_service import DatabaseService
from health_status import HealthStatus
import logging
from datetime import datetime, timedelta

admin_bp  = Blueprint('admin', __name__)
db_service = DatabaseService()

logging.basicConfig(
	level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)


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
	

@admin_bp.route('/all_reports', methods=['GET'])
def get_all_reports():
	"""
	Fetches all report data from database for admin interface, 
	providing a summary of report outcomes over the past week
	"""
	now = datetime.now()
	threshold = now - timedelta(days=7)
	reports_summary = {}

	try:
		response = db_service.fetch(
			table="reports",
			filters={"created_at": f"gte.{threshold}"},
			modifiers={"order": {"column": "created_at", "desc": True}},
		)

		if response and response.data:
			logger.info("Fetched reports for admin")
			# For each of the past 7 days...
			for i in range(0, 7):
				day = (now - timedelta(days=i)).strftime("%Y-%m-%d")  # Start from today, proceed backwards
				reports_summary[day] = {"Healthy": 0, "At Risk": 0, "Injured": 0}
				
				# Acquire all reports created on that day
				reports = [r for r in response.data if r['created_at'].startswith(day)]

				# Summarise outcomes of the reports
				for report in reports:
					if report.get('new_availability') == HealthStatus.AMBER:
						reports_summary[day]["At Risk"] += 1
					elif report.get('new_availability') == HealthStatus.RED:
						reports_summary[day]["Injured"] += 1
					else:
						reports_summary[day]["Healthy"] += 1

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
	

@admin_bp.route('/activity_data', methods=['GET'])
def get_activity_data():
	"""Fetches activity data, i.e. users who opened the app on a given day"""
	now = datetime.now()
	threshold = now - timedelta(days=7)
	weekly_activity = {}

	try: 
		response = db_service.fetch(
			table="session_events",
			filters={"event_type": "app_open_daily", "timestamp": f"gte.{threshold}"},
			modifiers={"order": {"column": "timestamp", "desc": True}}
		)
		if response and response.data:
			for i in range(0, 7):
				day = (now - timedelta(days=i)).strftime("%Y-%m-%d")
				weekly_activity[day] = 0

				items = [i for i in response.data if i['timestamp'].startswith(day)]
				weekly_activity[day] = len(items)
			logger.info(f"Weekly activity: {weekly_activity}")
			return jsonify(weekly_activity=weekly_activity), 200
		else:
			logger.warning("No activity data found")
			return jsonify(message="No activity data found"), 200
	except Exception as e:
		logger.error(f"Error retrieving activity data: {e}")
		return jsonify(error=str(e)), 500