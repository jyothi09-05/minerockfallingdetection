"""
Local Microclimate & Weather Simulation Engine
Simulates realistic mine site atmospheric physics, microclimates, storm events,
and their direct impacts on haul road friction and pit geotechnical safety.
"""
import math
import random
from minemind_sim.models import (
    WeatherSimState,
    WeatherType,
    SimulationScenario
)


class WeatherSimulationEngine:
    """
    Simulates local surface atmospheric conditions, rain accumulation,
    and road friction dynamics.
    """

    def __init__(self):
        self.state = WeatherSimState(
            condition=WeatherType.CLEAR_SUNNY,
            ambient_temp_c=28.5,
            relative_humidity_pct=42.0,
            rainfall_rate_mmh=0.0,
            wind_speed_kmh=14.0,
            wind_direction_deg=225.0,
            barometric_pressure_hpa=1013.2,
            visibility_meters=15000.0,
            lightning_risk_pct=0.0,
            road_friction_coefficient=0.88,
        )

    def update(self, dt: float, scenario: SimulationScenario = SimulationScenario.NORMAL_OPERATIONS):
        """
        Steps the weather simulator by delta time dt.
        """
        if scenario == SimulationScenario.HEAVY_RAIN_FLOOD:
            self.state.condition = WeatherType.HEAVY_STORM
            self.state.rainfall_rate_mmh = 45.0 + random.random() * 15.0
            self.state.relative_humidity_pct = 98.0
            self.state.wind_speed_kmh = 58.0 + random.random() * 12.0
            self.state.visibility_meters = 1200.0
            self.state.lightning_risk_pct = 85.0
            self.state.road_friction_coefficient = 0.42
            self.state.ambient_temp_c = 19.5
        elif scenario == SimulationScenario.HEATWAVE_FATIGUE:
            self.state.condition = WeatherType.CLEAR_SUNNY
            self.state.ambient_temp_c = 41.5 + random.random() * 2.0
            self.state.relative_humidity_pct = 18.0
            self.state.rainfall_rate_mmh = 0.0
            self.state.road_friction_coefficient = 0.90
            self.state.visibility_meters = 18000.0
        else:
            # Normal background drift
            self.state.condition = WeatherType.CLEAR_SUNNY
            self.state.rainfall_rate_mmh = 0.0
            self.state.relative_humidity_pct = 45.0 + math.sin(random.random()) * 5.0
            self.state.wind_speed_kmh = 12.0 + math.sin(random.random()) * 4.0
            self.state.road_friction_coefficient = 0.88
            self.state.visibility_meters = 15000.0
            self.state.lightning_risk_pct = 2.0
