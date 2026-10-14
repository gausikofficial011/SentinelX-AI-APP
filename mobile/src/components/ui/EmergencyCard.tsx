import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { EmergencyRequest } from '@/types';

interface EmergencyCardProps {
  emergency: EmergencyRequest;
  onPress?: () => void;
  onAssignPress?: () => void;
}

export function EmergencyCard({ emergency, onPress, onAssignPress }: EmergencyCardProps) {
  const isHigh = emergency.priority === 'HIGH' || emergency.priority === 'CRITICAL';
  const isMedium = emergency.priority === 'MEDIUM';

  const badgeColor = isHigh ? Colors.emergency : isMedium ? Colors.warning : Colors.success;
  const iconEmoji = isHigh ? '🚨' : isMedium ? '🚗' : '👁️';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.leftCol}>
        <View style={[styles.iconBox, { backgroundColor: `${badgeColor}20`, borderColor: `${badgeColor}40` }]}>
          <Text style={styles.icon}>{iconEmoji}</Text>
        </View>

        <View style={styles.infoCol}>
          <View style={styles.topMeta}>
            <Text style={[styles.priorityTag, { color: badgeColor }]}>
              {emergency.priority.charAt(0) + emergency.priority.slice(1).toLowerCase()}
            </Text>
          </View>

          <Text style={styles.title} numberOfLines={1}>
            {emergency.type}
          </Text>

          <Text style={styles.location} numberOfLines={1}>
            📍 {emergency.location.address || 'Unknown Location'}
          </Text>
        </View>
      </View>

      <View style={styles.rightCol}>
        <Text style={styles.timeText}>{emergency.createdAt}</Text>

        <TouchableOpacity
          style={[
            styles.assignBtn,
            emergency.status === 'UNIT_EN_ROUTE' && styles.assignedBtn,
          ]}
          onPress={onAssignPress || onPress}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.assignText,
              emergency.status === 'UNIT_EN_ROUTE' && styles.assignedText,
            ]}
          >
            {emergency.status === 'UNIT_EN_ROUTE' ? emergency.assignedUnit || 'Dispatched' : 'Assign'}
          </Text>
        </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  icon: {
    fontSize: 20,
  },
  infoCol: {
    flex: 1,
  },
  topMeta: {
    marginBottom: 2,
  },
  priorityTag: {
    fontSize: 11,
    fontWeight: Typography.weights.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: Typography.weights.bold,
    marginBottom: 2,
  },
  location: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  rightCol: {
    alignItems: 'flex-end',
    marginLeft: Spacing.sm,
  },
  timeText: {
    color: Colors.textDim,
    fontSize: 11,
    marginBottom: 8,
  },
  assignBtn: {
    backgroundColor: Colors.cyanGlow,
    borderColor: Colors.cyan,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Radius.sm,
  },
  assignedBtn: {
    backgroundColor: Colors.successSoft,
    borderColor: Colors.success,
  },
  assignText: {
    color: Colors.cyan,
    fontSize: 12,
    fontWeight: Typography.weights.bold,
  },
  assignedText: {
    color: Colors.success,
  },
});
