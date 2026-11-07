from flask import Flask, jsonify
from flask_cors import CORS
from config import Config

# Import blueprints
from routes.auth import auth_bp
from routes.menu import menu_bp
from routes.orders import orders_bp
from routes.addresses import addresses_bp
from routes.payments import payments_bp
from routes.delivery_slots import delivery_slots_bp
from routes.analytics import analytics_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS for React frontend
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(menu_bp)
    app.register_blueprint(orders_bp)
    app.register_blueprint(addresses_bp)
    app.register_blueprint(payments_bp)
    app.register_blueprint(delivery_slots_bp)
    app.register_blueprint(analytics_bp)

    @app.route('/api/health', methods=['GET'])
    def health():
        return jsonify({
            'status': 'healthy',
            'framework': 'Python Flask 3.0',
            'team': '#TEAMSQUAD',
            'application': 'CampusBite API Engine',
            'database': 'Supabase PostgreSQL Ready'
        })

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({'error': 'Endpoint not found', 'status': 404}), 404

    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({'error': 'Internal server error', 'status': 500}), 500

    return app

app = create_app()

if __name__ == '__main__':
    print("[CampusBite] Starting Python Flask backend server on port 5000...")
    app.run(host='0.0.0.0', port=5000, debug=True)
