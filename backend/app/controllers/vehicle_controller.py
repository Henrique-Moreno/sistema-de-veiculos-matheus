from flask import jsonify, request
from app.models.vehicle import Vehicle
from app import db
from flask_login import login_required
from datetime import datetime

class VehicleController:
    """Controlador para operações de veículos no sistema."""

    @staticmethod
    @login_required
    def create():
        """Cria um novo veículo no sistema."""
        data = request.get_json()

        required_fields = ['marca', 'modelo', 'ano', 'preco']
        if not data or not all(field in data for field in required_fields):
            return jsonify({"error": "Marca, modelo, ano e preço são obrigatórios."}), 400

        # Validações adicionais
        if not isinstance(data['ano'], int) or data['ano'] < 1900 or data['ano'] > 2026:
            return jsonify({"error": "Ano inválido. Deve ser um número entre 1900 e 2026."}), 400
        if not isinstance(data['preco'], (int, float)) or data['preco'] <= 0:
            return jsonify({"error": "Preço deve ser um número positivo."}), 400
        if 'photo_url' in data and (not isinstance(data['photo_url'], str) or len(data['photo_url']) > 255):
            return jsonify({"error": "Photo_url deve ser uma string de até 255 caracteres."}), 400

        new_vehicle = Vehicle(
            marca=data['marca'],
            modelo=data['modelo'],
            ano=data['ano'],
            preco=data['preco'],
            photo_url=data.get('photo_url'),  
            created_at=datetime.utcnow()
        )

        try:
            db.session.add(new_vehicle)
            db.session.commit()
            return jsonify({
                "message": "Veículo criado com sucesso.",
                "vehicle": new_vehicle.to_dict()
            }), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500

    @staticmethod
    @login_required
    def search():
        """Pesquisa veículos com base em filtros (marca, modelo, ano, preço, reservado)."""
        marca = request.args.get('marca')
        modelo = request.args.get('modelo')
        ano = request.args.get('ano', type=int)
        preco_min = request.args.get('preco_min', type=float)
        preco_max = request.args.get('preco_max', type=float)
        is_reserved = request.args.get('is_reserved', type=bool)

        query = Vehicle.query

        if marca:
            query = query.filter(Vehicle.marca.ilike(f"%{marca}%"))
        if modelo:
            query = query.filter(Vehicle.modelo.ilike(f"%{modelo}%"))
        if ano:
            query = query.filter(Vehicle.ano == ano)
        if preco_min:
            query = query.filter(Vehicle.preco >= preco_min)
        if preco_max:
            query = query.filter(Vehicle.preco <= preco_max)
        if is_reserved is not None:
            query = query.filter(Vehicle.is_reserved == is_reserved)

        vehicles = query.all()

        if not vehicles:
            return jsonify({"message": "Nenhum veículo encontrado com os filtros aplicados."}), 200

        return jsonify({"vehicles": [vehicle.to_dict() for vehicle in vehicles]}), 200

    @staticmethod
    @login_required
    def update(vehicle_id):
        """Atualiza os dados de um veículo existente."""
        data = request.get_json()

        if not data:
            return jsonify({"error": "Dados inválidos."}), 400

        vehicle = Vehicle.query.get_or_404(vehicle_id)

        # Verifica se o veículo está reservado
        if vehicle.is_reserved:
            return jsonify({"error": "Veículo reservado não pode ser atualizado."}), 400

        if 'marca' in data:
            vehicle.marca = data['marca']
        if 'modelo' in data:
            vehicle.modelo = data['modelo']
        if 'ano' in data:
            if not isinstance(data['ano'], int) or data['ano'] < 1900 or data['ano'] > 2026:
                return jsonify({"error": "Ano inválido. Deve ser um número entre 1900 e 2026."}), 400
            vehicle.ano = data['ano']
        if 'preco' in data:
            if not isinstance(data['preco'], (int, float)) or data['preco'] <= 0:
                return jsonify({"error": "Preço deve ser um número positivo."}), 400
            vehicle.preco = data['preco']
        if 'photo_url' in data:
            if not isinstance(data['photo_url'], str) or len(data['photo_url']) > 255:
                return jsonify({"error": "Photo_url deve ser uma string de até 255 caracteres."}), 400
            vehicle.photo_url = data['photo_url']

        try:
            db.session.commit()
            return jsonify({
                "message": "Veículo atualizado com sucesso.",
                "vehicle": vehicle.to_dict()
            }), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500

    @staticmethod
    @login_required
    def delete(vehicle_id):
        """Deleta um veículo do sistema."""
        vehicle = Vehicle.query.get_or_404(vehicle_id)

        # Verifica se o veículo está reservado
        if vehicle.is_reserved:
            return jsonify({"error": "Veículo reservado não pode ser deletado."}), 400

        try:
            db.session.delete(vehicle)
            db.session.commit()
            return jsonify({"message": "Veículo deletado com sucesso."}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500