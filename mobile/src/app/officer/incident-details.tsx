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
import { SeverityBadge, StatusBadge } from '@/components/common/SeverityBadge';
import { useIncidentStore } from '@/store/incidentStore';

export default function IncidentDetailsScreen() {
  const router = useRouter();
  const { selectedIncident, updateIncidentStatus } = useIncidentStore();

  const incident = selectedIncident;

  if (!incident) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header title="Incident Dossier" showBack />
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>No incident selected.</Text>
        </View>
        <BottomNav />
      </SafeAreaView>
    );
  }

  const handleResolve = () => {
    updateIncidentStatus(incident.id, 'RESOLVED');
    if (Platform.OS !== 'web') {
      Alert.alert('Status Updated', 'Incident marked as RESOLVED and case notes logged.');
    }
  };

  const handleDispatchBackup = () => {
    updateIncidentStatus(incident.id, 'UNIT_DISPATCHED');
    if (Platform.OS !== 'web') {
      Alert.alert('Backup Dispatched', 'Tactical unit VIPER-3 routing to incident location.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Incident Dossier" subtitle={incident.id} showBack />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Main Card */}
        <View style={styles.card}>
          <View style={styles.badgeRow}>
            <SeverityBadge severity={incident.severity} />
            <View style={{ width: 8 }} />
            <StatusBadge status={incident.status} />
            <Text style={styles.timestamp}>{incident.createdAt}</Text>
          </View>

          <Text style={styles.title}>{incident.title}</Text>
          <Text style={styles.description}>{incident.description}</Text>

          {/* Location Details */}
          <View style={styles.locBox}>
            <Text style={styles.locHeader}>📍 SCENE OF OCCURRENCE</Text>
            <Text style={styles.locAddress}>{incident.location.address || incident.area}</Text>
            <Text style={styles.locCoords}>
              Lat: {incident.location.latitude} • Long: {incident.location.longitude}
            </Text>
          </View>

          {/* Incident Intelligence Meta */}
          <View style={styles.metaRow}>
            <Text style={styles.metaKey}>Incident Category:</Text>
            <Text style={styles.metaVal}>{incident.incidentType}</Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaKey}>Reported Source:</Text>
            <Text style={styles.metaVal}>{incident.reportedBy}</Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaKey}>Assigned Patrol Unit:</Text>
            <Text style={[styles.metaVal, { color: Colors.cyan }]}>
              {incident.assignedUnit || 'Unassigned'}
            </Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaKey}>Digital Evidence:</Text>
            <Text style={styles.metaVal}>{incident.evidenceCount || 0} Attached Files</Text>
          </View>
        </View>

        {/* Tactical Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.navigateBtn}
            onPress={() => router.push('/officer/patrol')}
            activeOpacity={0.85}
          >
            <Text style={styles.navigateBtnText}>🗺️ Navigate to GPS Coordinates</Text>
          </TouchableOpacity>

          <View style={styles.actionSplit}>
            <TouchableOpacity
              style={styles.backupBtn}
              onPress={handleDispatchBackup}
              activeOpacity={0.85}
            >
              <Text style={styles.backupBtnText}>Request Backup</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resolveBtn}
              onPress={handleResolve}
              activeOpacity={0.85}
            >
              <Text style={styles.resolveBtnText}>Mark Resolved ✓</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  emptyWrap: {
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
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  timestamp: {
    color: Colors.textDim,
    fontSize: 11,
    marginLeft: 'auto',
  },
  title: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: Typography.weights.heavy,
    marginBottom: Spacing.sm,
    letterSpacing: 0.3,
  },
  description: {
    color: Colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  locBox: {
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  locHeader: {
    color: Colors.cyan,
    fontSize: 11,
    fontWeight: Typography.weights.bold,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  locAddress: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: Typography.weights.semibold,
  },
  locCoords: {
    color: Colors.textDim,
    fontSize: 12,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
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
  actions: {
    gap: Spacing.md,
  },
  navigateBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  navigateBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: Typography.weights.bold,
  },
  actionSplit: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  backupBtn: {
    flex: 1,
    backgroundColor: Colors.emergencySoft,
    borderColor: Colors.emergency,
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  backupBtnText: {
    color: Colors.emergency,
    fontSize: 13,
    fontWeight: Typography.weights.bold,
  },
  resolveBtn: {
    flex: 1,
    backgroundColor: Colors.successSoft,
    borderColor: Colors.success,
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  resolveBtnText: {
    color: Colors.success,
    fontSize: 13,
    fontWeight: Typography.weights.bold,
  },
});
