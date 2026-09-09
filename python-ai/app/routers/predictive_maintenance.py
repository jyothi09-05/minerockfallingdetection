"""
MineMind AI - Predictive Maintenance & Equipment Health Router
"""
from fastapi import APIRouter
from app.ml.registry import model_registry
from app.ml.base import PredictionResult
from app.schemas.ai import EquipmentRulRequest

router = APIRouter(prefix="/api/v1/ai/maintenance", tags=["Predictive Maintenance AI"])


@router.post("/equipment/rul", response_model=PredictionResult)
def predict_equipment_rul(body: EquipmentRulRequest):
    """Predicts Remaining Useful Life (RUL) and mechanical failure probability."""
    model = model_registry.get_model("equipment_failure")
    return model.predict(body.model_dump())
