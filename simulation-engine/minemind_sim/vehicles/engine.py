"""
Mining Vehicle Kinematics & Haul Cycle Simulation Engine
Simulates multi-ton haul trucks, hydraulic excavators, loaders, and auxiliary fleet.
"""
import math
import random
from typing import List, Dict, Optional, Tuple
from minemind_sim.models import (
    VehicleSimState,
    VehicleType,
    VehicleState,
    Position3D,
    RoadWaypoint,
    RoadSegment
)


class VehiclePhysicsEngine:
    """
    Simulates physics kinematics, waypoint navigation, payload haul cycles,
    engine thermals, fuel consumption, and component degradation for mining vehicles.
    """

    def __init__(self, waypoints: List[RoadWaypoint], roads: List[RoadSegment]):
        self.waypoints_map: Dict[str, RoadWaypoint] = {wp.id: wp for wp in waypoints}
        self.roads = roads
        self.vehicles: List[VehicleSimState] = []
        self._initialize_default_fleet()

    def _initialize_default_fleet(self):
        """Initializes a standard open-pit mining production fleet."""
        self.vehicles = [
            # Haul Trucks
            VehicleSimState(
                id="VEH-HT-101",
                name="CAT 797F Ultra-Class Hauler #1",
                code="HT-101",
                type=VehicleType.HAUL_TRUCK,
                state=VehicleState.HAULING_EMPTY,
                position=Position3D(x=0.0, y=500.0, z=100.0),
                velocity_ms=8.5,
                heading_deg=145.0,
                current_route_waypoints=["WP-SURFACE-GATE", "WP-RAMP-B1", "WP-RAMP-B2", "WP-RAMP-B3", "WP-PIT-FLOOR"],
                target_waypoint_index=1,
                payload_tonnes=0.0,
                max_capacity_tonnes=360.0,
                fuel_level_percent=88.5,
                fuel_burn_rate_lph=145.0,
                engine_temp_c=88.0,
                engine_rpm=1600.0,
                hydraulic_pressure_bar=210.0,
                tire_pressure_bar=7.2,
                health_score=0.96,
                operating_hours=4120.5,
                operator_id="WRK-001",
                operator_name="Marcus Vance",
            ),
            VehicleSimState(
                id="VEH-HT-102",
                name="CAT 797F Ultra-Class Hauler #2",
                code="HT-102",
                type=VehicleType.HAUL_TRUCK,
                state=VehicleState.HAULING_LOADED,
                position=Position3D(x=80.0, y=475.0, z=20.0),
                velocity_ms=4.2,
                heading_deg=320.0,
                current_route_waypoints=["WP-PIT-FLOOR", "WP-RAMP-B4", "WP-RAMP-B3", "WP-RAMP-B2", "WP-RAMP-B1", "WP-SURFACE-GATE", "WP-CRUSHER"],
                target_waypoint_index=3,
                payload_tonnes=352.0,
                max_capacity_tonnes=360.0,
                fuel_level_percent=74.0,
                fuel_burn_rate_lph=280.0,
                engine_temp_c=94.5,
                engine_rpm=1950.0,
                hydraulic_pressure_bar=225.0,
                tire_pressure_bar=7.4,
                health_score=0.91,
                operating_hours=5890.0,
                operator_id="WRK-002",
                operator_name="Elena Rostova",
            ),
            VehicleSimState(
                id="VEH-HT-103",
                name="Komatsu 930E-5 Electric Hauler",
                code="HT-103",
                type=VehicleType.HAUL_TRUCK,
                state=VehicleState.HAULING_LOADED,
                position=Position3D(x=-120.0, y=502.0, z=130.0),
                velocity_ms=6.8,
                heading_deg=310.0,
                current_route_waypoints=["WP-BENCH-BLAST-3", "WP-RAMP-B3", "WP-RAMP-B2", "WP-RAMP-B1", "WP-SURFACE-GATE", "WP-DUMP-NORTH"],
                target_waypoint_index=4,
                payload_tonnes=290.0,
                max_capacity_tonnes=300.0,
                fuel_level_percent=62.0,
                fuel_burn_rate_lph=210.0,
                engine_temp_c=89.0,
                engine_rpm=1750.0,
                hydraulic_pressure_bar=215.0,
                tire_pressure_bar=7.1,
                health_score=0.94,
                operating_hours=3250.0,
                operator_id="WRK-003",
                operator_name="Darius Thorne",
            ),
            # Excavator / Shovel
            VehicleSimState(
                id="VEH-EX-201",
                name="CAT 6060 Hydraulic Mining Shovel",
                code="EX-201",
                type=VehicleType.EXCAVATOR,
                state=VehicleState.LOADING,
                position=Position3D(x=-20.0, y=410.0, z=10.0),
                velocity_ms=0.0,
                heading_deg=85.0,
                current_route_waypoints=["WP-PIT-FLOOR"],
                target_waypoint_index=0,
                payload_tonnes=62.0,
                max_capacity_tonnes=65.0,
                fuel_level_percent=81.0,
                fuel_burn_rate_lph=190.0,
                engine_temp_c=91.0,
                engine_rpm=1800.0,
                hydraulic_pressure_bar=310.0,
                tire_pressure_bar=0.0,
                health_score=0.97,
                operating_hours=2100.0,
                operator_id="WRK-004",
                operator_name="Kofi Mensah",
            ),
            # Bulldozer
            VehicleSimState(
                id="VEH-DZ-301",
                name="CAT D11 Track-Type Dozer",
                code="DZ-301",
                type=VehicleType.BULLDOZER,
                state=VehicleState.IDLE,
                position=Position3D(x=-175.0, y=505.0, z=155.0),
                velocity_ms=1.2,
                heading_deg=220.0,
                current_route_waypoints=["WP-DUMP-NORTH"],
                target_waypoint_index=0,
                payload_tonnes=0.0,
                max_capacity_tonnes=0.0,
                fuel_level_percent=69.0,
                fuel_burn_rate_lph=95.0,
                engine_temp_c=86.0,
                engine_rpm=1400.0,
                hydraulic_pressure_bar=200.0,
                tire_pressure_bar=0.0,
                health_score=0.95,
                operating_hours=6400.0,
                operator_id="WRK-005",
                operator_name="Sarah Jenkins",
            ),
        ]

    def update(self, dt: float, road_friction: float = 0.85):
        """
        Updates kinematic position, haul cycles, fuel consumption, and thermals for all vehicles.
        :param dt: Delta time in seconds.
        :param road_friction: Current road friction factor from weather (0.4 to 0.95).
        """
        for v in self.vehicles:
            # Advance operating hours
            v.operating_hours += (dt / 3600.0)

            # Shovel / Stationary behavior
            if v.type == VehicleType.EXCAVATOR:
                # Cycle hydraulic pressure & load
                v.engine_rpm = 1750.0 + math.sin(v.operating_hours * 120.0) * 150.0
                v.hydraulic_pressure_bar = 280.0 + math.sin(v.operating_hours * 80.0) * 35.0
                v.fuel_level_percent = max(0.0, v.fuel_level_percent - (v.fuel_burn_rate_lph / 3600.0 * dt * 0.05))
                continue

            if v.state in [VehicleState.IDLE, VehicleState.MAINTENANCE, VehicleState.BREAKDOWN]:
                v.velocity_ms = 0.0
                continue

            if not v.current_route_waypoints:
                continue

            target_wp_id = v.current_route_waypoints[v.target_waypoint_index]
            target_wp = self.waypoints_map.get(target_wp_id)
            if not target_wp:
                continue

            # Calculate direction vector to target waypoint
            dx = target_wp.position.x - v.position.x
            dy = target_wp.position.y - v.position.y
            dz = target_wp.position.z - v.position.z
            dist_to_target = math.sqrt(dx * dx + dz * dz)

            # Heading calculation (in degrees)
            v.heading_deg = (math.degrees(math.atan2(dx, dz)) + 360.0) % 360.0

            # Target speed based on load and gradient
            base_max_speed = 12.0 if v.state == VehicleState.HAULING_EMPTY else 6.5
            # Road friction impact
            effective_max_speed = base_max_speed * (road_friction / 0.85)

            # Arrival at waypoint threshold
            if dist_to_target < 6.0:
                # Move to next waypoint or change haul state
                if v.target_waypoint_index < len(v.current_route_waypoints) - 1:
                    v.target_waypoint_index += 1
                else:
                    # Completed route - transition cycle
                    self._transition_haul_cycle(v)
            else:
                # Kinematic movement step
                v.velocity_ms = min(effective_max_speed, v.velocity_ms + 1.2 * dt)
                step_dist = min(dist_to_target, v.velocity_ms * dt)
                
                norm_x = dx / (dist_to_target + 1e-6)
                norm_z = dz / (dist_to_target + 1e-6)
                
                v.position.x += norm_x * step_dist
                v.position.z += norm_z * step_dist
                # Interpolate elevation Y
                v.position.y += (dy / (dist_to_target + 1e-6)) * step_dist

                # Engine thermals & fuel burn
                is_uphill = dy > 0.5
                is_loaded = v.payload_tonnes > 100.0
                
                target_temp = 96.0 if (is_uphill and is_loaded) else 88.0
                v.engine_temp_c += (target_temp - v.engine_temp_c) * 0.05 * dt
                
                burn_mult = 1.8 if (is_uphill and is_loaded) else 1.0
                v.fuel_burn_rate_lph = (140.0 * burn_mult)
                v.fuel_level_percent = max(0.0, v.fuel_level_percent - (v.fuel_burn_rate_lph / 3600.0 * dt * 0.04))

    def _transition_haul_cycle(self, v: VehicleSimState):
        """Transitions haul truck between Pit Floor Loading, Uphill Hauling, and Dumping."""
        if v.state == VehicleState.HAULING_EMPTY:
            # Arrived at pit floor/bench -> load up
            v.state = VehicleState.HAULING_LOADED
            v.payload_tonnes = v.max_capacity_tonnes * random.uniform(0.92, 1.0)
            # Switch route to crusher or waste dump
            dest = "WP-CRUSHER" if random.random() > 0.3 else "WP-DUMP-NORTH"
            v.current_route_waypoints = ["WP-PIT-FLOOR", "WP-RAMP-B4", "WP-RAMP-B3", "WP-RAMP-B2", "WP-RAMP-B1", "WP-SURFACE-GATE", dest]
            v.target_waypoint_index = 1
        elif v.state == VehicleState.HAULING_LOADED:
            # Arrived at crusher/dump -> dump and return empty
            v.state = VehicleState.HAULING_EMPTY
            v.payload_tonnes = 0.0
            # Route back down into the pit
            v.current_route_waypoints = ["WP-SURFACE-GATE", "WP-RAMP-B1", "WP-RAMP-B2", "WP-RAMP-B3", "WP-RAMP-B4", "WP-PIT-FLOOR"]
            v.target_waypoint_index = 0
            v.position.x = 0.0
            v.position.y = 500.0
            v.position.z = 100.0
