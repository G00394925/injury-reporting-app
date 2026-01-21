from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from supabase import create_client, Client
import os
import health_status
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)

CORS(app,
     origins="*",
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "PUT", "POST", "DELETE", "OPTIONS"],
     supports_credentials=True)

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Create Supabase connection
try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    logger.info("Connected to Supabase successfully.")
except Exception as e:
    logger.error(f"Error connecting to Supabase: {e}")


@app.route('/api/login', methods=['POST'])
def login():
    """
    Handles user login by verifying submitted credentials with Supabase Auth
    and retrieving the corresponding user data.

    Returns:
        JSON response with user details on successful login, or 
        error message on failure.
    """
    try:
        # Acquire submitted credentials from user
        credentials = request.get_json()
        email = credentials.get('email')
        password = credentials.get('password')

        logger.info(f"Login attempt for: {email}")

        response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })

        if response:
            try:
                # Fetch user data from database
                user_data = supabase.table("users").select("*").eq("id", response.user.id).execute()

                return jsonify(
                    message="Login successful",
                    uuid=response.user.id,
                    user={
                        "name": user_data.data[0].get('name', '').split()[0],
                        "email": email,
                        "user_type": user_data.data[0].get('role'),
                        "dob": user_data.data[0].get('dob'),
                    }
                )
            except Exception as e:
                logger.error(f"Error retrieving user data from Supabase table: {e}")
                return jsonify(error=str(e)), 401
    
    except Exception as e:
        logger.error(f"Error during login: {e}")
        return jsonify(error=str(e)), 500


@app.route('/api/register', methods=['POST'])
def register():
    """
    Handles user registration by creating a new user in Supabase Auth
    and inserting the corresponding user data into the database.

    Returns:
        JSON response indicating success or failure of registration.
    """

    # Acquire submitted credentials from user
    user = request.get_json()
    logger.info(f"Received user registration data: {user}")

    user_type = user.get('user_type')

    user_data = {
        "name": user.get('name'),
        "email": user.get('email'),
        "password": user.get('password'),
        "dob": user.get('dob'),
        "user_type": user_type,
    }

    # Add user to the database
    try:
        response = supabase.auth.sign_up({
            "email": user_data["email"],
            "password": user_data["password"]
        })

        if response:
            try:
                supabase.table("users").insert({
                    "id": response.user.id,
                    "name": user_data["name"],
                    "email": user_data["email"],
                    "dob": user_data["dob"],
                    "role": user_data["user_type"],
                }).execute()

                logger.info("User data inserted into Supabase table successfully.")

            except Exception as e:
                logger.error(f"Error inserting user data into Supabase table: {e}")

        # TODO: Complete Supabase setup and REMOVE MongoDB client.

        logger.info("User registered successfully.")
        return jsonify(message="User registered successfully"), 201
    except Exception as e:
        logger.error(f"Error registering user: {e}")
        return jsonify(error=str(e)), 500


@app.route('/api/health-report', methods=['POST'])
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

            supabase.table("athletes").update(
                {"status": new_status}
            ).eq("id", user_id).execute()
            logger.info(
                f"Updated health status for user {user_id} to {new_status}")

        return jsonify(message="Health report submitted successfully"), 201

    except Exception as e:
        logger.error(f"Error submitting health report: {e}")
        return jsonify(error=str(e)), 500


@app.route('/api/health-status/<user_id>', methods=['GET'])
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
            supabase.table("athletes")
            .select("*")
            .execute()
        )

        print(user)

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


@app.route('/api/create-team', methods=['POST'])
def create_team():
    """
    Handles the creation of a new team in the Supabase database.

    Returns:
        JSON response indicating success or failure of team creation.
    """
    new_team = request.get_json()

    try:
        response = supabase.table("teams").insert({
            "team_name": new_team.get("team_name"),
            "sport": new_team.get("sport"),
            "coach_id": new_team.get("coach_id"),
        }).execute()

        if response:
            logger.info("New team added to supabase database successfully")

            return jsonify(message="Team created successfully"), 201
    
    except Exception as e:
        logger.error(f"Error creating new team: {e}")
        return jsonify(error=str(e)), 500


@app.route('/api/coach-teams/<coach_id>', methods=['GET'])
def fetch_coach_teams(coach_id):
    """
    Fetches all teams associated with a specific coach from Supabase.
    
    Args:
        coach_id (str): The UUID of the coach.

    Returns:
        JSON response with a list of teams or error message.
    """
    try:
        response = supabase.table("teams").select("*").eq("coach_id", coach_id).execute()

        if response:
            teams = []
            for team in response.data:
                teams.append({
                    "team_id": team.get("team_id"),
                    "team_name": team.get("team_name"),
                    "sport": team.get("sport"),
                    "players": supabase.table("athletes").select("*", count="exact").eq("team_id", team.get("team_id")).execute().count
                })
            return jsonify(teams=teams), 200

    except Exception as e:
        logger.error(f"Error fetching teams for coach {coach_id}: {e}")
        return jsonify(error=str(e)), 500
    

@app.route('/api/athlete/teams', methods=['GET'])
def fetch_teams():
    """
    Fetches all teams from Supabase.

    Returns:
        JSON response with a list of teams or error message.
    """
    try:
        response = supabase.table("teams").select("*").execute()

        if response:
            teams = []
            for team in response.data:
                teams.append({
                    "team_id": team.get("team_id"),
                    "team_name": team.get("team_name"),
                    "sport": team.get("sport"),
                    "coach_name": supabase.table("users").select("name").eq("id", team.get("coach_id")).execute().data[0].get("name")
                })

            return jsonify(teams=teams), 200
        
    except Exception as e:
        logger.error(f"Error fetching teams: {e}")
        return jsonify(error=str(e)), 500


@app.route('/api/athlete/team/<athlete_id>', methods=['GET'])
def fetch_team_details(athlete_id):
    """
    Fetches the team details for a specific athlete from Supabase.
    
    Args:
        athlete_id (str): The UUID of the athlete.

    Returns:
        JSON response with the team details or error message.
    """
    try:
        response = (
            supabase.table("teams")
            .select("*")
            .eq("team_id", 
                supabase.table("athletes").select("team_id").eq("id", athlete_id)
                .execute().data[0].get("team_id")
            )
            .execute()
        )

        if response:
            team_details = {
                "sport": response.data[0].get("sport"),
                "team_name": response.data[0].get("team_name"),
                "coach": supabase.table("users").select("name").eq("id", response.data[0].get("coach_id")).execute().data[0].get("name"),
            }

            return jsonify(team_details=team_details), 200
        
    except Exception as e:
        logger.error(f"Error fetching team details for athlete {athlete_id}: {e}")
        return jsonify(error=str(e)), 500


@app.route('/api/athlete/join-team', methods=['POST'])
def join_team():
    """
    POST request that handles an athelte joining a team, updating their team_id in Supabase.

    Returns:
        JSON response indicating success or failure of the operation.
    """
    try:
        data = request.get_json()
        response = (
            supabase.table("athletes")
            .update({"team_id": data.get("team_id")})
            .eq("id", data.get("athlete_id"))
            .execute()
        )

        if response:
            logger.info("Athlete joined team successfully.")
            return jsonify(message="Athlete joined team successfully"), 200
        
    except Exception as e:
        logger.error(f"Error athlete joining team: {e}")
        return jsonify(error=str(e)), 500


@app.route('/api/team/get-athletes/<team_id>', methods=['GET'])
def fetch_athletes(team_id):
    """
    Fetches athletes associated with a given team
    
    Args:
        team_id (str): The UUID of the team to be queried.

    Returns:
        JSON response with a list of athletes or error message.
    """
    try:
        response = supabase.table("athletes").select("*").eq("team_id", team_id).execute()

        if response:
            athletes = []
            healthy_athletes = 0
            injured_athletes = 0
            
            for athlete in response.data:
                if athlete.get("status") == health_status.HealthStatus.HEALTHY.value:
                    healthy_athletes += 1
                elif athlete.get("status") == health_status.HealthStatus.INJURED.value:
                    injured_athletes += 1
                    
                athletes.append({
                    "athlete_id": athlete.get("id"),
                    "name": supabase.table("users").select("name").eq("id", athlete.get("id")).execute().data[0].get("name"),
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


@app.route('/api/event/create', methods=['POST'])
def create_event():
    """
    Handles the creation of a new event in the Supabase database.

    Returns:
        JSON response indicating success or failure of event creation.
    """
    new_event = request.get_json()
    logger.info(f"Received new event creation request: {new_event}")

    try:
        response = supabase.table("events").insert({
            "team_id": new_event.get("team_id"),
            "title": new_event.get("title"),
            "event_date": new_event.get("event_date"),
            "start_time": new_event.get("start_time"),
            "end_time": new_event.get("end_time"),
            "type": new_event.get("type"),
        }).execute()

        if response:
            logger.info(f"Event created successfully: {new_event.get('title')}")
            return jsonify(message="Event created successfully"), 201

    except Exception as e:
        logger.error(f"Error creating event: {e}")
        return jsonify(error=str(e)), 500


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
