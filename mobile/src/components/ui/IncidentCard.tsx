import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { Incident } from '@/types';
import { SeverityBadge, StatusBadge } from '@/components/common/SeverityBadge';

interface IncidentCardProps {
  incident: Incident;
  onPress?: () => void;
}

export function IncidentCard({ incident, onPress }: IncidentCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.headerRow}>
        <View style={styles.badgeGroup}>
          <SeverityBadge severity={incident.severity} />
          <View style={{ width: 6 }} />
          <StatusBadge status={incident.status} />
        </View>
        <Text style={styles.timeText}>{incident.createdAt}</Text>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {incident.title}
      </Text>

      <Text style={styles.desc} numberOfLines={2}>
        {incident.description}
      </Text>

      <View style={styles.footerRow}>
        <Text style={styles.locationText} numberOfLines={1}>
          📍 {incident.location.address || incident.area}
        </Text>
        {incident.evidenceCount !== undefined && incident.evidenceCount > 0 && (
          <View style={styles.evidenceTag}>
            <Text style={styles.evidenceText}>📎 {incident.evidenceCount} Evidences</Text>
          </View>
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
    marginBottom: Spacing.sm,
  },
  badgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    color: Colors.textDim,
    fontSize: 11,
  },
  title: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: Typography.weights.bold,
    marginBottom: 4,
  },
  desc: {
    color: Colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
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
  locationText: {
    color: Colors.textMuted,
    fontSize: 12,
    flex: 1,
  },
  evidenceTag: {
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.xs,
    marginLeft: Spacing.sm,
  },
  evidenceText: {
    color: Colors.cyan,
    fontSize: 11,
    fontWeight: Typography.weights.semibold,
  },
});
