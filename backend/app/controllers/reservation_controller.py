from flask import jsonify, request
from app.models.reservation import Reservation
from app.models.vehicle import Vehicle
from app.models.inspection import Inspection
from app import db
from flask_login import login_required, current_user
from datetime import datetime

class ReservationController:
    """Controlador para operações de reservas com sinal financeiro no sistema."""

    @staticmethod
    @login_required
    def list_reservations():
        """Lista todas as reservas do usuário autenticado."""
        try:
            reservations = Reservation.query.filter_by(user_id=current_user.id).all()
            return jsonify({
                "reservations": [reservation.to_dict() for reservation in reservations]
            }), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @staticmethod
    @login_required
    def create_reservation():
        """Cria uma reserva com sinal financeiro para um veículo."""
        data = request.get_json()

        required_fields = ['vehicle_id', 'amount']
        if not data or not all(field in data for field in required_fields):
            return jsonify({"error": "Vehicle_id e amount são obrigatórios."}), 400

        vehicle_id = data['vehicle_id']
        amount = data['amount']
        inspection_id = data.get('inspection_id')

        if amount < 500.00:
            return jsonify({"error": "O sinal deve ser de no mínimo R$ 500,00."}), 400

        vehicle = Vehicle.query.get_or_404(vehicle_id)
        active_reservation = Reservation.query.filter_by(vehicle_id=vehicle_id, status='active').first()
        if vehicle.is_reserved or active_reservation:
            return jsonify({"error": "Veículo já reservado."}), 400

        inspection = None
        if inspection_id:
            inspection = Inspection.query.get_or_404(inspection_id)
            if inspection.user_id != current_user.id:
                return jsonify({"error": "Vistoria não pertence ao usuário atual."}), 403

        new_reservation = Reservation(
            user_id=current_user.id,
            vehicle_id=vehicle_id,
            inspection_id=inspection_id,
            amount=amount,
            status='active',
            created_at=datetime.utcnow()
        )

        vehicle.is_reserved = True

        try:
            db.session.add(new_reservation)
            db.session.commit()
            return jsonify({
                "message": "Reserva criada com sucesso. Veículo reservado com prioridade.",
                "reservation": new_reservation.to_dict()
            }), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500

    @staticmethod
    @login_required
    def confirm_purchase(reservation_id):
        """Confirma a compra do veículo, abatendo o sinal do valor final."""
        reservation = Reservation.query.get_or_404(reservation_id)

        if reservation.user_id != current_user.id:
            return jsonify({"error": "Acesso negado: Reserva não pertence ao usuário."}), 403

        if reservation.status != 'active':
            return jsonify({"error": "Reserva já foi concluída ou cancelada."}), 400

        if reservation.inspection_id:
            inspection = Inspection.query.get_or_404(reservation.inspection_id)
            if inspection.status != 'completed':
                return jsonify({"error": "A vistoria associada ainda não foi concluída."}), 400

        reservation.status = 'completed'

        vehicle = Vehicle.query.get(reservation.vehicle_id)
        final_price = vehicle.preco - reservation.amount

        try:
            db.session.commit()
            return jsonify({
                "message": "Compra confirmada com sucesso. Sinal abatido do valor final.",
                "reservation": reservation.to_dict(),
                "final_price": final_price
            }), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500

    @staticmethod
    @login_required
    def cancel_reservation(reservation_id):
        """Cancela a reserva e libera o veículo para outros interessados."""
        reservation = Reservation.query.get_or_404(reservation_id)

        if reservation.user_id != current_user.id:
            return jsonify({"error": "Acesso negado: Reserva não pertence ao usuário."}), 403

        if reservation.status != 'active':
            return jsonify({"error": "Reserva já foi concluída ou cancelada."}), 400

        reservation.status = 'cancelled'

        vehicle = Vehicle.query.get(reservation.vehicle_id)
        vehicle.is_reserved = False

        try:
            db.session.commit()
            return jsonify({
                "message": "Reserva cancelada com sucesso. Veículo liberado. Sinal retido conforme política.",
                "reservation": reservation.to_dict()
            }), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500