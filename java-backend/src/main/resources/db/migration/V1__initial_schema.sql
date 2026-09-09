-- Copy of schema for Flyway Migration V1
-- Enable UUID extension if available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. ORGANIZATIONS & TENANCY
-- ==============================================================================
CREATE TABLE IF NOT EXISTS organizations (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(64) NOT NULL UNIQUE,
    description TEXT,
    country VARCHAR(100),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    settings JSONB DEFAULT '{}'::jsonb,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36)
);

CREATE INDEX IF NOT EXISTS idx_orgs_code ON organizations(code);
CREATE INDEX IF NOT EXISTS idx_orgs_status ON organizations(status);

-- ==============================================================================
-- 2. AUTHENTICATION & ACCESS CONTROL (RBAC & PBAC)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS permissions (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    module VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS roles (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    is_system_role BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS role_permissions (
    role_id VARCHAR(36) NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id VARCHAR(36) NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    organization_id VARCHAR(36) REFERENCES organizations(id) ON DELETE SET NULL,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(50),
    job_title VARCHAR(100),
    department VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    failed_login_attempts INT NOT NULL DEFAULT 0,
    lockout_until TIMESTAMP WITH TIME ZONE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    last_login_ip VARCHAR(50),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36)
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_org ON users(organization_id);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

CREATE TABLE IF NOT EXISTS user_roles (
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id VARCHAR(36) NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    assigned_by VARCHAR(36),
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE IF NOT EXISTS user_sessions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token_hash VARCHAR(255) NOT NULL UNIQUE,
    ip_address VARCHAR(50),
    user_agent TEXT,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_revoked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_accessed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(refresh_token_hash);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON user_sessions(user_id);

CREATE TABLE IF NOT EXISTS security_events (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    event_type VARCHAR(100) NOT NULL,
    ip_address VARCHAR(50),
    user_agent TEXT,
    status VARCHAR(50) NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sec_events_type ON security_events(event_type);
CREATE INDEX IF NOT EXISTS idx_sec_events_user ON security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_sec_events_time ON security_events(created_at DESC);

-- ==============================================================================
-- 3. MINE SPATIAL & HIERARCHY STRUCTURE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS mines (
    id VARCHAR(36) PRIMARY KEY,
    organization_id VARCHAR(36) NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(64) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL,
    commodity VARCHAR(100) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    elevation_meters DOUBLE PRECISION DEFAULT 0.0,
    total_area_hectares DOUBLE PRECISION DEFAULT 0.0,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    country VARCHAR(100) NOT NULL,
    state_province VARCHAR(100),
    timezone VARCHAR(50) NOT NULL DEFAULT 'UTC',
    metadata JSONB DEFAULT '{}'::jsonb,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36)
);

CREATE INDEX IF NOT EXISTS idx_mines_code ON mines(code);
CREATE INDEX IF NOT EXISTS idx_mines_org ON mines(organization_id);
CREATE INDEX IF NOT EXISTS idx_mines_status ON mines(status);

CREATE TABLE IF NOT EXISTS zones (
    id VARCHAR(36) PRIMARY KEY,
    mine_id VARCHAR(36) NOT NULL REFERENCES mines(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(64) NOT NULL,
    zone_type VARCHAR(50) NOT NULL,
    hazard_level VARCHAR(50) NOT NULL DEFAULT 'LOW',
    max_personnel_capacity INT DEFAULT 50,
    max_vehicle_capacity INT DEFAULT 20,
    boundary_coordinates JSONB,
    elevation_range_min DOUBLE PRECISION,
    elevation_range_max DOUBLE PRECISION,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    metadata JSONB DEFAULT '{}'::jsonb,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    UNIQUE(mine_id, code)
);

CREATE INDEX IF NOT EXISTS idx_zones_mine ON zones(mine_id);
CREATE INDEX IF NOT EXISTS idx_zones_type ON zones(zone_type);
CREATE INDEX IF NOT EXISTS idx_zones_hazard ON zones(hazard_level);

CREATE TABLE IF NOT EXISTS benches (
    id VARCHAR(36) PRIMARY KEY,
    zone_id VARCHAR(36) NOT NULL REFERENCES zones(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    bench_number INT NOT NULL,
    elevation_meters DOUBLE PRECISION NOT NULL,
    height_meters DOUBLE PRECISION NOT NULL DEFAULT 15.0,
    width_meters DOUBLE PRECISION NOT NULL DEFAULT 30.0,
    slope_angle_degrees DOUBLE PRECISION NOT NULL DEFAULT 65.0,
    stability_factor DOUBLE PRECISION NOT NULL DEFAULT 1.5,
    status VARCHAR(50) NOT NULL DEFAULT 'OPERATIONAL',
    metadata JSONB DEFAULT '{}'::jsonb,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36)
);

CREATE INDEX IF NOT EXISTS idx_benches_zone ON benches(zone_id);

CREATE TABLE IF NOT EXISTS roads (
    id VARCHAR(36) PRIMARY KEY,
    mine_id VARCHAR(36) NOT NULL REFERENCES mines(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(64) NOT NULL,
    road_type VARCHAR(50) NOT NULL,
    surface_type VARCHAR(50) NOT NULL DEFAULT 'GRAVEL',
    length_meters DOUBLE PRECISION NOT NULL,
    average_width_meters DOUBLE PRECISION NOT NULL DEFAULT 25.0,
    max_gradient_percent DOUBLE PRECISION NOT NULL DEFAULT 8.0,
    speed_limit_kmh INT NOT NULL DEFAULT 40,
    max_weight_capacity_tonnes DOUBLE PRECISION NOT NULL DEFAULT 400.0,
    status VARCHAR(50) NOT NULL DEFAULT 'OPEN',
    metadata JSONB DEFAULT '{}'::jsonb,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36)
);

CREATE INDEX IF NOT EXISTS idx_roads_mine ON roads(mine_id);

-- ==============================================================================
-- 4. WORKFORCE & SAFETY
-- ==============================================================================
CREATE TABLE IF NOT EXISTS workers (
    id VARCHAR(36) PRIMARY KEY,
    organization_id VARCHAR(36) NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
    user_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    assigned_mine_id VARCHAR(36) REFERENCES mines(id) ON DELETE SET NULL,
    current_zone_id VARCHAR(36) REFERENCES zones(id) ON DELETE SET NULL,
    badge_number VARCHAR(64) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,
    blood_group VARCHAR(10),
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(50),
    medical_clearance_status VARCHAR(50) NOT NULL DEFAULT 'VALID',
    status VARCHAR(50) NOT NULL DEFAULT 'OFF_DUTY',
    rfid_tag_id VARCHAR(100),
    metadata JSONB DEFAULT '{}'::jsonb,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36)
);

CREATE INDEX IF NOT EXISTS idx_workers_badge ON workers(badge_number);
CREATE INDEX IF NOT EXISTS idx_workers_mine ON workers(assigned_mine_id);
CREATE INDEX IF NOT EXISTS idx_workers_zone ON workers(current_zone_id);
CREATE INDEX IF NOT EXISTS idx_workers_status ON workers(status);

CREATE TABLE IF NOT EXISTS worker_certifications (
    id VARCHAR(36) PRIMARY KEY,
    worker_id VARCHAR(36) NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
    certification_name VARCHAR(255) NOT NULL,
    certificate_number VARCHAR(100),
    issuing_authority VARCHAR(255),
    issued_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_worker_certs_worker ON worker_certifications(worker_id);

CREATE TABLE IF NOT EXISTS shift_assignments (
    id VARCHAR(36) PRIMARY KEY,
    worker_id VARCHAR(36) NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
    mine_id VARCHAR(36) NOT NULL REFERENCES mines(id) ON DELETE CASCADE,
    zone_id VARCHAR(36) REFERENCES zones(id) ON DELETE SET NULL,
    shift_name VARCHAR(50) NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'SCHEDULED',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_shifts_worker ON shift_assignments(worker_id);
CREATE INDEX IF NOT EXISTS idx_shifts_mine ON shift_assignments(mine_id);

-- ==============================================================================
-- 5. FLEET, EQUIPMENT & ASSET MANAGEMENT
-- ==============================================================================
CREATE TABLE IF NOT EXISTS equipment (
    id VARCHAR(36) PRIMARY KEY,
    mine_id VARCHAR(36) NOT NULL REFERENCES mines(id) ON DELETE RESTRICT,
    current_zone_id VARCHAR(36) REFERENCES zones(id) ON DELETE SET NULL,
    asset_tag VARCHAR(64) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    model_number VARCHAR(100),
    serial_number VARCHAR(100),
    manufacturer VARCHAR(100),
    manufacture_year INT,
    capacity_tonnes DOUBLE PRECISION,
    engine_power_kw DOUBLE PRECISION,
    fuel_capacity_liters DOUBLE PRECISION,
    status VARCHAR(50) NOT NULL DEFAULT 'OPERATIONAL',
    health_score INT NOT NULL DEFAULT 100,
    operating_hours DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    last_maintenance_date TIMESTAMP WITH TIME ZONE,
    next_maintenance_due TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'::jsonb,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36)
);

CREATE INDEX IF NOT EXISTS idx_equipment_tag ON equipment(asset_tag);
CREATE INDEX IF NOT EXISTS idx_equipment_mine ON equipment(mine_id);
CREATE INDEX IF NOT EXISTS idx_equipment_type ON equipment(type);
CREATE INDEX IF NOT EXISTS idx_equipment_status ON equipment(status);

CREATE TABLE IF NOT EXISTS vehicles (
    id VARCHAR(36) PRIMARY KEY,
    equipment_id VARCHAR(36) UNIQUE REFERENCES equipment(id) ON DELETE CASCADE,
    license_plate VARCHAR(50),
    fuel_type VARCHAR(50) NOT NULL DEFAULT 'DIESEL',
    current_fuel_level_percent DOUBLE PRECISION DEFAULT 100.0,
    current_speed_kmh DOUBLE PRECISION DEFAULT 0.0,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    heading_degrees DOUBLE PRECISION DEFAULT 0.0,
    assigned_driver_id VARCHAR(36) REFERENCES workers(id) ON DELETE SET NULL,
    payload_weight_tonnes DOUBLE PRECISION DEFAULT 0.0,
    odometer_km DOUBLE PRECISION DEFAULT 0.0,
    tire_pressure_psi JSONB DEFAULT '{"fl": 110, "fr": 110, "rl1": 115, "rl2": 115, "rr1": 115, "rr2": 115}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_vehicles_equip ON vehicles(equipment_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_driver ON vehicles(assigned_driver_id);

CREATE TABLE IF NOT EXISTS equipment_telemetry (
    id VARCHAR(36) PRIMARY KEY,
    equipment_id VARCHAR(36) NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    engine_temp_celsius DOUBLE PRECISION,
    oil_pressure_psi DOUBLE PRECISION,
    vibration_amplitude_mms DOUBLE PRECISION,
    hydraulic_pressure_bar DOUBLE PRECISION,
    fuel_flow_rate_lph DOUBLE PRECISION,
    battery_voltage_volts DOUBLE PRECISION,
    fault_codes TEXT[],
    raw_payload JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_telemetry_equip_time ON equipment_telemetry(equipment_id, timestamp DESC);

-- ==============================================================================
-- 6. SENSORS & CAMERAS (IOT / EDGE REGISTRY)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS sensors (
    id VARCHAR(36) PRIMARY KEY,
    mine_id VARCHAR(36) NOT NULL REFERENCES mines(id) ON DELETE RESTRICT,
    zone_id VARCHAR(36) REFERENCES zones(id) ON DELETE SET NULL,
    sensor_code VARCHAR(64) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    unit_of_measurement VARCHAR(50) NOT NULL,
    min_safe_threshold DOUBLE PRECISION,
    max_safe_threshold DOUBLE PRECISION,
    warning_threshold DOUBLE PRECISION,
    critical_threshold DOUBLE PRECISION,
    sampling_interval_seconds INT NOT NULL DEFAULT 5,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    elevation_meters DOUBLE PRECISION,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    latest_reading_value DOUBLE PRECISION,
    latest_reading_time TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'::jsonb,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36)
);

CREATE INDEX IF NOT EXISTS idx_sensors_code ON sensors(sensor_code);
CREATE INDEX IF NOT EXISTS idx_sensors_mine ON sensors(mine_id);
CREATE INDEX IF NOT EXISTS idx_sensors_zone ON sensors(zone_id);
CREATE INDEX IF NOT EXISTS idx_sensors_type ON sensors(type);
CREATE INDEX IF NOT EXISTS idx_sensors_status ON sensors(status);

CREATE TABLE IF NOT EXISTS sensor_readings (
    id VARCHAR(36) PRIMARY KEY,
    sensor_id VARCHAR(36) NOT NULL REFERENCES sensors(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    value DOUBLE PRECISION NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'NORMAL',
    quality_score DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    raw_payload JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_sensor_readings_time ON sensor_readings(sensor_id, timestamp DESC);

CREATE TABLE IF NOT EXISTS cameras (
    id VARCHAR(36) PRIMARY KEY,
    mine_id VARCHAR(36) NOT NULL REFERENCES mines(id) ON DELETE RESTRICT,
    zone_id VARCHAR(36) REFERENCES zones(id) ON DELETE SET NULL,
    camera_code VARCHAR(64) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    stream_url VARCHAR(512),
    resolution VARCHAR(50) DEFAULT '1080p',
    fps INT DEFAULT 30,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    ptz_pan_degrees DOUBLE PRECISION DEFAULT 0.0,
    ptz_tilt_degrees DOUBLE PRECISION DEFAULT 0.0,
    ptz_zoom_factor DOUBLE PRECISION DEFAULT 1.0,
    status VARCHAR(50) NOT NULL DEFAULT 'ONLINE',
    ai_analytics_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    ai_features TEXT[] DEFAULT ARRAY['PPE_DETECTION', 'GEOFENCE_BREACH', 'COLLISION_WARNING'],
    metadata JSONB DEFAULT '{}'::jsonb,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36)
);

CREATE INDEX IF NOT EXISTS idx_cameras_code ON cameras(camera_code);
CREATE INDEX IF NOT EXISTS idx_cameras_mine ON cameras(mine_id);
CREATE INDEX IF NOT EXISTS idx_cameras_zone ON cameras(zone_id);

-- ==============================================================================
-- 7. INCIDENTS, ALERTS & SAFETY INTELLIGENCE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS incidents (
    id VARCHAR(36) PRIMARY KEY,
    mine_id VARCHAR(36) NOT NULL REFERENCES mines(id) ON DELETE RESTRICT,
    zone_id VARCHAR(36) REFERENCES zones(id) ON DELETE SET NULL,
    incident_number VARCHAR(64) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'REPORTED',
    reported_by_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    assigned_investigator_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    occurred_at TIMESTAMP WITH TIME ZONE NOT NULL,
    contained_at TIMESTAMP WITH TIME ZONE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    injuries_count INT DEFAULT 0,
    fatalities_count INT DEFAULT 0,
    estimated_cost_usd DOUBLE PRECISION DEFAULT 0.0,
    root_cause_analysis TEXT,
    corrective_actions TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36)
);

CREATE INDEX IF NOT EXISTS idx_incidents_number ON incidents(incident_number);
CREATE INDEX IF NOT EXISTS idx_incidents_mine ON incidents(mine_id);
CREATE INDEX IF NOT EXISTS idx_incidents_severity ON incidents(severity);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_incidents_occurred ON incidents(occurred_at DESC);

CREATE TABLE IF NOT EXISTS alerts (
    id VARCHAR(36) PRIMARY KEY,
    mine_id VARCHAR(36) NOT NULL REFERENCES mines(id) ON DELETE RESTRICT,
    zone_id VARCHAR(36) REFERENCES zones(id) ON DELETE SET NULL,
    source_type VARCHAR(50) NOT NULL,
    source_id VARCHAR(36),
    alert_code VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    level VARCHAR(50) NOT NULL,
    is_acknowledged BOOLEAN NOT NULL DEFAULT FALSE,
    acknowledged_by_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    is_resolved BOOLEAN NOT NULL DEFAULT FALSE,
    resolved_by_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolution_notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_alerts_mine ON alerts(mine_id);
CREATE INDEX IF NOT EXISTS idx_alerts_level ON alerts(level);
CREATE INDEX IF NOT EXISTS idx_alerts_ack ON alerts(is_acknowledged);
CREATE INDEX IF NOT EXISTS idx_alerts_time ON alerts(created_at DESC);

-- ==============================================================================
-- 8. AUDIT LOGGING & COMPLIANCE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(36) PRIMARY KEY,
    organization_id VARCHAR(36) REFERENCES organizations(id) ON DELETE SET NULL,
    user_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    username VARCHAR(100),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(36),
    ip_address VARCHAR(50),
    user_agent TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'SUCCESS',
    error_message TEXT,
    old_value JSONB,
    new_value JSONB,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_org ON audit_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_time ON audit_logs(created_at DESC);
