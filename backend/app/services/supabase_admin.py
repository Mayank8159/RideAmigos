import os
from pathlib import Path
from supabase import create_client, Client
from dotenv import load_dotenv

# This dynamically finds the root 'backend' folder regardless of where you run it from
BASE_DIR = Path(__file__).resolve().parent.parent.parent
env_path = BASE_DIR / ".env"

load_dotenv(dotenv_path=env_path)

class SupabaseAdminService:
    def __init__(self):
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        
        # This will tell us exactly what is wrong in the terminal
        if not url or not key:
            print(f"\n❌ ERROR: .env file not found or empty!")
            print(f"📂 Looking at path: {env_path}")
            print(f"📄 Files actually in that folder: {os.listdir(BASE_DIR)}\n")
            raise ValueError("Missing Supabase credentials in Backend .env")
            
        self.client: Client = create_client(url, key)

supabase_admin = SupabaseAdminService()