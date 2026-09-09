"""
Incident Management Service for MineMind AI.
Implements the full 7-stage incident lifecycle with evidence logging, audit tracking, and entity association.
"""

from datetime import datetime
from typing import Dict, List, Any, Optional
from enum import Enum
import uuid


class IncidentStage(str, Enum):
    DETECTED = "DETECTED"
    CLASSIFIED = "CLASSIFIED"
    INVESTIGATING = "INVESTIGATING"
    ESCALATED = "ESCALATED"
    RESPONDING = "RESPONDING"
    RESOLVED = "RESOLVED"
    CLOSED = "CLOSED"


class IncidentSeverity(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"
    CATASTROPHIC = "CATASTROPHIC"


class IncidentCategory(str, Enum):
    SLOPE_FAILURE = "SLOPE_FAILURE"
    GAS_OUTBURST = "GAS_OUTBURST"
    VEHICLE_COLLISION = "VEHICLE_COLLISION"
    EQUIPMENT_FIRE = "EQUIPMENT_FIRE"
    WORKER_DISTRESS = "WORKER_DISTRESS"
    VENTILATION_FAILURE = "VENTILATION_FAILURE"
    ELECTRICAL_FAULT = "ELECTRICAL_FAULT"
    NEAR_MISS = "NEAR_MISS"
    ROCKFALL = "ROCKFALL"
    PIT_INUNDATION = "PIT_INUNDATION"


class IncidentService:
    """
    Manages in-memory and database-synchronized incident records, audit logs, and lifecycle transitions.
    """

    def __init__(self):
        self.incidents: Dict[str, Dict[str, Any]] = {}
        self._seed_initial_incidents()

    def _seed_initial_incidents(self):
        initial = [
            {
                "id": "INC-2026-001",
                "incident_number": "INC-0891",
                "title": "Bench 1350 Highwall Micro-Fracture & Rockfall Advisory",
                "category": IncidentCategory.ROCKFALL.value,
                "severity": IncidentSeverity.HIGH.value,
                "stage": IncidentStage.INVESTIGATING.value,
                "zone_name": "North Highwall",
                "zone_id": "ZN-01",
                "occurred_at": datetime.now().isoformat(),
                "reported_by": "Radar InSAR Automated Scan",
                "assigned_investigator": "Dr. Sarah Lin (Geotechnical Lead)",
                "affected_entities": {
                    "vehicles": ["HT-101", "HT-104"],
                    "workers": ["WRK-001", "WRK-002"],
                    "equipment": ["EXCAVATOR-03"]
                },
                "timeline": [
                    {"stage": IncidentStage.DETECTED.value, "timestamp": datetime.now().isoformat(), "notes": "Automated radar detected >3.8 mm/day displacement.", "actor": "System"},
                    {"stage": IncidentStage.CLASSIFIED.value, "timestamp": datetime.now().isoformat(), "notes": "Classified as Geotechnical Rockfall Risk (Severity HIGH).", "actor": "Dispatcher Alpha"},
                    {"stage": IncidentStage.INVESTIGATING.value, "timestamp": datetime.now().isoformat(), "notes": "Prism telemetry correlation initiated. Visual drone inspection dispatched.", "actor": "Dr. Sarah Lin"}
                ],
                "evidence": [
                    {"type": "RADAR_DISPLACEMENT", "uri": "radar://insar/north-wall-20260909", "summary": "3.8 mm/day velocity on Bench 1350 crest."},
                    {"type": "CAMERA_STILL", "uri": "cctv://cam-pit-01/snapshot-0891", "summary": "Minor loose talus accumulation on catch berm."}
                ],
                "action_items": [
                    {"task": "Verify 2m catch berm containment capacity", "status": "IN_PROGRESS", "assignee": "Survey Crew"},
                    {"task": "Re-route loaded haul trucks to Ramp R-02", "status": "COMPLETED", "assignee": "Pit Dispatcher"}
                ]
            },
            {
                "id": "INC-2026-002",
                "incident_number": "INC-0892",
                "title": "Haul Truck HT-104 Brake Retarder Thermal Warning",
                "category": IncidentCategory.EQUIPMENT_FIRE.value,
                "severity": IncidentSeverity.MEDIUM.value,
                "stage": IncidentStage.RESPONDING.value,
                "zone_name": "Main Haul Ramp",
                "zone_id": "ZN-02",
                "occurred_at": datetime.now().isoformat(),
                "reported_by": "CAN0 High-Speed Telemetry",
                "assigned_investigator": "Marcus Vance (Reliability Engineer)",
                "affected_entities": {
                    "vehicles": ["HT-104"],
                    "workers": ["WRK-005"],
                    "equipment": []
                },
                "timeline": [
                    {"stage": IncidentStage.DETECTED.value, "timestamp": datetime.now().isoformat(), "notes": "Brake cooling oil temperature hit 118°C on 8% downgrade.", "actor": "CAN Bus Telemetry"},
                    {"stage": IncidentStage.CLASSIFIED.value, "timestamp": datetime.now().isoformat(), "notes": "Classified as Brake Thermal Risk (Severity MEDIUM).", "actor": "System"},
                    {"stage": IncidentStage.RESPONDING.value, "timestamp": datetime.now().isoformat(), "notes": "Operator instructed to gear down to 1st range and park on cooling pad.", "actor": "Dispatcher Alpha"}
                ],
                "evidence": [
                    {"type": "TELEMETRY_LOG", "uri": "telemetry://ht-104/brake-temp", "summary": "Peak oil temp 118.4°C."}
                ],
                "action_items": [
                    {"task": "Lube oil chiller bypass inspection", "status": "PENDING", "assignee": "Mobile Workshop"}
                ]
            }
        ]
        for inc in initial:
            self.incidents[inc["id"]] = inc

    def list_incidents(self, stage: Optional[str] = None, severity: Optional[str] = None) -> List[Dict[str, Any]]:
        """Returns incidents filtered by stage or severity."""
        results = list(self.incidents.values())
        if stage:
            results = [i for i in results if i["stage"].upper() == stage.upper()]
        if severity:
            results = [i for i in results if i["severity"].upper() == severity.upper()]
        return sorted(results, key=lambda x: x["occurred_at"], reverse=True)

    def get_incident(self, incident_id: str) -> Optional[Dict[str, Any]]:
        """Retrieves a single incident by ID."""
        return self.incidents.get(incident_id)

    def create_incident(
        self,
        title: str,
        category: str,
        severity: str,
        zone_name: str = "Pit Floor",
        reported_by: str = "Control Room Operator",
        assigned_investigator: Optional[str] = None,
        affected_entities: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Creates a new incident at the DETECTED stage."""
        inc_id = f"INC-{int(datetime.now().timestamp())}"
        inc_number = f"INC-{len(self.incidents) + 893}"
        now_str = datetime.now().isoformat()

        incident = {
            "id": inc_id,
            "incident_number": inc_number,
            "title": title,
            "category": category,
            "severity": severity,
            "stage": IncidentStage.DETECTED.value,
            "zone_name": zone_name,
            "zone_id": "ZN-01",
            "occurred_at": now_str,
            "reported_by": reported_by,
            "assigned_investigator": assigned_investigator or "Unassigned",
            "affected_entities": affected_entities or {"vehicles": [], "workers": [], "equipment": []},
            "timeline": [
                {
                    "stage": IncidentStage.DETECTED.value,
                    "timestamp": now_str,
                    "notes": "Incident registered in MineMind command system.",
                    "actor": reported_by
                }
            ],
            "evidence": [],
            "action_items": []
        }

        self.incidents[inc_id] = incident
        return incident

    def advance_stage(
        self,
        incident_id: str,
        target_stage: str,
        actor: str = "Safety Superintendent",
        notes: str = ""
    ) -> Optional[Dict[str, Any]]:
        """Advances or updates the incident lifecycle stage with audit entry."""
        inc = self.incidents.get(incident_id)
        if not inc:
            return None

        now_str = datetime.now().isoformat()
        inc["stage"] = target_stage.upper()
        inc["timeline"].append({
            "stage": target_stage.upper(),
            "timestamp": now_str,
            "notes": notes or f"Stage transitioned to {target_stage.upper()}",
            "actor": actor
        })

        if target_stage.upper() == IncidentStage.RESOLVED.value:
            inc["resolved_at"] = now_str
        elif target_stage.upper() == IncidentStage.CLOSED.value:
            inc["closed_at"] = now_str

        return inc

    def add_evidence(self, incident_id: str, evidence_type: str, summary: str, uri: str = "") -> Optional[Dict[str, Any]]:
        """Appends evidence to an ongoing incident."""
        inc = self.incidents.get(incident_id)
        if not inc:
            return None
        inc["evidence"].append({
            "type": evidence_type,
            "summary": summary,
            "uri": uri,
            "timestamp": datetime.now().isoformat()
        })
        return inc


incident_service = IncidentService()
