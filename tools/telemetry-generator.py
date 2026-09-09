#!/usr/bin/env python3
"""
MineMind AI — Synthetic Telemetry & Fleet Stream Generator
Simulates real-time IoT sensors (Methane, Carbon Monoxide, Seismic, Water Level)
and Haul Truck GPS / Telemetry updates.
"""
import time
import json
import random
import sys
from datetime import datetime, timezone

SENSORS = [
    {"code": "SNS-GAS-CH4-01", "type": "METHANE_GAS", "base": 42.0, "jitter": 3.0, "unit": "PPM"},
    {"code": "SNS-SLOPE-RAD-01", "type": "SLOPE_RADAR_DISPLACEMENT", "base": 1.8, "jitter": 0.2, "unit": "MM"},
    {"code": "SNS-VIB-CRUSH-01", "type": "SEISMIC_VIBRATION", "base": 4.2, "jitter": 0.8, "unit": "MM_S"},
    {"code": "SNS-DAM-PIEZ-01", "type": "WATER_LEVEL", "base": 14200.0, "jitter": 15.0, "unit": "MM"}
]

VEHICLES = [
    {"id": "veh-01", "equipment_tag": "EQ-TRK-101", "base_lat": -21.4540, "base_lon": 119.8220},
    {"id": "veh-02", "equipment_tag": "EQ-TRK-102", "base_lat": -21.4530, "base_lon": 119.8210}
]

def generate_telemetry_batch():
    now_iso = datetime.now(timezone.utc).isoformat()
    readings = []
    for s in SENSORS:
        val = round(s["base"] + random.uniform(-s["jitter"], s["jitter"]), 2)
        readings.append({
            "sensor_code": s["code"],
            "type": s["type"],
            "value": val,
            "unit": s["unit"],
            "timestamp": now_iso,
            "status": "NORMAL" if val < s["base"] * 1.5 else "WARNING"
        })
    
    fleet = []
    for v in VEHICLES:
        fleet.append({
            "vehicle_id": v["id"],
            "equipment_tag": v["equipment_tag"],
            "latitude": round(v["base_lat"] + random.uniform(-0.0005, 0.0005), 6),
            "longitude": round(v["base_lon"] + random.uniform(-0.0005, 0.0005), 6),
            "speed_kmh": round(random.uniform(20.0, 48.0), 1),
            "heading": random.randint(0, 360),
            "fuel_percent": round(random.uniform(60.0, 95.0), 1),
            "timestamp": now_iso
        })
    
    return {"timestamp": now_iso, "sensors": readings, "fleet": fleet}

if __name__ == "__main__":
    print("🚀 MineMind AI — Telemetry Stream Generator started (Press Ctrl+C to stop)...")
    try:
        while True:
            batch = generate_telemetry_batch()
            print(f"[{batch['timestamp']}] Generated {len(batch['sensors'])} sensor readings & {len(batch['fleet'])} vehicle states.")
            time.sleep(2)
    except KeyboardInterrupt:
        print("\n🛑 Telemetry generator stopped.")
