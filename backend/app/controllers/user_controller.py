from flask import jsonify, request
from app.models.user import User
from app import db
from datetime import datetime
from flask_login import login_user, logout_user, login_required, current_user

class UserController:
    """Controlador para operações de usuários no sistema."""

    @staticmethod
    def register():
        """Registra um novo usuário via JSON."""
        data = request.get_json()
        
        required_fields = ['username', 'email', 'password']
        if not data or not all(field in data for field in required_fields):
            return jsonify({"error": "Username, email e senha são obrigatórios."}), 400
        
        if User.query.filter_by(email=data['email']).first():
            return jsonify({"error": "Email já em uso."}), 400
        
        if User.query.filter_by(username=data['username']).first():
            return jsonify({"error": "Username já em uso."}), 400
        
        new_user = User(
            username=data['username'],
            email=data['email'],
            created_at=datetime.utcnow()
        )
        new_user.set_password(data['password'])
        
        try:
            db.session.add(new_user)
            db.session.commit()
            return jsonify({
                "message": "Cadastro realizado com sucesso.",
                "user": new_user.to_dict()
            }), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500

    @staticmethod
    def login():
        """Realiza login e gerencia sessão via Flask-Login."""
        data = request.get_json()
        
        if not data or 'email' not in data or 'password' not in data:
            return jsonify({"error": "Email e senha são obrigatórios."}), 400

        user = User.query.filter_by(email=data['email']).first()
        
        if user and user.check_password(data['password']):
            login_user(user)
            return jsonify({
                "message": "Login bem-sucedido.",
                "user": user.to_dict()
            }), 200
        
        return jsonify({"error": "Credenciais inválidas."}), 401

    @staticmethod
    @login_required
    def logout():
        """Realiza logout da sessão."""
        logout_user()
        return jsonify({"message": "Logout bem-sucedido."}), 200

    @staticmethod
    @login_required
    def get_profile():
        """Retorna perfil do usuário logado."""
        return jsonify({"user": current_user.to_dict()}), 200
    
    @staticmethod
    @login_required
    def update_profile():
        """Atualiza o perfil do usuário autenticado."""
        data = request.get_json()
        if not data:
            return jsonify({"error": "Dados inválidos."}), 400
        
        user = current_user
        if 'username' in data:
            if User.query.filter_by(username=data['username']).first() and data['username'] != user.username:
                return jsonify({"error": "Username já em uso."}), 400
            user.username = data['username']
        if 'email' in data:
            if User.query.filter_by(email=data['email']).first() and data['email'] != user.email:
                return jsonify({"error": "Email já em uso."}), 400
            user.email = data['email']
        if 'password' in data:
            user.set_password(data['password'])
        
        try:
            db.session.commit()
            return jsonify({
                "message": "Perfil atualizado com sucesso.",
                "user": user.to_dict()
            }), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500