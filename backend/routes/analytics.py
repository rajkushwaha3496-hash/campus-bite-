from flask import Blueprint, jsonify

analytics_bp = Blueprint('analytics', __name__, url_prefix='/api/analytics')

@analytics_bp.route('', methods=['GET'])
def get_analytics():
    return jsonify({
        "kpis": {
            "totalOrders": 142,
            "totalRevenue": 48920,
            "activeOrders": 14,
            "totalStudents": 1420,
            "averageOrderValue": 344
        },
        "topSelling": [
            {"name": "Campus Artisan Cold Coffee & Brownie", "count": 610, "percent": 88},
            {"name": "Butter Paneer Tikka Kathi Roll", "count": 512, "percent": 74},
            {"name": "Cheesy Veggie Delight Pan Pizza", "count": 420, "percent": 62},
            {"name": "Royal Chicken Biryani Thali", "count": 388, "percent": 55},
            {"name": "Campus Jumbo Burger Combo", "count": 342, "percent": 49}
        ],
        "peakHours": [
            {"time": "08:30 AM - 10:30 AM (Breakfast Dosa / Chai)", "percent": 65, "orders": 184},
            {"time": "12:30 PM - 02:00 PM (Lunch Thali & Biryani)", "percent": 95, "orders": 412},
            {"time": "04:30 PM - 06:00 PM (Evening Kathi Rolls & Shakes)", "percent": 70, "orders": 230},
            {"time": "08:00 PM - 09:30 PM (Dinner Rush)", "percent": 80, "orders": 310},
            {"time": "10:30 PM - 11:30 PM (Night Owl Canteen Snacks)", "percent": 85, "orders": 284}
        ]
    })
