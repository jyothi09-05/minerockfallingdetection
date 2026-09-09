# MineMind AI — Digital Twin Architecture Specification

## 1. Architectural Overview

The MineMind Digital Twin provides a real-time, synchronized virtual representation of the physical open-pit mining asset, capturing topography, bench levels, haulage networks, autonomous and manned machinery, IoT sensors, workforce locations, and microclimatic states.

```
                           ┌─────────────────────────────────────────┐
                           │      Digital Twin Presentation Layer    │
                           │  - 2D Canvas Tactical Map (Vector/HUD)  │
                           │  - 3D WebGL Open-Pit (Three.js Mesh)    │
                           └────────────────────┬────────────────────┘
                                                │
                           ┌────────────────────┴────────────────────┐
                           │      Digital Twin State Synchronization │
                           │  - Real-time Entity Graph (Graph Model) │
                           │  - Kinematic Interpolator (60 FPS)      │
                           │  - Raycasting & Spatial Hit-Testing     │
                           └────────────────────┬────────────────────┘
                                                │
                           ┌────────────────────┴────────────────────┐
                           │     Unified Domain State Envelope       │
                           │  - Terrain: Benches, Ramps, Strata      │
                           │  - Assets: Vehicles, Fixed Plant        │
                           │  - Telemetry: Gas, Radar, Geotech, Temp │
                           │  - Workforce: Biometrics, Roster, Zones │
                           └─────────────────────────────────────────┘
```

---

## 2. 2D Tactical Viewport Engine (`MineCanvas2D`)
- **Rendering Technology**: High-performance HTML5 2D Canvas with sub-pixel double buffering.
- **Features**:
  - Continuous pan and zoom matrix transformations ($T(x,y) \cdot S$).
  - Dynamic bench contour rendering with elevation strata fills.
  - Directional vehicle glyphs with heading orientation ($\theta$), velocity vectors, and payload status halos.
  - Multi-layer toggle filters (Benches, Roads, Sensors, Vehicles, Workers, Hazard Heatmaps).
  - Ray-to-object distance hit-testing within canvas pixel coordinates.

---

## 3. 3D WebGL Digital Twin Engine (`MineScene3D`)
- **Rendering Technology**: Three.js WebGL with custom procedural `BufferGeometry`.
- **Features**:
  - Procedural vertex height manipulation modeling terraced bench faces (15–18m bench steps) and conical pit geometry.
  - Stratigraphic vertex color blending corresponding to geological ore layers (overburden, weathered sandstone, hematite ore band, footwall quartzite).
  - Dynamic sun lighting with soft shadow mapping and configurable time-of-day shadow angles.
  - 3D vehicle primitives with haul beds, wheels, and excavator boom kinematics.
  - Atmospheric weather particle systems simulating rainfall streaks and wind dust drift.
  - Orbit camera navigation with orbital spherical coordinates ($r, \theta, \phi$).
