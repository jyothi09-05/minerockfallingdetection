"""
Procedural Terrain Generator for Open-Pit Mining Digital Twin
Generates deterministic 3D open-pit mine terrain from an integer seed,
including stepped concentric benches, haul ramps, ore bodies, geological strata,
and an interconnected road graph network.
"""
import math
import random
from typing import List, Tuple, Dict, Any
from minemind_sim.models import (
    TerrainMetadata,
    BenchDefinition,
    RoadSegment,
    RoadWaypoint,
    GeologicalLayer,
    Position3D
)


class ProceduralTerrainGenerator:
    """
    Deterministic open-pit mine terrain generator using multi-frequency
    gradient synthesis and mathematical pit terracing.
    """

    def __init__(
        self,
        seed: int = 42,
        grid_width: int = 64,
        grid_height: int = 64,
        cell_size_m: float = 25.0,
        bench_count: int = 6,
        bench_height_m: float = 15.0,
        surface_elevation_m: float = 500.0,
    ):
        self.seed = seed
        self.grid_width = grid_width
        self.grid_height = grid_height
        self.cell_size_m = cell_size_m
        self.bench_count = bench_count
        self.bench_height_m = bench_height_m
        self.surface_elevation_m = surface_elevation_m
        self.rng = random.Random(seed)

    def _pseudo_noise_2d(self, x: float, y: float, freq: float) -> float:
        """Deterministic 2D trigonometric harmonic noise."""
        sx = x * freq + self.seed * 0.173
        sy = y * freq + self.seed * 0.289
        n1 = math.sin(sx) * math.cos(sy)
        n2 = math.sin(sx * 1.7 + sy * 0.9) * 0.5
        n3 = math.cos(sx * 0.4 - sy * 1.3) * 0.25
        return (n1 + n2 + n3) / 1.75

    def generate_heightmap(self) -> List[List[float]]:
        """
        Generates the 2D grid matrix of elevations representing an open-pit mine
        with surrounding hills, stepped conical pit walls, and flat floor.
        """
        center_x = (self.grid_width - 1) / 2.0
        center_y = (self.grid_height - 1) / 2.0
        max_radius = min(center_x, center_y) * 0.85
        pit_depth = self.bench_count * self.bench_height_m

        matrix: List[List[float]] = []

        for r in range(self.grid_height):
            row: List[float] = []
            for c in range(self.grid_width):
                # Normalized coordinate from center
                dx = (c - center_x)
                dy = (r - center_y)
                dist = math.sqrt(dx * dx + dy * dy)
                norm_dist = dist / max_radius

                # Natural background terrain noise
                bg_noise = self._pseudo_noise_2d(c, r, 0.08) * 18.0
                fine_noise = self._pseudo_noise_2d(c, r, 0.25) * 4.0
                elevation = self.surface_elevation_m + bg_noise + fine_noise

                if norm_dist < 1.0:
                    # Inside the pit cone
                    # Smooth pit profile (0 at center, 1 at rim)
                    pit_factor = math.pow(norm_dist, 1.2)
                    raw_depth = (1.0 - pit_factor) * pit_depth

                    # Stepping for benches (terracing)
                    bench_index = math.floor(raw_depth / self.bench_height_m)
                    bench_index = min(max(bench_index, 0), self.bench_count - 1)
                    
                    fraction_in_bench = (raw_depth % self.bench_height_m) / self.bench_height_m
                    # Steep face vs flat bench step
                    stepped_depth = bench_index * self.bench_height_m + math.pow(fraction_in_bench, 3.5) * self.bench_height_m
                    
                    elevation -= stepped_depth

                row.append(round(elevation, 2))
            matrix.append(row)

        return matrix

    def generate_geological_layers(self) -> List[GeologicalLayer]:
        """Generates realistic stratigraphic geological layers based on seed."""
        return [
            GeologicalLayer(
                name="Topsoil & Weathered Overburden",
                code="OB-01",
                depth_start_m=0.0,
                depth_end_m=12.0,
                color_hex="#8B5A2B",
                hardness_mohs=2.5,
                stability_rating=0.88,
            ),
            GeologicalLayer(
                name="Weathered Sandstone & Siltstone",
                code="SS-02",
                depth_start_m=12.0,
                depth_end_m=35.0,
                color_hex="#D2B48C",
                hardness_mohs=4.2,
                stability_rating=0.92,
            ),
            GeologicalLayer(
                name="High-Grade Iron Ore / Hematite Band",
                code="ORE-HG",
                depth_start_m=35.0,
                depth_end_m=65.0,
                color_hex="#800000",
                hardness_mohs=6.0,
                stability_rating=0.95,
            ),
            GeologicalLayer(
                name="Quartzite & Basalt Footwall",
                code="QZ-04",
                depth_start_m=65.0,
                depth_end_m=120.0,
                color_hex="#708090",
                hardness_mohs=7.0,
                stability_rating=0.98,
            ),
        ]

    def generate_benches(self) -> List[BenchDefinition]:
        """Generates formal bench structures."""
        benches: List[BenchDefinition] = []
        for i in range(self.bench_count):
            elev = self.surface_elevation_m - (i * self.bench_height_m)
            benches.append(
                BenchDefinition(
                    bench_id=f"BENCH-{100 + i * 15}",
                    name=f"Bench Level {elev:.0f}m",
                    level_index=i + 1,
                    elevation_m=elev,
                    height_m=self.bench_height_m,
                    width_m=20.0 + (i * 2.5),
                    safety_berm_height_m=2.2,
                    face_angle_deg=65.0,
                    status="ACTIVE" if i < self.bench_count - 1 else "DEVELOPMENT",
                    risk_score=0.05 + (i * 0.04),
                )
            )
        return benches

    def generate_road_network(self) -> Tuple[List[RoadWaypoint], List[RoadSegment]]:
        """Generates waypoints and connecting road segments."""
        waypoints = [
            RoadWaypoint(id="WP-CRUSHER", name="Primary Gyratory Crusher", position=Position3D(x=120.0, y=self.surface_elevation_m + 2.0, z=140.0), type="CRUSHER"),
            RoadWaypoint(id="WP-DUMP-NORTH", name="North Waste Rock Dump", position=Position3D(x=-180.0, y=self.surface_elevation_m + 5.0, z=160.0), type="DUMP_POINT"),
            RoadWaypoint(id="WP-MAINT", name="Heavy Maintenance Workshop", position=Position3D(x=200.0, y=self.surface_elevation_m, z=-150.0), type="MAINTENANCE_YARD"),
            RoadWaypoint(id="WP-SURFACE-GATE", name="Pit Entry Ramp Gate", position=Position3D(x=0.0, y=self.surface_elevation_m, z=100.0), type="INTERSECTION"),
            RoadWaypoint(id="WP-RAMP-B1", name="Ramp Level 1 (485m)", position=Position3D(x=70.0, y=self.surface_elevation_m - 15.0, z=60.0), type="INTERSECTION"),
            RoadWaypoint(id="WP-RAMP-B2", name="Ramp Level 2 (470m)", position=Position3D(x=90.0, y=self.surface_elevation_m - 30.0, z=-30.0), type="INTERSECTION"),
            RoadWaypoint(id="WP-RAMP-B3", name="Ramp Level 3 (455m)", position=Position3D(x=20.0, y=self.surface_elevation_m - 45.0, z=-80.0), type="INTERSECTION"),
            RoadWaypoint(id="WP-RAMP-B4", name="Ramp Level 4 (440m)", position=Position3D(x=-60.0, y=self.surface_elevation_m - 60.0, z=-50.0), type="INTERSECTION"),
            RoadWaypoint(id="WP-PIT-FLOOR", name="Pit Bottom Load Face (410m)", position=Position3D(x=-20.0, y=self.surface_elevation_m - 90.0, z=10.0), type="LOADING_POINT"),
            RoadWaypoint(id="WP-BENCH-BLAST-3", name="West Blast Bench Face", position=Position3D(x=-80.0, y=self.surface_elevation_m - 45.0, z=40.0), type="LOADING_POINT"),
        ]

        roads = [
            RoadSegment(id="ROAD-01", name="Main Surface Arterial", start_waypoint_id="WP-SURFACE-GATE", end_waypoint_id="WP-CRUSHER", length_m=140.0, grade_percent=1.5, width_m=35.0, speed_limit_kmh=45.0),
            RoadSegment(id="ROAD-02", name="Waste Dump Access Haulway", start_waypoint_id="WP-SURFACE-GATE", end_waypoint_id="WP-DUMP-NORTH", length_m=190.0, grade_percent=2.5, width_m=35.0, speed_limit_kmh=40.0),
            RoadSegment(id="ROAD-03", name="Shop Linkway", start_waypoint_id="WP-SURFACE-GATE", end_waypoint_id="WP-MAINT", length_m=260.0, grade_percent=1.0, width_m=30.0, speed_limit_kmh=35.0),
            RoadSegment(id="ROAD-04", name="In-Pit Spiral Ramp 1", start_waypoint_id="WP-SURFACE-GATE", end_waypoint_id="WP-RAMP-B1", length_m=110.0, grade_percent=9.5, width_m=32.0, speed_limit_kmh=30.0),
            RoadSegment(id="ROAD-05", name="In-Pit Spiral Ramp 2", start_waypoint_id="WP-RAMP-B1", end_waypoint_id="WP-RAMP-B2", length_m=125.0, grade_percent=10.0, width_m=30.0, speed_limit_kmh=25.0),
            RoadSegment(id="ROAD-06", name="In-Pit Spiral Ramp 3", start_waypoint_id="WP-RAMP-B2", end_waypoint_id="WP-RAMP-B3", length_m=130.0, grade_percent=9.8, width_m=30.0, speed_limit_kmh=25.0),
            RoadSegment(id="ROAD-07", name="In-Pit Spiral Ramp 4", start_waypoint_id="WP-RAMP-B3", end_waypoint_id="WP-RAMP-B4", length_m=120.0, grade_percent=10.2, width_m=28.0, speed_limit_kmh=20.0),
            RoadSegment(id="ROAD-08", name="Pit Floor Connector", start_waypoint_id="WP-RAMP-B4", end_waypoint_id="WP-PIT-FLOOR", length_m=95.0, grade_percent=8.5, width_m=28.0, speed_limit_kmh=20.0),
            RoadSegment(id="ROAD-09", name="Bench 3 Shovel Spur", start_waypoint_id="WP-RAMP-B3", end_waypoint_id="WP-BENCH-BLAST-3", length_m=140.0, grade_percent=2.0, width_m=26.0, speed_limit_kmh=25.0),
        ]

        return waypoints, roads

    def generate_full_terrain(self, include_matrix: bool = True) -> TerrainMetadata:
        """Executes the complete deterministic terrain pipeline."""
        heightmap = self.generate_heightmap()
        min_elev = min(min(row) for row in heightmap)
        max_elev = max(max(row) for row in heightmap)
        waypoints, roads = self.generate_road_network()

        return TerrainMetadata(
            seed=self.seed,
            grid_width=self.grid_width,
            grid_height=self.grid_height,
            cell_size_m=self.cell_size_m,
            min_elevation_m=min_elev,
            max_elevation_m=max_elev,
            pit_depth_m=self.bench_count * self.bench_height_m,
            bench_count=self.bench_count,
            benches=self.generate_benches(),
            roads=roads,
            waypoints=waypoints,
            geological_layers=self.generate_geological_layers(),
            heightmap_matrix=heightmap if include_matrix else None,
        )
