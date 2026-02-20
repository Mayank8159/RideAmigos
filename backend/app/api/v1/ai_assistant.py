from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from openai import OpenAI
from app.services.supabase_admin import supabase_admin
import os

router = APIRouter()
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class ChatRequest(BaseModel):
    user_id: str
    message: str

@router.post("/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        # 1. Fetch rider's bike info from Supabase
        profile = supabase_admin.get_rider_profile(request.user_id)
        bike = profile.get("bike_model", "motorcycle")
        name = profile.get("full_name", "Rider")

        # 2. Generate AI Response with context
        response = openai_client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": f"You are an expert bike assistant. User is {name} riding a {bike}. Be concise."},
                {"role": "user", "content": request.message}
            ]
        )
        return {"reply": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))