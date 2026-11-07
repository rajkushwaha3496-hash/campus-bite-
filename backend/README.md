# CampusBite - Backend Architecture & Integration Guide
**Developed by #TEAMSQUAD**  
*Tagline: "Your Campus. Your Food. Your Way."*

---

## 1. Overview
CampusBite features a production-grade full-stack architecture:
1. **Node.js Express Full-Stack Server (`server.ts`)**: Runs on port 3000, serving the complete REST API (`/api/*`) and Vite frontend middlewares for the AI Studio preview and cloud deployment.
2. **Python Flask REST API (`backend/`)**: Modular Python service with Flask 3.0 blueprints, Supabase PostgreSQL connector, JWT authentication, and Razorpay payment integration.
3. **Supabase PostgreSQL Schema (`backend/schema.sql`)**: 12 normalized relational tables, foreign key constraints, Row Level Security (RLS) policies, and seed data.

---

## 2. Supabase Database Tables
- `users`: Student and staff accounts with roles (`student`, `admin`, `kitchen`, `delivery`), roll numbers, and wallet balances.
- `student_profiles`: Extended profile details, batch year, default hostel.
- `hostel_addresses`: Hostel name, building name, block, floor, room number, phone, delivery instructions.
- `food_categories`: Breakfast, Lunch, Snacks, Fast Food, Beverages, Desserts, Combos.
- `food_items`: Dish names, veg indicator, prices, availability, prep time, image URLs.
- `customization_options`: Spice levels, cheese add-ons, extra toppings, removable ingredients.
- `cart_items`: User tray storage with JSONB customization options.
- `orders`: Comprehensive order records, pickup vs delivery, PIN codes, QR tokens, estimated times.
- `order_items`: Line items with customized ingredient records.
- `delivery_slots`: Pre-booking delivery time windows and capacity caps.
- `delivery_partners`: Assigned runners, phones, and active task counts.
- `payments`: Razorpay transaction logs, order IDs, signatures, amounts, and statuses.

---

## 3. Environment Variables (`.env`)
Create a `.env` file in the root or `backend/` directory:
```bash
# Flask & Security
SECRET_KEY="your_flask_secret_key"
JWT_SECRET_KEY="your_jwt_secret_key"

# Supabase PostgreSQL
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_KEY="your_supabase_anon_public_key"
SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_key"
DATABASE_URL="postgresql://postgres:password@db.your-project.supabase.co:5432/postgres"

# Razorpay Payment Gateway
RAZORPAY_KEY_ID="rzp_test_campusbite"
RAZORPAY_KEY_SECRET="your_razorpay_secret"
```

---

## 4. How to Run the Applications

### A. Run Full-Stack Express App (Frontend + REST API on Port 3000)
```bash
npm install
npm run dev
```

### B. Run Python Flask Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```
Flask runs on `http://localhost:5000` with CORS enabled for cross-origin requests.

---

## 5. REST API Endpoints Reference
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health & system information |
| `POST` | `/api/auth/login` | Student / Staff JWT authentication |
| `POST` | `/api/auth/register` | Student sign-up with welcome wallet bonus |
| `GET` | `/api/auth/me` | Fetch active user profile |
| `POST` | `/api/auth/wallet/topup` | Credit money to student meal wallet |
| `GET` | `/api/menu` | Filterable menu (category, search, vegOnly) |
| `POST` | `/api/menu` | Add dish (Admin) |
| `PATCH` | `/api/menu/:id/availability` | 1-click In Stock / Out of Stock toggle |
| `GET` | `/api/addresses` | Fetch saved hostel rooms |
| `POST` | `/api/addresses` | Save new hostel address |
| `POST` | `/api/checkout/calculate` | Backend price & coupon verification |
| `POST` | `/api/payments/razorpay/create-order` | Generate Razorpay order |
| `POST` | `/api/payments/razorpay/verify` | Verify Razorpay payment signature |
| `GET` | `/api/orders` | Fetch orders (filter by status, student) |
| `POST` | `/api/orders` | Place pre-order (pickup or hostel delivery) |
| `PATCH` | `/api/orders/:id/status` | Kitchen & runner status progression |
| `PATCH` | `/api/orders/:id/assign` | Assign runner to delivery order |
| `GET` | `/api/analytics` | Sales KPIs, top dishes, peak rush hours |
