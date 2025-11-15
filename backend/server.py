from flask import Flask, jsonify, request
from flask_cors import CORS
import pymongo

app = Flask(__name__)
CORS(app, resources = {
    r"/api/*": {
        "origins": "*",
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})



@app.route('/api/hello', methods=['GET'])
def hello_world():
    return jsonify(message="Hello, World!")

@app.route('/api/register', methods=['POST'])
def register_user():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    user_type = data.get('user_type')
    

if __name__ == '__main__':
    app.run(debug=True)
