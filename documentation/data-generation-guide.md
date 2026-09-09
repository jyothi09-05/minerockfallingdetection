# MineMind AI — Historical Dataset Generation Guide

## 1. Overview

The MineMind Historical Dataset Generator (`tools/historical_dataset_generator.py`) generates high-volume, realistic time-series data for AI model training, system benchmarking, and safety compliance audits without relying on external cloud APIs.

---

## 2. CLI Usage

```powershell
# Generate 7 days of 5-minute telemetry in CSV format
python tools/historical_dataset_generator.py --days 7 --interval-sec 300 --format csv --output-dir ./export_csv

# Generate 30 days of high-frequency data in all formats (CSV, JSON, SQL)
python tools/historical_dataset_generator.py --days 30 --interval-sec 60 --format all --output-dir ./export_all --seed 1337
```

### Options:
- `--days`: Total time horizon in simulated days (default: 3).
- `--interval-sec`: Sampling resolution in seconds (default: 300s).
- `--format`: Output format: `csv`, `json`, `sql`, or `all`.
- `--output-dir`: Target filesystem destination directory.
- `--seed`: Deterministic integer seed for reproducible datasets.
- `--no-incidents`: Suppress scenario injections for pure baseline data.

---

## 3. Generated Datasets & Schemas

1. **`historical_sensors.csv`**: `timestamp`, `sensor_id`, `code`, `type`, `zone_id`, `value`, `unit`, `status`.
2. **`historical_vehicles.csv`**: `timestamp`, `vehicle_id`, `code`, `type`, `state`, `pos_x`, `pos_y`, `pos_z`, `speed_kmh`, `payload_tonnes`, `fuel_pct`, `engine_temp_c`.
3. **`historical_equipment.csv`**: `timestamp`, `equipment_id`, `code`, `type`, `power_kw`, `bearing_temp_c`, `vibration_mms`, `runtime_hours`, `status`.
4. **`historical_weather.csv`**: `timestamp`, `condition`, `ambient_temp_c`, `humidity_pct`, `rain_rate_mmh`, `wind_kmh`, `road_friction`.
5. **`historical_sensor_readings.sql`**: Direct PostgreSQL `INSERT` statements for database ingestion.
