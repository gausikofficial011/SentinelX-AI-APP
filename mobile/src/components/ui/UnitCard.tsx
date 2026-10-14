import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { FleetUnit } from '@/types';

interface UnitCardProps {
  unit: FleetUnit;
  onPress?: () => void;
  onDispatchPress?: () => void;
}

export function UnitCard({ unit, onPress, onDispatchPress }: UnitCardProps) {
  const isAvailable = unit.status === 'AVAILABLE';
  const isResponding = unit.status === 'RESPONDING';
  const statusColor = isAvailable ? Colors.success : isResponding ? Colors.warning : Colors.primary;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.headerRow}>
        <View style={styles.callSignRow}>
          <Text style={styles.carIcon}>🚔</Text>
          <Text style={styles.callSign}>{unit.callSign}</Text>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: `${statusColor}18`, borderColor: `${statusColor}40` }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>{unit.status.replace('_', ' ')}</Text>
        </View>
      </View>

      <Text style={styles.officerName}>👤 {unit.officer}</Text>
      <Text style={styles.sectorText}>📍 {unit.sector}</Text>

      <View style={styles.footerRow}>
        <View style={styles.telemetryGroup}>
          <Text style={styles.telemetryText}>🔋 Battery: {unit.battery}</Text>
          <Text style={styles.telemetryText}>⛽ Fuel: {unit.fuel}</Text>
        </View>

        {onDispatchPress && (
          <TouchableOpacity
            style={styles.dispatchBtn}
            onPress={onDispatchPress}
            activeOpacity={0.7}
          >
            <Text style={styles.dispatchBtnText}>Dispatch</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  callSignRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  carIcon: {
    fontSize: 18,
    marginRight: Spacing.xs,
  },
  callSign: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: Typography.weights.heavy,
    letterSpacing: 0.5,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 10,
    fontWeight: Typography.weights.heavy,
    textTransform: 'uppercase',
  },
  officerName: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: Typography.weights.semibold,
    marginTop: 2,
  },
  sectorText: {
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 2,
    marginBottom: Spacing.sm,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingTop: Spacing.sm,
  },
  telemetryGroup: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  telemetryText: {
    color: Colors.textDim,
    fontSize: 11,
  },
  dispatchBtn: {
    backgroundColor: Colors.cyanGlow,
    borderColor: Colors.cyan,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  dispatchBtnText: {
    color: Colors.cyan,
    fontSize: 12,
    fontWeight: Typography.weights.bold,
  },
});
