"""
Unit Tests for MineMind Simulation Engine Subsystems
"""
import pytest
from minemind_sim.core.simulation import MineMindSimulationMaster
from minemind_sim.terrain.generator import ProceduralTerrainGenerator
from minemind_sim.models import SimulationScenario, VehicleState, SensorType


def test_terrain_generator_determinism():
    """Verifies that two generators with identical seed produce exactly the same heightmap and benches."""
    gen1 = ProceduralTerrainGenerator(seed=1337, grid_width=32, grid_height=32)
    gen2 = ProceduralTerrainGenerator(seed=1337, grid_width=32, grid_height=32)

    h1 = gen1.generate_heightmap()
    h2 = gen2.generate_heightmap()

    assert len(h1) == 32
    assert len(h1[0]) == 32
    assert h1 == h2

    meta1 = gen1.generate_full_terrain(include_matrix=False)
    meta2 = gen2.generate_full_terrain(include_matrix=False)

    assert meta1.seed == meta2.seed
    assert len(meta1.benches) == len(meta2.benches)
    assert len(meta1.roads) == len(meta2.roads)
    assert meta1.min_elevation_m == meta2.min_elevation_m


def test_simulation_master_tick_loop():
    """Verifies that the master simulation orchestrator advances state and ticks correctly."""
    sim = MineMindSimulationMaster(seed=42)
    initial_snapshot = sim.get_snapshot()

    assert initial_snapshot.tick_index == 0
    assert initial_snapshot.simulation_time_sec == 0.0
    assert len(initial_snapshot.vehicles) > 0
    assert len(initial_snapshot.workers) > 0
    assert len(initial_snapshot.equipment) > 0
    assert len(initial_snapshot.sensors) > 0

    # Advance 5 ticks
    for _ in range(5):
        sim.tick(base_dt_sec=1.0)

    snap = sim.get_snapshot()
    assert snap.tick_index == 5
    assert snap.simulation_time_sec == 5.0


def test_vehicle_kinematics_and_fuel_consumption():
    """Verifies that vehicles move along waypoints and consume fuel."""
    sim = MineMindSimulationMaster(seed=42)
    truck = sim.vehicles_engine.vehicles[0]
    initial_fuel = truck.fuel_level_percent
    initial_pos_x = truck.position.x
    initial_pos_z = truck.position.z

    # Run for 20 simulation seconds
    for _ in range(20):
        sim.tick(base_dt_sec=1.0)

    assert truck.fuel_level_percent < initial_fuel
    # Truck moved
    assert (truck.position.x != initial_pos_x) or (truck.position.z != initial_pos_z)


def test_scenario_injection_and_sensor_thresholds():
    """Verifies that triggering an emergency scenario alters sensor readings and raises alerts."""
    sim = MineMindSimulationMaster(seed=42)
    
    # Check baseline
    snap_normal = sim.tick()
    methane_sensor = next(s for s in snap_normal.sensors if s.type == SensorType.GAS_METHANE)
    assert methane_sensor.status == "NORMAL"

    # Inject methane gas breach scenario
    sim.set_scenario(SimulationScenario.METHANE_GAS_BREACH)
    
    # Run multiple ticks to allow smoothing filter to catch up
    for _ in range(15):
        sim.tick(base_dt_sec=1.0)

    snap_breach = sim.get_snapshot()
    breach_sensor = next(s for s in snap_breach.sensors if s.type == SensorType.GAS_METHANE)
    
    assert breach_sensor.status in ["WARNING", "CRITICAL"]
    assert snap_breach.active_incidents_count > 0
    assert snap_breach.overall_mine_safety_score < 1.0
