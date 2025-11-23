from app import db
from datetime import datetime

class Purchase(db.Model):
    """Modelo que representa uma compra finalizada no sistema."""
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    vehicle_id = db.Column(db.Integer, db.ForeignKey('vehicle.id'), nullable=False)
    reservation_id = db.Column(db.Integer, db.ForeignKey('reservation.id'), nullable=False)
    final_price = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), nullable=False, default='completed')
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    buyer = db.relationship('User', back_populates='purchases', lazy=True)
    vehicle = db.relationship('Vehicle', back_populates='purchases', lazy=True)
    reservation = db.relationship('Reservation', back_populates='purchase', uselist=False)
    review = db.relationship('Review', back_populates='purchase', uselist=False)

    def to_dict(self):
        """Converte o modelo para um dicionário."""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'vehicle_id': self.vehicle_id,
            'reservation_id': self.reservation_id,
            'final_price': self.final_price,
            'status': self.status,
            'created_at': self.created_at.isoformat(),
            'buyer': self.buyer.to_dict() if self.buyer else None,
            'vehicle': self.vehicle.to_dict() if self.vehicle else None,
            'reservation': self.reservation.to_dict() if self.reservation else None,
            'review': self.review.to_dict() if self.review else None
        }

    def __repr__(self):
        return f'<Purchase {self.id} - Vehicle {self.vehicle_id} by User {self.user_id}>'