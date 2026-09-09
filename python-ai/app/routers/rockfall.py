"""
MineMind AI - Rockfall & Slope Stability Endpoints
"""
from fastapi import APIRouter
from app.ml.registry import model_registry
from app.ml.base import PredictionResult
from app.schemas.ai import RockfallPredictRequest, SlopeStabilityRequest

router = APIRouter(prefix="/api/v1/ai/geotech", tags=["Geotechnical AI"])


@router.post("/rockfall/predict", response_model=PredictionResult)
def predict_rockfall(body: RockfallPredictRequest):
    """Predicts rockfall probability from radar displacement, rainfall, and vibration."""
    model = model_registry.get_model("rockfall")
    return model.predict(body.model_dump())


@router.post("/slope/stability", response_model=PredictionResult)
def evaluate_slope_stability(body: SlopeStabilityRequest):
    """Evaluates Factor of Safety (FoS) and slope failure creep acceleration."""
    model = model_registry.get_model("slope_stability")
    return model.predict(body.model_dump())
