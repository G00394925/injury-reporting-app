from services.database_service import DatabaseService
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class SessionService:
    def __init__(self):
        self.db_service = DatabaseService()

    def create_session(self, user_id: str) -> dict:
        """Create new session when a user logs in."""
        try:
            response = self.db_service.insert("sessions", {
                "user_id": user_id,
                "session_start": datetime.now().isoformat()
            })
            logger.info(f"Session created for user_id: {user_id}")
            return response
        except Exception as e:
            logger.error(
                f"Error creating session for user_id {user_id}: {e}")
            raise e

    def end_session(self, session_id: str) -> dict:
        """Ends a session on user logout."""
        try:
            response = self.db_service.update(
                table="sessions",
                data={"session_end": datetime.now().isoformat()},
                filters={"session_id": session_id}
            )
            logger.info(f"Session {session_id} ended.")
            return response
        except Exception as e:
            logger.error(f"Error ending session {session_id}: {e}")
            raise e

    def log_event(self, session_id: str, event_type: str, event_data: dict = None, endpoint: str = None) -> dict:
        """Log an event during a session."""
        try:
            response = self.db_service.insert("session_events", {
                "session_id": session_id,
                "event_type": event_type,
                "event_data": event_data,
                "endpoint": endpoint,
                "timestamp": datetime.now().isoformat(),
            })
            logger.info(
                f"Event logged: {event_type} for session_id: {session_id}")
            return response
        except Exception as e:
            logger.error(
                f"Error logging event for session_id {session_id}: {e}")
            raise e
