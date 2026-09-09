"""
FastAPI Router for Simulated Emergency Scenarios and Evacuation Management.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Dict, List, Any, Optional
from app.services.emergency_service import emergency_service, EmergencyType

router = APIRouter(prefix="/api/v1/emergency", tags=["Emergency Response"])


class TriggerEmergencyRequest(BaseModel):
    emergency_type: str = Field(..., description="ROCKFALL, SLOPE_INSTABILITY, FIRE, FLOOD, VEHICLE_COLLISION, EQUIPMENT_FAILURE, WORKER_EMERGENCY, GAS_DUST_INCIDENT")
    zone_name: Optional[str] = Field(None, description="Optional override zone")


class ResolveEmergencyRequest(BaseModel):
    resolution_notes: Optional[str] = Field("All personnel accounted for. Situation contained.", description="Resolution summary")


@router.get("/active")
async def get_active_emergencies():
    """Lists currently active emergency scenarios and evacuation protocols."""
    active = emergency_service.list_active_emergencies()
    return {
        "count": len(active),
        "emergencies": active
    }


@router.get("/scenarios")
async def get_available_scenarios():
    """Returns available simulation scenario types."""
    return {
        "scenarios": [e.value for e in EmergencyType]
    }


@router.post("/trigger")
async def trigger_emergency_scenario(req: TriggerEmergencyRequest):
    """Triggers an active simulated disaster scenario with full evacuation routing."""
    emergency = emergency_service.trigger_emergency(
        emergency_type=req.emergency_type,
        custom_zone=req.zone_name
    )
    return emergency


@router.post("/{emergency_id}/resolve")
async def resolve_emergency_scenario(emergency_id: str, req: ResolveEmergencyRequest):
    """Deactivates and resolves an active emergency scenario."""
    resolved = emergency_service.resolve_emergency(
        emergency_id=emergency_id,
        resolution_notes=req.resolution_notes or "Situation contained and all-clear declared."
    )
    if not resolved:
        raise HTTPException(status_code=404, detail=f"Emergency '{emergency_id}' not found.")
    return resolved
