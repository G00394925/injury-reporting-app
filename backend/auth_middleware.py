from flask import request, jsonify, g
from services.supabase_service import SupabaseService
from functools import wraps
import logging

logger = logging.getLogger(__name__)

def check_auth():
    """Verify token and return None on success, or error response on failure"""
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        logger.warning("Missing or invalid Authorization header")
        return jsonify(error="Unauthorized - Missing or invalid Authorization header"), 401
    
    token = auth_header.split(" ")[1]

    if not token:
        logger.warning("No token provided in Authorization header")
        return jsonify(error="Unauthorized - Missing token in header"), 401
    
    try:
        # Verify token with Supabase Auth
        supabase = SupabaseService().get_client()
        user_response = supabase.auth.get_user(token)

        # Store user in Flask's global context
        g.user = user_response.user
        g.user_id = user_response.user.id

        logger.info(f"Token verified successfully for user ID: {user_response.user.id}")
        return None  # Success
    
    except Exception as e:
        logger.error(f"Token verification failed: {e}")
        return jsonify(error="Unauthorized - Invalid or expired token"), 401

def require_auth(f):
    """Decorator for route-level authentication"""
    @wraps(f)
    def decorator(*args, **kwargs):
        response = check_auth()
        if response:  # If error occurred
            return response
        return f(*args, **kwargs)

    return decorator
