# MineMind AI — CCTV Intelligence & Mine Surveillance Subsystem

## Overview
The **MineMind CCTV Intelligence & Surveillance Subsystem** provides a local, offline computer vision and spatial monitoring platform for open-pit mining operations. It delivers edge inference for multi-camera video streams, PPE compliance audits, polygonal exclusion zone incursion alarms, heavy fleet proximity warnings, and incident visual telemetry replay without reliance on cloud surveillance services or external APIs.

---

## Subsystem Architecture

```
                  Local Cameras (MP4 / Synthetic Streams / Webcams)
                                         │
                                         ▼
                     ┌───────────────────────────────────────┐
                     │   minemind_cv Pipeline Engine         │
                     │  - Multi-Object Tracking (IoU / Kine) │
                     │  - PPE Classifier (Helmet, High-Vis)  │
                     │  - Point-in-Polygon Geofences         │
                     │  - Proximity Vector Calculation       │
                     │  - Thermal / Smoke Anomaly Detector   │
                     └───────────────────┬───────────────────┘
                                         │
                                         ▼
                     ┌───────────────────────────────────────┐
                     │       FastAPI CCTV Service & Router   │
                     │  - Camera Registry & PTZ Controller   │
                     │  - Real-time Event Logger (500-ring)  │
                     │  - Auto Incident Candidate Trigger    │
                     │  - Incident Chronological Replay      │
                     └───────┬───────────────────────┬───────┘
                             │                       │
                             ▼                       ▼
                     Central Risk Engine       Mining AI Assistant
                             │                       │
                             ▼                       ▼
            Surveillance Center (/surveillance)   Digital Twin 2D/3D
```

---

## Key Capabilities

### 1. Camera Registry & Multi-Zone Coverage
Calibrated camera network spanning active mining zones:
- **`CAM-PIT-01`**: Pit Floor Shovel CAM #01 (`ZONE-PIT-01`) — Shovel swing radius & worker PPE.
- **`CAM-NW-02`**: North Wall Highwall Monitor #02 (`ZONE-NW-01`) — Bench crest buffer & slope dilation.
- **`CAM-RAMP-03`**: Haul Road Main Incline Junction #03 (`ZONE-RAMP-01`) — Switchback blindspot pedestrian safety.
- **`CAM-CRU-04`**: Primary Gyratory Crusher Hopper #04 (`ZONE-CRU-01`) — Hydraulic breaker pinch-points & thermal lube monitoring.
- **`CAM-SUMP-05`**: Pit Sump Dewatering Substation #05 (`ZONE-SUMP-01`) — Substation water level & perimeter defense.
- **`CAM-STOCK-06`**: ROM Stockpile Stacker / Reclaimer #06 (`ZONE-STOCK-01`) — High-grade stockpile walkway inspection.

### 2. Multi-Object Tracking & Velocity Estimation
- Stateful tracking assigns persistent `track_id` across consecutive frames.
- Velocity vectors $[v_x, v_y]$ and speed in meters/second are calculated to trace entity movement trajectories.
- Worker-to-machinery proximity analyzer evaluates safety danger envelopes ($<14\text{m}$).

### 3. Polygonal Virtual Safety Zones
- Ray-casting point-in-polygon algorithm checks object foot coordinates $(x, y_{max})$ against polygon boundaries.
- Immediate trigger of `RESTRICTED_ZONE_ENTRY` events upon perimeter breach.

### 4. Automated Incident Creation
- Critical surveillance breaches (`RESTRICTED_ZONE_ENTRY`, `SMOKE_DETECTED`, `FIRE_INDICATION`) automatically generate incident tickets into the 7-stage Incident Management System.

### 5. Surveillance Center UI (`/surveillance`)
- **Matrix View**: 1x1 Focused, 2x2 Quad, and 3x2 Grid matrix.
- **Live Canvas**: Canvas-rendered real-time simulation with bounding box tags, geofences, velocities, and trajectory lines.
- **PTZ Controls**: Pan, tilt, zoom, and center reset.
- **Simulation Injections**: Instant injection of PPE violations, zone breaches, and smoke plumes.
- **Visual Replay**: Chronological frame slider for incident investigation.

---

## API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/v1/cctv/cameras` | GET | List all registered cameras with health & PTZ status |
| `/api/v1/cctv/cameras/{id}` | GET | Get detailed camera metadata |
| `/api/v1/cctv/cameras/{id}/ptz` | POST | Update pan, tilt, and zoom |
| `/api/v1/cctv/cameras/{id}/frame` | GET | Run offline CV inference on current frame |
| `/api/v1/cctv/events` | GET | Query event timeline with severity filters |
| `/api/v1/cctv/events` | POST | Ingest surveillance event |
| `/api/v1/cctv/health` | GET | Global camera network health summary |
| `/api/v1/cctv/zones` | GET | List active polygonal virtual safety zones |
| `/api/v1/cctv/replays/{id}` | GET | Fetch frame sequence & bounding box replay |
