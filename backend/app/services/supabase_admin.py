import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

class SupabaseAdminService:
    def __init__(self):
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        if not url or not key:
            raise ValueError("Missing Supabase credentials in Backend .env")
        self.client: Client = create_client(url, key)

    def get_rider_profile(self, user_id: str):
        # Queries the 'profiles' table we created in Supabase
        result = self.client.table("profiles").select("*").eq("id", user_id).single().execute()
        return result.data

supabase_admin = SupabaseAdminService()