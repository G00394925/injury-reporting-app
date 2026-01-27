from flask import Blueprint, request, jsonify
from services.auth_service import AuthService
from services.database_service import DatabaseService
import logging

auth_bp = Blueprint('auth', __name__)

logger = logging.getLogger(__name__)

auth_service = AuthService()
db_service = DatabaseService()

@auth_bp.route('/register', methods=['POST'])
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
        response = auth_service.sign_up(
            email=user_data["email"],
            password=user_data["password"]
        )

        if response:
            try:
                db_service.insert("users", {
                    "id": response.user.id,
                    "name": user_data["name"],
                    "email": user_data["email"],
                    "dob": user_data["dob"],
                    "role": user_data["user_type"],
                })

                logger.info(
                    "User data inserted into Supabase table successfully.")

            except Exception as e:
                logger.error(
                    f"Error inserting user data into Supabase table: {e}")

        logger.info("User registered successfully.")
        return jsonify(message="User registered successfully"), 201
    except Exception as e:
        logger.error(f"Error registering user: {e}")
        return jsonify(error=str(e)), 500

@auth_bp.route('/login', methods=['POST'])
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

        response = auth_service.sign_in(
            email=email,
            password=password
        )

        if response:
            try:
                # Fetch user data from database
                user_data = db_service.fetch("users", {"id": response.user.id})

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
                logger.error(
                    f"Error retrieving user data from Supabase table: {e}")
                return jsonify(error=str(e)), 401

    except Exception as e:
        logger.error(f"Error during login: {e}")
        return jsonify(error=str(e)), 500
