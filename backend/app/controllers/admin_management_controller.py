from flask import jsonify, request
from app.models.user import User
from app.models.vehicle import Vehicle
from app.models.inspection import Inspection
from app.models.reservation import Reservation
from app.models.admin import Admin
from app import db
from app.controllers.admin_auth_controller import token_required, permission_required, log_admin_action

class AdminManagementController:
    """Controlador para gestão de entidades do sistema."""

    # Gestão de Usuários
    @staticmethod
    @token_required
    @permission_required('manage_users')
    def get_users(admin):
        """Retorna lista de todos os usuários cadastrados."""
        try:
            users = User.query.all()
            return jsonify({
                "users": [user.to_dict() for user in users],
                "total": len(users)
            }), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @staticmethod
    @token_required
    @permission_required('manage_users')
    def get_user(admin, user_id):
        """Retorna detalhes de um usuário específico."""
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "Usuário não encontrado."}), 404
        
        return jsonify({"user": user.to_dict()}), 200

    @staticmethod
    @token_required
    @permission_required('manage_users')
    def update_user(admin, user_id):
        """Atualiza os dados de um usuário."""
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "Usuário não encontrado."}), 404
        
        data = request.get_json()
        if not data:
            return jsonify({"error": "Dados inválidos."}), 400
        
        if 'username' in data:
            if User.query.filter_by(username=data['username']).first() and data['username'] != user.username:
                return jsonify({"error": "Username já em uso."}), 400
            user.username = data['username']
        
        if 'email' in data:
            if User.query.filter_by(email=data['email']).first() and data['email'] != user.email:
                return jsonify({"error": "Email já em uso."}), 400
            user.email = data['email']
        
        try:
            db.session.commit()
            log_admin_action(admin, "UPDATE_USER", f"Administrador atualizou usuário ID: {user_id}")
            return jsonify({
                "message": "Usuário atualizado com sucesso.",
                "user": user.to_dict()
            }), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500

    # Gestão de Veículos
    @staticmethod
    @token_required
    @permission_required('manage_vehicles')
    def get_vehicles(admin):
        """Retorna lista de todos os veículos."""
        try:
            vehicles = Vehicle.query.all()
            return jsonify({
                "vehicles": [vehicle.to_dict() for vehicle in vehicles],
                "total": len(vehicles)
            }), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @staticmethod
    @token_required
    @permission_required('manage_vehicles')
    def create_vehicle(admin):
        """Cria um novo veículo."""
        data = request.get_json()
        
        required_fields = ['marca', 'modelo', 'ano', 'preco']
        if not data or not all(field in data for field in required_fields):
            return jsonify({"error": "Marca, modelo, ano e preço são obrigatórios."}), 400
        
        new_vehicle = Vehicle(
            marca=data['marca'],
            modelo=data['modelo'],
            ano=data['ano'],
            preco=data['preco'],
            photo_url=data.get('photo_url'),
            is_reserved=False
        )
        
        try:
            db.session.add(new_vehicle)
            db.session.commit()
            
            log_admin_action(admin, "CREATE_VEHICLE", f"Administrador criou veículo: {data['marca']} {data['modelo']}")
            
            return jsonify({
                "message": "Veículo criado com sucesso.",
                "vehicle": new_vehicle.to_dict()
            }), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500

    @staticmethod
    @token_required
    @permission_required('manage_vehicles')
    def update_vehicle(admin, vehicle_id):
        """Atualiza um veículo."""
        vehicle = Vehicle.query.get(vehicle_id)
        if not vehicle:
            return jsonify({"error": "Veículo não encontrado."}), 404
        
        data = request.get_json()
        if not data:
            return jsonify({"error": "Dados inválidos."}), 400
        
        updatable_fields = ['marca', 'modelo', 'ano', 'preco', 'photo_url', 'is_reserved']
        for field in updatable_fields:
            if field in data:
                setattr(vehicle, field, data[field])
        
        try:
            db.session.commit()
            log_admin_action(admin, "UPDATE_VEHICLE", f"Administrador atualizou veículo ID: {vehicle_id}")
            return jsonify({
                "message": "Veículo atualizado com sucesso.",
                "vehicle": vehicle.to_dict()
            }), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500

    @staticmethod
    @token_required
    @permission_required('manage_vehicles')
    def delete_vehicle(admin, vehicle_id):
        """Deleta um veículo."""
        vehicle = Vehicle.query.get(vehicle_id)
        if not vehicle:
            return jsonify({"error": "Veículo não encontrado."}), 404
        
        try:
            db.session.delete(vehicle)
            db.session.commit()
            
            log_admin_action(admin, "DELETE_VEHICLE", f"Administrador deletou veículo ID: {vehicle_id}")
            
            return jsonify({"message": "Veículo deletado com sucesso."}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500

    # Gestão de Vistorias
    @staticmethod
    @token_required
    @permission_required('manage_inspections')
    def get_inspections(admin):
        """Retorna lista de todas as vistorias."""
        try:
            inspections = Inspection.query.all()
            return jsonify({
                "inspections": [inspection.to_dict() for inspection in inspections],
                "total": len(inspections)
            }), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    # Gestão de Reservas
    @staticmethod
    @token_required
    @permission_required('manage_reservations')
    def get_reservations(admin):
        """Retorna lista de todas as reservas."""
        try:
            reservations = Reservation.query.all()
            return jsonify({
                "reservations": [reservation.to_dict() for reservation in reservations],
                "total": len(reservations)
            }), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500