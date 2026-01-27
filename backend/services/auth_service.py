from services.supabase_service import SupabaseService
import logging


class AuthService:
    """
    Service to handle all authentication-related operations using Supabase Auth.
    """

    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.supabase = SupabaseService().get_client()

    def sign_up(self, email: str, password: str) -> dict:
        """
        Register a new user with Supabase Auth.

        Args:
            email: User's email address
            password: User's password

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
            self.logger.info(f"User signed up successfully: {email}")
            return response
        except Exception as e:
            self.logger.error(f"Error signing up user {email}: {e}")
            raise e

    def sign_in(self, email: str, password: str) -> dict:
        """
        Authenticate a user with Supabase Auth.

        Args:
            email: User's email address
            password: User's password

        Returns:
            Authentication response containing user data and session

        Raises:
            Exception: If sign in fails
        """
        try:
            self.logger.info(f"Login attempt for {email}")
            response = self.supabase.auth.sign_in_with_password({
                "email": email,
                "password": password
            })
            self.logger.info(f"User signed in successfully: {email}")
            return response
        except Exception as e:
            self.logger.error(f"Error signing in user {email}: {e}")
            raise e
