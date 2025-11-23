from flask import Blueprint
from app.controllers.reservation_controller import ReservationController
from flask_login import login_required

reservation_bp = Blueprint('reservation', __name__, url_prefix='/api/reservations')

reservation_bp.route('/', methods=['GET'])(login_required(ReservationController.list_reservations))
reservation_bp.route('/', methods=['POST'])(login_required(ReservationController.create_reservation))
reservation_bp.route('/<int:reservation_id>/confirm', methods=['PATCH'])(login_required(ReservationController.confirm_purchase))
reservation_bp.route('/<int:reservation_id>/cancel', methods=['PATCH'])(login_required(ReservationController.cancel_reservation))