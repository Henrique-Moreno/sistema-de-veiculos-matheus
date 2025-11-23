from flask import jsonify, request
from app.models.admin import Admin, AdminLog
from app.models.user import User
from app.models.vehicle import Vehicle
from app.models.inspection import Inspection
from app.models.reservation import Reservation
from app import db
from app.controllers.admin_auth_controller import token_required, permission_required, log_admin_action

class AdminSystemController:
    """Controlador para sistema, logs e dashboard administrativo."""

    # Gestão de Administradores
    @staticmethod
    @token_required
    @permission_required('manage_admins')
    def create_admin(admin):
        """Cria um novo administrador."""
        data = request.get_json()
        
        required_fields = ['username', 'email', 'password']
        if not data or not all(field in data for field in required_fields):
            return jsonify({"error": "Username, email e senha são obrigatórios."}), 400
        
        if Admin.query.filter_by(email=data['email']).first():
            return jsonify({"error": "Email já em uso."}), 400
        
        if Admin.query.filter_by(username=data['username']).first():
            return jsonify({"error": "Username já em uso."}), 400
        
        new_admin = Admin(
            username=data['username'],
            email=data['email'],
            is_super_admin=data.get('is_super_admin', False),
            is_active=data.get('is_active', True)
        )
        new_admin.set_password(data['password'])
        
        if 'permissions' in data:
            new_admin.set_permissions(data['permissions'])
        else:
            # PERMISSÕES PADRÃO PARA NOVOS ADMINS NAO SUPER ADMIN
            default_permissions = ['manage_users', 'manage_vehicles', 'view_reports']
            new_admin.set_permissions(default_permissions)
        
        try:
            db.session.add(new_admin)
            db.session.commit()
            
            log_admin_action(admin, "CREATE_ADMIN", f"Administrador criou novo admin: {data['username']}")
            
            return jsonify({
                "message": "Administrador criado com sucesso.",
                "admin": new_admin.to_dict()
            }), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500

    @staticmethod
    @token_required
    @permission_required('manage_admins')
    def get_admins(admin):
        """Retorna lista de todos os administradores."""
        try:
            admins = Admin.query.all()
            return jsonify({
                "admins": [admin.to_dict() for admin in admins],
                "total": len(admins)
            }), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    # Logs de Auditoria
    @staticmethod
    @token_required
    @permission_required('view_logs')
    def get_logs(admin):
        """Retorna logs de atividades dos administradores."""
        try:
            page = request.args.get('page', 1, type=int)
            per_page = request.args.get('per_page', 50, type=int)
            
            logs = AdminLog.query.order_by(AdminLog.created_at.desc()).paginate(
                page=page, per_page=per_page, error_out=False
            )
            
            return jsonify({
                "logs": [log.to_dict() for log in logs.items],
                "total": logs.total,
                "pages": logs.pages,
                "current_page": page
            }), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    # Dashboard/Estatísticas
    @staticmethod
    @token_required
    def get_dashboard(admin):
        """Retorna dados para o dashboard do admin."""
        try:
            total_users = User.query.count()
            total_vehicles = Vehicle.query.count()
            total_admins = Admin.query.filter_by(is_active=True).count()
            total_reservations = Reservation.query.count()
            total_inspections = Inspection.query.count()
            
            # Veículos reservados e disponíveis
            reserved_vehicles = Vehicle.query.filter_by(is_reserved=True).count()
            available_vehicles = total_vehicles - reserved_vehicles
            
            recent_logs = AdminLog.query.order_by(AdminLog.created_at.desc()).limit(10).all()
            
            return jsonify({
                "stats": {
                    "total_users": total_users,
                    "total_vehicles": total_vehicles,
                    "available_vehicles": available_vehicles,
                    "reserved_vehicles": reserved_vehicles,
                    "total_admins": total_admins,
                    "total_reservations": total_reservations,
                    "total_inspections": total_inspections
                },
                "recent_activity": [log.to_dict() for log in recent_logs]
            }), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500