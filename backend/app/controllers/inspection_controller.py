from flask import jsonify, request
from app.models.inspection import Inspection
from app.models.vehicle import Vehicle
from app import db
from flask_login import login_required, current_user
from datetime import datetime, timedelta

class InspectionController:
    """Controlador para operações de agendamento de vistorias no sistema."""

    @staticmethod
    @login_required
    def get_available_slots():
        """Retorna datas e horários disponíveis para vistorias (próximos 7 dias, horários comerciais)."""
        start_hour, end_hour = 9, 17
        days_ahead = 7
        slots_per_day = end_hour - start_hour

        available_slots = []
        today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)

        for day in range(days_ahead):
            current_date = today + timedelta(days=day)
            for hour in range(start_hour, end_hour):
                slot_time = current_date.replace(hour=hour, minute=0)
                existing_inspection = Inspection.query.filter_by(inspection_date=slot_time).first()
                if not existing_inspection:
                    available_slots.append(slot_time.isoformat())

        return jsonify({"available_slots": available_slots}), 200

    @staticmethod
    @login_required
    def schedule():
        """Agenda uma vistoria para um veículo com base no JSON recebido."""
        data = request.get_json()

        required_fields = ['vehicle_id', 'inspection_date']
        if not data or not all(field in data for field in required_fields):
            return jsonify({"error": "Vehicle_id e inspection_date são obrigatórios."}), 400

        vehicle_id = data['vehicle_id']
        try:
            inspection_date = datetime.fromisoformat(data['inspection_date'])
        except ValueError:
            return jsonify({"error": "Formato de data inválido. Use ISO 8601 (ex.: 2025-10-17T09:00:00)."}), 400

        vehicle = Vehicle.query.get_or_404(vehicle_id)

        existing_inspection = Inspection.query.filter_by(inspection_date=inspection_date).first()
        if existing_inspection:
            return jsonify({"error": "Horário já reservado."}), 400

        new_inspection = Inspection(
            user_id=current_user.id,
            vehicle_id=vehicle_id,
            inspection_date=inspection_date,
            status='pending',
            created_at=datetime.utcnow()
        )

        try:
            db.session.add(new_inspection)
            db.session.commit()
            return jsonify({
                "message": "Vistoria agendada com sucesso.",
                "inspection": new_inspection.to_dict()
            }), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500

    @staticmethod
    @login_required
    def complete_inspection(inspection_id):
        """Marca a vistoria como concluída e adiciona o relatório."""
        data = request.get_json()

        if not data or 'report' not in data:
            return jsonify({"error": "Relatório da vistoria é obrigatório."}), 400

        inspection = Inspection.query.get_or_404(inspection_id)

        if inspection.user_id != current_user.id:
            return jsonify({"error": "Acesso negado: Vistoria não pertence ao usuário."}), 403

        if inspection.status == 'completed':
            return jsonify({"error": "Vistoria já foi concluída."}), 400

        inspection.status = 'completed'
        inspection.report = data['report']

        try:
            db.session.commit()
            return jsonify({
                "message": "Vistoria concluída com sucesso.",
                "inspection": inspection.to_dict()
            }), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500