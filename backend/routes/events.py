from flask import Blueprint, request, jsonify
from services.database_service import DatabaseService
import logging

db_service = DatabaseService()
events_bp = Blueprint('events', __name__)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)

@events_bp.route('/new', methods=['POST'])
def create_event():
    """
    Handles the creation of a new event in the Supabase database.

    Returns:
        JSON response indicating success or failure of event creation.
    """
    new_event = request.get_json()
    logger.info(f"Received new event creation request: {new_event}")

    try:
        response = db_service.insert("events", data={
            "team_id": new_event.get("team_id"),
            "title": new_event.get("title"),
            "event_date": new_event.get("event_date"),
            "start_time": new_event.get("start_time"),
            "end_time": new_event.get("end_time"),
            "type": new_event.get("type"),
        })

        if response:
            logger.info(
                f"Event created successfully: {new_event.get('title')}")
            return jsonify(message="Event created successfully"), 201

    except Exception as e:
        logger.error(f"Error creating event: {e}")
        return jsonify(error=str(e)), 500
