from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
import uuid
import os
import health_status
import logging


app = Flask(__name__)

CORS(app, 
    origins="*",
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "PUT", "POST", "DELETE", "OPTIONS"],
    supports_credentials=True)

logging.basicConfig(level=logging.INFO)

load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")

# Create MondoDB connection
try:
    client = MongoClient(MONGO_URI)
    db = client['injury_reporting_app']
    athletes_collection = db['athletes']
    logging.info("Connected to MongoDB successfully.")
except Exception as e:
    logging.error(f"Error connecting to MongoDB: {e}")


@app.route('/api/hello', methods=['GET'])
def hello_world():
    return jsonify(message="Hello, World!")


# Register new athlete
@app.route('/api/register/athlete', methods=['POST'])
def register_athlete():
    athlete = request.get_json()
    logging.info(f"Received athlete registration data: {athlete}")
    
    athlete_data = {
        "athlete_id": str(uuid.uuid4()),
        "name": athlete.get('name'),
        "email": athlete.get('email'),
        "password": athlete.get('password'),
        "dob": athlete.get('dob'),
        "user_type": athlete.get('user_type'),
        "assigned_coach": None,
        "health_status": health_status.HealthStatus.HEALTHY.value
    }

    # Add athlete to the database
    try:
        athletes_collection.insert_one(athlete_data)
        logging.info("Athlete registered successfully.")
        return jsonify(message="Athlete registered successfully"), 201
    except Exception as e:
        logging.error(f"Error registering athlete: {e}")
        return jsonify(error=str(e)), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
