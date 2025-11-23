from flask import jsonify, request
from app.models.purchase import Purchase
from app.models.review import Review
from app.models.vehicle import Vehicle
from app import db
from datetime import datetime, timedelta
from app.controllers.admin_auth_controller import token_required, permission_required

class SalesReportController:
    """Controlador para relatórios e dashboard de vendas (Admin)."""

    @staticmethod
    @token_required
    @permission_required('view_reports')
    def get_sales_report(admin):
        """Gera relatório de vendas com filtros por data."""
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        query = Purchase.query
        
        # Aplica filtros de data se fornecidos
        if start_date:
            try:
                start_datetime = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
                query = query.filter(Purchase.created_at >= start_datetime)
            except ValueError:
                return jsonify({"error": "Formato de data inicial inválido. Use ISO format."}), 400
        
        if end_date:
            try:
                end_datetime = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
                query = query.filter(Purchase.created_at <= end_datetime)
            except ValueError:
                return jsonify({"error": "Formato de data final inválido. Use ISO format."}), 400

        sales = query.all()
        
        total_revenue = sum(sale.final_price for sale in sales)
        total_sales = len(sales)
        
        return jsonify({
            "report": {
                "period": {
                    "start_date": start_date,
                    "end_date": end_date
                },
                "total_sales": total_sales,
                "total_revenue": float(total_revenue),
                "average_sale_value": float(total_revenue / total_sales) if total_sales > 0 else 0,
                "sales": [sale.to_dict() for sale in sales]
            }
        }), 200

    @staticmethod
    @token_required
    @permission_required('view_reports')
    def get_sales_dashboard(admin):
        """Retorna dados consolidados para o dashboard de vendas."""
        try:
            total_sales = Purchase.query.count()
            total_revenue_result = db.session.query(db.func.sum(Purchase.final_price)).scalar()
            total_revenue = float(total_revenue_result) if total_revenue_result else 0
            
            thirty_days_ago = datetime.utcnow() - timedelta(days=30)
            recent_sales = Purchase.query.filter(Purchase.created_at >= thirty_days_ago).count()
            
            popular_vehicles = db.session.query(
                Vehicle.marca, 
                Vehicle.modelo,
                db.func.count(Purchase.id).label('sales_count')
            ).join(Purchase).group_by(Vehicle.marca, Vehicle.modelo).order_by(db.desc('sales_count')).limit(5).all()
            
            recent_reviews = Review.query.order_by(Review.created_at.desc()).limit(10).all()
            
            return jsonify({
                "dashboard": {
                    "total_sales": total_sales,
                    "total_revenue": total_revenue,
                    "recent_sales": recent_sales,
                    "popular_vehicles": [
                        {
                            "marca": vehicle.marca,
                            "modelo": vehicle.modelo,
                            "sales_count": vehicle.sales_count
                        } for vehicle in popular_vehicles
                    ],
                    "recent_reviews": [review.to_dict() for review in recent_reviews]
                }
            }), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @staticmethod
    @token_required
    @permission_required('view_reports')
    def get_all_reviews(admin):
        """Lista todas as avaliações do sistema (Admin)."""
        try:
            reviews = Review.query.order_by(Review.created_at.desc()).all()
            return jsonify({
                "reviews": [review.to_dict() for review in reviews]
            }), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500