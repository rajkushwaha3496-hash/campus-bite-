from flask import Blueprint, request, jsonify

delivery_slots_bp = Blueprint('delivery_slots', __name__, url_prefix='/api/delivery-slots')

SLOTS_STORE = [
    {"id": "slot-1", "timeWindow": "12:30 PM - 01:00 PM", "type": "Lunch", "maxCapacity": 35, "bookedCount": 18, "isActive": True},
    {"id": "slot-2", "timeWindow": "01:15 PM - 01:45 PM", "type": "Lunch", "maxCapacity": 35, "bookedCount": 29, "isActive": True},
    {"id": "slot-3", "timeWindow": "04:45 PM - 05:15 PM", "type": "Snacks", "maxCapacity": 40, "bookedCount": 12, "isActive": True},
    {"id": "slot-4", "timeWindow": "08:00 PM - 08:30 PM", "type": "Dinner", "maxCapacity": 30, "bookedCount": 22, "isActive": True},
    {"id": "slot-5", "timeWindow": "10:30 PM - 11:00 PM", "type": "Night Canteen", "maxCapacity": 50, "bookedCount": 38, "isActive": True}
]

@delivery_slots_bp.route('', methods=['GET'])
def get_slots():
    return jsonify({'slots': SLOTS_STORE})

@delivery_slots_bp.route('/<slot_id>', methods=['PATCH'])
def toggle_slot(slot_id):
    data = request.get_json() or {}
    slot = next((s for s in SLOTS_STORE if s['id'] == slot_id), None)
    if not slot:
        return jsonify({'error': 'Slot not found'}), 404

    if 'isActive' in data:
        slot['isActive'] = bool(data['isActive'])
    if 'maxCapacity' in data:
        slot['maxCapacity'] = int(data['maxCapacity'])

    return jsonify({'message': 'Slot updated', 'slot': slot})
