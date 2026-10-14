import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Colors, Typography, Radius } from '@/constants/theme';
import { SeverityLevel, IncidentStatus } from '@/types';

export function SeverityBadge({ severity }: { severity: SeverityLevel }) {
  const getStyle = () => {
    switch (severity?.toUpperCase()) {
      case 'CRITICAL':
        return { bg: 'rgba(239, 68, 68, 0.15)', text: Colors.emergency, border: 'rgba(239, 68, 68, 0.35)' };
      case 'HIGH':
        return { bg: 'rgba(249, 115, 22, 0.15)', text: '#F97316', border: 'rgba(249, 115, 22, 0.35)' };
      case 'MEDIUM':
        return { bg: 'rgba(245, 158, 11, 0.15)', text: Colors.warning, border: 'rgba(245, 158, 11, 0.35)' };
      default:
        return { bg: 'rgba(16, 185, 129, 0.15)', text: Colors.success, border: 'rgba(16, 185, 129, 0.35)' };
    }
  };

  const s = getStyle();

  return (
    <View style={[styles.badge, { backgroundColor: s.bg, borderColor: s.border }]}>
      <Text style={[styles.badgeText, { color: s.text }]}>{severity}</Text>
    </View>
  );
}

export function StatusBadge({ status }: { status: IncidentStatus | string }) {
  const getStyle = () => {
    switch (status) {
      case 'UNIT_DISPATCHED':
      case 'UNIT_EN_ROUTE':
        return { bg: 'rgba(0, 163, 255, 0.15)', text: Colors.primary, border: 'rgba(0, 163, 255, 0.35)' };
      case 'RESOLVED':
        return { bg: 'rgba(16, 185, 129, 0.15)', text: Colors.success, border: 'rgba(16, 185, 129, 0.35)' };
      case 'UNDER_INVESTIGATION':
        return { bg: 'rgba(245, 158, 11, 0.15)', text: Colors.warning, border: 'rgba(245, 158, 11, 0.35)' };
      default:
        return { bg: 'rgba(148, 163, 184, 0.15)', text: Colors.textMuted, border: 'rgba(148, 163, 184, 0.3)' };
    }
  };

  const s = getStyle();

  return (
    <View style={[styles.badge, { backgroundColor: s.bg, borderColor: s.border }]}>
      <Text style={[styles.badgeText, { color: s.text }]}>{status.replace('_', ' ')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.pill,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: Typography.weights.heavy,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
});
