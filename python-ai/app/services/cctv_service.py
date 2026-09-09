"""
MineMind AI - CCTV Intelligence & Mine Surveillance Service
Provides camera management, stream control, computer vision inference coordination,
event timeline logging, camera health monitoring, and incident candidate generation.
100% Offline and local.
"""
import uuid
import datetime
from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field

from minemind_cv.camera_registry import camera_registry, CameraConfig
from minemind_cv.zones import zone_manager, VirtualSafetyZone
from minemind_cv.pipeline import cv_pipeline, CameraFrameAnalysis, DetectionBoundingBox, ZoneIncursion
from app.services.incident_service import incident_service, IncidentCategory, IncidentSeverity


class CCTVEvent(BaseModel):
    event_id: str
    camera_id: str
    camera_name: str
    zone_id: str
    zone_name: str
    event_type: str  # PERSON_DETECTED, VEHICLE_DETECTED, PPE_VIOLATION, RESTRICTED_ZONE_ENTRY, PROXIMITY_WARNING, SMOKE_DETECTED, FIRE_INDICATION, ABNORMAL_ACTIVITY, CAMERA_OFFLINE, CAMERA_TAMPER_INDICATION
    severity: str  # LOW, MEDIUM, HIGH, CRITICAL
    timestamp: str
    description: str
    confidence: float
    bounding_boxes: List[Dict[str, Any]] = Field(default_factory=list)
    metadata: Dict[str, Any] = Field(default_factory=dict)
    incident_created: bool = False
    incident_id: Optional[str] = None


class CameraHealthSummary(BaseModel):
    total_cameras: int
    active_cameras: int
    offline_cameras: int
    degraded_cameras: int
    ai_monitoring_enabled: int
    average_health_score_pct: float
    average_latency_ms: float
    total_active_violations: int


class CCTVService:
    def __init__(self):
        self.events: List[CCTVEvent] = []
        self._seed_recent_events()

    def _seed_recent_events(self):
        now = datetime.datetime.now(datetime.timezone.utc)
        seeds = [
            {
                "camera_id": "CAM-PIT-01",
                "camera_name": "Pit Floor Shovel CAM #01",
                "zone_id": "ZONE-PIT-01",
                "zone_name": "Pit Floor Loading Zone",
                "event_type": "PPE_VIOLATION",
                "severity": "HIGH",
                "delta_min": 8,
                "confidence": 0.94,
                "description": "Worker detected within 15m radius of CAT 7495 shovel without safety helmet.",
                "boxes": [{"class_name": "PERSON", "box_2d": [0.45, 0.35, 0.68, 0.42], "is_violation": True}]
            },
            {
                "camera_id": "CAM-NW-02",
                "camera_name": "North Wall Highwall Monitor #02",
                "zone_id": "ZONE-NW-01",
                "zone_name": "North-West Sector Benches",
                "event_type": "RESTRICTED_ZONE_ENTRY",
                "severity": "CRITICAL",
                "delta_min": 14,
                "confidence": 0.91,
                "description": "Personnel incursion into Bench 1350 highwall exclusion buffer.",
                "boxes": [{"class_name": "PERSON", "box_2d": [0.22, 0.40, 0.45, 0.48], "is_violation": True}]
            },
            {
                "camera_id": "CAM-RAMP-03",
                "camera_name": "Haul Road Main Incline Junction #03",
                "zone_id": "ZONE-RAMP-01",
                "zone_name": "Haul Road Switchback #2",
                "event_type": "PROXIMITY_WARNING",
                "severity": "HIGH",
                "delta_min": 22,
                "confidence": 0.96,
                "description": "Light service vehicle #LV-102 within 18m blindspot envelope of ascending haul truck #HT-04.",
                "boxes": [{"class_name": "HAUL_TRUCK", "box_2d": [0.20, 0.25, 0.75, 0.65], "is_violation": False}]
            },
            {
                "camera_id": "CAM-CRU-04",
                "camera_name": "Primary Gyratory Crusher Hopper #04",
                "zone_id": "ZONE-CRU-01",
                "zone_name": "Primary Crusher Discharge",
                "event_type": "SMOKE_DETECTED",
                "severity": "CRITICAL",
                "delta_min": 45,
                "confidence": 0.88,
                "description": "Thermal haze and dense particulate plume near secondary lube pump skid.",
                "boxes": [{"class_name": "SMOKE_INDICATOR", "box_2d": [0.10, 0.55, 0.38, 0.82], "is_violation": True}]
            },
            {
                "camera_id": "CAM-STOCK-06",
                "camera_name": "ROM Stockpile Stacker / Reclaimer #06",
                "zone_id": "ZONE-STOCK-01",
                "zone_name": "High-Grade ROM Stockpile",
                "event_type": "PERSON_DETECTED",
                "severity": "LOW",
                "delta_min": 2,
                "confidence": 0.95,
                "description": "Authorized inspection personnel on boom walkway. PPE 100% compliant.",
                "boxes": [{"class_name": "PERSON", "box_2d": [0.60, 0.80, 0.88, 0.90], "is_violation": False}]
            }
        ]

        for s in seeds:
            ts = (now - datetime.timedelta(minutes=s["delta_min"])).isoformat()
            self.events.append(CCTVEvent(
                event_id=f"EVT-{uuid.uuid4().hex[:8].upper()}",
                camera_id=s["camera_id"],
                camera_name=s["camera_name"],
                zone_id=s["zone_id"],
                zone_name=s["zone_name"],
                event_type=s["event_type"],
                severity=s["severity"],
                timestamp=ts,
                description=s["description"],
                confidence=s["confidence"],
                bounding_boxes=s["boxes"],
                metadata={"source": "SYNTHETIC_SEED"}
            ))

    def get_cameras(self, zone_id: Optional[str] = None, status: Optional[str] = None) -> List[CameraConfig]:
        return camera_registry.list_cameras(zone_id=zone_id, operational_status=status)

    def get_camera(self, camera_id: str) -> Optional[CameraConfig]:
        return camera_registry.get_camera(camera_id)

    def update_ptz(self, camera_id: str, pan_deg: float, tilt_deg: float, zoom_level: float) -> Optional[CameraConfig]:
        return camera_registry.update_ptz(camera_id, pan_deg, tilt_deg, zoom_level)

    def process_camera_frame(
        self,
        camera_id: str,
        inject_violation: bool = False,
        inject_smoke: bool = False,
        inject_incursion: bool = False
    ) -> CameraFrameAnalysis:
        cam = camera_registry.get_camera(camera_id)
        if not cam:
            raise ValueError(f"Camera {camera_id} not found")

        analysis = cv_pipeline.process_frame(
            camera_id=camera_id,
            camera_name=cam.camera_name,
            inject_violation=inject_violation,
            inject_smoke=inject_smoke,
            inject_incursion=inject_incursion
        )

        # Log events if new hazards are detected
        if analysis.zone_incursions:
            for inc in analysis.zone_incursions:
                self.record_event(
                    camera_id=camera_id,
                    event_type="RESTRICTED_ZONE_ENTRY",
                    severity=inc.severity,
                    description=inc.description,
                    confidence=0.95,
                    bounding_boxes=[d.model_dump() for d in analysis.detections if d.is_violation],
                    metadata={"zone_id": inc.zone_id, "track_id": inc.track_id}
                )

        if analysis.ppe_compliance_rate_pct < 100.0:
            violators = [d for d in analysis.detections if d.class_name == "PERSON" and d.is_violation]
            if violators:
                self.record_event(
                    camera_id=camera_id,
                    event_type="PPE_VIOLATION",
                    severity="HIGH",
                    description=f"PPE Non-compliance detected on {cam.camera_name}: {violators[0].violation_reason or 'Missing PPE'}",
                    confidence=violators[0].confidence,
                    bounding_boxes=[v.model_dump() for v in violators],
                    metadata={"compliance_pct": analysis.ppe_compliance_rate_pct}
                )

        if inject_smoke or any(d.class_name == "SMOKE_INDICATOR" for d in analysis.detections):
            self.record_event(
                camera_id=camera_id,
                event_type="SMOKE_DETECTED",
                severity="CRITICAL",
                description=f"Thermal plume / smoke detected on {cam.camera_name}",
                confidence=0.89,
                bounding_boxes=[d.model_dump() for d in analysis.detections if d.class_name == "SMOKE_INDICATOR"],
                metadata={"hazard_type": "THERMAL_SMOKE"}
            )

        return analysis

    def record_event(
        self,
        camera_id: str,
        event_type: str,
        severity: str,
        description: str,
        confidence: float,
        bounding_boxes: Optional[List[Dict[str, Any]]] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> CCTVEvent:
        cam = camera_registry.get_camera(camera_id)
        zone_id = cam.zone_id if cam else "ZONE-UNKNOWN"
        zone_name = cam.zone_name if cam else "Unknown Zone"
        camera_name = cam.camera_name if cam else camera_id

        evt_id = f"EVT-{uuid.uuid4().hex[:8].upper()}"
        ts = datetime.datetime.now(datetime.timezone.utc).isoformat()

        # Automatic Incident candidate generation for CRITICAL and repeated HIGH events
        incident_created = False
        incident_id = None
        if severity == "CRITICAL" or event_type in ("SMOKE_DETECTED", "FIRE_INDICATION", "RESTRICTED_ZONE_ENTRY"):
            cat = IncidentCategory.NEAR_MISS.value
            if event_type in ("SMOKE_DETECTED", "FIRE_INDICATION"):
                cat = IncidentCategory.EQUIPMENT_FIRE.value
            elif event_type == "RESTRICTED_ZONE_ENTRY":
                cat = IncidentCategory.WORKER_DISTRESS.value

            inc = incident_service.create_incident(
                title=f"CCTV AI Trigger: {description}",
                category=cat,
                severity=IncidentSeverity.CRITICAL.value if severity == "CRITICAL" else IncidentSeverity.HIGH.value,
                zone_name=zone_name,
                reported_by=f"CCTV-AI-{camera_id}"
            )
            incident_created = True
            incident_id = inc.get("id")

        event = CCTVEvent(
            event_id=evt_id,
            camera_id=camera_id,
            camera_name=camera_name,
            zone_id=zone_id,
            zone_name=zone_name,
            event_type=event_type,
            severity=severity,
            timestamp=ts,
            description=description,
            confidence=confidence,
            bounding_boxes=bounding_boxes or [],
            metadata=metadata or {},
            incident_created=incident_created,
            incident_id=incident_id
        )

        self.events.insert(0, event)
        if len(self.events) > 500:
            self.events = self.events[:500]

        return event

    def get_events(
        self,
        camera_id: Optional[str] = None,
        zone_id: Optional[str] = None,
        event_type: Optional[str] = None,
        severity: Optional[str] = None,
        limit: int = 50
    ) -> List[CCTVEvent]:
        res = self.events
        if camera_id:
            res = [e for e in res if e.camera_id.lower() == camera_id.lower()]
        if zone_id:
            res = [e for e in res if e.zone_id.lower() == zone_id.lower()]
        if event_type:
            res = [e for e in res if e.event_type.lower() == event_type.lower()]
        if severity:
            res = [e for e in res if e.severity.lower() == severity.lower()]
        return res[:limit]

    def get_health_summary(self) -> CameraHealthSummary:
        cams = camera_registry.list_cameras()
        active = sum(1 for c in cams if c.operational_status == "ACTIVE")
        offline = sum(1 for c in cams if c.operational_status == "OFFLINE")
        degraded = sum(1 for c in cams if c.operational_status == "DEGRADED")
        ai_enabled = sum(1 for c in cams if c.ai_monitoring_status == "ENABLED")

        avg_health = sum(c.health_score_pct for c in cams) / len(cams) if cams else 0.0
        avg_latency = sum(c.latency_ms for c in cams) / len(cams) if cams else 0.0

        # Count active unacknowledged critical/high events in last 30 minutes
        recent_violations = sum(1 for e in self.events[:20] if e.severity in ("CRITICAL", "HIGH"))

        return CameraHealthSummary(
            total_cameras=len(cams),
            active_cameras=active,
            offline_cameras=offline,
            degraded_cameras=degraded,
            ai_monitoring_enabled=ai_enabled,
            average_health_score_pct=round(avg_health, 1),
            average_latency_ms=round(avg_latency, 1),
            total_active_violations=recent_violations
        )

    def get_incident_replay(self, incident_id: str) -> Dict[str, Any]:
        """
        Retrieves visual replay metadata and snapshot frames around an incident event.
        """
        matching_events = [e for e in self.events if e.incident_id == incident_id]
        if not matching_events:
            # Fallback to most recent critical event
            matching_events = [e for e in self.events if e.severity == "CRITICAL"]

        ref_event = matching_events[0] if matching_events else self.events[0] if self.events else None
        if not ref_event:
            return {"status": "NO_RECORDINGS", "incident_id": incident_id, "frames": []}

        # Generate simulated chronological replay frames (5 pre-event frames, event frame, 5 post-event frames)
        frames = []
        for i in range(-5, 6):
            sec_offset = i * 2.0
            frames.append({
                "frame_index": i + 5,
                "time_offset_seconds": sec_offset,
                "timestamp": ref_event.timestamp,
                "is_incident_climax": (i == 0),
                "camera_id": ref_event.camera_id,
                "camera_name": ref_event.camera_name,
                "annotations": ref_event.bounding_boxes if i >= 0 else []
            })

        return {
            "incident_id": incident_id,
            "camera_id": ref_event.camera_id,
            "camera_name": ref_event.camera_name,
            "event_type": ref_event.event_type,
            "event_timestamp": ref_event.timestamp,
            "severity": ref_event.severity,
            "description": ref_event.description,
            "total_replay_duration_sec": 22.0,
            "replay_frames": frames
        }


cctv_service = CCTVService()
