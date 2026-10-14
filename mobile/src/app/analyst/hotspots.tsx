import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadows } from '@/constants/theme';
import { Header } from '@/components/common/Header';
import { BottomNav } from '@/components/common/BottomNav';
import { useHotspotStore } from '@/store/hotspotStore';
import { SeverityBadge } from '@/components/common/SeverityBadge';

export default function AnalystHotspotsScreen() {
  const { clusters, radiusKm, minSamples, setRadiusKm, setMinSamples, recomputeHotspots, isComputing } =
    useHotspotStore();

  const [radiusInput, setRadiusInput] = useState(String(radiusKm));
  const [samplesInput, setSamplesInput] = useState(String(minSamples));

  const handleRecompute = async () => {
    const r = parseFloat(radiusInput) || 2.0;
    const m = parseInt(samplesInput, 10) || 2;
    setRadiusKm(r);
    setMinSamples(m);
    await recomputeHotspots();
    if (Platform.OS !== 'web') {
      Alert.alert(
        'DBSCAN Model Recomputed',
        `Python FastAPI AI engine clustered ${clusters.length} density sectors with eps=${r}km and min_samples=${m}.`
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="DBSCAN Clustering" subtitle="Spatial Density Model Hyperparameters" showBack />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Model Hyperparameter Control Card */}
        <View style={styles.modelCard}>
          <View style={styles.modelHeaderRow}>
            <Text style={styles.modelTitle}>⚙️ DBSCAN Model Parameters</Text>
            <View style={styles.tag}>
              <Text style={styles.tagText}>FastAPI Engine :8000</Text>
            </View>
          </View>

          <View style={styles.paramRow}>
            <View style={styles.paramCol}>
              <Text style={styles.paramLabel}>Search Radius (km)</Text>
              <TextInput
                style={styles.paramInput}
                value={radiusInput}
                onChangeText={setRadiusInput}
                keyboardType="numeric"
                placeholder="2.0"
                placeholderTextColor={Colors.textDim}
              />
            </View>

            <View style={styles.paramCol}>
              <Text style={styles.paramLabel}>Min Samples (pts)</Text>
              <TextInput
                style={styles.paramInput}
                value={samplesInput}
                onChangeText={setSamplesInput}
                keyboardType="numeric"
                placeholder="2"
                placeholderTextColor={Colors.textDim}
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.computeBtn}
            onPress={handleRecompute}
            disabled={isComputing}
            activeOpacity={0.85}
          >
            {isComputing ? (
              <ActivityIndicator color="#000" size="small" />
            ) : (
              <Text style={styles.computeBtnText}>⚡ Recompute Spatial Clusters (DBSCAN)</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Cluster Results */}
        <Text style={styles.sectionTitle}>Identified Spatial Clusters ({clusters.length})</Text>
        {clusters.map((cluster) => (
          <View key={cluster.id} style={styles.clusterCard}>
            <View style={styles.clusterTop}>
              <View>
                <Text style={styles.clusterId}>{cluster.id.toUpperCase()}</Text>
                <Text style={styles.clusterArea}>{cluster.area_name}</Text>
              </View>
              <SeverityBadge severity={cluster.severity} />
            </View>

            {/* Risk Score Progress Bar */}
            <View style={styles.riskBarWrap}>
              <View style={styles.riskLabelRow}>
                <Text style={styles.riskLabel}>Cluster Risk Index</Text>
                <Text style={styles.riskScoreText}>{cluster.risk_score} / 100</Text>
              </View>
              <View style={styles.riskBarBg}>
                <View style={[styles.riskBarFill, { width: `${cluster.risk_score}%` }]} />
              </View>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailKey}>Incident Density:</Text>
              <Text style={styles.detailVal}>{cluster.incident_count} Incidents in cluster</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailKey}>Spread Radius:</Text>
              <Text style={styles.detailVal}>{cluster.radius_meters} meters</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailKey}>Primary Pattern:</Text>
              <Text style={styles.detailVal}>{cluster.crimeType}</Text>
            </View>

            <View style={styles.patrolAdviceBox}>
              <Text style={styles.adviceHeader}>TACTICAL PATROL RECOMMENDATION</Text>
              <Text style={styles.adviceText}>{cluster.recommendedPatrolDensity}</Text>
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
  modelCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xl,
  },
  modelHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  modelTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: Typography.weights.bold,
  },
  tag: {
    backgroundColor: Colors.cyanGlow,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.xs,
  },
  tagText: {
    color: Colors.cyan,
    fontSize: 10,
    fontWeight: Typography.weights.bold,
  },
  paramRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  paramCol: {
    flex: 1,
  },
  paramLabel: {
    color: Colors.textDim,
    fontSize: 12,
    fontWeight: Typography.weights.medium,
    marginBottom: 4,
  },
  paramInput: {
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    height: 44,
    color: Colors.text,
    fontSize: 14,
    fontWeight: Typography.weights.bold,
  },
  computeBtn: {
    backgroundColor: Colors.cyan,
    paddingVertical: 13,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.glowBlue,
  },
  computeBtnText: {
    color: '#030712',
    fontSize: 13,
    fontWeight: Typography.weights.heavy,
    letterSpacing: 0.3,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: Typography.weights.bold,
    marginBottom: Spacing.md,
  },
  clusterCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  clusterTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  clusterId: {
    color: Colors.cyan,
    fontSize: 11,
    fontWeight: Typography.weights.heavy,
  },
  clusterArea: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: Typography.weights.bold,
    marginTop: 2,
  },
  riskBarWrap: {
    marginVertical: Spacing.sm,
  },
  riskLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  riskLabel: {
    color: Colors.textDim,
    fontSize: 11,
  },
  riskScoreText: {
    color: Colors.emergency,
    fontSize: 12,
    fontWeight: Typography.weights.heavy,
  },
  riskBarBg: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  riskBarFill: {
    height: '100%',
    backgroundColor: Colors.emergency,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  detailKey: {
    color: Colors.textDim,
    fontSize: 12,
  },
  detailVal: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: Typography.weights.medium,
  },
  patrolAdviceBox: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    marginTop: Spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: Colors.cyan,
  },
  adviceHeader: {
    color: Colors.cyan,
    fontSize: 10,
    fontWeight: Typography.weights.heavy,
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  adviceText: {
    color: Colors.text,
    fontSize: 12,
  },
});
