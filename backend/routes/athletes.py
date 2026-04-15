from flask import Blueprint, request, jsonify
from services.database_service import DatabaseService
from services.session_service import SessionService
import logging

athletes_bp = Blueprint('athletes', __name__)
db_service = DatabaseService()
session_service = SessionService()
logger = logging.getLogger(__name__)


@athletes_bp.route('/team/<athlete_id>', methods=['GET'])
def get_team_details(athlete_id):
    """
    Fetches the team details for a specific athlete from Supabase.

    Args:
        athlete_id (str): The UUID of the athlete.

    Returns:
        JSON response with the team details or error message.
    """

    try:
        athlete_teams = db_service.fetch(
            table="athlete_teams",
            filters={"athlete_id": athlete_id})

        if not athlete_teams or not athlete_teams.data:
            return jsonify(
                message="Athlete is not part of any team",
                team_details=None
            ), 200

        # Fetch team details for all teams the athlete is in
        teams = []
        for athlete_team in athlete_teams.data:
            response = db_service.fetch(
                "teams", {"team_id": athlete_team.get("team_id")})

            if response and response.data:
                for team in response.data:
                    # Fetch coach details
                    coach = db_service.fetch(
                        "users", {"id": team.get("coach_id")})
                    teams.append({
                        "team_id": team.get("team_id"),
                        "sport": team.get("sport"),
                        "team_name": team.get("team_name"),
                        "coach": coach.data[0].get("name") if coach and coach.data else None,
                    })

        if teams:
            logger.info(f"Fetched teams for athlete {athlete_id}")
            return jsonify(teams=teams), 200
        else:
            return jsonify(message="No teams found for the given athlete ID"), 404

    except Exception as e:
        logger.error(
            f"Error fetching team details for athlete {athlete_id}: {e}")
        return jsonify(message="Error fetching team details"), 500


@athletes_bp.route('/join_team', methods=['POST'])
def join_team():
    """
    POST request that handles an athlete joining a team, updating their team_id in Supabase.

    Returns:
        JSON response indicating success or failure of the operation.
    """

    try:
        req = request.get_json()
        response = db_service.insert(
            table="athlete_teams",
            data={
                "team_id": req.get("team_id"),
                "athlete_id": req.get("athlete_id")
            },
        )

        if response:
            logger.info(
                f"Athlete {req.get('athlete_id')} joined team {req.get('team_id')}")

            session_service.log_event(
                session_id=req.get("session"),
                event_type="join_team",
                event_data={
                    "athlete_id": req.get("athlete_id"),
                    "team_id": req.get("team_id")
                },
                endpoint="/athletes/join_team"
            )
            return jsonify(message="Athlete successfully joined the team"), 200

    except Exception as e:
        logger.error(f"Error athlete joining team: {e}")
        return jsonify(message="Error joining team"), 500


@athletes_bp.route('/leave_team', methods=['POST'])
def leave_team():
    """
    Handles team exit for requesting athlete. 

    Returns:
        message (json): Message indicating success or failure.
    """
    try:
        athlete_request = request.get_json()
        athlete_id = athlete_request.get("athlete_id")
        team_id = athlete_request.get("team_id")
        session = athlete_request.get("session")

        response = db_service.delete(
            table="athlete_teams",
            filters={"athlete_id": athlete_id, "team_id": team_id}
        )
        if response:
            logger.info(f"Athlete {athlete_id} has left their team.")
            session_service.log_event(
                session_id=session,
                event_type="leave_team",
                event_data={
                    "athlete_id": athlete_id,
                    "team_id": team_id
                },
                endpoint="/athletes/leave_team"
            )
            return jsonify(message="Athlete successfully left the team"), 200
        else:
            logger.warning(
                f"Failed to update athlete {athlete_id} to leave their team.")
            return jsonify(message="Failed to leave team"), 400

    except Exception as e:
        logger.error(f"Error athlete leaving team: {e}")
        return jsonify(message="Error leaving team"), 500
