import { create } from 'zustand';
import { FleetUnit } from '@/types';

const INITIAL_FLEET: FleetUnit[] = [
  {
    id: 'unit-1',
    callSign: 'EAGLE-1',
    officer: 'Sgt. M. Selvam',
    sector: 'RS Puram West Sector',
    battery: '94%',
    fuel: '82%',
    status: 'ON_PATROL',
    latitude: 11.0165,
    longitude: 76.9535,
    lastUpdate: 'Just now',
  },
  {
    id: 'unit-2',
    callSign: 'VIPER-3',
    officer: 'PC. Arjun Kumar',
    sector: 'Gandhipuram Commercial Hub',
    battery: '88%',
    fuel: '68%',
    status: 'RESPONDING',
    latitude: 11.0195,
    longitude: 76.9625,
    lastUpdate: '1 min ago',
  },
  {
    id: 'unit-3',
    callSign: 'SENTINEL-9',
    officer: 'Insp. R. Sundaram',
    sector: 'Avinashi Highway Perimeter',
    battery: '99%',
    fuel: '95%',
    status: 'AVAILABLE',
    latitude: 11.0289,
    longitude: 76.9612,
    lastUpdate: '3 mins ago',
  },
  {
    id: 'unit-4',
    callSign: 'DELTA-4',
    officer: 'PC. V. Anitha',
    sector: 'Race Course Promenade',
    battery: '76%',
    fuel: '54%',
    status: 'ON_SCENE',
    latitude: 11.0142,
    longitude: 76.9520,
    lastUpdate: '5 mins ago',
  },
];

interface FleetState {
  units: FleetUnit[];
  selectedUnit: FleetUnit | null;
  selectUnit: (unit: FleetUnit | null) => void;
  updateUnitStatus: (id: string, status: FleetUnit['status']) => void;
}

export const useFleetStore = create<FleetState>((set) => ({
  units: INITIAL_FLEET,
  selectedUnit: INITIAL_FLEET[0],
  selectUnit: (unit) => set({ selectedUnit: unit }),
  updateUnitStatus: (id, status) =>
    set((state) => ({
      units: state.units.map((u) => (u.id === id ? { ...u, status } : u)),
      selectedUnit: state.selectedUnit?.id === id ? { ...state.selectedUnit, status } : state.selectedUnit,
    })),
}));
