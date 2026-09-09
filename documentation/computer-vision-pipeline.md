# MineMind AI — Local Computer Vision Pipeline Specification

## 1. Overview & Offline Edge Architecture

The MineMind Local Computer Vision Platform monitors open-pit camera streams for occupational safety compliance and operational hazards without relying on cloud vision APIs or external network transmission.

```
Local Video File / Synthetic CCTV Stream
                   │
                   ▼
Frame Extractor (1920x1080 @ 10-30 FPS)
                   │
                   ▼
Image Preprocessing & Normalization
                   │
                   ▼
Local Multi-Class Detector
  ├── Class: PERSON
  ├── Class: HAUL_TRUCK
  ├── Class: EXCAVATOR
  ├── Class: HELMET (PPE)
  ├── Class: HIGH_VIS_VEST (PPE)
  └── Class: SMOKE_INDICATOR (Thermal Plume)
                   │
                   ▼
Spatial Safety Rule Engine
  ├── Personnel inside Shovel Swing Radius (<15m)
  ├── Personnel Missing Helmet / High-Vis Vest
  └── Thermal Hotspot / Smoke Plume Detection
                   │
                   ▼
Visual Bounding Boxes + Alert Dispatch
```

---

## 2. Detection Classes & Coordinates

Bounding boxes are represented as normalized floating-point coordinates:
$$[\text{ymin}, \text{xmin}, \text{ymax}, \text{xmax}] \in [0.0, 1.0]^4$$

The frontend renderer maps these normalized bounds to the resolution of the canvas for sub-pixel accuracy overlay rendering.
