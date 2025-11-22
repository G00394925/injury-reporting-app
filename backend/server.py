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
    logger.info("Connected to MongoDB successfully.")
except Exception as e:
    logger.error(f"Error connecting to MongoDB: {e}")


@app.route('/api/login', methods=['POST'])
def login():
    try:
        # Acquire submitted credentials from user
        credentials = request.get_json()
        email = credentials.get('email')
        password = credentials.get('password')
        name = ""

        logger.info(f"Login attempt for: {email}")

        # Check if user exists
        user = users.find_one({"email": email})

        if user:
            # Check password
            if user.get('password') == password:
                logger.info(f"User {email} logged in successfully.")
                name = user.get('name', '').split()[0]
                return jsonify(message="Login successful", name=name), 200
            else:
                logger.warning(f"Invalid password for user {email}")
                return jsonify(message="Invalid email or password"), 401
        else:
            logger.warning(f"User not found: {email}")
            return jsonify(message="Invalid email or password"), 401
    
    except Exception as e:
        logger.error(f"Error during login: {e}")
        return jsonify(error=str(e)), 500

# Register new athlete
@app.route('/api/register/athlete', methods=['POST'])
def register_athlete():
    # Acquire submitted credentials from user
    athlete = request.get_json()
    logger.info(f"Received athlete registration data: {athlete}")
    
    athlete_data = {
        "athlete_id": str(uuid.uuid4()),
        "name": athlete.get('name'),
        "email": athlete.get('email'),
        "password": athlete.get('password'),
        "dob": athlete.get('dob'),
        "user_type": athlete.get('user_type'),
        "health_status": health_status.HealthStatus.HEALTHY.value,
    }

    # Add athlete to the database
    try:
        users.insert_one(athlete_data)
        logger.info("Athlete registered successfully.")
        return jsonify(message="Athlete registered successfully"), 201
    except Exception as e:
        logger.error(f"Error registering athlete: {e}")
        return jsonify(error=str(e)), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
