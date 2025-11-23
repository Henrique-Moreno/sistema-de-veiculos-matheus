from flask import Blueprint
from app.controllers.user_controller import UserController
from flask_login import login_required

user_bp = Blueprint('user', __name__)

user_bp.route('/register', methods=['POST'])(UserController.register)
user_bp.route('/login', methods=['POST'])(UserController.login)
user_bp.route('/logout', methods=['POST'])(login_required(UserController.logout))
user_bp.route('/profile', methods=['GET'])(login_required(UserController.get_profile))
user_bp.route('/profile', methods=['PUT'])(login_required(UserController.update_profile))