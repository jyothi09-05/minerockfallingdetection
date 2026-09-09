"""
FastAPI Router for Incident Lifecycle Management.
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from typing import Dict, List, Any, Optional
from app.services.incident_service import incident_service, IncidentStage, IncidentSeverity

router = APIRouter(prefix="/api/v1/incidents", tags=["Incident Management"])


class CreateIncidentRequest(BaseModel):
    title: str = Field(..., description="Incident summary title")
    category: str = Field(..., description="Incident category")
    severity: str = Field(IncidentSeverity.MEDIUM.value, description="LOW, MEDIUM, HIGH, CRITICAL, CATASTROPHIC")
    zone_name: Optional[str] = Field("Pit Floor", description="Affected mining zone")
    reported_by: Optional[str] = Field("Control Room", description="Reporting entity or user")
    assigned_investigator: Optional[str] = Field(None, description="Assigned lead investigator")
    affected_entities: Optional[Dict[str, Any]] = None


class AdvanceStageRequest(BaseModel):
    target_stage: str = Field(..., description="DETECTED, CLASSIFIED, INVESTIGATING, ESCALATED, RESPONDING, RESOLVED, CLOSED")
    actor: Optional[str] = Field("Incident Commander", description="User advancing the stage")
    notes: Optional[str] = Field("", description="Operational context notes")


class AddEvidenceRequest(BaseModel):
    evidence_type: str = Field(..., description="RADAR_SCAN, CCTV_FRAME, TELEMETRY, INTERVIEW, SENSOR_LOG")
    summary: str = Field(..., description="Description of evidence")
    uri: Optional[str] = Field("", description="File URI or reference link")


@router.get("")
async def list_incidents(stage: Optional[str] = None, severity: Optional[str] = None):
    """Lists all active and past incidents with optional stage/severity filters."""
    incidents = incident_service.list_incidents(stage=stage, severity=severity)
    return {
        "count": len(incidents),
        "incidents": incidents
    }


@router.get("/{incident_id}")
async def get_incident_details(incident_id: str):
    """Retrieves full incident details, timeline audit history, and attached evidence."""
    inc = incident_service.get_incident(incident_id)
    if not inc:
        raise HTTPException(status_code=404, detail=f"Incident '{incident_id}' not found.")
    return inc


@router.post("")
async def create_incident(req: CreateIncidentRequest):
    """Registers a new incident at the DETECTED stage."""
    inc = incident_service.create_incident(
        title=req.title,
        category=req.category,
        severity=req.severity,
        zone_name=req.zone_name or "Pit Floor",
        reported_by=req.reported_by or "Control Room",
        assigned_investigator=req.assigned_investigator,
        affected_entities=req.affected_entities
    )
    return inc


@router.post("/{incident_id}/advance")
async def advance_incident_stage(incident_id: str, req: AdvanceStageRequest):
    """Advances or transitions the lifecycle stage of an incident."""
    updated = incident_service.advance_stage(
        incident_id=incident_id,
        target_stage=req.target_stage,
        actor=req.actor or "Incident Commander",
        notes=req.notes or ""
    )
    if not updated:
        raise HTTPException(status_code=404, detail=f"Incident '{incident_id}' not found.")
    return updated


@router.post("/{incident_id}/evidence")
async def add_incident_evidence(incident_id: str, req: AddEvidenceRequest):
    """Attaches telemetry or visual evidence to an incident record."""
    updated = incident_service.add_evidence(
        incident_id=incident_id,
        evidence_type=req.evidence_type,
        summary=req.summary,
        uri=req.uri or ""
    )
    if not updated:
        raise HTTPException(status_code=404, detail=f"Incident '{incident_id}' not found.")
    return updated
