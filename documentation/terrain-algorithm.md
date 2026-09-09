# MineMind AI — Procedural Terrain Generation Algorithm

## 1. Algorithmic Overview

The MineMind procedural terrain engine synthesizes realistic, deterministic 3D open-pit topography from an integer seed without external GIS dependencies.

---

## 2. Mathematical Synthesis Pipeline

```
Seed (Integer)
     │
     ▼
Trigonometric Harmonic Gradient Noise (Background Topography)
     │
     ▼
Conical Pit Profile Transformation (Radial Distance from Center)
     │
     ▼
Concentric Terraced Bench Quantization (Stepped Faces & Catch Berms)
     │
     ▼
Ramp & Haul Road Grade Carving (Spiral Incline Paths)
     │
     ▼
Stratigraphic Ore Layer Mapping (Geological Hardness & Color)
```

### 2.1 Multi-Octave Harmonic Gradient Noise
$$\text{Noise}(x, z) = \frac{\sin(\omega_1 x + \phi_x) \cdot \cos(\omega_1 z + \phi_z) + 0.5 \sin(1.7 \omega_1 x + 0.9 \omega_1 z) + 0.25 \cos(0.4 \omega_1 x - 1.3 \omega_1 z)}{1.75}$$
where phase offsets $\phi_x = \text{seed} \cdot 0.173$ and $\phi_z = \text{seed} \cdot 0.289$.

### 2.2 Radial Open-Pit Conical Profile
For normalized distance from pit center $r = \frac{\sqrt{(x - x_c)^2 + (z - z_c)^2}}{R_{\text{max}}}$:
$$\text{Depth}_{\text{raw}}(r) = (1 - r^{1.2}) \cdot \text{Depth}_{\text{pit}} \quad (\text{for } r < 1)$$

### 2.3 Terraced Bench Quantization
$$\text{BenchIndex} = \left\lfloor \frac{\text{Depth}_{\text{raw}}}{H_{\text{bench}}} \right\rfloor$$
$$\text{Fraction} = \frac{\text{Depth}_{\text{raw}} \pmod{H_{\text{bench}}}}{H_{\text{bench}}}$$
$$\text{Depth}_{\text{stepped}} = \text{BenchIndex} \cdot H_{\text{bench}} + \text{Fraction}^{3.5} \cdot H_{\text{bench}}$$

This power exponent ($3.5$) creates realistic near-vertical bench face slopes ($65^\circ–75^\circ$) followed by horizontal catch berm steps ($20–25\text{m}$ width).

---

## 3. Seed Determinism Guarantees
Identical seeds produce bitwise-identical heightmaps, bench geometries, geological layer depth allocations, and waypoint positions across Python, Java, and TypeScript platforms.
