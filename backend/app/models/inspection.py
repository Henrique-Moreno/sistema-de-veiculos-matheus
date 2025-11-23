from app import db
from datetime import datetime

class Inspection(db.Model):
    """Modelo que representa uma solicitação de vistoria no sistema."""
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    vehicle_id = db.Column(db.Integer, db.ForeignKey('vehicle.id'), nullable=False)
    inspection_date = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(20), nullable=False, default='pending')
    report = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    inspector = db.relationship('User', back_populates='inspections', lazy=True)
    vehicle = db.relationship('Vehicle', back_populates='inspections', lazy=True)
    reservation = db.relationship('Reservation', back_populates='inspection', uselist=False)

    def to_dict(self):
        """Converte o modelo para um dicionário."""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'vehicle_id': self.vehicle_id,
            'inspection_date': self.inspection_date.isoformat(),
            'status': self.status,
            'report': self.report,
            'created_at': self.created_at.isoformat(),
            'user': self.inspector.to_dict() if self.inspector else None,
            'vehicle': self.vehicle.to_dict() if self.vehicle else None
        }

    def __repr__(self):
        return f'<Inspection {self.id} for Vehicle {self.vehicle_id} by User {self.user_id}>'