import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  delta?: string;
  isPositive?: boolean;
  color?: string;
  onPress?: () => void;
}

export function StatCard({
  label,
  value,
  icon,
  delta,
  isPositive = true,
  color = Colors.primary,
  onPress,
}: StatCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={onPress ? 0.75 : 1}
    >
      <View style={styles.topRow}>
        <View style={[styles.iconBox, { backgroundColor: `${color}15`, borderColor: `${color}30` }]}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
        {delta && (
          <View style={[styles.deltaBadge, { backgroundColor: isPositive ? Colors.successSoft : 'rgba(239, 68, 68, 0.15)' }]}>
            <Text style={[styles.deltaText, { color: isPositive ? Colors.success : Colors.danger }]}>
              {delta}
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
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
    flex: 1,
    minWidth: 140,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  icon: {
    fontSize: 16,
  },
  deltaBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.pill,
  },
  deltaText: {
    fontSize: 11,
    fontWeight: Typography.weights.bold,
  },
  value: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: Typography.weights.heavy,
    letterSpacing: 0.5,
  },
  label: {
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 2,
    fontWeight: Typography.weights.medium,
  },
});
