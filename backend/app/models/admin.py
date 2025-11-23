from app import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import json

class Admin(db.Model):
    """Modelo que representa um administrador no sistema."""
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    is_super_admin = db.Column(db.Boolean, default=False, nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    last_login = db.Column(db.DateTime, nullable=True)
    permissions = db.Column(db.Text, default='') 

    # Relacionamentos 
    admin_logs = db.relationship('AdminLog', back_populates='admin', lazy=True)

    def set_password(self, password):
        """Define a senha hasheada do admin."""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """Verifica se a senha fornecida corresponde à senha hasheada."""
        return check_password_hash(self.password_hash, password)

    def update_last_login(self):
        """Atualiza o último login do admin."""
        self.last_login = datetime.utcnow()
        db.session.commit()

    def has_permission(self, permission):
        """Verifica se o admin tem uma permissão específica."""
        if self.is_super_admin:
            return True
        return permission in self.get_permissions_list()

    def get_permissions_list(self):
        """Retorna a lista de permissões do admin."""
        try:
            return json.loads(self.permissions) if self.permissions else []
        except:
            return []

    def set_permissions(self, permissions_list):
        """Define as permissões do admin."""
        self.permissions = json.dumps(permissions_list)

    def to_dict(self):
        """Converte o modelo para um dicionário."""
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'created_at': self.created_at.isoformat(),
            'is_super_admin': self.is_super_admin,
            'is_active': self.is_active,
            'last_login': self.last_login.isoformat() if self.last_login else None,
            'permissions': self.get_permissions_list()
        }

    def __repr__(self):
        return f'<Admin {self.username}>'

class AdminLog(db.Model):
    """Modelo para registrar ações dos administradores."""
    
    id = db.Column(db.Integer, primary_key=True)
    admin_id = db.Column(db.Integer, db.ForeignKey('admin.id'), nullable=False)
    action = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    ip_address = db.Column(db.String(45), nullable=True)
    user_agent = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    admin = db.relationship('Admin', back_populates='admin_logs')

    def to_dict(self):
        """Converte o modelo para um dicionário."""
        return {
            'id': self.id,
            'admin_id': self.admin_id,
            'admin_username': self.admin.username,
            'action': self.action,
            'description': self.description,
            'ip_address': self.ip_address,
            'user_agent': self.user_agent,
            'created_at': self.created_at.isoformat()
        }