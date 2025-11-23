from flask import jsonify, request
from app.models.purchase import Purchase
from app.models.reservation import Reservation
from app.models.vehicle import Vehicle
from app import db
from flask_login import login_required, current_user
from datetime import datetime

class PurchaseController:
    """Controlador para operações de histórico de compras no sistema."""

    @staticmethod
    @login_required
    def get_user_purchases():
        """Lista todas as compras do usuário autenticado."""
        try:
            purchases = Purchase.query.filter_by(user_id=current_user.id).all()
            return jsonify({
                "purchases": [purchase.to_dict() for purchase in purchases]
            }), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @staticmethod
    @login_required
    def get_purchase_details(purchase_id):
        """Retorna os detalhes de uma compra específica do usuário."""
        purchase = Purchase.query.get_or_404(purchase_id)
        
        if purchase.user_id != current_user.id:
            return jsonify({"error": "Acesso negado: Compra não pertence ao usuário."}), 403
        
        return jsonify({
            "purchase": purchase.to_dict()
        }), 200

    @staticmethod
    @login_required
    def create_purchase_from_reservation(reservation_id):
        """Cria uma compra a partir de uma reserva confirmada."""
        reservation = Reservation.query.get_or_404(reservation_id)
        
        if reservation.user_id != current_user.id:
            return jsonify({"error": "Acesso negado: Reserva não pertence ao usuário."}), 403
        
        if reservation.status != 'completed':
            return jsonify({"error": "A reserva precisa estar confirmada para criar uma compra."}), 400

        # Verifica se já existe uma compra para esta reserva
        existing_purchase = Purchase.query.filter_by(reservation_id=reservation_id).first()
        if existing_purchase:
            return jsonify({"error": "Já existe uma compra para esta reserva."}), 400

        vehicle = Vehicle.query.get_or_404(reservation.vehicle_id)
        final_price = vehicle.preco - reservation.amount

        new_purchase = Purchase(
            user_id=current_user.id,  
            vehicle_id=reservation.vehicle_id,
            reservation_id=reservation_id,
            final_price=final_price,
            status='completed',
            created_at=datetime.utcnow()
        )

        try:
            db.session.add(new_purchase)
            db.session.commit()
            return jsonify({
                "message": "Compra registrada com sucesso no histórico.",
                "purchase": new_purchase.to_dict()
            }), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500