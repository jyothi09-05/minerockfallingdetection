"""
MineMind AI - CCTV Intelligence API Router
FastAPI router providing comprehensive surveillance, camera management, live inference feeds,
event tracking, virtual zones, and incident replay endpoints.
100% Offline and local.
"""
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, HTTPException, Query, Body
from pydantic import BaseModel, Field

from app.services.cctv_service import (
    cctv_service,
    CCTVEvent,
    CameraHealthSummary,
)
from minemind_cv.camera_registry import CameraConfig, camera_registry
from minemind_cv.zones import zone_manager, VirtualSafetyZone
from minemind_cv.pipeline import CameraFrameAnalysis

router = APIRouter(prefix="/api/v1/cctv", tags=["CCTV & Mine Surveillance"])


class PTZUpdateRequest(BaseModel):
    pan_deg: float = Field(0.0, ge=-180.0, le=180.0)
    tilt_deg: float = Field(-15.0, ge=-90.0, le=90.0)
    zoom_level: float = Field(1.0, ge=1.0, le=10.0)


class StatusUpdateRequest(BaseModel):
    operational_status: str
    ai_monitoring_status: Optional[str] = None


class CreateEventRequest(BaseModel):
    camera_id: str
    event_type: str
    severity: str
    description: str
    confidence: float = 0.95
    bounding_boxes: Optional[List[Dict[str, Any]]] = None
    metadata: Optional[Dict[str, Any]] = None


@router.get("/cameras", response_model=List[CameraConfig])
def list_cameras(
    zone_id: Optional[str] = Query(None, description="Filter by mine zone ID"),
    operational_status: Optional[str] = Query(None, description="Filter by operational status")
):
    """List all registered mine cameras and their status."""
    return cctv_service.get_cameras(zone_id=zone_id, status=operational_status)


@router.get("/cameras/{camera_id}", response_model=CameraConfig)
def get_camera_details(camera_id: str):
    """Retrieve detailed metadata and health stats for a specific camera."""
    cam = cctv_service.get_camera(camera_id)
    if not cam:
        raise HTTPException(status_code=404, detail=f"Camera {camera_id} not found")
    return cam


@router.post("/cameras/{camera_id}/ptz", response_model=CameraConfig)
def update_camera_ptz(camera_id: str, ptz_req: PTZUpdateRequest):
    """Update Pan-Tilt-Zoom coordinates for a PTZ camera."""
    cam = cctv_service.update_ptz(camera_id, ptz_req.pan_deg, ptz_req.tilt_deg, ptz_req.zoom_level)
    if not cam:
        raise HTTPException(status_code=404, detail=f"Camera {camera_id} not found")
    return cam


@router.post("/cameras/{camera_id}/status", response_model=CameraConfig)
def update_camera_status(camera_id: str, req: StatusUpdateRequest):
    """Update camera operational or AI monitoring status."""
    cam = camera_registry.update_status(camera_id, req.operational_status, req.ai_monitoring_status)
    if not cam:
        raise HTTPException(status_code=404, detail=f"Camera {camera_id} not found")
    return cam


@router.get("/cameras/{camera_id}/frame", response_model=CameraFrameAnalysis)
def get_camera_frame_analysis(
    camera_id: str,
    inject_violation: bool = Query(False, description="Simulate a PPE violation in frame"),
    inject_smoke: bool = Query(False, description="Simulate a smoke/thermal anomaly in frame"),
    inject_incursion: bool = Query(False, description="Simulate a restricted zone incursion")
):
    """
    Executes local offline computer vision inference on the current frame from the camera,
    returning tracked entities, PPE compliance, and geofence incursion alerts.
    """
    try:
        return cctv_service.process_camera_frame(
            camera_id=camera_id,
            inject_violation=inject_violation,
            inject_smoke=inject_smoke,
            inject_incursion=inject_incursion
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/events", response_model=List[CCTVEvent])
def list_cctv_events(
    camera_id: Optional[str] = Query(None),
    zone_id: Optional[str] = Query(None),
    event_type: Optional[str] = Query(None),
    severity: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=500)
):
    """Retrieve filtered surveillance event timeline."""
    return cctv_service.get_events(
        camera_id=camera_id,
        zone_id=zone_id,
        event_type=event_type,
        severity=severity,
        limit=limit
    )


@router.post("/events", response_model=CCTVEvent)
def ingest_cctv_event(req: CreateEventRequest):
    """Record an event manually or from a local video ingestion stream."""
    return cctv_service.record_event(
        camera_id=req.camera_id,
        event_type=req.event_type,
        severity=req.severity,
        description=req.description,
        confidence=req.confidence,
        bounding_boxes=req.bounding_boxes,
        metadata=req.metadata
    )


@router.get("/health", response_model=CameraHealthSummary)
def get_camera_health_summary():
    """Retrieve global camera network health and active violation statistics."""
    return cctv_service.get_health_summary()


@router.get("/zones", response_model=List[VirtualSafetyZone])
def list_virtual_safety_zones(
    camera_id: Optional[str] = Query(None, description="Optional camera ID filter")
):
    """List virtual safety zones and polygonal exclusion geofences."""
    if camera_id:
        return zone_manager.get_zones_for_camera(camera_id)
    return zone_manager.list_all_zones()


@router.get("/replays/{incident_id}")
def get_incident_cctv_replay(incident_id: str):
    """Fetch synchronized CCTV visual replay frames and bounding box telemetry for an incident."""
    return cctv_service.get_incident_replay(incident_id)
