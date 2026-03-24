from flask import Blueprint, request, jsonify
from services.database_service import DatabaseService
from services.session_service import SessionService
import logging
from datetime import datetime, timedelta

db_service = DatabaseService()
session_service = SessionService()
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
            session_service.log_event(
                session_id=new_event.get("session"),
                event_type="create_event",
                event_data={
                    "event_id": response.data[0].get("id"),
                    "title": new_event.get("title"),
                },
                endpoint="/events/new"
            )
            logger.info(
                f"Event created successfully: {new_event.get('title')}")
            return jsonify(message="Event created successfully"), 201

    except Exception as e:
        logger.error(f"Error creating event: {e}")
        return jsonify(error=str(e)), 500


@events_bp.route('/get/<athlete_id>', methods=['GET'])
def get_events(athlete_id):
    """
    Fetches all event data associated with the given athlete_id.

    Parameters:
        athlete_id (uuid): Athlete's uuid used as a filter.

    Returns:
        events (json): Events data or message.
    """
    try:
        response = db_service.fetch(
            "events", filters={"athlete_id": athlete_id})

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


@events_bp.route('/get_next/<athlete_id>', methods=['GET'])
def get_next_event(athlete_id):
    """
    Fetches the next upcoming event associated with the given athlete id.

    Parameters:
        athlete_id (uuid): Athlete's uuid used as a filter.

    Returns: 
        next_event (json): Event data or message.
    """
    try:
        today = datetime.now().strftime('%Y-%m-%d')
        response = db_service.fetch("events",
                                    filters={"athlete_id": athlete_id,
                                             "event_date": f"gte.{today}"},
                                    modifiers={"order": "event_date"})

        if response and response.data:
            total_count = len(response.data)
            event = response.data[0]
            logger.info(f"Fetching most recent event")

            date = (event.get("event_date"))
            time = (event.get("start_time"))

            # Remove timezone offset
            time = time.split('+')[0]

            if date and time:
                # Convert into datetime objects
                date_obj = datetime.strptime(date, '%Y-%m-%d')
                time_obj = datetime.strptime(time, '%H:%M:%S')

                # Format date objects and return
                next_event = {
                    "title": event.get("title"),
                    "date": date_obj.strftime("%d %B"),
                    "time": time_obj.strftime("%H:%M"),
                    "total_future_events": total_count
                }

                logger.info(f"Next event for user {athlete_id}: {next_event}")
                return jsonify(next_event), 200
            else:
                logger.info(f"No event found with given time and date")
                return jsonify(message="No event found with given date and time")

        else:
            next_event = {
                "title": "No upcoming events",
                "date": None,
                "time": None,
                "total_future_events": 0
            }

            logger.info("No upcoming events")
            return jsonify(next_event), 200

    except Exception as e:
        logger.error(
            f"Error fetching most recent event for user {athlete_id}: {e}")
        return jsonify(error=str(e)), 500


@events_bp.route('/team_events/<team_id>', methods=['GET'])
def get_team_events(team_id):
    """
    Fetches all events for athletes on a given team within the next 3 days.

    Args:
        team_id (int): Teams's id used as a filter.

    Returns:
        events (json): Events data or message.
    """

    # Get all athletes from team
    try:
        athletes_response = db_service.fetch(
            "athletes", filters={"team_id": team_id})
        if athletes_response and athletes_response.data:
            logger.info(f"Fetching events for team {team_id}")
            events = []
            for athlete in athletes_response.data:
                athlete_id = athlete.get("id")

                # Only acquire events occuring within the next 3 days
                events_response = db_service.fetch(
                    table="events",
                    filters={
                        "athlete_id": athlete_id,
                        "event_date": f"gte.{datetime.now().strftime('%Y-%m-%d')}",
                        "event_date": f"lte.{(datetime.now() + timedelta(days=3)).strftime('%Y-%m-%d')}"
                    }
                )
                if events_response and events_response.data:
                    logger.info(f"Fetched events for {athlete_id}")
                    for event in events_response.data:
                        events.append({
                            "event_id": event.get("id"),
                            "title": event.get("title"),
                            "event_date": event.get("event_date"),
                            "start_time": event.get("start_time"),
                            "end_time": event.get("end_time"),
                            "type": event.get("type"),
                        })

                else:
                    logger.info(f"No events found for {athlete_id}")

            logger.info(f"Fetched team events for team {team_id}")
            return jsonify(team_events=events), 200
        else:
            logger.warning(f"No athletes found for team {team_id}")
            return jsonify(message="No athletes found for the specified team"), 404

    except Exception as e:
        logger.error(f"Error fetching team events for team {team_id}: {e}")
        return jsonify(error=str(e)), 500
