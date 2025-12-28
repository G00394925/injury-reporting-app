from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
import uuid
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
MONGO_URI = os.getenv("MONGO_URI")

# Create MondoDB connection
try:
    client = MongoClient(MONGO_URI)
    db = client['injury_reporting_app']
    users = db['users']
    health_reports = db['health_reports']
    logger.info("Connected to MongoDB successfully.")
except Exception as e:
    logger.error(f"Error connecting to MongoDB: {e}")


@app.route('/api/test', methods=['GET'])
def test_route():
    try:
        message = "Test route works"

        return jsonify(
            test_message=message
        )
    except Exception as e:
        print(f"error: {e}")


@app.route('/api/login', methods=['POST'])
def login():
    try:
        # Acquire submitted credentials from user
        credentials = request.get_json()
        email = credentials.get('email')
        password = credentials.get('password')

        logger.info(f"Login attempt for: {email}")

        # Check if user exists
        user = users.find_one({"email": email})

        if user:
            # Check password
            if user.get('password') == password:
                logger.info(f"User {email} logged in successfully.")
                name = user.get('name', '').split()[0]

                return jsonify(
                    message="Login successful",
                    uuid=user.get('user_id'),
                    user={
                        "name": name,
                        "email": email,
                        "user_type": user.get('user_type'),
                        "dob": user.get('dob'),
                    }
                ), 200
            else:
                logger.warning(f"Invalid password for user {email}")
                return jsonify(message="Invalid email or password"), 401
        else:
            logger.warning(f"User not found: {email}")
            return jsonify(message="Invalid email or password"), 401

    except Exception as e:
        logger.error(f"Error during login: {e}")
        return jsonify(error=str(e)), 500
    

@app.route('/api/register', methods=['POST'])
def register():
    # Acquire submitted credentials from user
    user = request.get_json()
    logger.info(f"Received user registration data: {user}")

    user_type = user.get('user_type')

    user_data = {
        "user_id": str(uuid.uuid4()),
        "name": user.get('name'),
        "email": user.get('email'),
        "password": user.get('password'),
        "dob": user.get('dob'),
        "user_type": user_type,
    }

    if user_type == 'athlete':
        user_data["health_status"] = health_status.HealthStatus.HEALTHY.value

    # Add user to the database
    try:
        users.insert_one(user_data)
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

        health_reports.insert_one(report_data)
        logger.info("Health report submitted successfully.")

        # Update user's health status if they're injured
        if 'injured' in report_data['answers']:
            injured = report_data['answers']['injured']
            user_id = report_data['user']
            new_status = health_status.HealthStatus.INJURED.value if injured else health_status.HealthStatus.HEALTHY.value

            users.update_one(
                {"user_id": user_id},
                {"$set": {"health_status": new_status}}
            )
            logger.info(
                f"Updated health status for user {user_id} to {new_status}")

        return jsonify(message="Health report submitted successfully"), 201

    except Exception as e:
        logger.error(f"Error submitting health report: {e}")
        return jsonify(error=str(e)), 500


@app.route('/api/health-status/<user_id>', methods=['GET'])
def get_status(user_id):
    try:
        user = users.find_one({"user_id": user_id})

        if user:
            health_status = user.get('health_status')

            return jsonify(
                user_id=user_id,
                health_status=health_status
            ), 200
        else:
            logger.warning(f"User of ID {user_id} not found.")
            return jsonify(message="User not found"), 404

    except Exception as e:
        logger.error(f"Error retrieving health status for user {user_id}: {e}")
        return jsonify(error=str(e)), 500


@app.route('/api/coaches', methods=['GET'])
def get_coaches():
    try:
        coaches = users.find({"user_type": "coach"})

        if coaches:
            coaches_list = []
            for coach in coaches:
                coaches_list.append(coach.get('name'))

            return jsonify(coaches=coaches_list), 200

        else:
            logger.error("No coaches found in database.")

    except Exception as e:
        logger.error(f"Error retrieving coaches: {e}")
        return jsonify(error=str(e)), 500


@app.route('/api/assign-coach/<user_id>', methods=['PUT'])
def assign_coach(athlete_id):
    try:
        data = request.get_json()

        athlete = users.get_one({"user_id": athlete_id})
        coach = users.get(
            {"name": data.get('coach_name'), "user_type": "coach"})

        if athlete and coach:
            # TODO: Implement coach assignment logic
            pass

    except Exception as e:
        logger.error(f"Error assigning coach: {e}")
        return jsonify(error=str(e)), 500


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
