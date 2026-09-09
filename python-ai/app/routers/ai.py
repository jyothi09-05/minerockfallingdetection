"""
MineMind AI - AI Platform & Global Risk Router
"""
from typing import Dict, Any, List
from fastapi import APIRouter
from app.ml.registry import model_registry
from app.services.risk_engine import central_risk_engine
from app.schemas.ai import GlobalMineRiskResponse

router = APIRouter(prefix="/api/v1/ai", tags=["AI Core & Model Registry"])


@router.get("/models")
def list_registered_models() -> List[Dict]:
    """Lists all registered local AI models, versions, and accuracy metrics."""
    return model_registry.list_models()


@router.post("/risk/global", response_model=GlobalMineRiskResponse)
def evaluate_global_risk(
    rockfall_params: Dict[str, Any] = {},
    slope_params: Dict[str, Any] = {},
    collision_params: Dict[str, Any] = {},
    equipment_params: Dict[str, Any] = {},
    worker_params: Dict[str, Any] = {},
    env_params: Dict[str, Any] = {},
):
    """Computes global composite mine risk, zone rankings, and explainable contributing factors."""
    return central_risk_engine.evaluate_global_risk(
        rockfall_input=rockfall_params,
        slope_input=slope_params,
        collision_input=collision_params,
        equipment_input=equipment_params,
        worker_input=worker_params,
        env_input=env_params,
    )
