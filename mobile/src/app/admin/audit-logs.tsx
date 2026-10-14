import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { Header } from '@/components/common/Header';
import { BottomNav } from '@/components/common/BottomNav';

export default function AuditLogsScreen() {
  const auditLogs = [
    {
      id: 'LOG-9921',
      actor: 'PC. Arjun Kumar (#TN-4587)',
      action: 'E-FIR_REGISTERED',
      details: 'Registered Electronic FIR-2026-44091 for Commercial Burglary',
      timestamp: '15 Sept 2026, 09:32 AM',
      ip: '192.168.0.108',
    },
    {
      id: 'LOG-9920',
      actor: 'Chief Dispatcher Mehta',
      action: 'CAD_UNIT_DISPATCHED',
      details: 'Routed Patrol Unit VIPER-3 to RS Puram distress emergency',
      timestamp: '15 Sept 2026, 09:28 AM',
      ip: '192.168.0.108',
    },
    {
      id: 'LOG-9919',
      actor: 'Dr. Arjun Roy (Analyst)',
      action: 'DBSCAN_RECOMPUTED',
      details: 'Recomputed spatial clusters with radius_km=2.0, min_samples=2',
      timestamp: '15 Sept 2026, 09:15 AM',
      ip: '192.168.0.108',
    },
    {
      id: 'LOG-9918',
      actor: 'Commissioner R. Natarajan',
      action: 'EMERGENCY_BROADCAST_SENT',
      details: 'Transmitted city-wide security advisory for Sector 4 North',
      timestamp: '15 Sept 2026, 08:50 AM',
      ip: '192.168.0.108',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Security Audit Trail" subtitle="Cryptographically Logged Operations" showBack />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {auditLogs.map((log) => (
          <View key={log.id} style={styles.logCard}>
            <View style={styles.topRow}>
              <Text style={styles.logId}>{log.id}</Text>
              <Text style={styles.time}>{log.timestamp}</Text>
            </View>

            <Text style={styles.actionTag}>{log.action}</Text>
            <Text style={styles.details}>{log.details}</Text>

            <View style={styles.footerRow}>
              <Text style={styles.actor}>Operative: {log.actor}</Text>
              <Text style={styles.ip}>IP: {log.ip}</Text>
            </View>
          </View>
        ))}
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
    gap: Spacing.md,
  },
  logCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  logId: {
    color: Colors.cyan,
    fontSize: 11,
    fontWeight: Typography.weights.heavy,
  },
  time: {
    color: Colors.textDim,
    fontSize: 11,
  },
  actionTag: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: Typography.weights.bold,
    marginBottom: 4,
  },
  details: {
    color: Colors.textMuted,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: Spacing.sm,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingTop: Spacing.xs,
  },
  actor: {
    color: Colors.textDim,
    fontSize: 11,
  },
  ip: {
    color: Colors.cyan,
    fontSize: 11,
    fontWeight: Typography.weights.semibold,
  },
});
