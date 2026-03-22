from flask import Blueprint, request, jsonify
from services.database_service import DatabaseService
import logging

notifications_bp = Blueprint('notifications', __name__)
db_service = DatabaseService()

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)


@notifications_bp.route('/register', methods=['POST'])
def register_push_token():
    """
    Register or update a push token for a user.
    
    Expected JSON body:
    {
        "user_id": "uuid",
        "push_token": "ExponentPushToken[...]"
    }
    """
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        push_token = data.get('push_token')
        
        if not user_id or not push_token:
            logger.warning(f"Missing required fields: user_id={user_id}, push_token={push_token}")
            return jsonify({"error": "Missing user_id or push_token"}), 400
        
        # Validate token format
        if not push_token.startswith("ExponentPushToken"):
            logger.warning(f"Invalid push token format: {push_token}")
            return jsonify({"error": "Invalid push token format"}), 400
        
        # Update user's push token in database
        response = db_service.update(
            'users', 
            {'push_token': push_token}, 
            {'id': user_id}
        )
        
        logger.info(f"Push token registered for user {user_id}")
        return jsonify({"success": True, "message": "Push token registered"}), 200
        
    except Exception as e:
        logger.error(f"Error registering push token: {e}")
        return jsonify({"error": str(e)}), 500
