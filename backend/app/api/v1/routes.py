from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict

router = APIRouter()

class RouteRequest(BaseModel):
    start: Dict[str, float] # {"lng": x, "lat": y}
    end: Dict[str, float]

@router.post("/generate")
async def generate_route(request: RouteRequest):
    # Mocking a GeoJSON response for the frontend Mapbox layer
    # Later, you can integrate Mapbox Directions API here
    return {
        "route_type": "scenic",
        "geometry": {
            "type": "LineString",
            "coordinates": [
                [request.start['lng'], request.start['lat']],
                [request.end['lng'], request.end['lat']]
            ]
        },
        "metadata": {"distance": "15km", "duration": "25 mins"}
    }