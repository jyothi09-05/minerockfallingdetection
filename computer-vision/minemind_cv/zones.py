"""
MineMind AI - Virtual Safety Zones & Exclusion Geofences
Defines 2D normalized polygonal zones across camera FOVs and performs ray-casting point-in-polygon incursion tests.
100% Offline and local.
"""
from typing import List, Tuple, Dict, Optional
from pydantic import BaseModel, Field


class Point2D(BaseModel):
    x: float = Field(..., ge=0.0, le=1.0)
    y: float = Field(..., ge=0.0, le=1.0)


class VirtualSafetyZone(BaseModel):
    zone_id: str
    camera_id: str
    name: str
    hazard_type: str  # BLAST_RADIUS, SWING_RADIUS, CONVEYOR_PINCH_POINT, HIGHWALL_CREST, HEAVY_HAUL_CORRIDOR
    polygon_points: List[List[float]] = Field(..., description="List of [x, y] normalized coordinates forming closed polygon")
    is_active: bool = True
    severity: str = "HIGH"  # CRITICAL, HIGH, MEDIUM, LOW
    description: str = ""

    def contains_point(self, x: float, y: float) -> bool:
        """
        Ray-casting algorithm to test if point (x, y) is inside the polygon.
        Polygon vertices are [ [x1, y1], [x2, y2], ... ]
        """
        n = len(self.polygon_points)
        if n < 3:
            return False

        inside = False
        p1x, p1y = self.polygon_points[0]
        for i in range(n + 1):
            p2x, p2y = self.polygon_points[i % n]
            if y > min(p1y, p2y):
                if y <= max(p1y, p2y):
                    if x <= max(p1x, p2x):
                        if p1y != p2y:
                            xinters = (y - p1y) * (p2x - p1x) / (p2y - p1y) + p1x
                        if p1x == p2x or x <= xinters:
                            inside = not inside
            p1x, p1y = p2x, p2y

        return inside


# Default preset safety zones for the cameras
DEFAULT_VIRTUAL_ZONES: List[VirtualSafetyZone] = [
    VirtualSafetyZone(
        zone_id="VZ-PIT-01",
        camera_id="CAM-PIT-01",
        name="Excavator 15m Swing Hazard Zone",
        hazard_type="SWING_RADIUS",
        polygon_points=[[0.20, 0.20], [0.85, 0.20], [0.85, 0.80], [0.20, 0.80]],
        severity="CRITICAL",
        description="Rotating upper-carriage and bucket trajectory zone for Shovel-01"
    ),
    VirtualSafetyZone(
        zone_id="VZ-NW-02",
        camera_id="CAM-NW-02",
        name="Highwall Crest 20m Unstable Buffer",
        hazard_type="HIGHWALL_CREST",
        polygon_points=[[0.05, 0.10], [0.95, 0.10], [0.95, 0.45], [0.05, 0.45]],
        severity="CRITICAL",
        description="Prone to bench spalling and micro-rockfalls"
    ),
    VirtualSafetyZone(
        zone_id="VZ-RAMP-03",
        camera_id="CAM-RAMP-03",
        name="Switchback Blindspot Pedestrian Exclusion",
        hazard_type="HEAVY_HAUL_CORRIDOR",
        polygon_points=[[0.10, 0.30], [0.90, 0.30], [0.90, 0.90], [0.10, 0.90]],
        severity="HIGH",
        description="Loaded CAT 797F haul trucks descending at 25km/h"
    ),
    VirtualSafetyZone(
        zone_id="VZ-CRU-04",
        camera_id="CAM-CRU-04",
        name="Gyratory Crusher Dump Pocket Exclusion",
        hazard_type="CONVEYOR_PINCH_POINT",
        polygon_points=[[0.30, 0.25], [0.70, 0.25], [0.70, 0.85], [0.30, 0.85]],
        severity="CRITICAL",
        description="Rock breaker hydraulic swing and direct fall hazard"
    )
]


class ZoneManager:
    def __init__(self):
        self._zones: Dict[str, VirtualSafetyZone] = {z.zone_id: z for z in DEFAULT_VIRTUAL_ZONES}

    def get_zones_for_camera(self, camera_id: str) -> List[VirtualSafetyZone]:
        return [z for z in self._zones.values() if z.camera_id == camera_id and z.is_active]

    def add_zone(self, zone: VirtualSafetyZone) -> VirtualSafetyZone:
        self._zones[zone.zone_id] = zone
        return zone

    def list_all_zones(self) -> List[VirtualSafetyZone]:
        return list(self._zones.values())


zone_manager = ZoneManager()
