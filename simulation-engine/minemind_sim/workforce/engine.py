"""
Mining Workforce Simulation Engine
Simulates virtual mining personnel across shifts, roles, physiological telemetry,
fatigue tracking, muster point routing, and exclusion zone safety checks.
"""
import math
import random
from typing import List, Dict, Optional
from minemind_sim.models import (
    WorkerSimState,
    WorkerRoleType,
    Position3D
)


class WorkforceSimulationEngine:
    """
    Simulates mining workforce operations, biometric safety telemetry (heart rate, fatigue, heat strain),
    zone allocation, and exclusion safety compliance.
    """

    def __init__(self):
        self.workers: List[WorkerSimState] = []
        self._initialize_default_workers()

    def _initialize_default_workers(self):
        self.workers = [
            WorkerSimState(
                id="WRK-001",
                name="Marcus Vance",
                badge_number="MM-8801",
                role=WorkerRoleType.TRUCK_OPERATOR,
                position=Position3D(x=0.0, y=500.0, z=100.0),
                assigned_zone_id="ZONE-HAUL-01",
                shift_name="Day Shift Alpha (06:00 - 18:00)",
                heart_rate_bpm=78.0,
                fatigue_index=0.22,
                body_temp_c=36.7,
                in_exclusion_zone=False,
                ppe_compliant=True,
                assigned_vehicle_id="VEH-HT-101",
            ),
            WorkerSimState(
                id="WRK-002",
                name="Elena Rostova",
                badge_number="MM-8802",
                role=WorkerRoleType.TRUCK_OPERATOR,
                position=Position3D(x=80.0, y=475.0, z=20.0),
                assigned_zone_id="ZONE-HAUL-01",
                shift_name="Day Shift Alpha (06:00 - 18:00)",
                heart_rate_bpm=82.0,
                fatigue_index=0.35,
                body_temp_c=36.8,
                in_exclusion_zone=False,
                ppe_compliant=True,
                assigned_vehicle_id="VEH-HT-102",
            ),
            WorkerSimState(
                id="WRK-003",
                name="Darius Thorne",
                badge_number="MM-8803",
                role=WorkerRoleType.TRUCK_OPERATOR,
                position=Position3D(x=-120.0, y=502.0, z=130.0),
                assigned_zone_id="ZONE-HAUL-01",
                shift_name="Day Shift Alpha (06:00 - 18:00)",
                heart_rate_bpm=75.0,
                fatigue_index=0.18,
                body_temp_c=36.6,
                in_exclusion_zone=False,
                ppe_compliant=True,
                assigned_vehicle_id="VEH-HT-103",
            ),
            WorkerSimState(
                id="WRK-004",
                name="Kofi Mensah",
                badge_number="MM-8804",
                role=WorkerRoleType.EXCAVATOR_OPERATOR,
                position=Position3D(x=-20.0, y=410.0, z=10.0),
                assigned_zone_id="ZONE-PIT-FLOOR",
                shift_name="Day Shift Alpha (06:00 - 18:00)",
                heart_rate_bpm=80.0,
                fatigue_index=0.28,
                body_temp_c=36.9,
                in_exclusion_zone=False,
                ppe_compliant=True,
                assigned_vehicle_id="VEH-EX-201",
            ),
            WorkerSimState(
                id="WRK-005",
                name="Sarah Jenkins",
                badge_number="MM-8805",
                role=WorkerRoleType.SAFETY_OFFICER,
                position=Position3D(x=10.0, y=500.0, z=80.0),
                assigned_zone_id="ZONE-SURFACE-ADMIN",
                shift_name="Day Shift Alpha (06:00 - 18:00)",
                heart_rate_bpm=72.0,
                fatigue_index=0.15,
                body_temp_c=36.6,
                in_exclusion_zone=False,
                ppe_compliant=True,
            ),
            WorkerSimState(
                id="WRK-006",
                name="Liam Gallagher",
                badge_number="MM-8806",
                role=WorkerRoleType.BLAST_ENGINEER,
                position=Position3D(x=-75.0, y=455.0, z=35.0),
                assigned_zone_id="ZONE-BENCH-3-BLAST",
                shift_name="Day Shift Alpha (06:00 - 18:00)",
                heart_rate_bpm=84.0,
                fatigue_index=0.30,
                body_temp_c=36.9,
                in_exclusion_zone=False,
                ppe_compliant=True,
            ),
            WorkerSimState(
                id="WRK-007",
                name="Amina Al-Mansoor",
                badge_number="MM-8807",
                role=WorkerRoleType.SURVEYOR,
                position=Position3D(x=60.0, y=485.0, z=50.0),
                assigned_zone_id="ZONE-RAMP-EAST",
                shift_name="Day Shift Alpha (06:00 - 18:00)",
                heart_rate_bpm=88.0,
                fatigue_index=0.25,
                body_temp_c=36.8,
                in_exclusion_zone=False,
                ppe_compliant=True,
            ),
        ]

    def update(self, dt: float, ambient_temp_c: float = 28.0, high_stress_scenario: bool = False):
        """
        Updates worker biometrics, fatigue accumulation, and path wander for surveyors/inspectors.
        """
        for w in self.workers:
            # Fatigue accumulation based on hours worked and ambient heat
            heat_factor = max(1.0, (ambient_temp_c - 25.0) * 0.1)
            stress_mult = 2.5 if high_stress_scenario else 1.0
            fatigue_rate = (0.00004 * heat_factor * stress_mult)
            w.fatigue_index = min(1.0, w.fatigue_index + fatigue_rate * dt)

            # Heart rate variability
            base_hr = 72.0 if w.role == WorkerRoleType.SAFETY_OFFICER else 80.0
            if high_stress_scenario:
                base_hr += 25.0
            w.heart_rate_bpm = base_hr + math.sin(w.fatigue_index * 10.0 + random.random()) * 6.0

            # Surveyor / Inspector walking patrol
            if w.role in [WorkerRoleType.SURVEYOR, WorkerRoleType.SAFETY_OFFICER]:
                walk_speed = 1.2  # m/s
                angle = (random.random() * math.pi * 2)
                w.position.x += math.cos(angle) * walk_speed * dt * 0.25
                w.position.z += math.sin(angle) * walk_speed * dt * 0.25
