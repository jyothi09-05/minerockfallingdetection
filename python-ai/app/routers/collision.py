"""
MineMind AI - Vehicle Collision & Proximity Router
"""
from fastapi import APIRouter
from app.ml.registry import model_registry
from app.ml.base import PredictionResult
from app.schemas.ai import CollisionCheckRequest

router = APIRouter(prefix="/api/v1/ai/collision", tags=["Vehicle Collision AI"])


@router.post("/check", response_model=PredictionResult)
def check_collision_proximity(body: CollisionCheckRequest):
    """Calculates pairwise distance, closing velocity, and Time-To-Collision (TTC)."""
    model = model_registry.get_model("collision")
    return model.predict(body.model_dump())
