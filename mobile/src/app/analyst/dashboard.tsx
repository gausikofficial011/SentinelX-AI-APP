import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { Header } from '@/components/common/Header';
import { BottomNav } from '@/components/common/BottomNav';
import { ForecastChart } from '@/components/ui/ForecastChart';
import { useHotspotStore } from '@/store/hotspotStore';

export default function AnalystDashboardScreen() {
  const router = useRouter();
  const { totalIncidentsCount, hotspotCount, predictedVolume7d } = useHotspotStore();
  const [timeRange, setTimeRange] = useState('7 Days');

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Crime Analytics" subtitle="AI Density Clustering & Predictive Models" />

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Time Selector Row matching screen #8 */}
        <View style={styles.timeRow}>
          <Text style={styles.sectionTitle}>Predictive Intelligence</Text>
          <TouchableOpacity style={styles.timeDropdown} activeOpacity={0.8}>
            <Text style={styles.timeText}>{timeRange} ▾</Text>
          </TouchableOpacity>
        </View>

        {/* 3 Metric Cards matching screen #8 */}
        <View style={styles.kpiRow}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Total Incidents</Text>
            <Text style={styles.kpiVal}>{totalIncidentsCount}</Text>
            <View style={styles.deltaBadge}>
              <Text style={styles.deltaText}>↑ 12%</Text>
            </View>
          </View>

          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Hotspots</Text>
            <Text style={styles.kpiVal}>{hotspotCount}</Text>
            <View style={styles.deltaBadge}>
              <Text style={styles.deltaText}>↑ 2</Text>
            </View>
          </View>

          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Predicted (Next 7d)</Text>
            <Text style={styles.kpiVal}>{predictedVolume7d}</Text>
            <View style={styles.deltaBadge}>
              <Text style={styles.deltaText}>↑ 18%</Text>
            </View>
          </View>
        </View>

        {/* Incident Forecast Chart matching screen #8 */}
        <ForecastChart />

        {/* AI Recommendations Quick Card */}
        <View style={styles.recomCard}>
          <View style={styles.recomTop}>
            <Text style={styles.recomTitle}>🧠 AI Tactical Patrol Allocation</Text>
            <View style={styles.aiPill}>
              <Text style={styles.aiPillText}>Prophet + DBSCAN</Text>
            </View>
          </View>

          <Text style={styles.recomBody}>
            High probability of evening burglary incidents detected in Sector 4 North Corridor. Recommending +2 mobile interceptors between 20:00 and 02:00.
          </Text>

          <TouchableOpacity
            style={styles.planBtn}
            onPress={() => router.push('/analyst/patrol-planning')}
            activeOpacity={0.85}
          >
            <Text style={styles.planBtnText}>Review Patrol Recommendations →</Text>
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
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: Typography.weights.bold,
  },
  timeDropdown: {
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.pill,
  },
  timeText: {
    color: Colors.cyan,
    fontSize: 12,
    fontWeight: Typography.weights.bold,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'flex-start',
  },
  kpiLabel: {
    color: Colors.textDim,
    fontSize: 11,
    fontWeight: Typography.weights.semibold,
    marginBottom: 4,
  },
  kpiVal: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: Typography.weights.heavy,
    marginBottom: 6,
  },
  deltaBadge: {
    backgroundColor: Colors.successSoft,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.pill,
  },
  deltaText: {
    color: Colors.success,
    fontSize: 10,
    fontWeight: Typography.weights.bold,
  },
  recomCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: Spacing.sm,
  },
  recomTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  recomTitle: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: Typography.weights.bold,
  },
  aiPill: {
    backgroundColor: 'rgba(0, 163, 255, 0.15)',
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.pill,
  },
  aiPillText: {
    color: Colors.cyan,
    fontSize: 10,
    fontWeight: Typography.weights.bold,
  },
  recomBody: {
    color: Colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  planBtn: {
    backgroundColor: Colors.cyanGlow,
    borderColor: Colors.cyan,
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  planBtnText: {
    color: Colors.cyan,
    fontSize: 13,
    fontWeight: Typography.weights.bold,
  },
});
