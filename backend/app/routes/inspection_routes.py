from flask import Blueprint
from app.controllers.inspection_controller import InspectionController
from flask_login import login_required

inspection_bp = Blueprint('inspection', __name__, url_prefix='')

inspection_bp.route('/slots', methods=['GET'])(login_required(InspectionController.get_available_slots))
inspection_bp.route('/', methods=['POST'])(login_required(InspectionController.schedule))
inspection_bp.route('/<int:inspection_id>/complete', methods=['PATCH'])(login_required(InspectionController.complete_inspection))