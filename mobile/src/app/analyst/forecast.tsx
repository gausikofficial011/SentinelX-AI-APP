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
import { ForecastChart } from '@/components/ui/ForecastChart';
import { useHotspotStore } from '@/store/hotspotStore';

export default function AnalystForecastScreen() {
  const { forecast } = useHotspotStore();

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="7-Day Incident Forecast" subtitle="Prophet & XGBoost Machine Learning Model" showBack />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <ForecastChart />

        <Text style={styles.sectionHeader}>Daily Breakdown & Risk Analysis</Text>
        {forecast.map((f) => (
          <View key={f.date} style={styles.dayCard}>
            <View style={styles.dayHeader}>
              <Text style={styles.dayDate}>{f.dayLabel} ({f.date})</Text>
              <View
                style={[
                  styles.riskPill,
                  {
                    backgroundColor:
                      f.riskLevel === 'CRITICAL'
                        ? 'rgba(239, 68, 68, 0.15)'
                        : f.riskLevel === 'HIGH'
                        ? 'rgba(249, 115, 22, 0.15)'
                        : 'rgba(245, 158, 11, 0.15)',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.riskText,
                    {
                      color:
                        f.riskLevel === 'CRITICAL'
                          ? Colors.emergency
                          : f.riskLevel === 'HIGH'
                          ? '#F97316'
                          : Colors.warning,
                    },
                  ]}
                >
                  {f.riskLevel} RISK
                </Text>
              </View>
            </View>

            <View style={styles.metricsRow}>
              <View style={styles.metricCol}>
                <Text style={styles.metricLabel}>Baseline Historical</Text>
                <Text style={styles.metricVal}>{f.historicalCount} calls</Text>
              </View>
              <View style={styles.metricCol}>
                <Text style={styles.metricLabel}>Model Prediction</Text>
                <Text style={[styles.metricVal, { color: Colors.cyan }]}>
                  {f.predictedCount} calls
                </Text>
              </View>
              <View style={styles.metricCol}>
                <Text style={styles.metricLabel}>Expected Trend</Text>
                <Text style={[styles.metricVal, { color: Colors.success }]}>
                  +{f.trendPercentage}%
                </Text>
              </View>
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
  },
  sectionHeader: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: Typography.weights.bold,
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  dayCard: {
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  dayDate: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: Typography.weights.bold,
  },
  riskPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.pill,
  },
  riskText: {
    fontSize: 10,
    fontWeight: Typography.weights.heavy,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Spacing.xs,
  },
  metricCol: {
    flex: 1,
  },
  metricLabel: {
    color: Colors.textDim,
    fontSize: 11,
  },
  metricVal: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: Typography.weights.bold,
    marginTop: 2,
  },
});
