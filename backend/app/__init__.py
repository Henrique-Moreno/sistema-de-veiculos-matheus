from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager
from flask_cors import CORS
from app.config import Config

db = SQLAlchemy()
migrate = Migrate()
login_manager = LoginManager()

def create_app():
    """Cria e configura a aplicação Flask."""
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Configurações de sessão 
    app.config['SESSION_COOKIE_SAMESITE'] = 'None'
    app.config['SESSION_COOKIE_SECURE'] = True  
    app.config['SESSION_COOKIE_HTTPONLY'] = True

    app.url_map.strict_slashes = False

    # Configuração de CORS 
    CORS(
        app,
        resources={r"/*": {"origins": "*"}},
        supports_credentials=True,
        methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization", "Accept"],
        expose_headers=["Set-Cookie", "Content-Type", "Authorization"]
    )

    db.init_app(app)
    migrate.init_app(app, db)

    login_manager.init_app(app)
    login_manager.login_view = None  

    @login_manager.unauthorized_handler
    def unauthorized():
        return jsonify({"error": "Não autenticado. Faça login para continuar."}), 401

    from app.models.user import User
    from app.models.vehicle import Vehicle
    from app.models.inspection import Inspection
    from app.models.reservation import Reservation
    from app.models.admin import Admin, AdminLog  

    @login_manager.user_loader
    def load_user(user_id):
        """Carrega um usuário pelo ID."""
        user = User.query.get(int(user_id))
        if user:
            return user
        return Admin.query.get(int(user_id))

    from app.routes import register_routes
    register_routes(app)

    with app.app_context():
        print("Rotas registradas:")
        for rule in app.url_map.iter_rules():
            print(f"{rule.endpoint}: {rule} {rule.methods}")

    @app.route('/')
    def home():
        """Rota inicial da aplicação."""
        return "Bem-vindo ao Sistema de Concessionária de Veículos"

    return app