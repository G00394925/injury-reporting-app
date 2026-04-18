from flask import Blueprint, request, jsonify, g
from services.auth_service import AuthService
from services.database_service import DatabaseService
from services.session_service import SessionService
import logging

auth_bp = Blueprint('auth', __name__)
auth_service = AuthService()
db_service = DatabaseService()
session_service = SessionService()
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

        # Verify user exists in database
        if not user_data.data or len(user_data.data) == 0:
            logger.error(f"User with email {email} not found in database")
            return jsonify(error="User not found"), 401

        if not user_data.data[0].get("email_verified"):
            return jsonify(message="Email not verified", verified=False), 200

        response = auth_service.sign_in(
            email=email,
            password=password
        )

        if response:
            # Create a new session for the user
            user_id = response.user.id

            # Double-check user exists before creating session
            user_check = db_service.fetch("users", {"id": user_id})
            if not user_check.data or len(user_check.data) == 0:
                logger.error(
                    f"User ID {user_id} not found in database despite email match")
                return jsonify(error="User record mismatch"), 401

            session_response = session_service.create_session(user_id=user_id)
            session_id = session_response.data[0]['session_id']

            # Log the login event
            session_service.log_event(
                session_id=session_id,
                event_type="login",
                event_data={"email": email},
                endpoint="/auth/login"
            )

            return jsonify(
                message="Login successful",
                uuid=response.user.id,
                access_token=response.session.access_token,
                refresh_token=response.session.refresh_token,
                user={
                    "name": user_data.data[0].get('name'),
                    "email": email,
                    "user_type": user_data.data[0].get('role'),
                    "dob": user_data.data[0].get('dob'),
                },
                session_id=session_id,
                verified=True
            ), 200

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
            db_service.update(
                table="users",
                data={"email_verified": True},
                filters={"email": email}
            )
        return jsonify(message="OTP verified successfully"), 200
    except Exception as e:
        logger.error(f"Error verifying OTP: {e}")
        return jsonify(error=str(e)), 400


@auth_bp.route('/logout', methods=['POST'])
def logout():
    data = request.get_json()
    session = data.get('session')

    try:
        # End the session
        session_service.end_session(session)

        # Log logout event
        session_service.log_event(
            session_id=session,
            event_type="logout",
            endpoint="/auth/logout"
        )
        logger.info(f"Session {session} ended")
        return jsonify(message="Logged out successfully"), 200
    except Exception as e:
        logger.error(f"Error during logout: {e}")
        return jsonify(error=str(e)), 500


@auth_bp.route('/delete_account', methods=['POST'])
def delete_account():
    data = request.get_json()
    uuid = data.get('uuid')

    if uuid != g.user_id:
        logger.warning(f"Unauthorised account delete attempt by user {g.user_id} for account {uuid}!")
        return jsonify(error="Unauthorized to delete this account"), 403

    try:
        response = db_service.delete("users", {"id": uuid})
        if response:
            auth_service.delete_account(uuid)
            logger.info("Account deleted by auth service")
            return jsonify(message="Account deleted by auth service"), 200
        else:
            return jsonify(error="No response from server")
    except Exception as e:
        logger.error(f"Error deleting account: {e}")
        return jsonify(error=str(e)), 500


@auth_bp.route('/refresh_token', methods=['POST'])
def refresh_token():
    try:
        logger.info("Performing token refresh")
        data = request.get_json()
        refresh_token = data.get('refresh_token')

        if not refresh_token:
            return jsonify(error="Refresh token required"), 400

        response = auth_service.supabase.auth.refresh_session(refresh_token)

        if response.session:
            return jsonify(
                access_token=response.session.access_token,
                refresh_token=response.session.refresh_token,
                expires_in=response.session.expires_in
            ), 200
        else:
            return jsonify(error="Failed to refresh token"), 401

    except Exception as e:
        logger.error(f"Error refreshing token: {e}")
        return jsonify(error="Invalid refresh token"), 401
