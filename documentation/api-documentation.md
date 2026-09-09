# MineMind AI — REST API Contract Specifications

All API responses follow a unified JSON envelope:

### Success Response Format:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2026-09-09T06:00:00.000Z"
}
```

### Error Response Format (RFC 7807):
```json
{
  "success": false,
  "status": 404,
  "error": "Not Found",
  "message": "Resource not found with id : 'xyz'",
  "path": "/api/v1/mines/xyz",
  "timestamp": "2026-09-09T06:00:00.000Z"
}
```

---

## Core Endpoint Catalog

### 1. Authentication (`/api/v1/auth`)
- `POST /login`: Authenticate credentials, returns access & refresh tokens.
- `POST /register`: Register user profile.
- `POST /logout`: Invalidate user active sessions.

### 2. User Management (`/api/v1/users`)
- `GET /me`: Authenticated user profile.
- `GET /`: Paginated list of users (`SUPER_ADMIN`, `MINE_ADMIN`).
- `GET /{id}`: Detailed user profile.
- `PUT /{id}`: Update user metadata and roles.
- `DELETE /{id}`: Soft delete user.
- `GET /roles`: All available roles and permissions.

### 3. Mine Sites (`/api/v1/mines`)
- `GET /`: Searchable & paginated mine complexes.
- `GET /{id}`: Single mine complex details.
- `POST /`: Register new mine site.
- `PUT /{id}`: Update mine parameters.
- `DELETE /{id}`: Decommission mine site.
- `GET /stats/summary`: Cross-site operational & safety index.

### 4. Zones & Sectors (`/api/v1/zones`)
- `GET /by-mine/{mineId}`: Zones for a mine.
- `GET /{id}`: Zone details.
- `POST /`: Create functional sector.
- `DELETE /{id}`: Soft delete sector.

### 5. Machinery & Fleet (`/api/v1/equipment`)
- `GET /by-mine/{mineId}`: Equipment fleet for a mine.
- `GET /{id}`: Equipment details.
- `POST /`: Register machinery asset.
- `POST /telemetry`: Ingest equipment diagnostics.
- `GET /{id}/telemetry`: Retrieve recent diagnostics stream.

### 6. Workforce & Roster (`/api/v1/workers`)
- `GET /by-mine/{mineId}`: Personnel directory.
- `GET /{id}`: Worker profile and certifications.
- `POST /`: Register mine personnel.
- `POST /shifts`: Schedule shift roster.

### 7. IoT Sensors & Readings (`/api/v1/sensors`)
- `GET /by-mine/{mineId}`: Atmospheric & geotechnical sensors.
- `GET /{id}`: Sensor details.
- `POST /`: Register sensor.
- `POST /readings`: Ingest high-frequency reading.
- `GET /{id}/readings`: Recent reading history.

### 8. Incidents & Alerts (`/api/v1/incidents`, `/api/v1/alerts`)
- `GET /incidents/by-mine/{mineId}`: Logged HSE incidents.
- `POST /incidents`: Report new incident.
- `GET /alerts/active/{mineId}`: Active unresolved alarms.
- `POST /alerts`: Dispatch safety alert.
- `POST /alerts/{id}/acknowledge`: Acknowledge alarm.
- `POST /alerts/{id}/resolve`: Resolve and archive alarm.

### 9. Audit Trail (`/api/v1/audit-logs`)
- `GET /`: Paginated immutable audit trail.
