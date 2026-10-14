import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { Header } from '@/components/common/Header';
import { BottomNav } from '@/components/common/BottomNav';
import { StatCard } from '@/components/common/StatCard';
import { IncidentCard } from '@/components/ui/IncidentCard';
import { FIRStepper } from '@/components/ui/FIRStepper';
import { useIncidentStore } from '@/store/incidentStore';

export default function OfficerDashboardScreen() {
  const router = useRouter();
  const { incidents } = useIncidentStore();
  const [firModalVisible, setFirModalVisible] = useState(false);

  const quickActions = [
    { label: 'File FIR', icon: '📄', action: () => setFirModalVisible(true) },
    { label: 'Scan Vehicle', icon: '🚗', action: () => router.push('/citizen/stolen-vehicle') },
    { label: 'Check Person', icon: '👤', action: () => router.push('/officer/suspect-dossier') },
    { label: 'Evidence', icon: '📎', action: () => router.push('/officer/evidence') },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header showDutyToggle showLiveBadge />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Metric Cards Grid matching screen #6 */}
        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <StatCard
              label="Live Incidents"
              value={8}
              icon="🔔"
              color={Colors.warning}
              onPress={() => router.push('/officer/incidents')}
            />
            <StatCard
              label="Assigned Tasks"
              value={3}
              icon="📋"
              color={Colors.primary}
              onPress={() => router.push('/officer/incidents')}
            />
          </View>

          <View style={styles.statsRow}>
            <StatCard
              label="Nearby Units"
              value={12}
              icon="🚨"
              color={Colors.success}
              onPress={() => router.push('/officer/patrol')}
            />
            <StatCard
              label="Messages"
              value={5}
              icon="💬"
              color={Colors.purple}
              onPress={() => router.push('/copilot' as any)}
            />
          </View>
        </View>

        {/* Quick Actions matching screen #6 */}
        <Text style={styles.sectionHeader}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.actionBtn}
              onPress={item.action}
              activeOpacity={0.75}
            >
              <View style={styles.actionIconBox}>
                <Text style={styles.actionIcon}>{item.icon}</Text>
              </View>
              <Text style={styles.actionLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Live Priority Incident */}
        <View style={styles.incidentHeaderRow}>
          <Text style={styles.sectionHeader}>Assigned Dispatch Mission</Text>
          <TouchableOpacity onPress={() => router.push('/officer/incidents')}>
            <Text style={styles.viewAllText}>View All ›</Text>
          </TouchableOpacity>
        </View>

        {incidents.length > 0 && (
          <IncidentCard
            incident={incidents[0]}
            onPress={() => router.push('/officer/incident-details')}
          />
        )}
      </ScrollView>

      {/* FIR Creation Stepper Modal */}
      <Modal visible={firModalVisible} animationType="slide">
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
          <FIRStepper
            onSuccess={() => setFirModalVisible(false)}
            onCancel={() => setFirModalVisible(false)}
          />
        </SafeAreaView>
      </Modal>

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
  statsGrid: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  sectionHeader: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: Typography.weights.bold,
    marginBottom: Spacing.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  actionBtn: {
    width: '23%',
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  actionIcon: {
    fontSize: 18,
  },
  actionLabel: {
    color: Colors.text,
    fontSize: 11,
    fontWeight: Typography.weights.medium,
    textAlign: 'center',
  },
  incidentHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  viewAllText: {
    color: Colors.cyan,
    fontSize: 13,
    fontWeight: Typography.weights.bold,
  },
});
