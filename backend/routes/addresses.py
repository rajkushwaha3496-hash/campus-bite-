from flask import Blueprint, request, jsonify
from supabase_client import get_supabase
import time

addresses_bp = Blueprint('addresses', __name__, url_prefix='/api/addresses')

ADDRESSES_STORE = [
    {
        "id": "addr-1",
        "label": "Main Hostel Room",
        "hostelName": "Aryabhatta Boys Hostel (H-4)",
        "buildingName": "Block B - Wing 2",
        "block": "Block B",
        "floorNumber": "3rd Floor",
        "roomNumber": "Room 314",
        "studentPhoneNumber": "+91 98765 43210",
        "deliveryInstructions": "Ring bell twice. If studying, leave with floor monitor.",
        "isDefault": True
    },
    {
        "id": "addr-2",
        "label": "Library Reading Desk",
        "hostelName": "Central Academic Block",
        "buildingName": "Dr. APJ Abdul Kalam Library",
        "block": "Reading Wing",
        "floorNumber": "1st Floor",
        "roomNumber": "Desk #42",
        "studentPhoneNumber": "+91 98765 43210",
        "deliveryInstructions": "Deliver outside library entrance gate.",
        "isDefault": False
    }
]

@addresses_bp.route('', methods=['GET'])
def get_addresses():
    return jsonify({'addresses': ADDRESSES_STORE})

@addresses_bp.route('', methods=['POST'])
def add_address():
    data = request.get_json() or {}
    new_addr = {
        "id": f"addr-{int(time.time()*1000)}",
        "label": data.get('label', 'Room'),
        "hostelName": data.get('hostelName', 'Hostel'),
        "buildingName": data.get('buildingName', ''),
        "block": data.get('block', ''),
        "floorNumber": data.get('floorNumber', ''),
        "roomNumber": data.get('roomNumber', ''),
        "studentPhoneNumber": data.get('studentPhoneNumber', '+91 98765 43210'),
        "deliveryInstructions": data.get('deliveryInstructions', ''),
        "isDefault": len(ADDRESSES_STORE) == 0 or bool(data.get('isDefault', False))
    }

    if new_addr['isDefault']:
        for a in ADDRESSES_STORE:
            a['isDefault'] = False

    ADDRESSES_STORE.append(new_addr)
    return jsonify({'message': 'Address saved', 'address': new_addr}), 201

@addresses_bp.route('/<addr_id>', methods=['PUT'])
def update_address(addr_id):
    data = request.get_json() or {}
    for a in ADDRESSES_STORE:
        if a['id'] == addr_id:
            a.update(data)
            return jsonify({'message': 'Address updated', 'address': a})
    return jsonify({'error': 'Address not found'}), 404

@addresses_bp.route('/<addr_id>/default', methods=['PATCH'])
def set_default(addr_id):
    for a in ADDRESSES_STORE:
        a['isDefault'] = (a['id'] == addr_id)
    return jsonify({'message': 'Default address updated'})

@addresses_bp.route('/<addr_id>', methods=['DELETE'])
def delete_address(addr_id):
    global ADDRESSES_STORE
    ADDRESSES_STORE = [a for a in ADDRESSES_STORE if a['id'] != addr_id]
    return jsonify({'message': 'Address deleted'})
