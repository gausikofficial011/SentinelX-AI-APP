import { create } from 'zustand';
import { PublicAlert } from '@/types';
import { api } from '@/services/api';

const INITIAL_ALERTS: PublicAlert[] = [
  {
    id: 'ALT-101',
    title: 'High Security Advisory: Commercial Sector 2',
    message: 'Increased mobile patrol units active in RS Puram. Citizens requested to report suspicious bag drops.',
    severity: 'CRITICAL',
    area: 'RS Puram Commercial Zone',
    timestamp: '10 mins ago',
    read: false,
  },
  {
    id: 'ALT-102',
    title: 'Traffic Diversion & Drone Surveillance Operation',
    message: 'Avinashi Road flyover lane 1 diverted for CCTV sensor maintenance until 14:00 hrs.',
    severity: 'WARNING',
    area: 'Avinashi Highway',
    timestamp: '45 mins ago',
    read: false,
  },
  {
    id: 'ALT-103',
    title: 'Public Safety Awareness: Cyber Helpline 1930',
    message: 'Never share OTPs or download unverified APK files. Report cyber frauds within 2 hours to freeze transactions.',
    severity: 'LOW',
    area: 'Citywide Advisory',
    timestamp: '3 hours ago',
    read: true,
  },
];

interface AlertState {
  alerts: PublicAlert[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  broadcastAlert: (title: string, message: string, severity?: PublicAlert['severity'], area?: string) => Promise<void>;
}

export const useAlertStore = create<AlertState>((set) => ({
  alerts: INITIAL_ALERTS,
  unreadCount: 2,

  markAsRead: (id) =>
    set((state) => {
      const updated = state.alerts.map((a) => (a.id === id ? { ...a, read: true } : a));
      return {
        alerts: updated,
        unreadCount: updated.filter((a) => !a.read).length,
      };
    }),

  broadcastAlert: async (title, message, severity = 'CRITICAL', area = 'Citywide') => {
    const newAlert: PublicAlert = {
      id: `ALT-${Date.now()}`,
      title,
      message,
      severity,
      area,
      timestamp: 'Just now',
      read: false,
    };

    try {
      await api.broadcastAlert(title, message, severity, area);
    } catch {
      // offline fallback
    }

    set((state) => ({
      alerts: [newAlert, ...state.alerts],
      unreadCount: state.unreadCount + 1,
    }));
  },
}));
