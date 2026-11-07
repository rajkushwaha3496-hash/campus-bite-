import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Flask Secrets
    SECRET_KEY = os.getenv("SECRET_KEY", "campusbite_teamsquad_secret_key_2026")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "campusbite_jwt_secret_teamsquad")
    
    # Supabase Configuration
    SUPABASE_URL = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")
    SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    DATABASE_URL = os.getenv("DATABASE_URL", "")

    # Razorpay Payment Gateway
    RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "rzp_test_campusbite_demo")
    RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "campusbite_test_secret_12345")
    
    # Canteen Rules
    FREE_DELIVERY_THRESHOLD = 149
    DEFAULT_DELIVERY_FEE = 15
    MAX_SLOT_CAPACITY = 35
