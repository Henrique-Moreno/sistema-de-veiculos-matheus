from flask import Blueprint
from app.controllers.vehicle_controller import VehicleController
from flask_login import login_required

vehicle_bp = Blueprint('vehicle', __name__, url_prefix='')

vehicle_bp.route('/', methods=['POST'])(login_required(VehicleController.create))
vehicle_bp.route('/', methods=['GET'])(login_required(VehicleController.search))
vehicle_bp.route('/<int:vehicle_id>', methods=['PUT'])(login_required(VehicleController.update))
vehicle_bp.route('/<int:vehicle_id>', methods=['DELETE'])(login_required(VehicleController.delete))