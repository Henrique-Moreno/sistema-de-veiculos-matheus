from app import db
from datetime import datetime

class Vehicle(db.Model):
    """Modelo que representa um veículo no sistema."""
    
    id = db.Column(db.Integer, primary_key=True)
    marca = db.Column(db.String(100), nullable=False)
    modelo = db.Column(db.String(150), nullable=False)
    ano = db.Column(db.Integer, nullable=False)
    preco = db.Column(db.Float, nullable=False)
    is_reserved = db.Column(db.Boolean, nullable=False, default=False)
    photo_url = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    inspections = db.relationship('Inspection', back_populates='vehicle', lazy=True)
    reservations = db.relationship('Reservation', back_populates='vehicle', lazy=True)
    purchases = db.relationship('Purchase', back_populates='vehicle', lazy=True)

    def to_dict(self):
        """Converte o modelo para um dicionário."""
        return {
            'id': self.id,
            'marca': self.marca,
            'modelo': self.modelo,
            'ano': self.ano,
            'preco': self.preco,
            'is_reserved': self.is_reserved,
            'photo_url': self.photo_url,  
            'created_at': self.created_at.isoformat()
        }

    def __repr__(self):
        return f'<Vehicle {self.marca} {self.modelo} {self.ano}>'