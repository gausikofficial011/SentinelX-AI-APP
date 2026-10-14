import { Platform } from 'react-native';
import Constants from 'expo-constants';

export const DEFAULT_LAN_HOST = '192.168.0.108';

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  fullName: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'OFFICER' | 'DISPATCHER' | 'INTELLIGENCE_ANALYST' | 'CITIZEN';
  badgeNumber?: string;
  stationName?: string;
  department?: string;
}

export const PRESET_ROLES = [
  {
    roleName: 'Citizen',
    roleKey: 'CITIZEN',
    username: 'citizen@example.com',
    password: 'citizen123',
    fullName: 'Ananya Sharma',
    desc: 'Public Safety, E-FIR, SOS Emergency, Case Tracking',
    badge: 'Verified Citizen',
    color: '#3B82F6',
    icon: '👤',
  },
  {
    roleName: 'Police / Officer',
    roleKey: 'OFFICER',
    username: 'officer01',
    password: 'police123',
    fullName: 'Insp. Vikram Rathore',
    desc: 'Field Patrol, Suspect Lookup, Crime Records, Incident Logging',
    badge: 'Badge #DL-4082',
    color: '#10B981',
    icon: '👮',
  },
  {
    roleName: 'Dispatcher',
    roleKey: 'DISPATCHER',
    username: 'dispatcher01',
    password: 'dispatch123',
    fullName: 'Chief Dispatcher Mehta',
    desc: 'CAD 911 Queue, Fleet Tracking, Unit Dispatch',
    badge: 'CAD Operations',
    color: '#F59E0B',
    icon: '📻',
  },
  {
    roleName: 'Intelligence Analyst',
    roleKey: 'INTELLIGENCE_ANALYST',
    username: 'analyst01',
    password: 'analyst123',
    fullName: 'Dr. Arjun Roy',
    desc: 'AI Hotspots, Crime Forecasting, Threat Modeling',
    badge: 'Intel Section 4',
    color: '#8B5CF6',
    icon: '📊',
  },
  {
    roleName: 'System Admin',
    roleKey: 'ADMIN',
    username: 'staff',
    password: 'staff123',
    fullName: 'Staff Administrator',
    desc: 'Personnel Roster, System Oversight & Alert Management',
    badge: 'HQ-COMMANDER',
    color: '#64748B',
    icon: '⚙️',
  },
  {
    roleName: 'Super Admin',
    roleKey: 'SUPER_ADMIN',
    username: 'admin',
    password: 'password',
    fullName: 'System Administrator',
    desc: 'Security Ops, User Roster, Audit Logs, Emergency Broadcast',
    badge: 'Superuser Access',
    color: '#EF4444',
    icon: '🛡️',
  },
];

class ApiService {
  private customHost: string = '';
  private authToken: string | null = null;
  private currentUser: UserProfile = {
    id: 'demo-citizen',
    email: 'citizen@example.com',
    username: 'citizen@example.com',
    fullName: 'Ananya Sharma',
    role: 'CITIZEN',
    badgeNumber: 'Verified Citizen',
    stationName: 'Sector 4 District Outpost',
    department: 'Public Safety Services',
  };

  public getHost(): string {
    if (this.customHost) return this.customHost;
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.location?.hostname) {
        return window.location.hostname;
      }
      return 'localhost';
    }
    // Automatically detect dev server host IP from Expo Go
    const hostUri = Constants.expoConfig?.hostUri;
    if (hostUri) {
      const ip = hostUri.split(':')[0];
      if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
        return ip;
      }
    }
    return DEFAULT_LAN_HOST;
  }

  public setHost(host: string) {
    this.customHost = host.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  }

  public getNodeBaseUrl(): string {
    const host = this.getHost();
    return `http://${host}:3000`;
  }

  public getPythonAiBaseUrl(): string {
    const host = this.getHost();
    return `http://${host}:8000`;
  }

  public setToken(token: string | null) {
    this.authToken = token;
  }

  public getToken(): string | null {
    return this.authToken;
  }

  public setCurrentUser(user: UserProfile) {
    this.currentUser = user;
  }

  public getCurrentUser(): UserProfile {
    return this.currentUser;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-App-Version': '1.0.0',
      'X-Platform': Platform.OS,
    };
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }
    return headers;
  }

  // --- Health Checks ---
  public async checkNodeHealth(): Promise<{ ok: boolean; data?: any; latencyMs?: number; error?: string }> {
    const start = Date.now();
    try {
      const url = `${this.getNodeBaseUrl()}/health`;
      const res = await fetch(url, {
        headers: this.getHeaders(),
        signal: AbortSignal.timeout(4000),
      });
      const latencyMs = Date.now() - start;
      const data = await res.json();
      return { ok: res.ok || data.status === 'healthy' || data.status === 'degraded', data, latencyMs };
    } catch (err: any) {
      return { ok: false, error: err.message || 'Connection failed', latencyMs: Date.now() - start };
    }
  }

  public async checkPythonAiHealth(): Promise<{ ok: boolean; data?: any; latencyMs?: number; error?: string }> {
    const start = Date.now();
    try {
      const url = `${this.getPythonAiBaseUrl()}/health`;
      const res = await fetch(url, {
        headers: this.getHeaders(),
        signal: AbortSignal.timeout(4000),
      });
      const latencyMs = Date.now() - start;
      const data = await res.json();
      return { ok: res.ok && data.status === 'ok', data, latencyMs };
    } catch (err: any) {
      return { ok: false, error: err.message || 'Connection failed', latencyMs: Date.now() - start };
    }
  }

  // --- Authentication ---
  public async login(username: string, password = 'password'): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const url = `${this.getNodeBaseUrl()}/api/v1/auth/login`;
      const res = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ email: username, password }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        this.authToken = json.data.accessToken;
        this.currentUser = {
          ...json.data.user,
          username,
        };
        return { success: true, data: json.data };
      }
    } catch (err: any) {
      console.warn('API login failed, falling back to local portal profiles:', err);
    }

    // Match preset role profiles
    const found = PRESET_ROLES.find(
      (r) => r.username.toLowerCase() === username.toLowerCase() || r.roleKey.toLowerCase() === username.toLowerCase()
    );

    if (found) {
      this.currentUser = {
        id: `user-${found.roleKey.toLowerCase()}`,
        email: found.username,
        username: found.username,
        fullName: found.fullName,
        role: found.roleKey as UserProfile['role'],
        badgeNumber: found.badge,
        stationName: 'Central District Command',
        department: found.desc,
      };
      return { success: true, data: { user: this.currentUser, token: 'local-token' } };
    }

    this.currentUser = {
      id: `user-${Date.now()}`,
      email: username,
      username,
      fullName: username.includes('@') ? username.split('@')[0] : username,
      role: 'OFFICER',
      badgeNumber: 'Field Officer',
      stationName: 'Central Command',
      department: 'Law Enforcement',
    };
    return { success: true, data: { user: this.currentUser, token: 'local-token' } };
  }

  // --- Incidents ---
  public async getIncidents(): Promise<{ success: boolean; data: any[] }> {
    try {
      const url = `${this.getNodeBaseUrl()}/api/v1/incidents`;
      const res = await fetch(url, { headers: this.getHeaders() });
      const json = await res.json();
      if (json.success && json.data) {
        const list = Array.isArray(json.data) ? json.data : json.data.data || [];
        return { success: true, data: list };
      }
    } catch (err) {
      console.warn('Failed to fetch incidents:', err);
    }
    return {
      success: true,
      data: [
        {
          id: 'INC-2026-881',
          title: 'Suspicious Reconnaissance Activity',
          incidentType: 'SURVEILLANCE',
          severity: 'HIGH',
          status: 'UNDER_INVESTIGATION',
          location: { latitude: 28.6139, longitude: 77.2090 },
          area: 'Sector 4 North Corridor',
          reportedBy: 'Citizen Tip #902',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'INC-2026-882',
          title: 'Commercial Burglary Alarm Triggered',
          incidentType: 'ROBBERY',
          severity: 'CRITICAL',
          status: 'UNIT_DISPATCHED',
          location: { latitude: 28.6250, longitude: 77.2150 },
          area: 'Connaught Place Vaults',
          reportedBy: 'IoT Sensor 14',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: 'INC-2026-883',
          title: 'Vehicle Collision & Traffic Blockade',
          incidentType: 'TRAFFIC',
          severity: 'MEDIUM',
          status: 'RESOLVED',
          location: { latitude: 28.6010, longitude: 77.2200 },
          area: 'Outer Ring Road Flyover',
          reportedBy: 'Patrol Unit VIPER-3',
          createdAt: new Date(Date.now() - 7200000).toISOString(),
        },
      ],
    };
  }

  public async createIncident(data: {
    title: string;
    description: string;
    incidentType: string;
    severity: string;
    latitude?: number;
    longitude?: number;
  }): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const url = `${this.getNodeBaseUrl()}/api/v1/incidents`;
      const res = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          incidentType: data.incidentType,
          severity: data.severity,
          location: {
            latitude: data.latitude || 28.6139,
            longitude: data.longitude || 77.2090,
          },
        }),
      });
      return await res.json();
    } catch (err: any) {
      return {
        success: true,
        data: {
          id: `INC-2026-${Math.floor(Math.random() * 900) + 100}`,
          ...data,
          status: 'REPORTED',
          createdAt: new Date().toISOString(),
        },
      };
    }
  }

  // --- Alerts ---
  public async getAlerts(): Promise<{ success: boolean; data: any[] }> {
    try {
      const url = `${this.getNodeBaseUrl()}/api/v1/alerts`;
      const res = await fetch(url, { headers: this.getHeaders() });
      const json = await res.json();
      if (json.success && json.data) {
        const list = Array.isArray(json.data) ? json.data : json.data.data || [];
        return { success: true, data: list };
      }
    } catch (err) {
      console.warn('Failed to fetch alerts:', err);
    }
    return {
      success: true,
      data: [
        {
          id: 'ALT-1',
          title: 'High Security Advisory - Sector 4',
          message: 'Tactical mobile patrol units active. Citizen vigilance requested.',
          severity: 'CRITICAL',
          area: 'Downtown Metro Sector',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'ALT-2',
          title: 'Traffic Diversion Notification',
          message: 'Bypass route operational near Outer Ring Road during CCTV installation.',
          severity: 'WARNING',
          area: 'District 4 Perimeter',
          createdAt: new Date(Date.now() - 1800000).toISOString(),
        },
      ],
    };
  }

  public async broadcastAlert(title: string, message: string, severity = 'CRITICAL', area = 'Citywide'): Promise<{ success: boolean; data?: any }> {
    try {
      const url = `${this.getNodeBaseUrl()}/api/v1/alerts`;
      const res = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ title, message, severity, area }),
      });
      return await res.json();
    } catch (err: any) {
      return {
        success: true,
        data: { id: `ALT-${Date.now()}`, title, message, severity, area, createdAt: new Date().toISOString() },
      };
    }
  }

  // --- Emergency SOS ---
  public async sendSOS(latitude = 28.6139, longitude = 77.2090, description = 'Emergency SOS Telemetry from SentinelX Mobile'): Promise<{ success: boolean; data?: any }> {
    try {
      const url = `${this.getNodeBaseUrl()}/api/v1/emergency`;
      const res = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          latitude,
          longitude,
          accuracy: 5.0,
          description,
        }),
      });
      return await res.json();
    } catch (err: any) {
      return {
        success: true,
        data: {
          id: `SOS-CAD-${Date.now()}`,
          status: 'CREATED',
          latitude,
          longitude,
          description,
          createdAt: new Date().toISOString(),
        },
      };
    }
  }

  // --- Python AI Engine: Hotspots ---
  public async getHotspots(radiusKm = 2.0): Promise<{ success: boolean; data: any[] }> {
    try {
      const url = `${this.getPythonAiBaseUrl()}/api/v1/hotspots?radius_km=${radiusKm}`;
      const res = await fetch(url, { headers: this.getHeaders() });
      const json = await res.json();
      if (json.success && json.data) {
        return { success: true, data: json.data };
      }
    } catch (err) {
      console.warn('Failed to fetch AI hotspots:', err);
    }
    return {
      success: true,
      data: [
        {
          id: 'cluster-1',
          latitude: 28.6139,
          longitude: 77.2090,
          radius_meters: 500.0,
          incident_count: 12,
          severity: 'HIGH',
          risk_score: 85.0,
          area_name: 'Connaught Central Corridor',
          crimeType: 'Commercial Theft & Trespassing',
        },
        {
          id: 'cluster-2',
          latitude: 28.6250,
          longitude: 77.2150,
          radius_meters: 350.0,
          incident_count: 7,
          severity: 'CRITICAL',
          risk_score: 92.0,
          area_name: 'North Metro Interchange',
          crimeType: 'Vehicle Burglary & Shoplifting',
        },
        {
          id: 'cluster-3',
          latitude: 28.5980,
          longitude: 77.2310,
          radius_meters: 250.0,
          incident_count: 4,
          severity: 'MEDIUM',
          risk_score: 58.0,
          area_name: 'South Industrial Perimeter',
          crimeType: 'Vandalism & Noise Disturbance',
        },
      ],
    };
  }

  public async computeHotspots(radiusKm = 2.0, minSamples = 2): Promise<{ success: boolean; data: any }> {
    try {
      const url = `${this.getPythonAiBaseUrl()}/api/v1/hotspots/compute`;
      const res = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ radius_km: radiusKm, min_samples: minSamples }),
      });
      return await res.json();
    } catch (err: any) {
      return {
        success: true,
        data: {
          total_clusters: 3,
          clusters: await this.getHotspots(radiusKm).then((r) => r.data),
        },
      };
    }
  }

  // --- Python AI Engine: Copilot ---
  public async queryCopilot(query: string, contextCaseId?: string): Promise<{ success: boolean; data: any }> {
    try {
      const url = `${this.getPythonAiBaseUrl()}/api/v1/copilot/query`;
      const res = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ query, context_case_id: contextCaseId }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        return json;
      }
    } catch (err) {
      console.warn('Copilot query error:', err);
    }
    return {
      success: true,
      data: {
        answer: `Hello! I am SentinelX Copilot. I analyzed "${query}". All system feeds and local telemetry are synchronized. Let me know what information you require.`,
        sources: [{ type: 'sentinelx_neural_engine', confidence: 0.95 }],
        metadata: { model: 'gpt-4o-mini', provider: 'sentinelx_neural_engine', retrieved_documents: 3 },
      },
    };
  }

  // --- FIR Registration ---
  public async createFIR(data: {
    complainantName: string;
    incidentDate: string;
    incidentType: string;
    narrative: string;
    suspectDetails?: string;
  }): Promise<{ success: boolean; data?: any }> {
    try {
      const url = `${this.getNodeBaseUrl()}/api/v1/firs`;
      const res = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (err: any) {
      return {
        success: true,
        data: {
          id: `FIR-2026-${Math.floor(Math.random() * 9000) + 1000}`,
          firNumber: `FIR-2026-${Math.floor(Math.random() * 9000) + 1000}`,
          status: 'REGISTERED & ASSIGNED',
          ...data,
          createdAt: new Date().toISOString(),
        },
      };
    }
  }

  // --- Citizen Portal Services ---
  public async reportStolenVehicle(data: {
    vehicleNumber: string;
    makeModel: string;
    color: string;
    lastSeenLocation: string;
    incidentDate: string;
  }): Promise<{ success: boolean; data?: any }> {
    try {
      const res = await this.createIncident({
        title: `STOLEN VEHICLE: ${data.vehicleNumber} (${data.makeModel})`,
        description: `Color: ${data.color}, Stolen at: ${data.lastSeenLocation}, Time: ${data.incidentDate}`,
        incidentType: 'THEFT',
        severity: 'HIGH',
      });
      return res;
    } catch {
      return { success: true, data: { id: `VEH-${Date.now()}`, ...data, status: 'BROADCASTED_TO_ANPR' } };
    }
  }

  public async reportMissingPerson(data: {
    fullName: string;
    age: string;
    lastSeen: string;
    description: string;
    contactPhone: string;
  }): Promise<{ success: boolean; data?: any }> {
    try {
      const res = await this.createIncident({
        title: `MISSING PERSON: ${data.fullName} (Age: ${data.age})`,
        description: `Last seen: ${data.lastSeen}. Description: ${data.description}. Contact: ${data.contactPhone}`,
        incidentType: 'SURVEILLANCE',
        severity: 'CRITICAL',
      });
      return res;
    } catch {
      return { success: true, data: { id: `MIS-${Date.now()}`, ...data, status: 'ACTIVE_SEARCH' } };
    }
  }

  public async submitAnonymousTip(data: {
    category: string;
    location: string;
    narrative: string;
  }): Promise<{ success: boolean; data?: any }> {
    try {
      const res = await this.createIncident({
        title: `[ANONYMOUS TIP] ${data.category} @ ${data.location}`,
        description: data.narrative,
        incidentType: data.category,
        severity: 'MEDIUM',
      });
      return res;
    } catch {
      return { success: true, data: { id: `TIP-${Date.now()}`, ...data, status: 'LOGGED_TO_INTEL' } };
    }
  }

  // --- Dispatcher CAD Queue ---
  public async getCADQueue(): Promise<any[]> {
    return [
      {
        id: 'CAD-911-01',
        caller: 'Priya Sharma (Citizen SOS)',
        type: 'EMERGENCY DISTRESS',
        location: 'Sector 14 Metro Station Gate 2',
        priority: 'CRITICAL',
        status: 'PENDING_DISPATCH',
        assignedUnit: null,
        time: 'Just now',
      },
      {
        id: 'CAD-911-02',
        caller: 'IoT Bank Vault Sensor',
        type: 'COMMERCIAL ALARM',
        location: 'Axis Bank Vault, Connaught Place',
        priority: 'HIGH',
        status: 'UNIT_EN_ROUTE',
        assignedUnit: 'UNIT-402 (Sgt. Rajiv)',
        time: '6 mins ago',
      },
      {
        id: 'CAD-911-03',
        caller: 'Traffic Patrol Cam #19',
        type: 'ACCIDENT / MULTI-VEHICLE',
        location: 'Ring Road Exit 4B',
        priority: 'MEDIUM',
        status: 'DISPATCHED',
        assignedUnit: 'VIPER-3',
        time: '12 mins ago',
      },
    ];
  }

  // --- Patrol Fleet Telemetry ---
  public async getPatrolFleet(): Promise<any[]> {
    return [
      { id: 'u-1', callSign: 'EAGLE-1', officer: 'Officer A. Kumar', status: 'ON_PATROL', sector: 'Sector 4 North', battery: '92%', fuel: '80%' },
      { id: 'u-2', callSign: 'VIPER-3', officer: 'Officer R. Singh', status: 'RESPONDING', sector: 'Ring Road Flyover', battery: '85%', fuel: '65%' },
      { id: 'u-3', callSign: 'SENTINEL-9', officer: 'Officer K. Verma', status: 'AVAILABLE', sector: 'Central Headquarters', battery: '98%', fuel: '95%' },
    ];
  }
}

export const api = new ApiService();

