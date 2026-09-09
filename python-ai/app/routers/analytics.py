"""
FastAPI Router for Enterprise Analytics.
"""

from fastapi import APIRouter
from app.services.analytics_service import analytics_service

router = APIRouter(prefix="/api/v1/analytics", tags=["Enterprise Analytics"])


@router.get("/overview")
async def get_analytics_overview():
    """Returns combined analytics snapshot across all operational domains."""
    return {
        "safety": analytics_service.get_safety_analytics(),
        "production": analytics_service.get_production_analytics(),
        "equipment": analytics_service.get_equipment_analytics(),
        "environmental": analytics_service.get_environmental_analytics(),
        "ai_models": analytics_service.get_ai_model_analytics()
    }


@router.get("/safety")
async def get_safety_analytics():
    return analytics_service.get_safety_analytics()


@router.get("/production")
async def get_production_analytics():
    return analytics_service.get_production_analytics()


@router.get("/equipment")
async def get_equipment_analytics():
    return analytics_service.get_equipment_analytics()


@router.get("/environmental")
async def get_environmental_analytics():
    return analytics_service.get_environmental_analytics()


@router.get("/ai")
async def get_ai_analytics():
    return analytics_service.get_ai_model_analytics()
