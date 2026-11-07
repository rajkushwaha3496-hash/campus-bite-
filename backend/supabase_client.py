import os
from config import Config

supabase_client = None

def get_supabase():
    global supabase_client
    if supabase_client is not None:
        return supabase_client
    
    url = Config.SUPABASE_URL
    key = Config.SUPABASE_SERVICE_ROLE_KEY or Config.SUPABASE_KEY
    
    if url and key:
        try:
            from supabase import create_client, Client
            supabase_client = create_client(url, key)
            print("[CampusBite] Connected to Supabase PostgreSQL successfully.")
            return supabase_client
        except Exception as e:
            print(f"[CampusBite] Supabase init warning: {e}. Using in-memory store.")
            return None
    return None
