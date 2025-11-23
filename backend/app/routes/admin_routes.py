from flask import Blueprint
from app.controllers.admin_auth_controller import AdminAuthController
from app.controllers.admin_management_controller import AdminManagementController
from app.controllers.admin_system_controller import AdminSystemController

admin_bp = Blueprint('admin', __name__)

# Autenticação e Perfil
admin_bp.route('/login', methods=['POST'])(AdminAuthController.login)
admin_bp.route('/profile', methods=['GET'])(AdminAuthController.get_profile)
admin_bp.route('/profile', methods=['PUT'])(AdminAuthController.update_profile)

# Gestão de Usuários
admin_bp.route('/users', methods=['GET'])(AdminManagementController.get_users)
admin_bp.route('/users/<int:user_id>', methods=['GET'])(AdminManagementController.get_user)
admin_bp.route('/users/<int:user_id>', methods=['PUT'])(AdminManagementController.update_user)

# Gestão de Veículos
admin_bp.route('/vehicles', methods=['GET'])(AdminManagementController.get_vehicles)
admin_bp.route('/vehicles', methods=['POST'])(AdminManagementController.create_vehicle)
admin_bp.route('/vehicles/<int:vehicle_id>', methods=['PUT'])(AdminManagementController.update_vehicle)
admin_bp.route('/vehicles/<int:vehicle_id>', methods=['DELETE'])(AdminManagementController.delete_vehicle)

# Gestão de Vistorias
admin_bp.route('/inspections', methods=['GET'])(AdminManagementController.get_inspections)

# Gestão de Reservas
admin_bp.route('/reservations', methods=['GET'])(AdminManagementController.get_reservations)

# Gestão de Administradores
admin_bp.route('/admins', methods=['GET'])(AdminSystemController.get_admins)
admin_bp.route('/admins', methods=['POST'])(AdminSystemController.create_admin)

# Auditoria e Dashboard
admin_bp.route('/logs', methods=['GET'])(AdminSystemController.get_logs)
admin_bp.route('/dashboard', methods=['GET'])(AdminSystemController.get_dashboard)