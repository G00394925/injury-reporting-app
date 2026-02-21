from flask import Blueprint, request, jsonify
from health_status import HealthStatus
from services.database_service import DatabaseService
import logging

db_service = DatabaseService()
teams_bp = Blueprint('teams', __name__)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)

@teams_bp.route('/get_teams', methods=['GET'])
def get_teams():
    """
    Fetches all teams from Supabase.

    Returns:
        JSON response with a list of teams or error message.
    """

    try:
        response = db_service.fetch("teams")

        if response:
            teams = []
            for team in response.data:
                coach_data = db_service.fetch("users", filters={"id": team.get("coach_id")})
                coach_name = coach_data.data[0].get("name") if coach_data and coach_data.data else None
                
                teams.append({
                    "team_id": team.get("team_id"),
                    "team_name": team.get("team_name"),
                    "sport": team.get("sport"),
                    "coach_name": coach_name
                })

            return jsonify(teams=teams), 200

    except Exception as e:
        logger.error(f"Error fetching teams: {e}")
        return jsonify(error=str(e)), 500


@teams_bp.route('/coach_teams/<coach_id>', methods=['GET'])
def fetch_coach_teams(coach_id):
    """
    Fetches all teams associated with a specific coach from Supabase.

    Args:
        coach_id (str): The UUID of the coach.

    Returns:
        JSON response with a list of teams or error message.
    """
    try:
        response = db_service.fetch("teams", filters={"coach_id": coach_id})

        if response:
            teams = []
            for team in response.data:
                players = db_service.fetch("athletes", filters={"team_id": team.get("team_id")})
                teams.append({
                    "team_id": team.get("team_id"),
                    "team_name": team.get("team_name"),
                    "sport": team.get("sport"),
                    "players": len(players.data)
                })
            logger.info(f"Fetched teams for coach {coach_id} successfully.")    
            return jsonify(teams=teams), 200

    except Exception as e:
        logger.error(f"Error fetching teams for coach {coach_id}: {e}")
        return jsonify(error=str(e)), 500


@teams_bp.route('/new', methods=['POST'])
def create_team():
    """
    Handles the creation of a new team in the Supabase database.

    Returns:
        JSON response indicating success or failure of team creation.
    """

    new_team = request.get_json()

    try:
        response = db_service.insert("teams", {
            "team_name": new_team.get("team_name"),
            "sport": new_team.get("sport"),
            "coach_id": new_team.get("coach_id"),
        })

        if response:
            logger.info("New team added to supabase database successfully")

            return jsonify(message="Team created successfully"), 201

    except Exception as e:
        logger.error(f"Error creating new team: {e}")
        return jsonify(error=str(e)), 500


@teams_bp.route('/get_athletes/<team_id>', methods=['GET'])
def fetch_athletes(team_id):
    """
    Fetches athletes associated with a given team

    Args:
        team_id (str): The UUID of the team to be queried.

    Returns:
        JSON response with a list of athletes or error message.
    """

    try:
        response = db_service.fetch("athletes", filters={"team_id": team_id})

        if response:
            athletes = []
            healthy_athletes = 0
            injured_athletes = 0

            for athlete in response.data:
                if athlete.get("status") == HealthStatus.GREEN:
                    healthy_athletes += 1
                elif athlete.get("status") == HealthStatus.RED:
                    injured_athletes += 1
                    print("Injured boy")

                athletes.append({
                    "athlete_id": athlete.get("id"),
                    "name": db_service.fetch("users", filters={"id": athlete.get("id")}).data[0].get("name"),
                    "health_status": athlete.get("status")
                })

            logger.info(f"Fetched athletes for team {team_id} successfully.")

            return jsonify(
                athletes=athletes,
                num_athletes=len(athletes),
                healthy_athletes=healthy_athletes,
                injured_athletes=injured_athletes), 200

    except Exception as e:
        logger.error(f"Error fetching athletes for team {team_id}: {e}")
        return jsonify(error=str(e)), 500