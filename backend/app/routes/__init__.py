from app.routes.user_routes import user_bp
from app.routes.vehicle_routes import vehicle_bp
from app.routes.inspection_routes import inspection_bp
from app.routes.reservation_routes import reservation_bp
from app.routes.admin_routes import admin_bp
from app.routes.purchase_routes import purchase_bp
from app.routes.review_routes import review_bp
from app.routes.sales_report_routes import sales_report_bp

def register_routes(app):
    """Registra todos os blueprints da aplicação."""
    app.register_blueprint(user_bp, url_prefix='/api/users')
    app.register_blueprint(vehicle_bp, url_prefix='/api/vehicles')
    app.register_blueprint(inspection_bp, url_prefix='/api/inspections')
    app.register_blueprint(reservation_bp, url_prefix='/api/reservations')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(purchase_bp, url_prefix='/api/users')
    app.register_blueprint(review_bp, url_prefix='/api')
    app.register_blueprint(sales_report_bp, url_prefix='/api/admin/sales')