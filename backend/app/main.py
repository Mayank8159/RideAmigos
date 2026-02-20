from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import ai_assistant, routes

app = FastAPI(title="RiderAmigos API", version="1.0.0")

# SECURITY: Allow your Next.js frontend to access this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include our modular routes
app.include_router(ai_assistant.router, prefix="/api/v1/ai", tags=["AI"])
app.include_router(routes.router, prefix="/api/v1/routes", tags=["Navigation"])

@app.get("/")
async def health_check():
    return {"status": "online", "message": "Rider Community Backend is revving."}