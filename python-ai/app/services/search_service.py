"""
Sub-Millisecond Global Search Engine for MineMind AI.
Indexes and performs fast prefix, keyword, and category-filtered search across all mine entities.
"""

from typing import Dict, List, Any, Optional
import os
import glob
import re


class SearchService:
    """
    In-memory indexed global search provider for enterprise control rooms.
    """

    def __init__(self):
        self.indexed_records: List[Dict[str, Any]] = []
        self._build_index()

    def _build_index(self):
        records = [
            # Mines & Zones
            {"id": "MINE-01", "type": "MINE", "title": "MineMind Open-Pit Copper-Gold Mine", "subtitle": "Primary Surface Pit #1", "zone": "All Sectors", "status": "ACTIVE", "link": "/mines"},
            {"id": "ZN-01", "type": "ZONE", "title": "North Highwall (Bench 1300-1450)", "subtitle": "Geotechnical Risk Sector", "zone": "North Sector", "status": "MODERATE_RISK", "link": "/geotech-risk"},
            {"id": "ZN-02", "type": "ZONE", "title": "Main Haul Ramp Corridor", "subtitle": "8% Gradient Double-Lane Haulway", "zone": "Central Sector", "status": "ACTIVE", "link": "/collision-avoidance"},
            {"id": "ZN-03", "type": "ZONE", "title": "Primary Crusher & Stockpile Area", "subtitle": "Fixed Plant Ore Processing", "zone": "South Surface", "status": "ACTIVE", "link": "/predictive-maintenance"},
            {"id": "ZN-04", "type": "ZONE", "title": "South Sump & Dewatering Basin", "subtitle": "Pit Floor Catchment", "zone": "South Pit Floor", "status": "ACTIVE", "link": "/digital-twin"},

            # Vehicles
            {"id": "HT-101", "type": "VEHICLE", "title": "CAT 797F Haul Truck #101", "subtitle": "Payload: 380t | Speed: 36 km/h", "zone": "Main Haul Ramp", "status": "OPERATIONAL", "link": "/vehicles"},
            {"id": "HT-102", "type": "VEHICLE", "title": "CAT 797F Haul Truck #102", "subtitle": "Payload: 395t | Speed: 41 km/h", "zone": "Pit Floor", "status": "OPERATIONAL", "link": "/vehicles"},
            {"id": "HT-104", "type": "VEHICLE", "title": "CAT 797F Haul Truck #104", "subtitle": "Brake Temp 118°C | Maintenance Due", "zone": "Crusher Approach", "status": "WARNING", "link": "/vehicles"},
            {"id": "LV-201", "type": "VEHICLE", "title": "Toyota Hilux Light Vehicle #201", "subtitle": "Survey Crew Vehicle", "zone": "North Highwall", "status": "OPERATIONAL", "link": "/vehicles"},

            # Equipment
            {"id": "CRUSHER-01", "type": "EQUIPMENT", "title": "Primary 60x89 Gyratory Crusher", "subtitle": "Health: 84.5% | RUL: 310 hrs", "zone": "Crusher Area", "status": "HEALTHY", "link": "/predictive-maintenance"},
            {"id": "EXCAVATOR-03", "type": "EQUIPMENT", "title": "Komatsu PC8000 Hydraulic Shovel", "subtitle": "Health: 88.0% | Shovel Face 1", "zone": "North Highwall", "status": "HEALTHY", "link": "/equipment"},

            # Workers
            {"id": "WRK-001", "type": "WORKER", "title": "Marcus Vance", "subtitle": "Drill Specialist | Fatigue: 24%", "zone": "Bench 1350", "status": "ON_SHIFT", "link": "/workers"},
            {"id": "WRK-002", "type": "WORKER", "title": "Elena Rostova", "subtitle": "Geotechnical Lead | Fatigue: 31%", "zone": "North Highwall", "status": "ON_SHIFT", "link": "/workers"},
            {"id": "WRK-005", "type": "WORKER", "title": "David K.", "subtitle": "Fixed Plant Tech | Fatigue: 58%", "zone": "Crusher Area", "status": "ON_SHIFT", "link": "/workers"},

            # Sensors & Cameras
            {"id": "SN-01", "type": "SENSOR", "title": "InSAR Highwall Radar Prism #01", "subtitle": "Deformation: 3.8 mm/day", "zone": "North Highwall", "status": "ACTIVE", "link": "/sensors"},
            {"id": "SN-04", "type": "SENSOR", "title": "Crusher Methane & Dust Array #04", "subtitle": "PM10: 42.1 ug/m³ | Methane: 0.0%", "zone": "Crusher Area", "status": "ACTIVE", "link": "/sensors"},
            {"id": "CAM-PIT-01", "type": "CAMERA", "title": "CCTV Pit Wide Angle Alpha", "subtitle": "PPE Detection & Hazard Monitoring", "zone": "North Highwall", "status": "ONLINE", "link": "/computer-vision"},

            # Alerts & Incidents
            {"id": "ALT-4091", "type": "ALERT", "title": "Haul Truck HT-104 Brake Temp Warning", "subtitle": "TARP Yellow Brake Retarder Overload", "zone": "Main Haul Ramp", "status": "WARNING", "link": "/ai-overview"},
            {"id": "INC-0891", "type": "INCIDENT", "title": "Bench 1350 Highwall Rockfall Advisory", "subtitle": "Stage: INVESTIGATING | Severity: HIGH", "zone": "North Highwall", "status": "INVESTIGATING", "link": "/incidents"},

            # SOP Documents
            {"id": "SOP-SAF-001", "type": "DOCUMENT", "title": "SOP 01: Blast Exclusion Zone Protocols", "subtitle": "500m Personnel & 300m Equipment Radii", "zone": "Knowledge Base", "status": "OFFLINE_DOC", "link": "/ai-assistant"},
            {"id": "SOP-SAF-002", "type": "DOCUMENT", "title": "SOP 02: Pedestrian & Light Vehicle Haulway Interaction", "subtitle": "50m Heavy Vehicle Buffer & Positive Radio", "zone": "Knowledge Base", "status": "OFFLINE_DOC", "link": "/ai-assistant"},
            {"id": "GEO-GT-001", "type": "DOCUMENT", "title": "GEO 01: Radar Slope Stability & InSAR Monitoring", "subtitle": "Factor of Safety & Deformation Velocity TARPs", "zone": "Knowledge Base", "status": "OFFLINE_DOC", "link": "/ai-assistant"},
            {"id": "MAINT-CRU-001", "type": "DOCUMENT", "title": "MAINT 01: Gyratory Crusher Diagnostics & Weibull RUL", "subtitle": "Eccentric Bearing & Vibration Limits", "zone": "Knowledge Base", "status": "OFFLINE_DOC", "link": "/ai-assistant"}
        ]
        self.indexed_records = records

    def search(self, query: str, entity_type: Optional[str] = None, limit: int = 20) -> List[Dict[str, Any]]:
        """Searches across all indexed entities using multi-field token matching."""
        if not query or not query.strip():
            return self.indexed_records[:limit]

        tokens = query.lower().split()
        results = []

        for rec in self.indexed_records:
            if entity_type and rec["type"].upper() != entity_type.upper():
                continue

            searchable = f"{rec['id']} {rec['type']} {rec['title']} {rec['subtitle']} {rec['zone']}".lower()
            match_score = sum(1 for t in tokens if t in searchable)

            if match_score > 0:
                results.append((match_score, rec))

        # Sort descending by match score
        results.sort(key=lambda x: x[0], reverse=True)
        return [r[1] for r in results[:limit]]


search_service = SearchService()
