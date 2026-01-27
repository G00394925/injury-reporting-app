from flask import Blueprint, request, jsonify
from services.database_service import DatabaseService
import logging
import health_status

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
    try:
        report = request.get_json()
        report_data = {
            "user": report.get('user_id'),
            "answers": report.get('answers_list'),
        }
        logger.info(f"Received new health report: {report_data}")

        # supabase.table("reports").insert(report_data).execute()
        # logger.info("Health report submitted successfully.")

        # Update user's health status if they're injured
        if 'injured' in report_data['answers']:
            injured = report_data['answers']['injured']
            user_id = report_data['user']
            new_status = health_status.HealthStatus.INJURED.value if injured else health_status.HealthStatus.HEALTHY.value

            db_service.update(
                "athletes", 
                data={"status": new_status},
                filters={"id": user_id}
            )

            logger.info(f"Updated health status for user {user_id} to {new_status}")

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
        user = (
            db_service.fetch("athletes", filters={"id": user_id})
        )

        if user.data:
            health_status_value = user.data[0].get('status')

            return jsonify(
                user_id=user_id,
                health_status=health_status_value
            ), 200
        
        else:
            logger.warning(f"User of ID {user_id} not found.")
            return jsonify(message="User not found"), 404

    except Exception as e:
        logger.error(f"Error retrieving health status for user {user_id}: {e}")
        return jsonify(error=str(e)), 500