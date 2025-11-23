from flask import jsonify, request, current_app
from app.models.admin import Admin, AdminLog
from app import db
from datetime import datetime
import jwt
from functools import wraps

# Configuração JWT padrão
def get_jwt_secret():
    """Obtém a chave JWT da configuração existente do sistema."""
    return current_app.config.get('SECRET_KEY', 'car-dealership-secret-key-2024')

JWT_SECRET = get_jwt_secret
JWT_ALGORITHM = 'HS256'

def token_required(f):
    """Decorator para verificar token JWT."""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(' ')[1]
            except IndexError:
                return jsonify({"error": "Token malformado. Use: Bearer <token>"}), 401
        
        if not token:
            return jsonify({"error": "Token de acesso necessário."}), 401
        
        try:
            data = jwt.decode(token, JWT_SECRET(), algorithms=[JWT_ALGORITHM])
            current_admin = Admin.query.get(data['admin_id'])
            
            if not current_admin or not current_admin.is_active:
                return jsonify({"error": "Admin inválido ou conta inativa."}), 401
                
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expirado."}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Token inválido."}), 401
        
        return f(current_admin, *args, **kwargs)
    
    return decorated

def permission_required(permission):
    """Decorator para verificar permissões específicas."""
    def decorator(f):
        @wraps(f)
        def decorated_function(admin, *args, **kwargs):
            if not admin.has_permission(permission):
                return jsonify({"error": f"Permissão '{permission}' necessária."}), 403
            return f(admin, *args, **kwargs)
        return decorated_function
    return decorator

def log_admin_action(admin, action, description=None):
    """Registra uma ação do administrador."""
    try:
        admin_log = AdminLog(
            admin_id=admin.id,
            action=action,
            description=description,
            ip_address=request.remote_addr,
            user_agent=request.headers.get('User-Agent')
        )
        db.session.add(admin_log)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"Erro ao registrar ação do admin: {e}")

class AdminAuthController:
    """Controlador para autenticação e perfil de administradores."""

    @staticmethod
    def login():
        """Realiza login de administrador com JWT."""
        data = request.get_json()
        
        if not data or 'email' not in data or 'password' not in data:
            return jsonify({"error": "Email e senha são obrigatórios."}), 400

        admin = Admin.query.filter_by(email=data['email']).first()
        
        if admin and admin.is_active and admin.check_password(data['password']):
            admin.update_last_login()
            
            # Gerar token JWT
            token_payload = {
                'admin_id': admin.id,
                'email': admin.email,
                'exp': datetime.utcnow().timestamp() + 86400  # 24 horas
            }
            token = jwt.encode(token_payload, JWT_SECRET(), algorithm=JWT_ALGORITHM)
            
            # Log da ação
            log_admin_action(admin, "LOGIN", "Administrador fez login no sistema")
            
            return jsonify({
                "message": "Login de administrador bem-sucedido.",
                "token": token,
                "admin": admin.to_dict()
            }), 200
        
        return jsonify({"error": "Credenciais inválidas ou conta inativa."}), 401

    @staticmethod
    @token_required
    def get_profile(admin):
        """Retorna perfil do administrador logado."""
        return jsonify({"admin": admin.to_dict()}), 200

    @staticmethod
    @token_required
    def update_profile(admin):
        """Atualiza o perfil do administrador autenticado."""
        data = request.get_json()
        if not data:
            return jsonify({"error": "Dados inválidos."}), 400
        
        if 'username' in data:
            if Admin.query.filter_by(username=data['username']).first() and data['username'] != admin.username:
                return jsonify({"error": "Username já em uso."}), 400
            admin.username = data['username']
        
        if 'email' in data:
            if Admin.query.filter_by(email=data['email']).first() and data['email'] != admin.email:
                return jsonify({"error": "Email já em uso."}), 400
            admin.email = data['email']
        
        if 'password' in data:
            admin.set_password(data['password'])
        
        try:
            db.session.commit()
            log_admin_action(admin, "UPDATE_PROFILE", "Administrador atualizou seu perfil")
            return jsonify({
                "message": "Perfil de administrador atualizado com sucesso.",
                "admin": admin.to_dict()
            }), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500