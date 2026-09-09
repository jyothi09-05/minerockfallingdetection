"""
Mining Environmental & Geotechnical Sensor Simulator
Simulates multi-parameter sensor streams with physical baseline drift,
Gaussian noise, threshold checks, and incident injection.
"""
import math
import random
from typing import List, Dict, Optional
from minemind_sim.models import (
    SensorSimState,
    SensorType,
    Position3D,
    SimulationScenario
)


class SensorSimulationEngine:
    """
    Simulates mining environmental and geotechnical sensor telemetry:
    methane, carbon monoxide, seismic PPV, radar slope displacement,
    crack extensometers, piezometric water tables, dust and ambient acoustics.
    """

    def __init__(self):
        self.sensors: List[SensorSimState] = []
        self._initialize_default_sensors()

    def _initialize_default_sensors(self):
        self.sensors = [
            SensorSimState(
                id="SNS-GAS-01",
                name="Sump Gas Monitor CH4 / Methane",
                code="GAS-CH4-01",
                type=SensorType.GAS_METHANE,
                position=Position3D(x=-22.0, y=410.0, z=12.0),
                zone_id="ZONE-PIT-FLOOR",
                current_value=0.12,
                unit="% LEL",
                baseline_value=0.10,
                warning_threshold=0.80,
                critical_threshold=1.50,
                status="NORMAL",
                battery_level_pct=98.0,
            ),
            SensorSimState(
                id="SNS-GAS-02",
                name="Crusher Pocket CO Monitor",
                code="GAS-CO-01",
                type=SensorType.GAS_CO,
                position=Position3D(x=122.0, y=502.0, z=142.0),
                zone_id="ZONE-CRUSHER",
                current_value=4.5,
                unit="ppm",
                baseline_value=4.0,
                warning_threshold=25.0,
                critical_threshold=50.0,
                status="NORMAL",
                battery_level_pct=99.0,
            ),
            SensorSimState(
                id="SNS-GEO-SLOPE-01",
                name="East Wall Radar Displacement Sensor",
                code="RADAR-SLOPE-E1",
                type=SensorType.SLOPE_DISPLACEMENT,
                position=Position3D(x=110.0, y=460.0, z=-10.0),
                zone_id="ZONE-EAST-WALL",
                current_value=0.45,
                unit="mm/day",
                baseline_value=0.40,
                warning_threshold=2.50,
                critical_threshold=6.00,
                status="NORMAL",
                battery_level_pct=95.0,
            ),
            SensorSimState(
                id="SNS-GEO-SEIS-01",
                name="Blast Bench Triaxial Seismograph",
                code="SEIS-PPV-01",
                type=SensorType.SEISMIC_PPV,
                position=Position3D(x=-80.0, y=455.0, z=40.0),
                zone_id="ZONE-BENCH-3-BLAST",
                current_value=1.8,
                unit="mm/s",
                baseline_value=1.5,
                warning_threshold=15.0,
                critical_threshold=25.0,
                status="NORMAL",
                battery_level_pct=94.0,
            ),
            SensorSimState(
                id="SNS-GEO-CRACK-01",
                name="North Crest Crack Extensometer",
                code="CRACK-EXT-N1",
                type=SensorType.CRACK_GAUGE,
                position=Position3D(x=-40.0, y=500.0, z=90.0),
                zone_id="ZONE-NORTH-CREST",
                current_value=2.1,
                unit="mm",
                baseline_value=2.0,
                warning_threshold=5.0,
                critical_threshold=10.0,
                status="NORMAL",
                battery_level_pct=91.0,
            ),
            SensorSimState(
                id="SNS-ENV-DUST-01",
                name="Haul Road PM10 Optical Particle Counter",
                code="DUST-PM10-01",
                type=SensorType.DUST_PM10,
                position=Position3D(x=10.0, y=495.0, z=85.0),
                zone_id="ZONE-HAUL-01",
                current_value=42.0,
                unit="µg/m³",
                baseline_value=40.0,
                warning_threshold=120.0,
                critical_threshold=250.0,
                status="NORMAL",
                battery_level_pct=97.0,
            ),
            SensorSimState(
                id="SNS-ENV-PIEZO-01",
                name="Floor Piezometer Pore Water Pressure",
                code="PIEZO-PWP-01",
                type=SensorType.PIEZOMETER_WATER,
                position=Position3D(x=-20.0, y=405.0, z=10.0),
                zone_id="ZONE-PIT-FLOOR",
                current_value=45.0,
                unit="kPa",
                baseline_value=42.0,
                warning_threshold=95.0,
                critical_threshold=150.0,
                status="NORMAL",
                battery_level_pct=96.0,
            ),
        ]

    def update(self, dt: float, scenario: SimulationScenario = SimulationScenario.NORMAL_OPERATIONS):
        """
        Updates sensor readings applying natural physical drift, noise, and scenario-specific anomalies.
        """
        for s in self.sensors:
            noise = (random.random() - 0.5) * (s.baseline_value * 0.08)
            target_val = s.baseline_value + noise

            # Scenario Injections
            if scenario == SimulationScenario.SLOPE_INSTABILITY_WARNING:
                if s.type == SensorType.SLOPE_DISPLACEMENT:
                    target_val = s.warning_threshold * random.uniform(1.2, 1.8)
                elif s.type == SensorType.CRACK_GAUGE:
                    target_val = s.warning_threshold * random.uniform(1.1, 1.5)
            elif scenario == SimulationScenario.METHANE_GAS_BREACH:
                if s.type == SensorType.GAS_METHANE:
                    target_val = s.critical_threshold * random.uniform(1.1, 1.4)
            elif scenario == SimulationScenario.HEAVY_RAIN_FLOOD:
                if s.type == SensorType.PIEZOMETER_WATER:
                    target_val = s.warning_threshold * random.uniform(1.2, 1.6)
                elif s.type == SensorType.DUST_PM10:
                    target_val = 12.0  # Rain suppresses dust

            # Smooth interpolation
            s.current_value += (target_val - s.current_value) * min(1.0, 0.2 * dt)
            s.current_value = round(max(0.0, s.current_value), 2)

            # Evaluate status threshold
            if s.current_value >= s.critical_threshold:
                s.status = "CRITICAL"
            elif s.current_value >= s.warning_threshold:
                s.status = "WARNING"
            else:
                s.status = "NORMAL"
