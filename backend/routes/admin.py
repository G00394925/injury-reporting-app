from flask import Blueprint, request, jsonify
from services.database_service import DatabaseService
from health_status import HealthStatus
import logging

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

			for athlete in response.data:
				if athlete.get('status') == HealthStatus.GREEN:
					healthy += 1
				elif athlete.get('status') == HealthStatus.AMBER:
					at_risk += 1
				elif athlete.get('status') == HealthStatus.RED:
					injured += 1

				if athlete.get('report_due'):
					reports_due += 1

			return jsonify({
				"num_athletes": len(response.data),
				"healthy": healthy,
				"at_risk": at_risk,
				"injured": injured
			}), 200
		else:
			logger.warning("No athlete data found")
			return jsonify(message="No athlete data found"), 200
		
	except Exception as e:
		logger.error(f"Error fetching athletes for admin: {e}")
		return jsonify(error=str(e)), 500