# MineMind AI — Security & Authentication Architecture

## 1. Authentication Subsystem
- **Stateless JWT**: Standard RFC 7519 tokens signed with HMAC-SHA256 (`HS256`).
- **Token Rotation**: 24-hour access tokens paired with 7-day cryptographically hashed refresh tokens stored in `user_sessions`.
- **Password Hashing**: Industry-standard `BCryptPasswordEncoder` with strength factor 10.
- **Brute-Force Lockout**: 5 consecutive failed login attempts automatically lock the account for 15 minutes.

---

## 2. Role-Based & Permission-Based Access Control (RBAC + PBAC)

### Predefined System Roles:
1. `ROLE_SUPER_ADMIN`: Full system governance and tenant setup.
2. `ROLE_MINE_ADMIN`: Site-level administration and asset governance.
3. `ROLE_MINE_MANAGER`: Shift dispatch, haulage supervision, and output targets.
4. `ROLE_SAFETY_OFFICER`: Emergency evacuation dispatch, atmospheric thresholds, and incident investigations.
5. `ROLE_GEOLOGIST`: Geotechnical slope stability and bench integrity oversight.
6. `ROLE_MAINTENANCE_ENGINEER`: Heavy machinery health, telemetry calibration, and repair logging.
7. `ROLE_OPERATOR`: Equipment telemetry and task checklists.
8. `ROLE_WORKER`: Basic site presence and emergency broadcasts.
9. `ROLE_VIEWER`: Read-only observer and ESG audit access.

---

## 3. Auditing & Forensics
Every mutation (`POST`, `PUT`, `DELETE`), login attempt, and privilege change produces an immutable audit record containing:
- Authenticated user ID & username
- Client IP address & User-Agent
- Target resource type and entity ID
- Execution status (`SUCCESS` / `FAILED`)
- Timestamp in UTC
