#!/usr/bin/env python3
"""
MineMind Historical Mining Dataset Generator CLI
Generates high-fidelity historical time-series datasets for mining digital twins:
- Environmental & Geotechnical Sensors
- Fleet & Vehicle Telemetry
- Heavy Equipment Health Metrics
- Worker Shift Logs & Biometrics
- Site Weather History
- Safety Incidents & Alerts

Supports export to CSV, JSON, and PostgreSQL INSERT scripts.
"""
import argparse
import csv
import json
import os
import random
import sys
from datetime import datetime, timedelta, timezone

# Add parent directory to path for simulation imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "simulation-engine"))
from minemind_sim.core.simulation import MineMindSimulationMaster
from minemind_sim.models import SimulationScenario


def generate_historical_data(
    days: int = 7,
    interval_sec: int = 60,
    output_dir: str = "./data_export",
    export_format: str = "csv",
    seed: int = 42,
    inject_incidents: bool = True
):
    os.makedirs(output_dir, exist_ok=True)
    random.seed(seed)
    
    sim = MineMindSimulationMaster(seed=seed)
    start_time = datetime.now(timezone.utc) - timedelta(days=days)
    total_steps = int((days * 86400) / interval_sec)
    
    print(f"[MineMind Data Gen] Generating {total_steps} historical records ({days} days @ {interval_sec}s interval)...")
    
    sensor_records = []
    vehicle_records = []
    equipment_records = []
    weather_records = []
    incident_records = []

    current_time = start_time
    for step in range(total_steps):
        # Scenario injection for variety
        if inject_incidents and step % (int(86400 / interval_sec) * 2) == int(3600 / interval_sec):
            sim.set_scenario(SimulationScenario.SLOPE_INSTABILITY_WARNING)
        elif inject_incidents and step % (int(86400 / interval_sec) * 4) == int(7200 / interval_sec):
            sim.set_scenario(SimulationScenario.HEAVY_RAIN_FLOOD)
        elif step % int(7200 / interval_sec) == 0:
            sim.set_scenario(SimulationScenario.NORMAL_OPERATIONS)

        snap = sim.tick(base_dt_sec=float(interval_sec))
        ts_str = current_time.isoformat()

        # 1. Sensors
        for s in snap.sensors:
            sensor_records.append({
                "timestamp": ts_str,
                "sensor_id": s.id,
                "code": s.code,
                "type": s.type.value,
                "zone_id": s.zone_id,
                "value": s.current_value,
                "unit": s.unit,
                "status": s.status,
            })

        # 2. Vehicles
        for v in snap.vehicles:
            vehicle_records.append({
                "timestamp": ts_str,
                "vehicle_id": v.id,
                "code": v.code,
                "type": v.type.value,
                "state": v.state.value,
                "pos_x": round(v.position.x, 2),
                "pos_y": round(v.position.y, 2),
                "pos_z": round(v.position.z, 2),
                "speed_kmh": round(v.velocity_ms * 3.6, 1),
                "payload_tonnes": round(v.payload_tonnes, 1),
                "fuel_pct": round(v.fuel_level_percent, 1),
                "engine_temp_c": round(v.engine_temp_c, 1),
            })

        # 3. Equipment
        for eq in snap.equipment:
            equipment_records.append({
                "timestamp": ts_str,
                "equipment_id": eq.id,
                "code": eq.code,
                "type": eq.type.value,
                "power_kw": round(eq.power_draw_kw, 1),
                "bearing_temp_c": round(eq.bearing_temp_c, 1),
                "vibration_mms": round(eq.vibration_amplitude_mms, 2),
                "runtime_hours": round(eq.runtime_hours, 1),
                "status": eq.status,
            })

        # 4. Weather
        weather_records.append({
            "timestamp": ts_str,
            "condition": snap.weather.condition.value,
            "ambient_temp_c": round(snap.weather.ambient_temp_c, 1),
            "humidity_pct": round(snap.weather.relative_humidity_pct, 1),
            "rain_rate_mmh": round(snap.weather.rainfall_rate_mmh, 1),
            "wind_kmh": round(snap.weather.wind_speed_kmh, 1),
            "road_friction": round(snap.weather.road_friction_coefficient, 2),
        })

        current_time += timedelta(seconds=interval_sec)

        if (step + 1) % 500 == 0 or step == total_steps - 1:
            print(f"  Progress: {step + 1}/{total_steps} steps processed ({(step + 1)/total_steps*100:.1f}%)")

    # Export files
    if export_format in ["csv", "all"]:
        _export_csv(os.path.join(output_dir, "historical_sensors.csv"), sensor_records)
        _export_csv(os.path.join(output_dir, "historical_vehicles.csv"), vehicle_records)
        _export_csv(os.path.join(output_dir, "historical_equipment.csv"), equipment_records)
        _export_csv(os.path.join(output_dir, "historical_weather.csv"), weather_records)
        print(f"[MineMind Data Gen] Successfully exported CSV datasets to {output_dir}")

    if export_format in ["json", "all"]:
        with open(os.path.join(output_dir, "historical_sensors.json"), "w") as f:
            json.dump(sensor_records, f, indent=2)
        with open(os.path.join(output_dir, "historical_vehicles.json"), "w") as f:
            json.dump(vehicle_records, f, indent=2)
        with open(os.path.join(output_dir, "historical_equipment.json"), "w") as f:
            json.dump(equipment_records, f, indent=2)
        with open(os.path.join(output_dir, "historical_weather.json"), "w") as f:
            json.dump(weather_records, f, indent=2)
        print(f"[MineMind Data Gen] Successfully exported JSON datasets to {output_dir}")

    if export_format in ["sql", "all"]:
        _export_sql(os.path.join(output_dir, "historical_sensor_readings.sql"), "sensor_readings", sensor_records)
        print(f"[MineMind Data Gen] Successfully exported SQL dataset to {output_dir}")


def _export_csv(filepath: str, data: list):
    if not data:
        return
    with open(filepath, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=data[0].keys())
        writer.writeheader()
        writer.writerows(data)


def _export_sql(filepath: str, table_name: str, data: list):
    if not data:
        return
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(f"-- MineMind Generated Historical Seed for {table_name}\n")
        for row in data:
            cols = ", ".join(row.keys())
            vals = ", ".join(f"'{v}'" if isinstance(v, str) else str(v) for v in row.values())
            f.write(f"INSERT INTO {table_name} ({cols}) VALUES ({vals});\n")


def main():
    parser = argparse.ArgumentParser(description="MineMind Historical Mining Dataset Generator")
    parser.add_argument("--days", type=int, default=3, help="Number of simulated days")
    parser.add_argument("--interval-sec", type=int, default=300, help="Interval between records in seconds")
    parser.add_argument("--output-dir", type=str, default="./generated_data", help="Output directory")
    parser.add_argument("--format", choices=["csv", "json", "sql", "all"], default="csv", help="Export format")
    parser.add_argument("--seed", type=int, default=42, help="Deterministic random seed")
    parser.add_argument("--no-incidents", action="store_true", help="Disable incident scenario injections")

    args = parser.parse_args()
    generate_historical_data(
        days=args.days,
        interval_sec=args.interval_sec,
        output_dir=args.output_dir,
        export_format=args.format,
        seed=args.seed,
        inject_incidents=not args.no_incidents
    )


if __name__ == "__main__":
    main()
