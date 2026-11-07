from flask import Blueprint, request, jsonify
from supabase_client import get_supabase
import time
import random

orders_bp = Blueprint('orders', __name__, url_prefix='/api/orders')

ORDERS_STORE = [
    {
        "id": "ord-101",
        "orderNumber": "CB-9412",
        "createdAt": "2026-11-04T18:40:00Z",
        "type": "delivery",
        "status": "preparing",
        "studentName": "Aarav Sharma",
        "studentPhone": "+91 98765 43210",
        "studentId": "2024CS084",
        "items": [
            {
                "id": "oi-1",
                "menuItemId": "food-1",
                "name": "Campus Jumbo Burger Combo",
                "price": 189,
                "quantity": 1,
                "isVeg": False,
                "customization": {
                    "spiceLevel": "Spicy",
                    "extraCheese": True,
                    "extraToppings": ["Extra Cheddar Cheese Slice", "Crispy Peri Peri Fries Upsize"],
                    "removedIngredients": ["Pickles"],
                    "specialInstructions": "Extra crispy fries please"
                },
                "subtotal": 244
            }
        ],
        "itemTotal": 244,
        "deliveryFee": 0,
        "discount": 50,
        "promoCodeApplied": "CAMPUS50",
        "finalAmount": 194,
        "hostelAddress": {
            "hostelName": "Aryabhatta Boys Hostel (H-4)",
            "roomNumber": "Room 314",
            "floorNumber": "3rd Floor",
            "buildingName": "Block B"
        },
        "deliverySlot": "12:30 PM - 01:00 PM",
        "deliveryPartnerId": "dp-1",
        "deliveryPartnerName": "Rahul Verma",
        "deliveryPartnerPhone": "+91 98112 34567",
        "deliveryPin": "4829",
        "estimatedTime": "12 mins left",
        "paymentMethod": "UPI",
        "paymentStatus": "Paid"
    }
]

@orders_bp.route('', methods=['GET'])
def get_orders():
    status = request.args.get('status')
    student_id = request.args.get('studentId')
    order_type = request.args.get('type')

    filtered = list(ORDERS_STORE)
    if status:
        filtered = [o for o in filtered if o['status'] == status]
    if student_id:
        filtered = [o for o in filtered if o['studentId'] == student_id]
    if order_type:
        filtered = [o for o in filtered if o['type'] == order_type]

    return jsonify({'orders': filtered, 'total': len(filtered)})

@orders_bp.route('/<order_id>', methods=['GET'])
def get_order(order_id):
    order = next((o for o in ORDERS_STORE if o['id'] == order_id), None)
    if not order:
        return jsonify({'error': 'Order not found'}), 404
    return jsonify({'order': order})

@orders_bp.route('', methods=['POST'])
def create_order():
    data = request.get_json() or {}
    items = data.get('items', [])
    if not items:
        return jsonify({'error': 'No food items in tray'}), 400

    order_type = data.get('type', 'pickup')
    payment_method = data.get('paymentMethod', 'UPI')
    discount = float(data.get('discount', 0))

    # Calculate item totals server side
    item_total = 0
    processed_items = []
    for item in items:
        unit_price = item.get('price') or item.get('menuItem', {}).get('price', 100)
        customization = item.get('customization', {})
        if customization.get('extraCheese'):
            unit_price += 25
        if customization.get('extraToppings'):
            unit_price += len(customization['extraToppings']) * 20
        
        qty = int(item.get('quantity', 1))
        subtotal = unit_price * qty
        item_total += subtotal

        processed_items.append({
            "id": f"oi-{random.randint(1000, 9999)}",
            "menuItemId": item.get('menuItemId') or item.get('menuItem', {}).get('id', 'food-1'),
            "name": item.get('name') or item.get('menuItem', {}).get('name', 'Dish'),
            "price": unit_price,
            "quantity": qty,
            "isVeg": item.get('isVeg', True),
            "customization": customization,
            "subtotal": subtotal
        })

    delivery_fee = 0 if order_type == 'pickup' else (0 if item_total >= 149 else 15)
    final_amount = max(0, item_total + delivery_fee - discount)
    order_num = f"CB-{random.randint(1000, 9999)}"

    new_order = {
        "id": f"ord-{int(time.time()*1000)}",
        "orderNumber": order_num,
        "createdAt": time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
        "type": order_type,
        "status": "placed",
        "items": processed_items,
        "itemTotal": item_total,
        "deliveryFee": delivery_fee,
        "discount": discount,
        "promoCodeApplied": data.get('promoCodeApplied'),
        "finalAmount": final_amount,
        "studentName": data.get('studentName', 'Student'),
        "studentPhone": data.get('studentPhone', '+91 98765 43210'),
        "studentId": data.get('studentId', '2024CS084'),
        "hostelAddress": data.get('hostelAddress') if order_type == 'delivery' else None,
        "deliverySlot": data.get('deliverySlot') if order_type == 'delivery' else None,
        "pickupSlot": data.get('pickupSlot') if order_type == 'pickup' else None,
        "pickupCounter": "Express Counter #1 (Ground Floor)" if order_type == 'pickup' else None,
        "pickupQrCode": f"CAMPUSBITE-{order_num}-VERIFIED",
        "deliveryPin": str(random.randint(1000, 9999)) if order_type == 'delivery' else None,
        "deliveryPartnerId": "dp-1" if order_type == 'delivery' else None,
        "deliveryPartnerName": "Rahul Verma" if order_type == 'delivery' else None,
        "deliveryPartnerPhone": "+91 98112 34567" if order_type == 'delivery' else None,
        "estimatedTime": "15-20 mins" if order_type == 'pickup' else "25-30 mins",
        "paymentMethod": payment_method,
        "paymentStatus": "Paid"
    }

    ORDERS_STORE.insert(0, new_order)
    return jsonify({'message': f'Order #{order_num} created', 'order': new_order}), 201

@orders_bp.route('/<order_id>/status', methods=['PATCH'])
def update_status(order_id):
    data = request.get_json() or {}
    new_status = data.get('status')
    order = next((o for o in ORDERS_STORE if o['id'] == order_id), None)
    if not order:
        return jsonify({'error': 'Order not found'}), 404

    order['status'] = new_status
    if new_status == 'accepted':
        order['acceptedAt'] = time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
    elif new_status == 'preparing':
        order['estimatedTime'] = '10-15 mins'
    elif new_status == 'ready':
        order['preparedAt'] = time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
        order['estimatedTime'] = 'Ready for Pickup now!' if order['type'] == 'pickup' else 'Out for delivery to hostel'
    elif new_status == 'delivered':
        order['deliveredAt'] = time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
        order['estimatedTime'] = 'Delivered'

    return jsonify({'message': f'Order status updated to {new_status}', 'order': order})

@orders_bp.route('/<order_id>/assign', methods=['PATCH'])
def assign_partner(order_id):
    data = request.get_json() or {}
    partner_id = data.get('partnerId')
    order = next((o for o in ORDERS_STORE if o['id'] == order_id), None)
    if not order:
        return jsonify({'error': 'Order not found'}), 404

    order['deliveryPartnerId'] = partner_id
    order['deliveryPartnerName'] = 'Rahul Verma'
    order['deliveryPartnerPhone'] = '+91 98112 34567'
    return jsonify({'message': 'Partner assigned', 'order': order})

@orders_bp.route('/<order_id>/cancel', methods=['POST'])
def cancel_order(order_id):
    order = next((o for o in ORDERS_STORE if o['id'] == order_id), None)
    if not order:
        return jsonify({'error': 'Order not found'}), 404
    if order['status'] != 'placed':
        return jsonify({'error': 'Cannot cancel order once kitchen preparation has begun'}), 400

    order['status'] = 'cancelled'
    return jsonify({'message': 'Order cancelled', 'order': order})
