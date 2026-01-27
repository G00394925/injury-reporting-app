from flask import Flask
from flask_cors import CORS
import logging

# Flask Blueprints
from routes.auth import auth_bp
from routes.athletes import athletes_bp
from routes.teams import teams_bp
from routes.health import health_bp
from routes.events import events_bp

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)

CORS(app,
     resources={r"/api/*": {"origins": "*"}},
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "PUT", "POST", "DELETE", "OPTIONS"],
     supports_credentials=True)

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(athletes_bp, url_prefix='/api/athletes')
app.register_blueprint(teams_bp, url_prefix='/api/teams')
app.register_blueprint(health_bp, url_prefix='/api/health')
app.register_blueprint(events_bp, url_prefix='/api/events')


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
