from flask import Blueprint, request, jsonify
from services.database_service import DatabaseService
import logging

athletes_bp = Blueprint('athletes', __name__)
db_service = DatabaseService()

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
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
        # Get athlete's team id
        athlete = db_service.fetch("athletes", {"id": athlete_id})

        if not athlete or not athlete.data:
            return jsonify(message="Athlete not found"), 404
        
        team_id = athlete.data[0].get("team_id")

        if not team_id:
            return jsonify(
                message="Athlete is not part of any team",
                team_details=None
            ), 200

        # Fetch team details
        response = db_service.fetch("teams", {"team_id": team_id})

        if response:
            # Fetch coach id for their name and return team details
            coach = db_service.fetch("users", {"id": response.data[0].get("coach_id")})
            team_details = {
                "sport": response.data[0].get("sport"),
                "team_name": response.data[0].get("team_name"),
                "coach": coach.data[0].get("name") if coach and coach.data else None,
            }
            return jsonify(team_details=team_details), 200
        
        else:
            return jsonify(message="No team found for the given athlete ID"), 404
        
    except Exception as e:
        logger.error(f"Error fetching team details for athlete {athlete_id}: {e}")
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

        response = db_service.update("athletes",
            data={"team_id": req.get("team_id")},
            filters={"id": req.get("athlete_id")}
        )

        if response:
            logger.info(f"Athlete {req.get('athlete_id')} joined team {req.get('team_id')}")
            return jsonify(message="Athlete successfully joined the team"), 200
        
    except Exception as e:
        logger.error(f"Error athlete joining team: {e}")
        return jsonify(message="Error joining team"), 500


@athletes_bp.route('/leave_team/<athlete_id>', methods=['POST'])
def leave_team(athlete_id):
    try:

        response = db_service.update("athletes",
            data={"team_id": None},
            filters={"id": athlete_id}
        )

        if response:
            logger.info(f"Athlete {athlete_id} has left their team.")
            return jsonify(message="Athlete successfully left the team"), 200
        else:
            logger.warning(f"Failed to update athlete {athlete_id} to leave their team.")
            return jsonify(message="Failed to leave team"), 400
    except Exception as e:
        logger.error(f"Error athlete leaving team: {e}")
        return jsonify(message="Error leaving team"), 500