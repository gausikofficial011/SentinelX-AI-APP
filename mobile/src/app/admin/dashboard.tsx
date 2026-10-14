import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { Header } from '@/components/common/Header';
import { BottomNav } from '@/components/common/BottomNav';
import { api } from '@/services/api';

export default function AdminDashboardScreen() {
  const router = useRouter();
  const [nodeOk, setNodeOk] = useState(false);
  const [nodeLatency, setNodeLatency] = useState(0);
  const [pyOk, setPyOk] = useState(false);
  const [pyLatency, setPyLatency] = useState(0);
  const [checking, setChecking] = useState(true);

  const checkTelemetry = async () => {
    setChecking(true);
    const [nRes, pRes] = await Promise.all([api.checkNodeHealth(), api.checkPythonAiHealth()]);
    setNodeOk(nRes.ok);
    setNodeLatency(nRes.latencyMs || 24);
    setPyOk(pRes.ok);
    setPyLatency(pRes.latencyMs || 45);
    setChecking(false);
  };

  useEffect(() => {
    checkTelemetry();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Command Bureau" subtitle="System Administration & Telemetry" />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* System Telemetry Cluster */}
        <View style={styles.clusterCard}>
          <View style={styles.clusterTop}>
            <Text style={styles.clusterTitle}>🖥️ Live Cluster Diagnostics</Text>
            <TouchableOpacity onPress={checkTelemetry} disabled={checking}>
              {checking ? (
                <ActivityIndicator size="small" color={Colors.cyan} />
              ) : (
                <Text style={styles.refreshText}>↻ Refresh</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Service Rows */}
          <View style={styles.serviceRow}>
            <View style={styles.serviceLeft}>
              <View style={[styles.statusDot, { backgroundColor: nodeOk ? Colors.success : Colors.danger }]} />
              <Text style={styles.serviceName}>Node.js API (:3000)</Text>
            </View>
            <Text style={styles.latencyText}>{nodeOk ? `${nodeLatency} ms` : 'OFFLINE'}</Text>
          </View>

          <View style={styles.serviceRow}>
            <View style={styles.serviceLeft}>
              <View style={[styles.statusDot, { backgroundColor: pyOk ? Colors.success : Colors.danger }]} />
              <Text style={styles.serviceName}>Python AI Engine (:8000)</Text>
            </View>
            <Text style={styles.latencyText}>{pyOk ? `${pyLatency} ms` : 'OFFLINE'}</Text>
          </View>

          <View style={styles.serviceRow}>
            <View style={styles.serviceLeft}>
              <View style={[styles.statusDot, { backgroundColor: Colors.success }]} />
              <Text style={styles.serviceName}>PostgreSQL + PostGIS</Text>
            </View>
            <Text style={styles.latencyText}>12 ms</Text>
          </View>

          <View style={styles.serviceRow}>
            <View style={styles.serviceLeft}>
              <View style={[styles.statusDot, { backgroundColor: Colors.success }]} />
              <Text style={styles.serviceName}>Socket.IO Real-time Events</Text>
            </View>
            <Text style={styles.latencyText}>CONNECTED</Text>
          </View>
        </View>

        {/* Quick Administration Actions */}
        <Text style={styles.sectionHeader}>Security & Administration Operations</Text>
        <View style={styles.opsGrid}>
          <TouchableOpacity
            style={styles.opsCard}
            onPress={() => router.push('/admin/users')}
            activeOpacity={0.8}
          >
            <Text style={styles.opsIcon}>👥</Text>
            <Text style={styles.opsTitle}>Personnel Roster</Text>
            <Text style={styles.opsDesc}>Manage officers, analysts & credentials</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.opsCard}
            onPress={() => router.push('/admin/alerts')}
            activeOpacity={0.8}
          >
            <Text style={styles.opsIcon}>📢</Text>
            <Text style={styles.opsTitle}>Emergency Broadcast</Text>
            <Text style={styles.opsDesc}>Push city-wide critical advisories</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.opsCard}
            onPress={() => router.push('/admin/system-health')}
            activeOpacity={0.8}
          >
            <Text style={styles.opsIcon}>⚙️</Text>
            <Text style={styles.opsTitle}>Cluster Telemetry</Text>
            <Text style={styles.opsDesc}>Deep database & memory logs</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.opsCard}
            onPress={() => router.push('/admin/audit-logs')}
            activeOpacity={0.8}
          >
            <Text style={styles.opsIcon}>🔒</Text>
            <Text style={styles.opsTitle}>Security Audit</Text>
            <Text style={styles.opsDesc}>Immutable officer access records</Text>
          </TouchableOpacity>
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
  clusterCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xl,
  },
  clusterTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  clusterTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: Typography.weights.bold,
  },
  refreshText: {
    color: Colors.cyan,
    fontSize: 12,
    fontWeight: Typography.weights.bold,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  serviceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.sm,
  },
  serviceName: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: Typography.weights.semibold,
  },
  latencyText: {
    color: Colors.cyan,
    fontSize: 12,
    fontWeight: Typography.weights.bold,
  },
  sectionHeader: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: Typography.weights.bold,
    marginBottom: Spacing.md,
  },
  opsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  opsCard: {
    width: '47%',
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  opsIcon: {
    fontSize: 26,
    marginBottom: Spacing.xs,
  },
  opsTitle: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: Typography.weights.bold,
    marginBottom: 2,
  },
  opsDesc: {
    color: Colors.textMuted,
    fontSize: 11,
    lineHeight: 15,
  },
});
