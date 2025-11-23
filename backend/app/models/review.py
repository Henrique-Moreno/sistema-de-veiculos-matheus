from app import db
from datetime import datetime

class Review(db.Model):
    """Modelo que representa uma avaliação pós-compra no sistema."""
    
    id = db.Column(db.Integer, primary_key=True)
    purchase_id = db.Column(db.Integer, db.ForeignKey('purchase.id'), nullable=False)
    vehicle_rating = db.Column(db.Integer, nullable=False)
    service_rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    purchase = db.relationship('Purchase', back_populates='review', uselist=False)

    def to_dict(self):
        """Converte o modelo para um dicionário."""
        return {
            'id': self.id,
            'purchase_id': self.purchase_id,
            'vehicle_rating': self.vehicle_rating,
            'service_rating': self.service_rating,
            'comment': self.comment,
            'created_at': self.created_at.isoformat(),
            'purchase': self.purchase.to_dict() if self.purchase else None
        }

    def __repr__(self):
        return f'<Review {self.id} for Purchase {self.purchase_id}>'