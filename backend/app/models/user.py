from app import db
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

class User(UserMixin, db.Model):
    """Modelo que representa um usuário no sistema."""
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    inspections = db.relationship('Inspection', back_populates='inspector', lazy=True)
    reservations = db.relationship('Reservation', back_populates='reserver', lazy=True)
    purchases = db.relationship('Purchase', back_populates='buyer', lazy=True)

    def set_password(self, password):
        """Define a senha hasheada do usuário."""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """Verifica se a senha fornecida corresponde à senha hasheada."""
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        """Converte o modelo para um dicionário."""
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'created_at': self.created_at.isoformat()
        }

    def __repr__(self):
        return f'<User {self.username}>'