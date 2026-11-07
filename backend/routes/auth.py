from flask import Blueprint, request, jsonify
import jwt
import datetime
from config import Config
from supabase_client import get_supabase

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

# Mock memory fallback if Supabase credentials are not yet entered
USERS_STORE = [
    {
        "id": "usr-student-1",
        "name": "Aarav Sharma",
        "email": "aarav.cs24@campus.edu",
        "role": "student",
        "student_id_number": "2024CS084",
        "phone_number": "+91 98765 43210",
        "wallet_balance": 650,
        "department": "Computer Science & Engineering"
    },
    {
        "id": "usr-admin-1",
        "name": "Prof. Sharma (Canteen Admin)",
        "email": "admin.canteen@campus.edu",
        "role": "admin",
        "student_id_number": "ADMIN-01",
        "phone_number": "+91 98765 00001",
        "wallet_balance": 5000,
        "department": "Canteen Administration"
    },
    {
        "id": "usr-chef-1",
        "name": "Chef Murugan (Head Chef)",
        "email": "chef.murugan@campus.edu",
        "role": "kitchen",
        "student_id_number": "KITCHEN-01",
        "phone_number": "+91 98765 00002",
        "wallet_balance": 0,
        "department": "Canteen Kitchen"
    },
    {
        "id": "usr-runner-1",
        "name": "Rahul Verma (Runner #1)",
        "email": "rahul.runner@campus.edu",
        "role": "delivery",
        "student_id_number": "RUNNER-01",
        "phone_number": "+91 98112 34567",
        "wallet_balance": 350,
        "department": "Campus Logistics"
    }
]

def generate_token(user):
    payload = {
        'sub': user['id'],
        'email': user['email'],
        'role': user['role'],
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }
    return jwt.encode(payload, Config.JWT_SECRET_KEY, algorithm='HS256')

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    identifier = data.get('identifier', '').strip()
    if not identifier:
        return jsonify({'error': 'Email or Student ID is required'}), 400

    supabase = get_supabase()
    if supabase:
        try:
            res = supabase.table('users').select('*').or_(f"email.eq.{identifier},student_id_number.eq.{identifier}").execute()
            if res.data and len(res.data) > 0:
                user = res.data[0]
                token = generate_token(user)
                return jsonify({'message': 'Login successful', 'token': token, 'user': user}), 200
        except Exception as e:
            print(f"Supabase login lookup error: {e}")

    # Fallback to store
    user = next((u for u in USERS_STORE if u['email'].lower() == identifier.lower() or u.get('student_id_number') == identifier), None)
    if not user:
        # Create student profile on the fly
        user = {
            "id": f"usr-{int(datetime.datetime.utcnow().timestamp())}",
            "name": identifier.split('@')[0].capitalize(),
            "email": identifier if '@' in identifier else f"{identifier.lower()}@campus.edu",
            "role": "student",
            "student_id_number": identifier.upper() if '@' not in identifier else "2024CS999",
            "phone_number": "+91 98765 43210",
            "wallet_balance": 500,
            "department": "Engineering"
        }
        USERS_STORE.append(user)

    token = generate_token(user)
    return jsonify({'message': 'Login successful', 'token': token, 'user': user}), 200

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    email = data.get('email', '').strip()
    name = data.get('name', '').strip()
    student_id = data.get('studentIdNumber', '')
    phone = data.get('phoneNumber', '+91 98765 43210')
    dept = data.get('department', 'Engineering')

    if not email or not name:
        return jsonify({'error': 'Name and email are required'}), 400

    supabase = get_supabase()
    if supabase:
        try:
            new_user = {
                "name": name,
                "email": email,
                "role": "student",
                "student_id_number": student_id,
                "phone_number": phone,
                "wallet_balance": 300,
                "department": dept
            }
            res = supabase.table('users').insert(new_user).execute()
            if res.data:
                user = res.data[0]
                return jsonify({'message': 'Student registered', 'user': user, 'token': generate_token(user)}), 201
        except Exception as e:
            print(f"Supabase register error: {e}")

    user = {
        "id": f"usr-{int(datetime.datetime.utcnow().timestamp())}",
        "name": name,
        "email": email,
        "role": "student",
        "student_id_number": student_id,
        "phone_number": phone,
        "wallet_balance": 300,
        "department": dept
    }
    USERS_STORE.append(user)
    return jsonify({'message': 'Student registered', 'user': user, 'token': generate_token(user)}), 201

@auth_bp.route('/me', methods=['GET'])
def get_me():
    user_id = request.headers.get('x-user-id')
    user = next((u for u in USERS_STORE if u['id'] == user_id), USERS_STORE[0])
    return jsonify({'user': user})

@auth_bp.route('/wallet/topup', methods=['POST'])
def topup_wallet():
    data = request.get_json() or {}
    amount = float(data.get('amount', 0))
    user_id = data.get('userId')

    if amount <= 0:
        return jsonify({'error': 'Invalid topup amount'}), 400

    user = next((u for u in USERS_STORE if u['id'] == user_id), USERS_STORE[0])
    user['wallet_balance'] += amount
    return jsonify({'message': f'₹{amount} added to wallet', 'walletBalance': user['wallet_balance']})
