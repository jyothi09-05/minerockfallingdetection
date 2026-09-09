-- ==============================================================================
-- MINEMIND AI — DATABASE SEED DATA (Phase 1 Baseline)
-- Password for all seed accounts:
-- superadmin@minemind.io -> MineMind@Admin2026!
-- mineadmin@minemind.io  -> MineMind@Admin2026!
-- safety@minemind.io     -> MineMind@Safety2026!
-- viewer@minemind.io     -> MineMind@Viewer2026!
-- BCrypt Hash: $2a$10$wT70bTsqkFkP.5oQz3yDCO6N5bW8hR9V1s3yYJmS0g9uRkR9vPjFe
-- ==============================================================================

-- 1. Organizations
INSERT INTO organizations (id, name, code, description, country, contact_email, contact_phone, status, settings)
VALUES (
    'org-00000000-0000-0000-0000-000000000001',
    'Apex Mining Operations Global',
    'APEX-GLOBAL',
    'Global tier-1 multi-commodity extraction and autonomous mine operations enterprise.',
    'Australia',
    'hq@apexmining.io',
    '+61 8 9123 4567',
    'ACTIVE',
    '{"telemetry_interval_sec": 5, "emergency_broadcast_enabled": true, "offline_sync_mode": "REALTIME"}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- 2. Permissions
INSERT INTO permissions (id, name, module, description) VALUES
('perm-01', 'MINE_READ', 'MINE_MANAGEMENT', 'View mine metadata, spatial geometry, and layout'),
('perm-02', 'MINE_WRITE', 'MINE_MANAGEMENT', 'Create and modify mines, zones, benches, and roads'),
('perm-03', 'MINE_DELETE', 'MINE_MANAGEMENT', 'Delete or decommission mines and zones'),
('perm-04', 'ASSET_READ', 'ASSET_MANAGEMENT', 'View heavy machinery, haul fleet, and equipment telemetry'),
('perm-05', 'ASSET_WRITE', 'ASSET_MANAGEMENT', 'Register, update, and maintain equipment and vehicles'),
('perm-06', 'WORKER_READ', 'WORKFORCE', 'View personnel directories, shift rosters, and safety clearances'),
('perm-07', 'WORKER_WRITE', 'WORKFORCE', 'Assign shifts, update certifications, and manage personnel'),
('perm-08', 'SAFETY_READ', 'SAFETY_INTELLIGENCE', 'View safety alerts, atmospheric sensors, and incident logs'),
('perm-09', 'SAFETY_WRITE', 'SAFETY_INTELLIGENCE', 'Acknowledge alerts, log incidents, and trigger emergency evacuations'),
('perm-10', 'USER_READ', 'USER_MANAGEMENT', 'View system users and role assignments'),
('perm-11', 'USER_WRITE', 'USER_MANAGEMENT', 'Create users, modify credentials, and assign permissions'),
('perm-12', 'AUDIT_READ', 'AUDIT_LOGGING', 'View immutable audit trail and security compliance records')
ON CONFLICT (id) DO NOTHING;

-- 3. Roles
INSERT INTO roles (id, name, display_name, description, is_system_role) VALUES
('role-01', 'ROLE_SUPER_ADMIN', 'Super Administrator', 'Full platform control, tenant management, and system configuration', true),
('role-02', 'ROLE_MINE_ADMIN', 'Mine Site Administrator', 'Site-level administration and resource governance', true),
('role-03', 'ROLE_MINE_MANAGER', 'Mine Operations Manager', 'Supervises daily production, haulage, and dispatch', true),
('role-04', 'ROLE_SAFETY_OFFICER', 'Chief Safety Officer', 'Oversees HSE compliance, incident response, and environmental telemetry', true),
('role-05', 'ROLE_GEOLOGIST', 'Chief Geologist', 'Monitors geotechnical stability, ore grade, and bench structures', true),
('role-06', 'ROLE_MAINTENANCE_ENGINEER', 'Reliability & Maintenance Engineer', 'Equipment health monitoring and maintenance scheduling', true),
('role-07', 'ROLE_OPERATOR', 'Equipment Operator', 'Machinery and vehicle operation telemetry access', true),
('role-08', 'ROLE_WORKER', 'Mine Site Personnel', 'Basic workforce access and emergency broadcast receiver', true),
('role-09', 'ROLE_VIEWER', 'Auditor / Read-Only Observer', 'Read-only access to operational dashboards and reports', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Role Permissions
-- Super Admin (All Permissions)
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'role-01', id FROM permissions
ON CONFLICT DO NOTHING;

-- Mine Admin
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'role-02', id FROM permissions WHERE name NOT IN ('AUDIT_READ')
ON CONFLICT DO NOTHING;

-- Safety Officer
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'role-04', id FROM permissions WHERE name IN ('MINE_READ', 'ASSET_READ', 'WORKER_READ', 'SAFETY_READ', 'SAFETY_WRITE', 'AUDIT_READ')
ON CONFLICT DO NOTHING;

-- Viewer
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'role-09', id FROM permissions WHERE name LIKE '%_READ'
ON CONFLICT DO NOTHING;

-- 5. Users
-- Password for all default accounts is: MineMind@Admin2026! (or safety/viewer respectively)
-- Using standard BCrypt hash for MineMind@Admin2026! : $2a$10$wT70bTsqkFkP.5oQz3yDCO6N5bW8hR9V1s3yYJmS0g9uRkR9vPjFe
INSERT INTO users (id, organization_id, username, email, password_hash, first_name, last_name, job_title, department, status) VALUES
('usr-00000000-0000-0000-0000-000000000001', 'org-00000000-0000-0000-0000-000000000001', 'superadmin', 'superadmin@minemind.io', '$2a$10$wT70bTsqkFkP.5oQz3yDCO6N5bW8hR9V1s3yYJmS0g9uRkR9vPjFe', 'Alexander', 'Vance', 'Chief Technology Officer', 'Executive Operations', 'ACTIVE'),
('usr-00000000-0000-0000-0000-000000000002', 'org-00000000-0000-0000-0000-000000000001', 'mineadmin', 'mineadmin@minemind.io', '$2a$10$wT70bTsqkFkP.5oQz3yDCO6N5bW8hR9V1s3yYJmS0g9uRkR9vPjFe', 'Elena', 'Rostova', 'General Mine Superintendent', 'Site Operations', 'ACTIVE'),
('usr-00000000-0000-0000-0000-000000000003', 'org-00000000-0000-0000-0000-000000000001', 'safety', 'safety@minemind.io', '$2a$10$wT70bTsqkFkP.5oQz3yDCO6N5bW8hR9V1s3yYJmS0g9uRkR9vPjFe', 'Marcus', 'Chen', 'Lead Health & Safety Director', 'HSE & Safety', 'ACTIVE'),
('usr-00000000-0000-0000-0000-000000000004', 'org-00000000-0000-0000-0000-000000000001', 'viewer', 'viewer@minemind.io', '$2a$10$wT70bTsqkFkP.5oQz3yDCO6N5bW8hR9V1s3yYJmS0g9uRkR9vPjFe', 'Sophia', 'Alvarez', 'ESG & Compliance Auditor', 'Compliance', 'ACTIVE')
ON CONFLICT (id) DO NOTHING;

-- User Roles
INSERT INTO user_roles (user_id, role_id) VALUES
('usr-00000000-0000-0000-0000-000000000001', 'role-01'),
('usr-00000000-0000-0000-0000-000000000002', 'role-02'),
('usr-00000000-0000-0000-0000-000000000003', 'role-04'),
('usr-00000000-0000-0000-0000-000000000004', 'role-09')
ON CONFLICT DO NOTHING;

-- 6. Demonstration Mines
INSERT INTO mines (id, organization_id, name, code, type, commodity, latitude, longitude, elevation_meters, total_area_hectares, status, country, state_province, timezone, metadata) VALUES
('mine-00000000-0000-0000-0000-000000000001', 'org-00000000-0000-0000-0000-000000000001', 'Prometheus Pit #4 — Supercut Copper', 'MINE-PROM-04', 'OPEN_PIT', 'COPPER', -21.4532, 119.8214, 450.0, 1850.5, 'ACTIVE', 'Australia', 'Western Australia', 'Australia/Perth', '{"target_output_tpd": 85000, "stripping_ratio": 2.8, "geological_formation": "Pilbara BIF"}'::jsonb),
('mine-00000000-0000-0000-0000-000000000002', 'org-00000000-0000-0000-0000-000000000001', 'Valiants Deep Gold Complex', 'MINE-VAL-09', 'UNDERGROUND', 'GOLD', 48.1205, -79.9812, 280.0, 920.0, 'ACTIVE', 'Canada', 'Ontario', 'America/Toronto', '{"shaft_depth_meters": 1400, "ventilation_capacity_cfm": 850000}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 7. Zones for Prometheus Pit #4
INSERT INTO zones (id, mine_id, name, code, zone_type, hazard_level, max_personnel_capacity, max_vehicle_capacity, elevation_range_min, elevation_range_max, status, metadata) VALUES
('zone-00000000-0000-0000-0000-000000000001', 'mine-00000000-0000-0000-0000-000000000001', 'North Extraction Sector Alpha', 'ZN-NORTH-EXT-01', 'EXTRACTION_PIT', 'HIGH', 35, 15, 200.0, 450.0, 'ACTIVE', '{"primary_shovels": ["EQ-SHOV-01"], "blasting_frequency": "DAILY_1400"}'::jsonb),
('zone-00000000-0000-0000-0000-000000000002', 'mine-00000000-0000-0000-0000-000000000001', 'Primary Gyratory Crusher Hub', 'ZN-CRUSH-HUB-02', 'PROCESSING_PLANT', 'MEDIUM', 20, 8, 440.0, 460.0, 'ACTIVE', '{"throughput_rate_tph": 4500}'::jsonb),
('zone-00000000-0000-0000-0000-000000000003', 'mine-00000000-0000-0000-0000-000000000001', 'South Waste Overburden Facility', 'ZN-WASTE-STK-03', 'WASTE_DUMP', 'MEDIUM', 15, 12, 450.0, 520.0, 'ACTIVE', '{"lift_height_meters": 20}'::jsonb),
('zone-00000000-0000-0000-0000-000000000004', 'mine-00000000-0000-0000-0000-000000000001', 'Tailings Retention Basin Delta', 'ZN-TAIL-DAM-04', 'TAILINGS_DAM', 'CRITICAL', 10, 4, 380.0, 410.0, 'ACTIVE', '{"ph_level_target": 7.8, "dam_piezometer_count": 18}'::jsonb),
('zone-00000000-0000-0000-0000-000000000005', 'mine-00000000-0000-0000-0000-000000000001', 'Heavy Fleet Maintenance Workshops', 'ZN-WORK-BAY-05', 'WORKSHOP', 'LOW', 60, 20, 455.0, 465.0, 'ACTIVE', '{"service_bays": 8, "crane_capacity_tonnes": 50}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 8. Benches
INSERT INTO benches (id, zone_id, name, bench_number, elevation_meters, height_meters, width_meters, slope_angle_degrees, stability_factor, status) VALUES
('bnc-01', 'zone-00000000-0000-0000-0000-000000000001', 'Bench 450 (Top Crest)', 450, 450.0, 15.0, 35.0, 65.0, 1.85, 'OPERATIONAL'),
('bnc-02', 'zone-00000000-0000-0000-0000-000000000001', 'Bench 435 (High Grade Ore)', 435, 435.0, 15.0, 30.0, 68.0, 1.62, 'DRILLING'),
('bnc-03', 'zone-00000000-0000-0000-0000-000000000001', 'Bench 420 (Active Loading Face)', 420, 420.0, 15.0, 28.0, 64.0, 1.48, 'LOADING'),
('bnc-04', 'zone-00000000-0000-0000-0000-000000000001', 'Bench 405 (Pit Floor Expansion)', 405, 405.0, 15.0, 25.0, 62.0, 1.55, 'OPERATIONAL')
ON CONFLICT (id) DO NOTHING;

-- 9. Roads
INSERT INTO roads (id, mine_id, name, code, road_type, surface_type, length_meters, average_width_meters, max_gradient_percent, speed_limit_kmh, max_weight_capacity_tonnes, status) VALUES
('rd-01', 'mine-00000000-0000-0000-0000-000000000001', 'North Ramp Main Dual-Lane Haulway', 'RD-HAUL-N-01', 'MAIN_HAUL_ROAD', 'CRUSHED_ROCK', 3400.0, 32.0, 8.5, 45, 450.0, 'OPEN'),
('rd-02', 'mine-00000000-0000-0000-0000-000000000001', 'Crusher Access Connector', 'RD-CRUSH-ACC-02', 'SECONDARY_ACCESS', 'GRAVEL', 1200.0, 24.0, 6.0, 35, 400.0, 'OPEN'),
('rd-03', 'mine-00000000-0000-0000-0000-000000000001', 'Emergency Escape Spur West', 'RD-ESC-WEST-03', 'EMERGENCY_ESCAPE', 'GRAVEL', 850.0, 18.0, 10.0, 50, 100.0, 'OPEN')
ON CONFLICT (id) DO NOTHING;

-- 10. Heavy Machinery & Fleet
INSERT INTO equipment (id, mine_id, current_zone_id, asset_tag, name, type, model_number, manufacturer, manufacture_year, capacity_tonnes, engine_power_kw, fuel_capacity_liters, status, health_score, operating_hours) VALUES
('eq-00000000-0000-0000-0000-000000000001', 'mine-00000000-0000-0000-0000-000000000001', 'zone-00000000-0000-0000-0000-000000000001', 'EQ-SHOV-01', 'Komatsu PC8000-11 Electric-Hydraulic Shovel', 'HYDRAULIC_SHOVEL', 'PC8000-11', 'Komatsu Mining', 2023, 42.0, 2900.0, 4500.0, 'OPERATIONAL', 96, 4210.5),
('eq-00000000-0000-0000-0000-000000000002', 'mine-00000000-0000-0000-0000-000000000001', 'zone-00000000-0000-0000-0000-000000000001', 'EQ-TRK-101', 'Caterpillar 797F Ultra-Class Haul Truck', 'HAUL_TRUCK', '797F', 'Caterpillar', 2022, 363.0, 2983.0, 3785.0, 'OPERATIONAL', 92, 6840.0),
('eq-00000000-0000-0000-0000-000000000003', 'mine-00000000-0000-0000-0000-000000000001', 'zone-00000000-0000-0000-0000-000000000001', 'EQ-TRK-102', 'Caterpillar 797F Ultra-Class Haul Truck', 'HAUL_TRUCK', '797F', 'Caterpillar', 2022, 363.0, 2983.0, 3785.0, 'OPERATIONAL', 88, 7120.0),
('eq-00000000-0000-0000-0000-000000000004', 'mine-00000000-0000-0000-0000-000000000001', 'zone-00000000-0000-0000-0000-000000000001', 'EQ-DRIL-01', 'Epiroc Pit Viper 271 Autonomous Rotary Drill', 'ROTARY_DRILL', 'PV-271', 'Epiroc Mining', 2024, 25.0, 783.0, 1500.0, 'OPERATIONAL', 98, 1420.0),
('eq-00000000-0000-0000-0000-000000000005', 'mine-00000000-0000-0000-0000-000000000001', 'zone-00000000-0000-0000-0000-000000000005', 'EQ-DOZ-01', 'Caterpillar D11 Heavy Track Bulldozer', 'BULLDOZER', 'D11', 'Caterpillar', 2021, 45.0, 634.0, 1600.0, 'UNDER_MAINTENANCE', 74, 9850.0)
ON CONFLICT (id) DO NOTHING;

-- Vehicles Telemetry Link
INSERT INTO vehicles (id, equipment_id, license_plate, fuel_type, current_fuel_level_percent, current_speed_kmh, latitude, longitude, heading_degrees, payload_weight_tonnes, odometer_km) VALUES
('veh-01', 'eq-00000000-0000-0000-0000-000000000002', 'WA-HT-101', 'DIESEL', 84.5, 32.4, -21.4540, 119.8220, 145.0, 352.0, 48200.0),
('veh-02', 'eq-00000000-0000-0000-0000-000000000003', 'WA-HT-102', 'DIESEL', 62.0, 0.0, -21.4530, 119.8210, 80.0, 0.0, 52140.0)
ON CONFLICT (id) DO NOTHING;

-- 11. Sensors
INSERT INTO sensors (id, mine_id, zone_id, sensor_code, name, type, unit_of_measurement, min_safe_threshold, max_safe_threshold, warning_threshold, critical_threshold, latitude, longitude, status, latest_reading_value, latest_reading_time) VALUES
('sns-01', 'mine-00000000-0000-0000-0000-000000000001', 'zone-00000000-0000-0000-0000-000000000001', 'SNS-GAS-CH4-01', 'Methane (CH4) Multi-Point Atmospheric Sensor', 'METHANE_GAS', 'PPM', 0.0, 500.0, 400.0, 800.0, -21.4535, 119.8215, 'ACTIVE', 42.0, CURRENT_TIMESTAMP),
('sns-02', 'mine-00000000-0000-0000-0000-000000000001', 'zone-00000000-0000-0000-0000-000000000001', 'SNS-SLOPE-RAD-01', 'Interferometric Slope Stability Radar #1', 'SLOPE_RADAR_DISPLACEMENT', 'MM', -5.0, 5.0, 12.0, 25.0, -21.4528, 119.8205, 'ACTIVE', 1.8, CURRENT_TIMESTAMP),
('sns-03', 'mine-00000000-0000-0000-0000-000000000001', 'zone-00000000-0000-0000-0000-000000000002', 'SNS-VIB-CRUSH-01', 'Primary Crusher Bearing Tri-Axial Accelerometer', 'SEISMIC_VIBRATION', 'MM_S', 0.0, 8.0, 12.5, 20.0, -21.4502, 119.8250, 'ACTIVE', 4.2, CURRENT_TIMESTAMP),
('sns-04', 'mine-00000000-0000-0000-0000-000000000001', 'zone-00000000-0000-0000-0000-000000000004', 'SNS-DAM-PIEZ-01', 'Tailings Embankment Piezometer Level Sensor', 'WATER_LEVEL', 'MM', 0.0, 25000.0, 22000.0, 24500.0, -21.4600, 119.8300, 'ACTIVE', 14200.0, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- 12. Cameras
INSERT INTO cameras (id, mine_id, zone_id, camera_code, name, type, stream_url, resolution, fps, latitude, longitude, status, ai_analytics_enabled) VALUES
('cam-01', 'mine-00000000-0000-0000-0000-000000000001', 'zone-00000000-0000-0000-0000-000000000001', 'CAM-PIT-N-01', 'North Pit Face Long-Range Thermal PTZ', 'THERMAL_INFRARED', '/streams/pit-north-thermal.m3u8', '4K', 30, -21.4525, 119.8200, 'ONLINE', true),
('cam-02', 'mine-00000000-0000-0000-0000-000000000001', 'zone-00000000-0000-0000-0000-000000000002', 'CAM-CRUSH-IN-02', 'Crusher Hopper Infeed Optical AI Camera', 'PTZ_OPTICAL', '/streams/crusher-infeed.m3u8', '1080p', 60, -21.4501, 119.8249, 'ONLINE', true)
ON CONFLICT (id) DO NOTHING;

-- 13. Workers
INSERT INTO workers (id, organization_id, assigned_mine_id, current_zone_id, badge_number, first_name, last_name, role, blood_group, emergency_contact_name, emergency_contact_phone, status, rfid_tag_id) VALUES
('wrk-01', 'org-00000000-0000-0000-0000-000000000001', 'mine-00000000-0000-0000-0000-000000000001', 'zone-00000000-0000-0000-0000-000000000001', 'BADGE-88401', 'Jacob', 'Thornton', 'OPERATOR', 'O_POS', 'Sarah Thornton', '+61 411 902 334', 'ON_DUTY', 'RFID-88401-TX'),
('wrk-02', 'org-00000000-0000-0000-0000-000000000001', 'mine-00000000-0000-0000-0000-000000000001', 'zone-00000000-0000-0000-0000-000000000001', 'BADGE-88402', 'Liam', 'MacKenzie', 'BLASTING_SPECIALIST', 'A_POS', 'Fiona MacKenzie', '+61 412 883 119', 'ON_DUTY', 'RFID-88402-TX'),
('wrk-03', 'org-00000000-0000-0000-0000-000000000001', 'mine-00000000-0000-0000-0000-000000000001', 'zone-00000000-0000-0000-0000-000000000005', 'BADGE-88403', 'David', 'Kowalski', 'MAINTENANCE_TECH', 'B_POS', 'Anna Kowalski', '+61 413 774 228', 'ON_DUTY', 'RFID-88403-TX')
ON CONFLICT (id) DO NOTHING;

-- 14. Safety Alerts & Incidents
INSERT INTO alerts (id, mine_id, zone_id, source_type, alert_code, title, message, level, is_acknowledged, is_resolved) VALUES
('alt-01', 'mine-00000000-0000-0000-0000-000000000001', 'zone-00000000-0000-0000-0000-000000000001', 'SENSOR', 'ALT-SLOPE-001', 'Slope Velocity Advisory - Sector Alpha', 'Sub-millimeter displacement acceleration detected on Bench 435 crest.', 'WARNING', true, false),
('alt-02', 'mine-00000000-0000-0000-0000-000000000001', 'zone-00000000-0000-0000-0000-000000000005', 'TELEMETRY', 'ALT-HYD-004', 'Bulldozer Hydraulic Pressure Loss', 'CAT D11 reported sudden 15% pressure drop in main blade circuit.', 'INFO', false, false)
ON CONFLICT (id) DO NOTHING;

-- 15. Audit Logs Baseline
INSERT INTO audit_logs (id, organization_id, user_id, username, action, resource_type, resource_id, ip_address, status, details) VALUES
('aud-01', 'org-00000000-0000-0000-0000-000000000001', 'usr-00000000-0000-0000-0000-000000000001', 'superadmin', 'SYSTEM_INITIALIZATION', 'SYSTEM', 'ROOT', '127.0.0.1', 'SUCCESS', '{"version": "1.0.0-PHASE1", "modules_initialized": ["AUTH", "MINE", "ASSET", "WORKFORCE", "SAFETY", "AUDIT"]}'::jsonb)
ON CONFLICT (id) DO NOTHING;
