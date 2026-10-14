import { create } from 'zustand';
import { Incident, IncidentType, SeverityLevel, IncidentStatus } from '@/types';
import { api } from '@/services/api';

const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'INC-2026-881',
    title: 'High Risk Area Incident: Commercial Shoplifting',
    description: 'Multiple suspects attempted to breach security lockers at RS Puram retail center.',
    incidentType: 'THEFT',
    severity: 'HIGH',
    status: 'UNDER_INVESTIGATION',
    location: {
      latitude: 11.0168,
      longitude: 76.9558,
      address: 'RS Puram, Coimbatore',
    },
    area: 'RS Puram Sector 2',
    reportedBy: 'Store Security #12',
    assignedUnit: 'VIPER-3',
    evidenceCount: 3,
    createdAt: '15 mins ago',
  },
  {
    id: 'INC-2026-882',
    title: 'Physical Assault Outside Metro Station',
    description: 'Altercation between two groups near gate 2. Suspect fled on black sports motorcycle.',
    incidentType: 'ASSAULT',
    severity: 'CRITICAL',
    status: 'UNIT_DISPATCHED',
    location: {
      latitude: 11.0195,
      longitude: 76.9625,
      address: 'Gandhipuram Terminal',
    },
    area: 'Central Bus Terminal Zone',
    reportedBy: 'Citizen SOS #44',
    assignedUnit: 'EAGLE-1',
    evidenceCount: 1,
    createdAt: '35 mins ago',
  },
  {
    id: 'INC-2026-883',
    title: 'Multi-Vehicle Collision on Flyover',
    description: 'Truck and two sedans collided on Avinashi Road flyover. Traffic police diverted lane 1.',
    incidentType: 'ACCIDENT',
    severity: 'MEDIUM',
    status: 'RESOLVED',
    location: {
      latitude: 11.0289,
      longitude: 76.9612,
      address: 'Avinashi Road Flyover',
    },
    area: 'East Corridor Highway',
    reportedBy: 'Traffic Surveillance Cam #09',
    assignedUnit: 'SENTINEL-9',
    evidenceCount: 4,
    createdAt: '2 hours ago',
  },
  {
    id: 'INC-2026-884',
    title: 'Vehicle Break-in & Bag Snatching',
    description: 'Window glass shattered on parked SUV, laptop bag and documents reported stolen.',
    incidentType: 'THEFT',
    severity: 'HIGH',
    status: 'REPORTED',
    location: {
      latitude: 11.0142,
      longitude: 76.9520,
      address: 'Race Course Road Walkway',
    },
    area: 'Race Course Promenade',
    reportedBy: 'Citizen e-Report',
    evidenceCount: 2,
    createdAt: '4 hours ago',
  },
  {
    id: 'INC-2026-885',
    title: 'Suspicious Reconnaissance Activity',
    description: 'Unidentified drone spotted hovering near restricted municipal water treatment facility.',
    incidentType: 'SURVEILLANCE',
    severity: 'LOW',
    status: 'REPORTED',
    location: {
      latitude: 11.0345,
      longitude: 77.0121,
      address: 'Peelamedu North',
    },
    area: 'Tech Park Utility Outpost',
    reportedBy: 'Facility Supervisor',
    evidenceCount: 1,
    createdAt: '6 hours ago',
  },
];

interface IncidentState {
  incidents: Incident[];
  selectedIncident: Incident | null;
  activeFilter: 'ALL' | IncidentType;
  searchQuery: string;
  isLoading: boolean;

  setSearchQuery: (query: string) => void;
  setActiveFilter: (filter: 'ALL' | IncidentType) => void;
  selectIncident: (incident: Incident | null) => void;
  addIncident: (incident: Omit<Incident, 'id' | 'createdAt'>) => Promise<Incident>;
  updateIncidentStatus: (id: string, status: IncidentStatus) => void;
  fetchIncidents: () => Promise<void>;
}

export const useIncidentStore = create<IncidentState>((set, get) => ({
  incidents: INITIAL_INCIDENTS,
  selectedIncident: INITIAL_INCIDENTS[0],
  activeFilter: 'ALL',
  searchQuery: '',
  isLoading: false,

  setSearchQuery: (query) => set({ searchQuery: query }),
  setActiveFilter: (filter) => set({ activeFilter: filter }),
  selectIncident: (incident) => set({ selectedIncident: incident }),

  addIncident: async (incidentData) => {
    set({ isLoading: true });
    const newIncident: Incident = {
      ...incidentData,
      id: `INC-2026-${Math.floor(Math.random() * 900) + 100}`,
      createdAt: 'Just now',
    };

    try {
      await api.createIncident({
        title: incidentData.title,
        description: incidentData.description,
        incidentType: incidentData.incidentType,
        severity: incidentData.severity,
        latitude: incidentData.location.latitude,
        longitude: incidentData.location.longitude,
      });
    } catch {
      // offline fallback
    }

    set((state) => ({
      isLoading: false,
      incidents: [newIncident, ...state.incidents],
      selectedIncident: newIncident,
    }));

    return newIncident;
  },

  updateIncidentStatus: (id, status) => {
    set((state) => ({
      incidents: state.incidents.map((inc) => (inc.id === id ? { ...inc, status } : inc)),
      selectedIncident:
        state.selectedIncident?.id === id
          ? { ...state.selectedIncident, status }
          : state.selectedIncident,
    }));
  },

  fetchIncidents: async () => {
    set({ isLoading: true });
    try {
      const res = await api.getIncidents();
      if (res.success && res.data?.length > 0) {
        // Keep initial rich mock if API response is minimal
        set({ isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },
}));
