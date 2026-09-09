"""
MineMind Simulation Master Orchestrator
Coordinates terrain, vehicle kinematics, workforce, equipment, sensors, weather,
and scenario transitions into a synchronized real-time state loop.
"""
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from minemind_sim.models import (
    SimulationStateSnapshot,
    SimulationScenario,
    TerrainMetadata,
    VehicleSimState,
    VehicleState,
    WorkerSimState,
    EquipmentSimState,
    SensorSimState,
    WeatherSimState
)
from minemind_sim.terrain.generator import ProceduralTerrainGenerator
from minemind_sim.vehicles.engine import VehiclePhysicsEngine
from minemind_sim.workforce.engine import WorkforceSimulationEngine
from minemind_sim.equipment.engine import EquipmentSimulationEngine
from minemind_sim.sensors.engine import SensorSimulationEngine
from minemind_sim.weather.engine import WeatherSimulationEngine


class MineMindSimulationMaster:
    """
    Master digital twin simulation runtime engine.
    Manages deterministic tick cycles, entity physics, and scenario executions.
    """

    def __init__(self, seed: int = 42):
        self.seed = seed
        self.is_running: bool = True
        self.speed_multiplier: float = 1.0
        self.scenario: SimulationScenario = SimulationScenario.NORMAL_OPERATIONS
        self.tick_index: int = 0
        self.simulation_time_sec: float = 0.0

        # Subsystems
        self.terrain_gen = ProceduralTerrainGenerator(seed=self.seed)
        self.terrain_metadata = self.terrain_gen.generate_full_terrain(include_matrix=True)

        self.vehicles_engine = VehiclePhysicsEngine(
            waypoints=self.terrain_metadata.waypoints,
            roads=self.terrain_metadata.roads
        )
        self.workforce_engine = WorkforceSimulationEngine()
        self.equipment_engine = EquipmentSimulationEngine()
        self.sensors_engine = SensorSimulationEngine()
        self.weather_engine = WeatherSimulationEngine()

    def set_scenario(self, scenario: SimulationScenario):
        """Sets active simulation scenario."""
        self.scenario = scenario

    def set_speed_multiplier(self, mult: float):
        """Sets simulation speed multiplier (1x to 50x)."""
        self.speed_multiplier = max(0.1, min(50.0, mult))

    def reset(self, new_seed: Optional[int] = None):
        """Resets the simulation runtime with optional new seed."""
        if new_seed is not None:
            self.seed = new_seed
        self.tick_index = 0
        self.simulation_time_sec = 0.0
        self.scenario = SimulationScenario.NORMAL_OPERATIONS
        
        self.terrain_gen = ProceduralTerrainGenerator(seed=self.seed)
        self.terrain_metadata = self.terrain_gen.generate_full_terrain(include_matrix=True)
        self.vehicles_engine = VehiclePhysicsEngine(
            waypoints=self.terrain_metadata.waypoints,
            roads=self.terrain_metadata.roads
        )
        self.workforce_engine = WorkforceSimulationEngine()
        self.equipment_engine = EquipmentSimulationEngine()
        self.sensors_engine = SensorSimulationEngine()
        self.weather_engine = WeatherSimulationEngine()

    def tick(self, base_dt_sec: float = 0.5) -> SimulationStateSnapshot:
        """
        Advances the entire mine digital twin state by one simulation tick.
        """
        if not self.is_running:
            return self.get_snapshot()

        effective_dt = base_dt_sec * self.speed_multiplier
        self.simulation_time_sec += effective_dt
        self.tick_index += 1

        # 1. Update weather
        self.weather_engine.update(dt=effective_dt, scenario=self.scenario)
        weather_state = self.weather_engine.state

        # 2. Update vehicle kinematics & haul cycles
        self.vehicles_engine.update(
            dt=effective_dt,
            road_friction=weather_state.road_friction_coefficient
        )

        # 3. Update workforce telemetry
        is_stress = self.scenario in [
            SimulationScenario.EMERGENCY_EVACUATION,
            SimulationScenario.METHANE_GAS_BREACH,
            SimulationScenario.SLOPE_INSTABILITY_WARNING
        ]
        self.workforce_engine.update(
            dt=effective_dt,
            ambient_temp_c=weather_state.ambient_temp_c,
            high_stress_scenario=is_stress
        )

        # 4. Update equipment
        is_heavy_load = self.scenario == SimulationScenario.NORMAL_OPERATIONS
        self.equipment_engine.update(dt=effective_dt, heavy_load_scenario=is_heavy_load)

        # 5. Update sensors
        self.sensors_engine.update(dt=effective_dt, scenario=self.scenario)

        return self.get_snapshot()

    def get_snapshot(self) -> SimulationStateSnapshot:
        """Captures a complete digital twin state snapshot."""
        # Calculate active critical alarms
        crit_sensors = sum(1 for s in self.sensors_engine.sensors if s.status == "CRITICAL")
        warn_sensors = sum(1 for s in self.sensors_engine.sensors if s.status == "WARNING")
        incidents = crit_sensors + (1 if self.scenario != SimulationScenario.NORMAL_OPERATIONS else 0)

        # Mine safety score (1.00 down to 0.0)
        safety_score = max(0.40, 1.0 - (crit_sensors * 0.20 + warn_sensors * 0.05))
        if self.scenario == SimulationScenario.EMERGENCY_EVACUATION:
            safety_score = 0.45

        # Fleet production rate (tonnes per hour)
        active_haulers = sum(1 for v in self.vehicles_engine.vehicles if v.state == VehicleState.HAULING_LOADED)
        prod_rate = active_haulers * 680.0

        return SimulationStateSnapshot(
            timestamp=datetime.now(timezone.utc),
            tick_index=self.tick_index,
            simulation_time_sec=self.simulation_time_sec,
            scenario=self.scenario,
            is_running=self.is_running,
            speed_multiplier=self.speed_multiplier,
            terrain_seed=self.seed,
            weather=self.weather_engine.state,
            vehicles=self.vehicles_engine.vehicles,
            workers=self.workforce_engine.workers,
            equipment=self.equipment_engine.equipment,
            sensors=self.sensors_engine.sensors,
            active_incidents_count=incidents,
            overall_mine_safety_score=round(safety_score, 2),
            fleet_production_rate_tph=round(prod_rate, 1),
        )
