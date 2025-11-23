from flask import Blueprint
from app.controllers.sales_report_controller import SalesReportController

sales_report_bp = Blueprint('sales_report', __name__)

# Rotas para administradores
sales_report_bp.route('/reports', methods=['GET'])(SalesReportController.get_sales_report)
sales_report_bp.route('/dashboard', methods=['GET'])(SalesReportController.get_sales_dashboard)
sales_report_bp.route('/reviews', methods=['GET'])(SalesReportController.get_all_reviews)