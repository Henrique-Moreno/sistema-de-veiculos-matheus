from app import db
from datetime import datetime

class Reservation(db.Model):
    """Modelo que representa uma reserva com sinal financeiro no sistema."""
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    vehicle_id = db.Column(db.Integer, db.ForeignKey('vehicle.id'), nullable=False)
    inspection_id = db.Column(db.Integer, db.ForeignKey('inspection.id'), nullable=True)
    amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), nullable=False, default='active')
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    reserver = db.relationship('User', back_populates='reservations', lazy=True)
    vehicle = db.relationship('Vehicle', back_populates='reservations', lazy=True)
    inspection = db.relationship('Inspection', back_populates='reservation', uselist=False)
    purchase = db.relationship('Purchase', back_populates='reservation', uselist=False)

    def to_dict(self):
        """Converte o modelo para um dicionário."""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'vehicle_id': self.vehicle_id,
            'inspection_id': self.inspection_id,
            'amount': self.amount,
            'status': self.status,
            'created_at': self.created_at.isoformat(),
            'user': self.reserver.to_dict() if self.reserver else None,
            'vehicle': self.vehicle.to_dict() if self.vehicle else None,
            'inspection': self.inspection.to_dict() if self.inspection else None
        }

    def __repr__(self):
        return f'<Reservation {self.id} for Vehicle {self.vehicle_id} by User {self.user_id}>'