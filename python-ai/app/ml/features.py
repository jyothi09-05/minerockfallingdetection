"""
MineMind AI - Feature Engineering Hub
Extracts domain-specific features from raw mining telemetry:
- Geotechnical velocity gradients & displacement accelerations
- Kinematic vectors, relative bearings, and Time-To-Collision (TTC)
- Vibration harmonics, peak-to-peak amplitude, and RMS velocity
- Heat index and physiological worker strain
"""
import math
from typing import List, Dict, Any, Tuple


class FeatureExtractor:
    """Mathematical and statistical feature engineering utilities."""

    @staticmethod
    def calculate_displacement_acceleration(displacements: List[float], time_intervals_sec: List[float]) -> Tuple[float, float]:
        """
        Calculates current displacement velocity (mm/day) and acceleration (mm/day^2)
        from a series of displacement radar readings.
        """
        if len(displacements) < 2 or len(time_intervals_sec) < 1:
            return 0.0, 0.0

        # Velocity in mm/day
        dt_days = sum(time_intervals_sec[-1:]) / 86400.0
        if dt_days <= 0:
            return 0.0, 0.0

        v1 = (displacements[-1] - displacements[-2]) / dt_days
        
        if len(displacements) >= 3 and len(time_intervals_sec) >= 2:
            dt_days_prev = sum(time_intervals_sec[-2:-1]) / 86400.0
            v0 = (displacements[-2] - displacements[-3]) / (dt_days_prev if dt_days_prev > 0 else dt_days)
            accel = (v1 - v0) / dt_days
        else:
            accel = 0.0

        return round(v1, 3), round(accel, 3)

    @staticmethod
    def calculate_kinematic_ttc(
        pos_a: Tuple[float, float, float],
        vel_a: Tuple[float, float, float],
        pos_b: Tuple[float, float, float],
        vel_b: Tuple[float, float, float]
    ) -> Tuple[float, float, float]:
        """
        Calculates 3D Euclidean distance (m), relative closing velocity (m/s),
        and Time-To-Collision (TTC in seconds) between two vehicles.
        """
        dx = pos_b[0] - pos_a[0]
        dy = pos_b[1] - pos_a[1]
        dz = pos_b[2] - pos_a[2]
        distance = math.sqrt(dx * dx + dy * dy + dz * dz)

        # Relative velocity vector (V_rel = V_a - V_b)
        dvx = vel_a[0] - vel_b[0]
        dvy = vel_a[1] - vel_b[1]
        dvz = vel_a[2] - vel_b[2]

        # Closing velocity is projection of relative velocity along distance vector
        if distance > 1e-4:
            closing_vel = (dx * dvx + dy * dvy + dz * dvz) / distance
        else:
            closing_vel = 0.0

        # Time-to-collision
        if closing_vel > 0.1:
            ttc = distance / closing_vel
        else:
            ttc = 999.0  # Diverging or stationary

        return round(distance, 2), round(closing_vel, 2), round(ttc, 2)

    @staticmethod
    def calculate_vibration_rms(vibration_samples: List[float]) -> float:
        """Calculates Root-Mean-Square (RMS) vibration velocity."""
        if not vibration_samples:
            return 0.0
        sq_sum = sum(x * x for x in vibration_samples)
        return round(math.sqrt(sq_sum / len(vibration_samples)), 3)

    @staticmethod
    def calculate_heat_strain_index(temp_c: float, humidity_pct: float) -> float:
        """
        Calculates ambient heat strain index (0.0 to 1.0) using simplified Rothfusz equation.
        """
        # Simplified heat index approximation
        hi = temp_c + 0.5555 * (6.11 * math.exp(5417.7530 * (1/273.16 - 1/(273.15 + temp_c))) * (humidity_pct / 100.0) - 10)
        # Normalize: 25C = 0.0, 50C = 1.0
        normalized = (hi - 25.0) / 25.0
        return round(max(0.0, min(1.0, normalized)), 3)
