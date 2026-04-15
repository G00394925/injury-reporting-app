from flask import Blueprint, request, jsonify
from services.database_service import DatabaseService
from services.session_service import SessionService
import logging

session_bp = Blueprint('session', __name__)
db_service = DatabaseService()
session_service = SessionService()
logger = logging.getLogger(__name__)


@session_bp.route('/log_event', methods=['POST'])
def log_event():
    """Log arbitrary events (app opens, close, background/foreground etc.)"""
    data = request.get_json()
    session_id = data.get('session_id')
    event_type = data.get('event_type')
    endpoint = data.get('endpoint')
    event_data = data.get('event_data', {})

    try:
        session_service.log_event(
            session_id=session_id,
            event_type=event_type,
            event_data=event_data,
            endpoint=endpoint
        )
        return jsonify(message="Event logged successfully"), 200

    except Exception as e:
        logger.error(f"Error logging event: {e}")
        return jsonify(error=str(e)), 500
