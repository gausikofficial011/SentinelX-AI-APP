import { Platform } from 'react-native';

export const Colors = {
  // Brand Base
  background: '#030712', // Deep Obsidian
  backgroundSecondary: '#070D1B', // Dark Navy Surface
  backgroundCard: '#0D1527', // Card Surface
  backgroundCardHover: '#131F38',
  backgroundOverlay: 'rgba(3, 7, 18, 0.85)',
  glassBorder: 'rgba(56, 189, 248, 0.15)',
  glassBorderStrong: 'rgba(0, 240, 255, 0.4)',

  // Primary Accent & Tech
  primary: '#00A3FF',
  primaryGlow: 'rgba(0, 163, 255, 0.35)',
  cyan: '#00F0FF',
  cyanGlow: 'rgba(0, 240, 255, 0.25)',
  blue: '#3B82F6',

  // Status & Operational
  emergency: '#EF4444',
  emergencyGlow: 'rgba(239, 68, 68, 0.45)',
  emergencySoft: 'rgba(239, 68, 68, 0.15)',
  danger: '#DC2626',
  warning: '#F59E0B',
  warningGlow: 'rgba(245, 158, 11, 0.3)',
  warningSoft: 'rgba(245, 158, 11, 0.15)',
  success: '#10B981',
  successGlow: 'rgba(16, 185, 129, 0.3)',
  successSoft: 'rgba(16, 185, 129, 0.15)',
  purple: '#8B5CF6',
  purpleSoft: 'rgba(139, 92, 246, 0.18)',

  // Text Hierarchy
  text: '#F8FAFC',
  textMuted: '#94A3B8',
  textDim: '#64748B',
  textInverse: '#030712',

  // Borders & Dividers
  border: 'rgba(148, 163, 184, 0.12)',
  borderLight: 'rgba(255, 255, 255, 0.08)',
  divider: 'rgba(148, 163, 184, 0.12)',
  // Tactical Design System Palette from FRONTPAGE/DESIGN.md
  tactical: {
    surface: '#0d1515',
    surfaceDim: '#0d1515',
    surfaceBright: '#333b3b',
    surfaceContainerLowest: '#080f10',
    surfaceContainerLow: '#151d1e',
    surfaceContainer: '#192122',
    surfaceContainerHigh: '#232b2c',
    surfaceContainerHighest: '#2e3637',
    onSurface: '#dce4e4',
    onSurfaceVariant: '#b9cacb',
    outline: '#849495',
    outlineVariant: '#3a494b',
    primary: '#00f2ff',
    primaryContainer: '#00f2ff',
    onPrimaryContainer: '#006a71',
    primaryFixed: '#74f5ff',
    secondary: '#ddb7ff',
    secondaryContainer: '#6f00be',
    tertiary: '#fed83a',
    tertiaryContainer: '#fed83a',
    tertiaryFixed: '#ffe173',
    error: '#ffb4ab',
  },
  // Legacy theme support for template components
  light: {
    text: '#111827',
    textSecondary: '#6B7280',
    background: '#FFFFFF',
    backgroundElement: '#F3F4F6',
    backgroundSelected: '#E5E7EB',
    tint: '#00A3FF',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: '#00A3FF',
  },
  dark: {
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    background: '#030712',
    backgroundElement: '#0D1527',
    backgroundSelected: '#131F38',
    tint: '#00A3FF',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#00A3FF',
  },
} as const;

export type ThemeColor =
  | 'text'
  | 'textSecondary'
  | 'background'
  | 'backgroundElement'
  | 'backgroundSelected'
  | 'tint'
  | 'icon'
  | 'tabIconDefault'
  | 'tabIconSelected';

export const Fonts = {
  mono: Platform.select({
    ios: 'SpaceMono',
    android: 'monospace',
    default: 'monospace',
  }),
};

export const BottomTabInset = 60;
export const MaxContentWidth = 800;

export const Typography = {
  fontFamily: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'system-ui',
  }),
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    heavy: '800' as const,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  // Template compatibility aliases
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 9999,
} as const;

export const Shadows = {
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 6,
  },
  glowBlue: {
    shadowColor: '#00A3FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 8,
  },
  glowEmergency: {
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 20,
    elevation: 12,
  },
};
