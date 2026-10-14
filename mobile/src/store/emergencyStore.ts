import { create } from 'zustand';
import { EmergencyRequest } from '@/types';
import { api } from '@/services/api';

const INITIAL_CAD_QUEUE: EmergencyRequest[] = [
  {
    id: 'emg-001',
    trackingId: 'EMG-2026-0915-0042',
    citizenName: 'Gausik Srinivasan',
    phone: '+91 98401 22345',
    type: 'Assault Reported',
    priority: 'HIGH',
    status: 'PENDING_DISPATCH',
    location: {
      latitude: 11.0168,
      longitude: 76.9558,
      address: 'RS Puram, Coimbatore',
    },
    description: 'Physical confrontation reported outside commercial plaza. Urgent unit needed.',
    createdAt: '2 mins ago',
  },
  {
    id: 'emg-002',
    trackingId: 'EMG-2026-0915-0041',
    citizenName: 'Kavitha Ramachandran',
    phone: '+91 94432 11223',
    type: 'Road Accident',
    priority: 'MEDIUM',
    status: 'PENDING_DISPATCH',
    location: {
      latitude: 11.0289,
      longitude: 76.9612,
      address: 'Avinashi Road Flyover',
    },
    description: 'Multi-vehicle collision, moderate traffic blockage, 1 minor injury.',
    createdAt: '6 mins ago',
  },
  {
    id: 'emg-003',
    trackingId: 'EMG-2026-0915-0039',
    citizenName: 'IoT Motion Sensor 14',
    phone: 'SYSTEM_AUTOMATED',
    type: 'Suspicious Activity',
    priority: 'LOW',
    status: 'PENDING_DISPATCH',
    location: {
      latitude: 11.0345,
      longitude: 77.0121,
      address: 'Peelamedu Tech Park Perimeter',
    },
    description: 'Perimeter fence sensor breach alarm triggered during off-hours.',
    createdAt: '12 mins ago',
  },
  {
    id: 'emg-004',
    trackingId: 'EMG-2026-0915-0038',
    citizenName: 'Store Manager - Reliance Mart',
    phone: '+91 97890 44556',
    type: 'Theft In Progress',
    priority: 'HIGH',
    status: 'PENDING_DISPATCH',
    location: {
      latitude: 11.0182,
      longitude: 76.9698,
      address: 'Gandhipuram Cross Cut Road',
    },
    description: 'Shoplifter armed with blunt weapon resisting security. Urgent backup.',
    createdAt: '15 mins ago',
  },
];

interface EmergencyState {
  activeEmergency: EmergencyRequest | null;
  cadQueue: EmergencyRequest[];
  isLoading: boolean;
  error: string | null;

  triggerSOS: (coords?: { latitude: number; longitude: number; address?: string }) => Promise<EmergencyRequest>;
  clearActiveEmergency: () => void;
  assignUnitToEmergency: (emergencyId: string, unitCallSign: string) => void;
  resolveEmergency: (emergencyId: string) => void;
  addEmergencyFromSocket: (emergency: EmergencyRequest) => void;
}

export const useEmergencyStore = create<EmergencyState>((set, get) => ({
  activeEmergency: null,
  cadQueue: INITIAL_CAD_QUEUE,
  isLoading: false,
  error: null,

  triggerSOS: async (coords) => {
    set({ isLoading: true, error: null });
    const trackingId = `EMG-2026-${String(Date.now()).slice(-8)}`;
    const newEmergency: EmergencyRequest = {
      id: `emg-${Date.now()}`,
      trackingId,
      citizenName: 'Gausik Srinivasan',
      phone: '+91 98401 22345',
      type: 'Citizen Emergency SOS',
      priority: 'CRITICAL',
      status: 'PENDING_DISPATCH',
      location: {
        latitude: coords?.latitude || 11.0168,
        longitude: coords?.longitude || 76.9558,
        address: coords?.address || 'RS Puram, Coimbatore',
        accuracy: 4.5,
      },
      description: 'Emergency SOS beacon broadcasted with live GPS telemetry.',
      createdAt: 'Just now',
    };

    try {
      await api.sendSOS(newEmergency.location.latitude, newEmergency.location.longitude, newEmergency.description);
    } catch {
      // Graceful offline fallback
    }

    set((state) => ({
      isLoading: false,
      activeEmergency: newEmergency,
      cadQueue: [newEmergency, ...state.cadQueue],
    }));

    return newEmergency;
  },

  clearActiveEmergency: () => set({ activeEmergency: null }),

  assignUnitToEmergency: (emergencyId, unitCallSign) => {
    set((state) => ({
      cadQueue: state.cadQueue.map((item) =>
        item.id === emergencyId
          ? { ...item, status: 'UNIT_EN_ROUTE', assignedUnit: unitCallSign }
          : item
      ),
      activeEmergency:
        state.activeEmergency?.id === emergencyId
          ? { ...state.activeEmergency, status: 'UNIT_EN_ROUTE', assignedUnit: unitCallSign }
          : state.activeEmergency,
    }));
  },

  resolveEmergency: (emergencyId) => {
    set((state) => ({
      cadQueue: state.cadQueue.filter((item) => item.id !== emergencyId),
      activeEmergency: state.activeEmergency?.id === emergencyId ? null : state.activeEmergency,
    }));
  },

  addEmergencyFromSocket: (emergency) => {
    set((state) => ({
      cadQueue: [emergency, ...state.cadQueue.filter((e) => e.id !== emergency.id)],
    }));
  },
}));
