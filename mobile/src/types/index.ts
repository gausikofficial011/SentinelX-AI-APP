export type UserRole =
  | 'CITIZEN'
  | 'OFFICER'
  | 'DISPATCHER'
  | 'INTELLIGENCE_ANALYST'
  | 'ADMIN'
  | 'SUPER_ADMIN';

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  fullName: string;
  role: UserRole;
  badgeNumber?: string;
  stationName?: string;
  department?: string;
  phone?: string;
  avatarUrl?: string;
  dutyStatus?: 'ON_DUTY' | 'OFF_DUTY';
}

export type IncidentType =
  | 'THEFT'
  | 'ROBBERY'
  | 'ASSAULT'
  | 'ACCIDENT'
  | 'SURVEILLANCE'
  | 'TRAFFIC'
  | 'BURGLARY'
  | 'DISTURBANCE'
  | 'OTHER';

export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'WARNING' | 'MEDIUM' | 'LOW';

export type IncidentStatus =
  | 'REPORTED'
  | 'UNDER_INVESTIGATION'
  | 'UNIT_DISPATCHED'
  | 'RESOLVED'
  | 'CLOSED';

export interface LocationCoords {
  latitude: number;
  longitude: number;
  accuracy?: number;
  address?: string;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  incidentType: IncidentType;
  severity: SeverityLevel;
  status: IncidentStatus;
  location: LocationCoords;
  area: string;
  reportedBy: string;
  assignedUnit?: string;
  evidenceCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface EmergencyRequest {
  id: string;
  trackingId: string;
  citizenId?: string;
  citizenName?: string;
  phone?: string;
  location: LocationCoords;
  status: 'PENDING_DISPATCH' | 'UNIT_EN_ROUTE' | 'ON_SCENE' | 'RESOLVED' | 'CANCELLED';
  priority: SeverityLevel;
  type: string;
  assignedUnit?: string;
  description?: string;
  createdAt: string;
}

export interface FIRRecord {
  id: string;
  firNumber: string;
  complainantName: string;
  phone: string;
  incidentDate: string;
  incidentType: IncidentType;
  location: string;
  narrative: string;
  suspectDetails?: string;
  evidenceNotes?: string;
  status: IncidentStatus;
  assignedOfficer?: string;
  createdAt: string;
}

export interface DBSCANCluster {
  id: string;
  latitude: number;
  longitude: number;
  radius_meters: number;
  incident_count: number;
  severity: SeverityLevel;
  risk_score: number;
  area_name?: string;
  crimeType?: string;
  recommendedPatrolDensity?: string;
}

export interface ForecastDay {
  date: string;
  dayLabel: string;
  historicalCount: number;
  predictedCount: number;
  trendPercentage: number;
  riskLevel: SeverityLevel;
}

export interface FleetUnit {
  id: string;
  callSign: string;
  officer: string;
  sector: string;
  battery: string;
  fuel: string;
  status: 'AVAILABLE' | 'ON_PATROL' | 'RESPONDING' | 'ON_SCENE' | 'OFFLINE';
  latitude: number;
  longitude: number;
  lastUpdate: string;
}

export interface PublicAlert {
  id: string;
  title: string;
  message: string;
  severity: SeverityLevel;
  area: string;
  timestamp: string;
  read?: boolean;
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'copilot';
  text: string;
  timestamp: string;
  sources?: { type: string; confidence: number; title?: string }[];
  actionPills?: { label: string; action: string }[];
}

export interface SuspectDossier {
  id: string;
  fullName: string;
  aliases: string[];
  age: number;
  status: 'WANTED' | 'UNDER_SURVEILLANCE' | 'IN_CUSTODY' | 'CLEARED';
  riskLevel: SeverityLevel;
  primaryOffense: string;
  lastKnownLocation: string;
  associatedCases: string[];
  physicalDescription: string;
  warrantIssued: boolean;
}
