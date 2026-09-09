# MineMind AI — Database Architecture & Schema Documentation

## 1. Design Overview
The MineMind AI database architecture is designed for **PostgreSQL 16** with normalized relational tables, UUID primary keys, foreign key constraints, composite performance indexes, soft deletion flags (`is_deleted`, `deleted_at`), and JSONB metadata columns for flexible telemetry and spatial boundaries.

---

## 2. Table Catalog

### A. Tenancy, Users & Access Control
- `organizations`: Multi-tenant corporate mining enterprise entities.
- `permissions`: Atomic system authorities (e.g. `MINE_READ`, `ASSET_WRITE`, `SAFETY_WRITE`).
- `roles`: Role definitions (`SUPER_ADMIN`, `MINE_ADMIN`, `SAFETY_OFFICER`, etc.).
- `role_permissions`: Join table linking roles to granular permissions.
- `users`: User profiles, BCrypt password hashes, failed login counters, and lockout timestamps.
- `user_roles`: Join table associating users with one or more roles.
- `user_sessions`: Active user sessions and hashed refresh tokens for revocation.
- `security_events`: Security event log recording authentication and authorization attempts.

### B. Mine Hierarchy & Geospatial Infrastructure
- `mines`: Mine complexes with geographic coordinates, surface elevation, and operational status.
- `zones`: Functional operational zones with hazard tiers (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`, `RESTRICTED`) and capacity caps.
- `benches`: Pit bench elevation profiles, slope angles, and stability factors.
- `roads`: Haul roads, ramps, and escape routes with width, gradient, and axle-weight limits.

### C. Workforce & Personnel
- `workers`: Site workers with emergency contact data, blood group, badge ID, and status.
- `worker_certifications`: Skill certifications, issuing authorities, and expiry tracking.
- `shift_assignments`: Shift rosters, scheduled times, and assigned sectors.

### D. Machinery, Fleet & Telemetry
- `equipment`: Heavy machinery asset registry, health score (0-100), operating hours, and maintenance schedules.
- `vehicles`: Dynamic vehicle telemetry details (GPS lat/lon, speed, heading, fuel percentage, payload weight).
- `equipment_telemetry`: Time-series engine diagnostics (oil pressure, hydraulic pressure, vibration, temperature).

### E. IoT Sensors & Edge Cameras
- `sensors`: Atmospheric and geotechnical sensor registry (methane, CO, seismic vibration, slope radar displacement).
- `sensor_readings`: High-frequency sensor readings with automated threshold validation.
- `cameras`: CCTV and thermal PTZ camera streams with edge AI video analytics flags.

### F. Safety Intelligence & Audit Logging
- `incidents`: HSE incidents, severity ratings, injury counts, and root-cause analysis.
- `alerts`: Real-time safety alarms with multi-tier acknowledgment and resolution workflows.
- `audit_logs`: Immutable audit trail recording mutations across all core domain entities.

---

## 3. Database Migrations
Database versioning is managed via **Flyway**:
- `V1__initial_schema.sql`: Full DDL creation with constraints and indexes.
- `V2__seed_data.sql`: Seed data containing demonstration mine ("Prometheus Pit #4"), sectors, heavy machinery, IoT sensors, and default administrative accounts.
