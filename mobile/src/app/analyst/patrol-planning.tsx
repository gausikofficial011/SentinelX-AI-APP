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
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { Header } from '@/components/common/Header';
import { BottomNav } from '@/components/common/BottomNav';

export default function PatrolPlanningScreen() {
  const recommendations = [
    {
      id: 'REC-01',
      zone: 'Sector 4 North (RS Puram)',
      riskScore: 88,
      incidentVolume: '12 incidents / 30d',
      recommendedDensity: 'High Frequency (Every 20 mins)',
      reason: 'Spike in commercial store burglaries reported between 20:00 and 02:00.',
      recommendedTime: '20:00 - 02:00 IST',
    },
    {
      id: 'REC-02',
      zone: 'Gandhipuram Central Bus Terminal',
      riskScore: 94,
      incidentVolume: '9 incidents / 30d',
      recommendedDensity: 'Stationary Tactical Unit + Drone Sweep',
      reason: 'Physical altercations & pickpocketing clusters around evening commuter surge.',
      recommendedTime: '17:30 - 21:30 IST',
    },
    {
      id: 'REC-03',
      zone: 'Avinashi Road Highway Flyover',
      riskScore: 64,
      incidentVolume: '6 incidents / 30d',
      recommendedDensity: 'Traffic Interceptor Patrol',
      reason: 'Frequent multi-vehicle pileups and speeding violations during rain.',
      recommendedTime: '07:30 - 11:00 IST',
    },
  ];

  const handleAssign = (zone: string) => {
    if (Platform.OS !== 'web') {
      Alert.alert('Patrol Strategy Dispatched', `Directive for ${zone} broadcasted to CAD fleet.`);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="AI Patrol Planning" subtitle="Algorithmic Patrol Allocations" showBack />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {recommendations.map((rec) => (
          <View key={rec.id} style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.zoneName}>{rec.zone}</Text>
              <View style={styles.scoreBadge}>
                <Text style={styles.scoreText}>Risk: {rec.riskScore}/100</Text>
              </View>
            </View>

            <Text style={styles.densityLabel}>Recommended Density:</Text>
            <Text style={styles.densityVal}>{rec.recommendedDensity}</Text>

            <Text style={styles.reasonLabel}>AI Analytical Rationale:</Text>
            <Text style={styles.reasonVal}>{rec.reason}</Text>

            <View style={styles.timeRow}>
              <Text style={styles.timeLabel}>Target Window:</Text>
              <Text style={styles.timeVal}>{rec.recommendedTime}</Text>
            </View>

            <TouchableOpacity
              style={styles.assignBtn}
              onPress={() => handleAssign(rec.zone)}
              activeOpacity={0.85}
            >
              <Text style={styles.assignBtnText}>Broadcast Patrol Directive →</Text>
            </TouchableOpacity>
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
  card: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  zoneName: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: Typography.weights.bold,
    flex: 1,
  },
  scoreBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: Colors.emergency,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.pill,
  },
  scoreText: {
    color: Colors.emergency,
    fontSize: 11,
    fontWeight: Typography.weights.heavy,
  },
  densityLabel: {
    color: Colors.textDim,
    fontSize: 11,
    marginTop: Spacing.xs,
  },
  densityVal: {
    color: Colors.cyan,
    fontSize: 13,
    fontWeight: Typography.weights.bold,
    marginBottom: Spacing.xs,
  },
  reasonLabel: {
    color: Colors.textDim,
    fontSize: 11,
  },
  reasonVal: {
    color: Colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: Spacing.xs,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  timeLabel: {
    color: Colors.textDim,
    fontSize: 11,
    marginRight: 6,
  },
  timeVal: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: Typography.weights.bold,
  },
  assignBtn: {
    backgroundColor: Colors.cyanGlow,
    borderColor: Colors.cyan,
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  assignBtnText: {
    color: Colors.cyan,
    fontSize: 13,
    fontWeight: Typography.weights.bold,
  },
});
