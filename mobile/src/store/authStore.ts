import { create } from 'zustand';
import { UserProfile, UserRole } from '@/types';

export interface RoleCredential {
  role: UserRole;
  identifier: string;
  password: string;
  name: string;
  badge: string;
  tagline: string;
}

export const PRESET_CREDENTIALS: Record<UserRole, RoleCredential> = {
  CITIZEN: {
    role: 'CITIZEN',
    identifier: 'citizen@example.com',
    password: 'citizen123',
    name: 'Ananya Sharma',
    badge: 'Verified Citizen ID #DL-8821',
    tagline: 'Public Safety, SOS & E-FIR Tracking',
  },
  OFFICER: {
    role: 'OFFICER',
    identifier: 'officer01',
    password: 'police123',
    name: 'Insp. Vikram Rathore',
    badge: 'Badge #DL-4082',
    tagline: 'Field Patrol, Tactical Response & FIRs',
  },
  DISPATCHER: {
    role: 'DISPATCHER',
    identifier: 'dispatcher01',
    password: 'dispatch123',
    name: 'Chief Dispatcher Mehta',
    badge: 'CAD-Lead-09',
    tagline: '911 Queue & Fleet Unit Deployment',
  },
  INTELLIGENCE_ANALYST: {
    role: 'INTELLIGENCE_ANALYST',
    identifier: 'analyst01',
    password: 'analyst123',
    name: 'Dr. Arjun Roy',
    badge: 'INTEL-7 Division',
    tagline: 'AI DBSCAN Hotspots & Crime Forecasting',
  },
  ADMIN: {
    role: 'ADMIN',
    identifier: 'staff',
    password: 'staff123',
    name: 'Staff Administrator',
    badge: 'HQ-COMMANDER',
    tagline: 'Personnel Roster & System Oversight',
  },
  SUPER_ADMIN: {
    role: 'SUPER_ADMIN',
    identifier: 'admin',
    password: 'password',
    name: 'System Administrator',
    badge: 'SUPERUSER-ROOT',
    tagline: 'Security Infrastructure & Master Console',
  },
};

export const PRESET_ACCOUNTS: Record<UserRole, UserProfile> = {
  CITIZEN: {
    id: 'user-citizen',
    email: 'citizen@example.com',
    username: 'citizen@example.com',
    fullName: 'Ananya Sharma',
    role: 'CITIZEN',
    phone: '+91 98401 22345',
    stationName: 'Sector 4 District Outpost',
    department: 'Civilian Public Safety Services',
    badgeNumber: 'Verified Citizen ID #DL-8821',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
  },
  OFFICER: {
    id: 'user-officer',
    email: 'officer01@sentinelx.gov',
    username: 'officer01',
    fullName: 'Insp. Vikram Rathore',
    role: 'OFFICER',
    badgeNumber: 'Badge #DL-4082',
    stationName: 'Central District Police HQ',
    department: 'Tactical Crime Suppression & Field Response',
    dutyStatus: 'ON_DUTY',
    phone: '+91 94440 98765',
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
  },
  DISPATCHER: {
    id: 'user-dispatcher',
    email: 'dispatcher01@sentinelx.gov',
    username: 'dispatcher01',
    fullName: 'Chief Dispatcher Mehta',
    role: 'DISPATCHER',
    badgeNumber: 'CAD-Lead-09',
    stationName: 'Emergency Communications Hub 911',
    department: 'Central Computer-Aided Dispatch',
    dutyStatus: 'ON_DUTY',
    phone: '+91 98840 55667',
  },
  INTELLIGENCE_ANALYST: {
    id: 'user-analyst',
    email: 'analyst01@sentinelx.gov',
    username: 'analyst01',
    fullName: 'Dr. Arjun Roy',
    role: 'INTELLIGENCE_ANALYST',
    badgeNumber: 'INTEL-7 Division',
    stationName: 'Directorate of Crime Analytics',
    department: 'Spatial Crime Intelligence & AI Engine',
    dutyStatus: 'ON_DUTY',
    phone: '+91 98402 33445',
  },
  ADMIN: {
    id: 'user-admin',
    email: 'staff@sentinelx.gov',
    username: 'staff',
    fullName: 'Staff Administrator',
    role: 'ADMIN',
    badgeNumber: 'HQ-COMMANDER',
    stationName: 'City Command & Control Bureau',
    department: 'Executive Administration & Operations',
    dutyStatus: 'ON_DUTY',
  },
  SUPER_ADMIN: {
    id: 'user-superadmin',
    email: 'admin@sentinelx.gov',
    username: 'admin',
    fullName: 'System Administrator',
    role: 'SUPER_ADMIN',
    badgeNumber: 'SUPERUSER-ROOT',
    stationName: 'National Cyber Security Infrastructure',
    department: 'Platform Governance & Master Security',
  },
};

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  dutyStatus: 'ON_DUTY' | 'OFF_DUTY';
  selectedRoleForOnboarding: UserRole;
  setRoleForOnboarding: (role: UserRole) => void;
  loginWithRole: (role: UserRole) => UserProfile;
  loginCustom: (user: UserProfile, token: string) => void;
  toggleDutyStatus: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  dutyStatus: 'ON_DUTY',
  selectedRoleForOnboarding: 'CITIZEN',

  setRoleForOnboarding: (role) => set({ selectedRoleForOnboarding: role }),

  loginWithRole: (role) => {
    const profile = PRESET_ACCOUNTS[role] || PRESET_ACCOUNTS.CITIZEN;
    set({
      user: profile,
      token: `jwt-${role.toLowerCase()}-sentinelx-token`,
      isAuthenticated: true,
      dutyStatus: profile.dutyStatus || 'ON_DUTY',
    });
    return profile;
  },

  loginCustom: (user, token) =>
    set({
      user,
      token,
      isAuthenticated: true,
      dutyStatus: user.dutyStatus || 'ON_DUTY',
    }),

  toggleDutyStatus: () =>
    set((state) => ({
      dutyStatus: state.dutyStatus === 'ON_DUTY' ? 'OFF_DUTY' : 'ON_DUTY',
    })),

  logout: () =>
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    }),
}));
