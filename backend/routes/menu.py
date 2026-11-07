from flask import Blueprint, request, jsonify
from supabase_client import get_supabase
import time

menu_bp = Blueprint('menu', __name__, url_prefix='/api/menu')

MENU_STORE = [
    {
        "id": "food-1",
        "name": "Campus Jumbo Burger Combo",
        "category": "Combos",
        "price": 189,
        "originalPrice": 220,
        "isVeg": False,
        "isAvailable": True,
        "rating": 4.8,
        "ratingCount": 342,
        "prepTimeMinutes": 12,
        "description": "Crispy toasted bun loaded with grilled juicy patty, signature spicy canteen mayo, fresh lettuce, and golden fries + chilled beverage.",
        "image": "/src/assets/images/hero_campus_combo_1793819593119.jpg",
        "isSpecial": True,
        "isPopular": True,
        "isRecommended": True,
        "availableToppings": [
            {"name": "Extra Cheddar Cheese Slice", "price": 25},
            {"name": "Crispy Peri Peri Fries Upsize", "price": 30}
        ],
        "removableIngredients": ["Onions", "Pickles", "Canteen Mayo"]
    },
    {
        "id": "food-2",
        "name": "Butter Paneer Tikka Kathi Roll",
        "category": "Snacks",
        "price": 135,
        "originalPrice": 150,
        "isVeg": True,
        "isAvailable": True,
        "rating": 4.9,
        "ratingCount": 512,
        "prepTimeMinutes": 10,
        "description": "Smoky tandoori spiced cottage cheese cubes wrapped inside a flaky multi-layered butter paratha with tangy mint chutney.",
        "image": "/src/assets/images/food_paneer_roll_1793819593701.jpg",
        "isSpecial": False,
        "isPopular": True,
        "isRecommended": True,
        "availableToppings": [
            {"name": "Extra Amul Mozzarella Cheese", "price": 25},
            {"name": "Double Paneer Cubes", "price": 40}
        ],
        "removableIngredients": ["Raw Onion", "Green Chillies", "Mint Chutney"]
    },
    {
        "id": "food-3",
        "name": "Crispy Mysore Masala Dosa",
        "category": "Breakfast",
        "price": 95,
        "originalPrice": 110,
        "isVeg": True,
        "isAvailable": True,
        "rating": 4.7,
        "ratingCount": 289,
        "prepTimeMinutes": 8,
        "description": "Fresh fermented golden crepe slathered with spicy red garlic chutney, filled with potato bhaji, served with coconut chutney & hot sambar.",
        "image": "/src/assets/images/food_crispy_dosa_1793819595370.jpg",
        "isSpecial": True,
        "isPopular": True,
        "isRecommended": False,
        "availableToppings": [
            {"name": "Extra Desi Ghee Roast", "price": 20},
            {"name": "Grated Paneer Filling", "price": 30}
        ],
        "removableIngredients": ["Mustard Seed Tadka", "Curry Leaves"]
    },
    {
        "id": "food-4",
        "name": "Cheesy Veggie Delight Pan Pizza",
        "category": "Fast Food",
        "price": 199,
        "originalPrice": 240,
        "isVeg": True,
        "isAvailable": True,
        "rating": 4.8,
        "ratingCount": 420,
        "prepTimeMinutes": 15,
        "description": "7-inch hand-stretched crust topped with rich Italian herb sauce, golden sweet corn, bell peppers, and 100% mozzarella.",
        "image": "/src/assets/images/food_cheese_pizza_1793819594606.jpg",
        "isSpecial": True,
        "isPopular": True,
        "isRecommended": True,
        "availableToppings": [
            {"name": "Cheese Burst Crust", "price": 45},
            {"name": "Black Olives & Jalapenos", "price": 25}
        ],
        "removableIngredients": ["Capsicum", "Onions", "Sweet Corn"]
    },
    {
        "id": "food-5",
        "name": "Campus Artisan Cold Coffee & Brownie",
        "category": "Beverages",
        "price": 110,
        "originalPrice": 130,
        "isVeg": True,
        "isAvailable": True,
        "rating": 4.9,
        "ratingCount": 610,
        "prepTimeMinutes": 5,
        "description": "Thick, frothy slow-brewed cold coffee with chocolate swirls, served alongside a warm fudgy chocolate walnut brownie.",
        "image": "/src/assets/images/food_cold_coffee_1793819595530.jpg",
        "isSpecial": False,
        "isPopular": True,
        "isRecommended": True,
        "availableToppings": [
            {"name": "Extra Chocolate Fudge Drizzle", "price": 15},
            {"name": "Vanilla Ice Cream Scoop", "price": 30}
        ],
        "removableIngredients": ["Sugar (make unsweetened)", "Chocolate Drizzle"]
    }
]

@menu_bp.route('', methods=['GET'])
def get_menu():
    category = request.args.get('category')
    search = request.args.get('search', '').lower()
    veg_only = request.args.get('vegOnly') == 'true'

    supabase = get_supabase()
    if supabase:
        try:
            q = supabase.table('food_items').select('*')
            if category and category != 'All':
                q = q.eq('category', category)
            if veg_only:
                q = q.eq('is_veg', True)
            res = q.execute()
            if res.data:
                return jsonify({'items': res.data, 'total': len(res.data)})
        except Exception as e:
            print(f"Supabase menu query fallback: {e}")

    items = list(MENU_STORE)
    if category and category != 'All':
        items = [i for i in items if i['category'].lower() == category.lower()]
    if search:
        items = [i for i in items if search in i['name'].lower() or search in i['description'].lower()]
    if veg_only:
        items = [i for i in items if i['isVeg']]

    return jsonify({'items': items, 'total': len(items)})

@menu_bp.route('/<item_id>', methods=['GET'])
def get_item(item_id):
    item = next((i for i in MENU_STORE if i['id'] == item_id), None)
    if not item:
        return jsonify({'error': 'Item not found'}), 404
    return jsonify({'item': item})

@menu_bp.route('', methods=['POST'])
def add_item():
    data = request.get_json() or {}
    new_item = {
        "id": f"food-{int(time.time()*1000)}",
        "name": data.get('name', 'New Dish'),
        "category": data.get('category', 'Fast Food'),
        "price": float(data.get('price', 100)),
        "originalPrice": float(data.get('originalPrice', data.get('price', 100))),
        "isVeg": bool(data.get('isVeg', True)),
        "isAvailable": True,
        "rating": 4.8,
        "ratingCount": 1,
        "prepTimeMinutes": int(data.get('prepTimeMinutes', 10)),
        "description": data.get('description', ''),
        "image": data.get('image', '/src/assets/images/hero_campus_combo_1793819593119.jpg'),
        "isSpecial": bool(data.get('isSpecial', False)),
        "availableToppings": data.get('availableToppings', []),
        "removableIngredients": data.get('removableIngredients', [])
    }
    MENU_STORE.insert(0, new_item)
    return jsonify({'message': 'Food item added to menu', 'item': new_item}), 201

@menu_bp.route('/<item_id>', methods=['PUT'])
def update_item(item_id):
    data = request.get_json() or {}
    for idx, item in enumerate(MENU_STORE):
        if item['id'] == item_id:
            MENU_STORE[idx].update(data)
            return jsonify({'message': 'Item updated', 'item': MENU_STORE[idx]})
    return jsonify({'error': 'Item not found'}), 404

@menu_bp.route('/<item_id>/availability', methods=['PATCH'])
def toggle_availability(item_id):
    data = request.get_json() or {}
    for item in MENU_STORE:
        if item['id'] == item_id:
            item['isAvailable'] = data.get('isAvailable', not item['isAvailable'])
            return jsonify({'message': f"Item stock status changed to {item['isAvailable']}", 'item': item})
    return jsonify({'error': 'Item not found'}), 404

@menu_bp.route('/<item_id>', methods=['DELETE'])
def delete_item(item_id):
    global MENU_STORE
    prev = len(MENU_STORE)
    MENU_STORE = [i for i in MENU_STORE if i['id'] != item_id]
    if len(MENU_STORE) == prev:
        return jsonify({'error': 'Item not found'}), 404
    return jsonify({'message': 'Item deleted'})
