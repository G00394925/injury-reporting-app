from flask import Blueprint, request, jsonify
from services.auth_service import AuthService
from services.database_service import DatabaseService
import logging
from datetime import datetime

auth_bp = Blueprint('auth', __name__)
auth_service = AuthService()
db_service = DatabaseService()

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)


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
                    "email_verified": False
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

        # Fetch user data from database
        user_data = db_service.fetch("users", {"email": email})

        if not user_data.data[0].get("email_verified"):
            return jsonify(message="Email not verified", verified=False), 200

        response = auth_service.sign_in(
            email=email,
            password=password
        )

        if response:
            try:
                db_service.update("users",
                                  data={
                                      "num_logins": user_data.data[0].get('num_logins') + 1,
                                      "last_login": datetime.now().isoformat()
                                  },
                                  filters={"id": response.user.id}
                                  )
                return jsonify(
                    message="Login successful",
                    uuid=response.user.id,
                    user={
                        "name": user_data.data[0].get('name'),
                        "email": email,
                        "user_type": user_data.data[0].get('role'),
                        "dob": user_data.data[0].get('dob'),
                    },
                    verified=True
                )
            except Exception as e:
                logger.error(
                    f"Error retrieving user data from Supabase table: {e}")
                return jsonify(error=str(e)), 401

    except Exception as e:
        logger.error(f"Error during login: {e}")
        return jsonify(error=str(e)), 500


@auth_bp.route('/change_password', methods=['POST'])
def update_password():
    """
    Change password for a given requesting user. Verifies old credentials
    are correct before updating.

    Returns:
        JSON response indicating success for failure.
    """
    credentials = request.get_json()
    old_password = credentials.get('old_password')
    new_password = credentials.get('new_password')

    try:
        if not old_password or not new_password:
            return jsonify(error="Both old and new passwords are required"), 400

        # Sign in with old password to verify it is correct before updating
        verify = auth_service.sign_in(
            email=credentials.get('email'),
            password=old_password
        )

        if not verify:
            return jsonify(message="Old password is incorrect"), 400
        else:
            # Update user's password
            response = auth_service.update_password(
                email=credentials.get('email'),
                new_password=new_password
            )
            return response

    except Exception as e:
        logger.error(f"Error updating password: {e}")
        return jsonify(error=str(e)), 500


@auth_bp.route('/send_otp', methods=['POST'])
def send_otp():
    """
    Send an additional One-Time passcode to the user's email if 
    requested. 

    Returns:
        JSON resposne indicating success or failure.
    """
    data = request.get_json()
    email = data.get("email")

    if not email:
        return jsonify(error="Email is required")

    try:
        response = auth_service.send_otp(email=email)
        return jsonify(message="OTP send successfully"), 200
    except Exception as e:
        logger.error(f"Error sending OTP: {e}")
        return jsonify(error=str(e)), 400


@auth_bp.route('/verify_otp', methods=['POST'])
def verify_otp():
    """
    Checks if the entered OTP matches with what was sent 
    to the user's email.

    Returns:
        JSON response indicating success or failure.
    """
    data = request.get_json()
    email = data.get('email')
    token = data.get('token')

    try:
        response = auth_service.verify_otp(email=email, token=token)
        if response:
            db_service.update("users",
                              data={"email_verified": True},
                              filters={"email": email}
                              )
        return jsonify(message="OTP verified successfully"), 200
    except Exception as e:
        logger.error(f"Error verifying OTP: {e}")
        return jsonify(error=str(e)), 400


@auth_bp.route('/delete_account', methods=['POST'])
def delete_account():
    data = request.get_json()
    uuid = data.get('uuid')

    try:
        response = auth_service.delete_account(uuid)
        if response:
            db_service.delete("users", {"id": uuid})
            logger.info("Account deleted by auth service")
            return jsonify(message="Account deleted by auth service"), 200
        else:
            return jsonify(error="No response from server")
    except Exception as e:
        logger.error(f"Error deleting account: {e}")
        return jsonify(error=str(e)), 500
