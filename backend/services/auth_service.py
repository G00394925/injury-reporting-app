from flask import jsonify
from services.supabase_service import SupabaseService
import logging

logger = logging.getLogger(__name__)


class AuthService:
    """
    Service to handle all authentication-related operations using Supabase Auth.
    These include actions such as signing up, signing in, updating passwords, 
    sending and verifying OTPs, etc.
    """

    def __init__(self):
        self.supabase = SupabaseService().get_client()

    def sign_up(self, email: str, password: str) -> dict:
        """
        Register a new user with Supabase Auth.

        Args:
            email (str): User's email address
            password (str): User's password

        Returns:
            Authentication response containing user data

        Raises:
            Exception: If sign up fails
        """
        try:
            response = self.supabase.auth.sign_up({
                "email": email,
                "password": password
            })
            logger.info(f"User signed up successfully: {email}")
            return response
        except Exception as e:
            logger.error(f"Error signing up user {email}: {e}")
            raise e

    def sign_in(self, email: str, password: str) -> dict:
        """
        Authenticate a user with Supabase Auth.

        Args:
            email (str): User's email address
            password (str): User's password

        Returns:
            Authentication response containing user data and session

        Raises:
            Exception: If sign in fails
        """
        try:
            logger.info(f"Login attempt for {email}")
            response = self.supabase.auth.sign_in_with_password({
                "email": email,
                "password": password
            })
            logger.info(f"User signed in successfully: {email}")
            return response
        except Exception as e:
            logger.error(f"Error signing in user {email}: {e}")
            raise e

    def update_password(self, email: str, new_password: str) -> dict:
        """
        Change a user's password at their request.

        Args:
            email (str): The user's email
            new_password (str): The new password the user wishes to use/

        Returns: 
            JSON response indicating success

        Raises:
            Exception: If password update fails.
        """
        try:
            logger.info(f"Password update attempt for {email}")
            response = self.supabase.auth.update_user(
                {"password": new_password}
            )

            logger.info(f"Password updated successfully for {email}")
            return jsonify(message="Password updated successfully"), 200
        except Exception as e:
            logger.error(f"Error updating password for {email}: {e}")
            raise e

    def send_otp(self, email: str) -> dict:
        """
        Send a One Time Passcode to the given email. Typically OTPs are sent 
        automatically by Supabase upon sign up, but this function supports
        sending additional OTPs at the user's request (e.g., if their original 
        OTP expired or they didn't receive it).

        Args:
            email (str): The email to send the OTP to. 
        """

        try:
            logger.info(f"Sending OTP to {email}")
            response = self.supabase.auth.sign_in_with_otp({
                "email": email
            })
            logger.info(f"OTP sent successfully to {email}")
            return response
        except Exception as e:
            logger.error(f"Error sending OTP to {email}")
            raise e

    def verify_otp(self, email: str, token: str) -> dict:
        """
        Verify that the user-entered OTP matches with what was sent
        to their email.

        Args:
            email (str): The user's email the OTP was sent to.
            token (str): The user-submitted code.
        """

        try:
            logger.info(f"OTP verification attempt for {email}")
            response = self.supabase.auth.verify_otp({
                "email": email,
                "token": token,
                "type": "email"
            })
            logger.info(f"OTP successfully verified for {email}")
            return response
        except Exception as e:
            logger.error(f"Error verifying OTP for {email} {e}")
            raise e

    def delete_account(self, uuid: str):

        try:
            logger.info(
                f"User {uuid} has requested the deletion of their account")
            response = self.supabase.auth.admin.delete_user(
                uuid
            )
            if response:
                logger.info("Account has been deleted.")
                return response
        except Exception as e:
            logger.error(f"Error deleting account for user {uuid}: {e}")
            raise e
