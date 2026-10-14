import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { Header } from '@/components/common/Header';
import { BottomNav } from '@/components/common/BottomNav';
import { GISMap } from '@/components/ui/GISMap';

export default function OfficerPatrolScreen() {
  const [patrolStatus, setPatrolStatus] = useState<'ACTIVE' | 'PAUSED'>('ACTIVE');
  const [sector, setSector] = useState('RS Puram West Sector (Zone 4)');

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Tactical Patrol Tracking" subtitle="GPS Sector Breadcrumbs" showDutyToggle />
      <View style={styles.topStatusCard}>
        <View style={styles.statusCol}>
          <Text style={styles.sectorLabel}>ASSIGNED PATROL SECTOR</Text>
          <Text style={styles.sectorName}>{sector}</Text>
          <Text style={styles.gpsCoord}>GPS Fix: 11.0168° N, 76.9558° E • Accuracy 3.2m</Text>
        </View>

        <TouchableOpacity
          style={[styles.toggleBtn, patrolStatus === 'ACTIVE' ? styles.activeBtn : styles.pausedBtn]}
          onPress={() => setPatrolStatus(patrolStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE')}
          activeOpacity={0.8}
        >
          <Text style={styles.toggleText}>{patrolStatus === 'ACTIVE' ? 'Patrolling' : 'Standby'}</Text>
        </TouchableOpacity>
      </View>

      <GISMap />
      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topStatusCard: {
    backgroundColor: Colors.backgroundCard,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusCol: {
    flex: 1,
  },
  sectorLabel: {
    color: Colors.cyan,
    fontSize: 10,
    fontWeight: Typography.weights.heavy,
    letterSpacing: 0.5,
  },
  sectorName: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: Typography.weights.bold,
    marginTop: 2,
  },
  gpsCoord: {
    color: Colors.textDim,
    fontSize: 11,
    marginTop: 2,
  },
  toggleBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  activeBtn: {
    backgroundColor: Colors.successSoft,
    borderColor: Colors.success,
  },
  pausedBtn: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: Colors.warning,
  },
  toggleText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: Typography.weights.bold,
  },
});
