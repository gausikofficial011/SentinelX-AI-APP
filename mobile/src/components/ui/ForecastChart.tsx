import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { useHotspotStore } from '@/store/hotspotStore';

const { width } = Dimensions.get('window');

export function ForecastChart() {
  const router = useRouter();
  const { forecast, forecastTrend } = useHotspotStore();

  // Simulated spline points matching screen #8
  const chartHeight = 110;
  const maxVal = 70;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Incident Forecast</Text>
        <View style={styles.trendBadge}>
          <Text style={styles.trendArrow}>↑</Text>
          <Text style={styles.trendText}>{forecastTrend}</Text>
        </View>
      </View>

      {/* Visual Line Chart Area */}
      <View style={styles.chartBox}>
        {/* Y Axis Guides */}
        <View style={styles.yGuides}>
          <Text style={styles.guideText}>100</Text>
          <Text style={styles.guideText}>200</Text>
          <Text style={styles.guideText}>0</Text>
        </View>

        {/* Visual Line with Dot Nodes */}
        <View style={styles.lineArea}>
          <View style={styles.gridLineH} />
          <View style={[styles.gridLineH, { top: '50%' }]} />

          {/* Connected SVG-like Nodes */}
          <View style={styles.nodesRow}>
            {forecast.map((day, idx) => {
              const h = (day.predictedCount / maxVal) * chartHeight;
              return (
                <View key={day.date} style={styles.nodeCol}>
                  <View style={[styles.barVisual, { height: h }]}>
                    <View style={styles.nodeDot} />
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </View>

      {/* X Axis Date Labels */}
      <View style={styles.labelsRow}>
        <Text style={styles.xLabel}>Sep 9</Text>
        <Text style={styles.xLabel}>Sep 11</Text>
        <Text style={styles.xLabel}>Sep 13</Text>
        <Text style={styles.xLabel}>Sep 15</Text>
      </View>

      {/* DBSCAN Hotspots Map Preview Link */}
      <View style={styles.divider} />
      <View style={styles.bottomRow}>
        <View>
          <Text style={styles.hotspotLabel}>Crime Hotspots (DBSCAN)</Text>
          <Text style={styles.hotspotSub}>Spatial density clusters active</Text>
        </View>
        <TouchableOpacity
          style={styles.viewMapBtn}
          onPress={() => router.push('/analyst/hotspots' as any)}
          activeOpacity={0.7}
        >
          <Text style={styles.viewMapText}>View Map</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
    marginBottom: Spacing.md,
  },
  title: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: Typography.weights.bold,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.successSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.pill,
  },
  trendArrow: {
    color: Colors.success,
    fontSize: 12,
    fontWeight: Typography.weights.bold,
    marginRight: 2,
  },
  trendText: {
    color: Colors.success,
    fontSize: 12,
    fontWeight: Typography.weights.heavy,
  },
  chartBox: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 120,
    marginTop: Spacing.xs,
  },
  yGuides: {
    justifyContent: 'space-between',
    height: '100%',
    paddingRight: 8,
    paddingBottom: 4,
  },
  guideText: {
    color: Colors.textDim,
    fontSize: 10,
    fontFamily: Typography.fontFamily,
  },
  lineArea: {
    flex: 1,
    height: '100%',
    position: 'relative',
    justifyContent: 'flex-end',
  },
  gridLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '20%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  nodesRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '100%',
    paddingHorizontal: 10,
  },
  nodeCol: {
    alignItems: 'center',
  },
  barVisual: {
    width: 2,
    backgroundColor: 'rgba(0, 163, 255, 0.4)',
    alignItems: 'center',
  },
  nodeDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: Colors.cyan,
    borderWidth: 1.5,
    borderColor: '#FFF',
    marginTop: -4,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 30,
    paddingRight: 10,
    marginTop: Spacing.xs,
  },
  xLabel: {
    color: Colors.textDim,
    fontSize: 11,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: Spacing.md,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hotspotLabel: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: Typography.weights.bold,
  },
  hotspotSub: {
    color: Colors.textDim,
    fontSize: 11,
    marginTop: 2,
  },
  viewMapBtn: {
    backgroundColor: Colors.cyanGlow,
    borderColor: Colors.cyan,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.sm,
  },
  viewMapText: {
    color: Colors.cyan,
    fontSize: 12,
    fontWeight: Typography.weights.bold,
  },
});
