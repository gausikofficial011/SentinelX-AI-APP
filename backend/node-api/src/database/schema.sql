-- ==============================================================================
-- SENTINELX AI - CORE DATABASE SCHEMA
-- Requires PostgreSQL + PostGIS Extension
-- ==============================================================================

-- Enable PostGIS for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- ENUMS
-- ==============================================================================
CREATE TYPE user_role AS ENUM (
    'CITIZEN', 'OFFICER', 'INVESTIGATOR', 'DISPATCHER', 
    'INTELLIGENCE_ANALYST', 'ADMIN', 'SUPER_ADMIN'
);

CREATE TYPE incident_type AS ENUM (
    'THEFT', 'ASSAULT', 'VANDALISM', 'ROBBERY', 'BURGLARY', 
    'MISSING_PERSON', 'TRAFFIC_ACCIDENT', 'DOMESTIC_VIOLENCE', 
    'DRUG_RELATED', 'SUSPICIOUS_ACTIVITY', 'OTHER'
);

CREATE TYPE incident_status AS ENUM (
    'REPORTED', 'UNDER_INVESTIGATION', 'RESOLVED', 'FALSE_ALARM', 'PENDING'
);

CREATE TYPE severity_level AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

CREATE TYPE emergency_status AS ENUM (
    'CREATED', 'DISPATCHING', 'RESPONDING', 'ON_SCENE', 
    'RESOLVED', 'CANCELLED', 'FALSE_ALARM'
);

CREATE TYPE alert_severity AS ENUM ('INFO', 'WARNING', 'CRITICAL', 'SEVERE');

-- ==============================================================================
-- 1. USERS & AUTHENTICATION
-- ==============================================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'CITIZEN',
    phone_number VARCHAR(20),
    profile_image_url TEXT,
    department_id UUID,
    badge_number VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ==============================================================================
-- 2. DEPARTMENTS & STATIONS
-- ==============================================================================
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    jurisdiction_area GEOMETRY(POLYGON, 4326),
    headquarters_location GEOMETRY(POINT, 4326),
    contact_phone VARCHAR(20),
    contact_email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE stations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department_id UUID REFERENCES departments(id),
    name VARCHAR(255) NOT NULL,
    location GEOMETRY(POINT, 4326) NOT NULL,
    address TEXT,
    contact_phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_stations_location ON stations USING GIST (location);

-- Link user to department via foreign key defined now that departments exist
ALTER TABLE users ADD CONSTRAINT fk_user_dept FOREIGN KEY (department_id) REFERENCES departments(id);

-- ==============================================================================
-- 3. OFFICERS & PATROLS
-- ==============================================================================
CREATE TABLE officers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    station_id UUID REFERENCES stations(id),
    rank VARCHAR(50),
    is_on_duty BOOLEAN DEFAULT false,
    current_location GEOMETRY(POINT, 4326),
    last_location_update TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_officers_location ON officers USING GIST (current_location);

-- ==============================================================================
-- 4. INCIDENTS (Reports from Citizens/Officers)
-- ==============================================================================
CREATE TABLE incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    incident_type incident_type NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    location_point GEOMETRY(POINT, 4326), -- Geospatial index
    address TEXT,
    severity severity_level NOT NULL DEFAULT 'MEDIUM',
    status incident_status NOT NULL DEFAULT 'REPORTED',
    reported_by_id UUID REFERENCES users(id),
    assigned_officer_id UUID REFERENCES users(id),
    station_id UUID REFERENCES stations(id),
    case_id UUID, -- References cases table (created later)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trigger to auto-update location_point from lat/lon
CREATE OR REPLACE FUNCTION update_incident_location() RETURNS TRIGGER AS $$
BEGIN
  NEW.location_point = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_incident_location
BEFORE INSERT OR UPDATE ON incidents
FOR EACH ROW EXECUTE PROCEDURE update_incident_location();

CREATE INDEX idx_incidents_location ON incidents USING GIST (location_point);
CREATE INDEX idx_incidents_status ON incidents(status);
CREATE INDEX idx_incidents_type ON incidents(incident_type);

-- ==============================================================================
-- 5. EMERGENCY SOS (Realtime Dispatch)
-- ==============================================================================
CREATE TABLE emergency_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    citizen_id UUID REFERENCES users(id) ON DELETE CASCADE,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    location_point GEOMETRY(POINT, 4326),
    location_accuracy DOUBLE PRECISION,
    description TEXT,
    status emergency_status NOT NULL DEFAULT 'CREATED',
    assigned_officer_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_update_emergency_location
BEFORE INSERT OR UPDATE ON emergency_requests
FOR EACH ROW EXECUTE PROCEDURE update_incident_location();

CREATE INDEX idx_emergency_location ON emergency_requests USING GIST (location_point);
CREATE INDEX idx_emergency_status ON emergency_requests(status);

-- ==============================================================================
-- 6. PUBLIC ALERTS
-- ==============================================================================
CREATE TABLE public_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    severity alert_severity NOT NULL,
    area TEXT,
    target_geometry GEOMETRY(POLYGON, 4326),
    created_by_id UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX idx_alerts_active ON public_alerts(is_active);
CREATE INDEX idx_alerts_geometry ON public_alerts USING GIST (target_geometry);

-- ==============================================================================
-- 7. CASES & INVESTIGATIONS (Phase 6)
-- ==============================================================================
CREATE TABLE cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_number VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'OPEN',
    lead_investigator_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Foreign key link back to incidents
ALTER TABLE incidents ADD CONSTRAINT fk_incident_case FOREIGN KEY (case_id) REFERENCES cases(id);

CREATE TABLE fir (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fir_number VARCHAR(50) UNIQUE NOT NULL,
    incident_id UUID REFERENCES incidents(id),
    case_id UUID REFERENCES cases(id),
    filed_by_officer_id UUID REFERENCES users(id),
    complainant_id UUID REFERENCES users(id),
    statement TEXT NOT NULL,
    sections_applied TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    collected_by_id UUID REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_type VARCHAR(50),
    file_hash VARCHAR(255) NOT NULL, -- For chain of custody integrity
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    collected_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
