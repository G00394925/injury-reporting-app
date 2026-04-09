from flask import Flask, request
from flask_cors import CORS
from auth_middleware import require_auth, check_auth
from services.scheduler_service import SchedulerService
import logging
import atexit

# Flask Blueprints
from routes.auth import auth_bp
from routes.athletes import athletes_bp
from routes.teams import teams_bp
from routes.health import health_bp
from routes.events import events_bp
from routes.notifications import notifications_bp
from routes.admin import admin_bp
from routes.sessions import session_bp

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)

scheduler_service = SchedulerService()

app = Flask(__name__)

CORS(
    app,
    resources={r"/api/*": {"origins": "*"}},
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "PUT", "POST", "DELETE", "OPTIONS"],
    supports_credentials=True
)


@app.before_request
def authenticate():
    """Middleware to check authentication for protected routes. Public routes are defined and skipped."""
    public_routes = [
        '/api/auth/register',
        '/api/auth/login',
        '/api/auth/send_otp',
        '/api/auth/verify_otp'
    ]

    # Skip auth check for public routes
    if request.path in public_routes:
        return
    
    # For all other routes, require authentication
    if request.path.startswith('/api'):
        return check_auth()

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(athletes_bp, url_prefix='/api/athletes')
app.register_blueprint(teams_bp, url_prefix='/api/teams')
app.register_blueprint(health_bp, url_prefix='/api/health')
app.register_blueprint(events_bp, url_prefix='/api/events')
app.register_blueprint(notifications_bp, url_prefix='/api/notifications')
app.register_blueprint(admin_bp, url_prefix='/api/admin')
app.register_blueprint(session_bp, url_prefix='/api/session')

if __name__ == '__main__':
    scheduler_service.start()
    # Gracefully shutdown scheduler when process stops
    atexit.register(scheduler_service.stop)
    app.run(host="0.0.0.0", port=5000, debug=True)
