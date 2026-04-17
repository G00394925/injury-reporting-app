from supabase import Client, create_client
from supabase.lib.client_options import SyncClientOptions
from dotenv import load_dotenv
import os
import logging

logger = logging.getLogger(__name__)


class SupabaseService:
    """
    Singleton service to create a single instance of a Supabase client. 
    This client is used by AuthService and DatabaseService.
    """
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            # Create and initialise the singleton instance
            cls._instance = super().__new__(cls)
            cls._instance._initialise()
        return cls._instance

    def _initialise(self):

        # Load supabase credentials
        load_dotenv()
        self.url = os.getenv("SUPABASE_URL")
        self.key = os.getenv("SUPABASE_KEY")

        try:
            assert self.url is not None, "SUPABASE_URL is not set in environment variables."
            assert self.key is not None, "SUPABASE_KEY is not set in environment variables."
            logger.info("Supabase credentials loaded")

            options = SyncClientOptions(
                auto_refresh_token=True, persist_session=False)
            self.client: Client = create_client(
                self.url, self.key, options=options)
            self.admin_auth_client = self.client.auth.admin

            logger.info("Supabase client created")

        except AssertionError as e:
            raise RuntimeError(f"Supabase initialization error: {e}")

    def get_client(self) -> Client:
        return self.client
