from flask import Blueprint
from app.controllers.purchase_controller import PurchaseController
from flask_login import login_required

purchase_bp = Blueprint('purchase', __name__)

purchase_bp.route('/me/purchases', methods=['GET'])(login_required(PurchaseController.get_user_purchases))
purchase_bp.route('/purchases/<int:purchase_id>', methods=['GET'])(login_required(PurchaseController.get_purchase_details))
purchase_bp.route('/from-reservation/<int:reservation_id>', methods=['POST'])(login_required(PurchaseController.create_purchase_from_reservation))