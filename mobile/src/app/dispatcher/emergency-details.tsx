import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { Header } from '@/components/common/Header';
import { BottomNav } from '@/components/common/BottomNav';
import { useEmergencyStore } from '@/store/emergencyStore';

export default function DispatcherEmergencyDetailsScreen() {
  const router = useRouter();
  const { cadQueue, assignUnitToEmergency, resolveEmergency } = useEmergencyStore();

  const emergency = cadQueue[0];

  if (!emergency) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header title="CAD Emergency Details" showBack />
        <View style={styles.empty}><Text style={styles.emptyText}>No emergency selected.</Text></View>
        <BottomNav />
      </SafeAreaView>
    );
  }

  const handleDispatch = (unit: string) => {
    assignUnitToEmergency(emergency.id, unit);
    if (Platform.OS !== 'web') {
      Alert.alert('Unit Dispatched', `Unit ${unit} has been routed with emergency lights.`);
    }
  };

  const handleResolve = () => {
    resolveEmergency(emergency.id);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Emergency Telemetry" subtitle={emergency.trackingId} showBack />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.priorityRow}>
            <View style={styles.priorityBadge}>
              <Text style={styles.priorityText}>{emergency.priority} PRIORITY</Text>
            </View>
            <Text style={styles.time}>{emergency.createdAt}</Text>
          </View>

          <Text style={styles.typeTitle}>{emergency.type}</Text>
          <Text style={styles.desc}>{emergency.description}</Text>

          <View style={styles.locBox}>
            <Text style={styles.locLabel}>📍 EMERGENCY LOCATION</Text>
            <Text style={styles.locAddr}>{emergency.location.address}</Text>
            <Text style={styles.locCoords}>
              Latitude: {emergency.location.latitude} • Longitude: {emergency.location.longitude}
            </Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaKey}>Distress Caller:</Text>
            <Text style={styles.metaVal}>{emergency.citizenName}</Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaKey}>Contact Phone:</Text>
            <Text style={styles.metaVal}>{emergency.phone}</Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaKey}>Assigned Fleet Unit:</Text>
            <Text style={[styles.metaVal, { color: Colors.cyan }]}>
              {emergency.assignedUnit || 'PENDING DISPATCH'}
            </Text>
          </View>
        </View>

        {/* Dispatch Controls */}
        <Text style={styles.sectionHeader}>Route Nearest Unit</Text>
        <View style={styles.unitRow}>
          {['EAGLE-1 (ETA 3m)', 'VIPER-3 (ETA 5m)', 'SENTINEL-9 (ETA 8m)'].map((u) => {
            const callSign = u.split(' ')[0];
            return (
              <TouchableOpacity
                key={u}
                style={styles.unitBtn}
                onPress={() => handleDispatch(callSign)}
                activeOpacity={0.8}
              >
                <Text style={styles.unitBtnText}>{u}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.resolveBtn} onPress={handleResolve} activeOpacity={0.85}>
          <Text style={styles.resolveBtnText}>Close / Mark Resolved ✓</Text>
        </TouchableOpacity>
      </ScrollView>
      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 14,
  },
  card: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  priorityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  priorityBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: Colors.emergency,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.pill,
  },
  priorityText: {
    color: Colors.emergency,
    fontSize: 10,
    fontWeight: Typography.weights.heavy,
  },
  time: {
    color: Colors.textDim,
    fontSize: 11,
  },
  typeTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: Typography.weights.heavy,
    marginBottom: 4,
  },
  desc: {
    color: Colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  locBox: {
    backgroundColor: Colors.backgroundSecondary,
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.md,
  },
  locLabel: {
    color: Colors.cyan,
    fontSize: 10,
    fontWeight: Typography.weights.heavy,
    marginBottom: 3,
  },
  locAddr: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: Typography.weights.bold,
  },
  locCoords: {
    color: Colors.textDim,
    fontSize: 11,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  metaKey: {
    color: Colors.textDim,
    fontSize: 13,
  },
  metaVal: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: Typography.weights.semibold,
  },
  sectionHeader: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: Typography.weights.bold,
    marginBottom: Spacing.sm,
  },
  unitRow: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  unitBtn: {
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.cyan,
    paddingVertical: 12,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  unitBtnText: {
    color: Colors.cyan,
    fontSize: 13,
    fontWeight: Typography.weights.bold,
  },
  resolveBtn: {
    backgroundColor: Colors.successSoft,
    borderColor: Colors.success,
    borderWidth: 1,
    paddingVertical: 14,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  resolveBtnText: {
    color: Colors.success,
    fontSize: 14,
    fontWeight: Typography.weights.bold,
  },
});
