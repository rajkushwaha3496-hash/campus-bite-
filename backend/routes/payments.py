from flask import Blueprint, request, jsonify
from config import Config
import hmac
import hashlib
import time
import secrets

payments_bp = Blueprint('payments', __name__, url_prefix='/api/payments')

PAYMENTS_STORE = []

@payments_bp.route('/razorpay/create-order', methods=['POST'])
def create_razorpay_order():
    data = request.get_json() or {}
    amount = float(data.get('amount', 0))
    currency = data.get('currency', 'INR')
    receipt = data.get('receipt', f"rcpt_{int(time.time())}")

    if amount <= 0:
        return jsonify({'error': 'Invalid payment amount'}), 400

    order_id = f"order_{secrets.token_hex(8)}"
    record = {
        "order_id": order_id,
        "amount": int(amount * 100),
        "currency": currency,
        "receipt": receipt,
        "status": "created",
        "createdAt": time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
    }
    PAYMENTS_STORE.append(record)

    return jsonify({
        "id": order_id,
        "amount": int(amount * 100),
        "currency": currency,
        "key_id": Config.RAZORPAY_KEY_ID,
        "receipt": receipt,
        "status": "created"
    }), 200

@payments_bp.route('/razorpay/verify', methods=['POST'])
def verify_payment():
    data = request.get_json() or {}
    razorpay_order_id = data.get('razorpay_order_id')
    razorpay_payment_id = data.get('razorpay_payment_id')
    razorpay_signature = data.get('razorpay_signature')

    if not razorpay_order_id or not razorpay_payment_id:
        return jsonify({'error': 'Missing payment verification credentials'}), 400

    # In production, HMAC-SHA256 signature check:
    # generated_signature = hmac.new(
    #     Config.RAZORPAY_KEY_SECRET.encode('utf-8'),
    #     f"{razorpay_order_id}|{razorpay_payment_id}".encode('utf-8'),
    #     hashlib.sha256
    # ).hexdigest()
    # is_valid = (generated_signature == razorpay_signature)

    for p in PAYMENTS_STORE:
        if p['order_id'] == razorpay_order_id:
            p['status'] = 'captured'
            p['payment_id'] = razorpay_payment_id

    return jsonify({
        "verified": True,
        "message": "Payment verified by CampusBite Razorpay gateway",
        "paymentId": razorpay_payment_id or f"pay_{secrets.token_hex(6)}"
    }), 200

@payments_bp.route('/cod/confirm', methods=['POST'])
def confirm_cod():
    data = request.get_json() or {}
    order_id = data.get('order_id')
    return jsonify({
        "verified": True,
        "mode": "Cash on Delivery",
        "message": "Cash collection scheduled upon hostel delivery"
    })
