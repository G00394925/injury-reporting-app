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
            "athlete_id": new_event.get("athlete_id"),
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


@events_bp.route('/get/<athlete_id>')
def get_events(athlete_id):
    
    try:
        response = db_service.fetch("events", filters={"athlete_id": athlete_id})

        if response:
            events = []

            for event in response.data:
                events.append({
                    "event_id": event.get("id"),
                    "title": event.get("title"),
                    "event_date": event.get("event_date"),
                    "start_time": event.get("start_time"),
                    "end_time": event.get("end_time"),
                    "type": event.get("type"),
                })

            logger.info(f"Events fetched for user {athlete_id}")
            return jsonify(events), 200
        else:
            logger.error(f"No events found for user {athlete_id}")
            return jsonify(error="No events found"), 404
        
    except Exception as e:
        logger.error(f"Error fetching events for user {athlete_id}: {e}")
        return jsonify(error=str(e)), 500