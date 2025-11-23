from flask import jsonify, request
from app.models.review import Review
from app.models.purchase import Purchase
from app import db
from flask_login import login_required, current_user
from datetime import datetime

class ReviewController:
    """Controlador para operações de avaliações pós-compra no sistema."""

    @staticmethod
    @login_required
    def create_review():
        """Cria uma avaliação para uma compra realizada."""
        data = request.get_json()
        
        required_fields = ['purchase_id', 'vehicle_rating', 'service_rating']
        if not data or not all(field in data for field in required_fields):
            return jsonify({"error": "Purchase_id, vehicle_rating e service_rating são obrigatórios."}), 400

        purchase_id = data['purchase_id']
        vehicle_rating = data['vehicle_rating']
        service_rating = data['service_rating']
        comment = data.get('comment')

        if not (1 <= vehicle_rating <= 5) or not (1 <= service_rating <= 5):
            return jsonify({"error": "As avaliações devem ser entre 1 e 5."}), 400

        purchase = Purchase.query.get_or_404(purchase_id)
        
        if purchase.user_id != current_user.id:  
            return jsonify({"error": "Acesso negado: Compra não pertence ao usuário."}), 403

        # Verifica se já existe avaliação para esta compra
        existing_review = Review.query.filter_by(purchase_id=purchase_id).first()
        if existing_review:
            return jsonify({"error": "Já existe uma avaliação para esta compra."}), 400

        new_review = Review(
            purchase_id=purchase_id,
            vehicle_rating=vehicle_rating,
            service_rating=service_rating,
            comment=comment,
            created_at=datetime.utcnow()
        )

        try:
            db.session.add(new_review)
            db.session.commit()
            return jsonify({
                "message": "Avaliação criada com sucesso.",
                "review": new_review.to_dict()
            }), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500

    @staticmethod
    @login_required
    def get_user_reviews():
        """Lista todas as avaliações do usuário autenticado."""
        try:
            # Busca avaliações através das compras do usuário
            user_purchases = Purchase.query.filter_by(user_id=current_user.id).all()  
            purchase_ids = [purchase.id for purchase in user_purchases]
            
            reviews = Review.query.filter(Review.purchase_id.in_(purchase_ids)).all()
            
            return jsonify({
                "reviews": [review.to_dict() for review in reviews]
            }), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @staticmethod
    @login_required
    def update_review(review_id):
        """Atualiza uma avaliação existente."""
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "Dados inválidos."}), 400

        review = Review.query.get_or_404(review_id)
        purchase = Purchase.query.get_or_404(review.purchase_id)
        
        if purchase.user_id != current_user.id:  
            return jsonify({"error": "Acesso negado: Avaliação não pertence ao usuário."}), 403

        if 'vehicle_rating' in data:
            if not (1 <= data['vehicle_rating'] <= 5):
                return jsonify({"error": "A avaliação do veículo deve ser entre 1 e 5."}), 400
            review.vehicle_rating = data['vehicle_rating']
        
        if 'service_rating' in data:
            if not (1 <= data['service_rating'] <= 5):
                return jsonify({"error": "A avaliação do atendimento deve ser entre 1 e 5."}), 400
            review.service_rating = data['service_rating']
        
        if 'comment' in data:
            review.comment = data['comment']

        try:
            db.session.commit()
            return jsonify({
                "message": "Avaliação atualizada com sucesso.",
                "review": review.to_dict()
            }), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500