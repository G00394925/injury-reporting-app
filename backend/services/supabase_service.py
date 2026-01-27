from supabase import Client, create_client
from dotenv import load_dotenv
import os
import logging


class SupabaseService:
    """
    Singleton service to create one and only one instance of a 
    Supabase client. This client is used by AuthService and DatabaseService.
    """ 

    _instance = None

    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    logger = logging.getLogger(__name__)
    
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
            
            self.client: Client = create_client(self.url, self.key)
        
        except AssertionError as e:
            raise RuntimeError(f"Supabase initialization error: {e}")


    def get_client(self) -> Client:
        return self.client