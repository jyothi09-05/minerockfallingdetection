"""
Mining Equipment & Fixed Machinery Simulation Engine
Simulates primary crushers, conveyors, dewatering pumps, and rotary blast drills.
"""
import math
import random
from typing import List, Dict
from minemind_sim.models import (
    EquipmentSimState,
    EquipmentType,
    Position3D
)


class EquipmentSimulationEngine:
    """
    Simulates operational dynamics, electrical power draw, vibration spectra,
    bearing thermals, and mechanical failure probabilities for fixed mine plant equipment.
    """

    def __init__(self):
        self.equipment: List[EquipmentSimState] = []
        self._initialize_default_equipment()

    def _initialize_default_equipment(self):
        self.equipment = [
            EquipmentSimState(
                id="EQ-CRUSH-01",
                name="Primary 60-110 Superior Gyratory Crusher",
                code="CRUSH-01",
                type=EquipmentType.PRIMARY_CRUSHER,
                position=Position3D(x=120.0, y=502.0, z=140.0),
                status="RUNNING",
                power_draw_kw=650.0,
                utilization_rate_pct=84.5,
                bearing_temp_c=68.5,
                vibration_amplitude_mms=3.4,
                vibration_frequency_hz=29.5,
                runtime_hours=12450.0,
                failure_probability=0.035,
                efficiency_pct=92.0,
            ),
            EquipmentSimState(
                id="EQ-CONV-01",
                name="Overland Ore Conveyor System CV-101",
                code="CV-101",
                type=EquipmentType.CONVEYOR_SYSTEM,
                position=Position3D(x=150.0, y=504.0, z=160.0),
                status="RUNNING",
                power_draw_kw=320.0,
                utilization_rate_pct=88.0,
                bearing_temp_c=54.0,
                vibration_amplitude_mms=1.8,
                vibration_frequency_hz=14.2,
                runtime_hours=18900.0,
                failure_probability=0.02,
                efficiency_pct=96.5,
            ),
            EquipmentSimState(
                id="EQ-PUMP-01",
                name="Pit Sump High-Volume Dewatering Pump DP-01",
                code="DP-01",
                type=EquipmentType.DEWATERING_PUMP,
                position=Position3D(x=-25.0, y=408.0, z=15.0),
                status="RUNNING",
                power_draw_kw=180.0,
                utilization_rate_pct=92.0,
                bearing_temp_c=58.0,
                vibration_amplitude_mms=2.1,
                vibration_frequency_hz=48.0,
                runtime_hours=8740.0,
                failure_probability=0.04,
                efficiency_pct=89.0,
            ),
            EquipmentSimState(
                id="EQ-DRILL-01",
                name="Pit Viper 271 Rotary Blast Hole Drill",
                code="PV-271",
                type=EquipmentType.BLAST_DRILL,
                position=Position3D(x=-85.0, y=455.0, z=45.0),
                status="RUNNING",
                power_draw_kw=420.0,
                utilization_rate_pct=76.0,
                bearing_temp_c=74.0,
                vibration_amplitude_mms=7.8,
                vibration_frequency_hz=62.0,
                runtime_hours=6320.0,
                failure_probability=0.06,
                efficiency_pct=91.0,
            ),
        ]

    def update(self, dt: float, heavy_load_scenario: bool = False):
        """
        Updates machine telemetry, thermal equilibrium, and vibration oscillation.
        """
        for eq in self.equipment:
            eq.runtime_hours += (dt / 3600.0)

            if eq.status != "RUNNING":
                eq.power_draw_kw = max(10.0, eq.power_draw_kw - 20.0 * dt)
                eq.bearing_temp_c = max(30.0, eq.bearing_temp_c - 0.2 * dt)
                eq.vibration_amplitude_mms = max(0.1, eq.vibration_amplitude_mms - 0.5 * dt)
                continue

            # Load variations
            load_mult = 1.3 if heavy_load_scenario else 1.0
            power_jitter = (random.random() - 0.5) * 15.0
            eq.power_draw_kw = max(50.0, (eq.power_draw_kw * 0.98 + (eq.power_draw_kw * load_mult + power_jitter) * 0.02))

            # Thermal equilibrium
            target_temp = 72.0 if eq.type == EquipmentType.PRIMARY_CRUSHER else 55.0
            if heavy_load_scenario:
                target_temp += 18.0
            eq.bearing_temp_c += (target_temp - eq.bearing_temp_c) * 0.02 * dt

            # Vibration noise
            vib_noise = (random.random() - 0.5) * 0.3
            eq.vibration_amplitude_mms = max(0.5, eq.vibration_amplitude_mms + vib_noise)
