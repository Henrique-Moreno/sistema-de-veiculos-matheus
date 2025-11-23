from flask import Blueprint
from app.controllers.review_controller import ReviewController
from flask_login import login_required

review_bp = Blueprint('review', __name__)

# Rotas para usuários
review_bp.route('', methods=['POST'])(login_required(ReviewController.create_review))
review_bp.route('/me/reviews', methods=['GET'])(login_required(ReviewController.get_user_reviews))
review_bp.route('/<int:review_id>', methods=['PUT'])(login_required(ReviewController.update_review))