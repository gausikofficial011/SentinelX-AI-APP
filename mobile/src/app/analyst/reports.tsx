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

export default function AnalystReportsScreen() {
  const reports = [
    {
      id: 'REP-2026-W37',
      title: 'Weekly Crime Trend & Hotspot Intelligence Summary',
      period: '08 Sept 2026 - 15 Sept 2026',
      highlights: 'DBSCAN identifies 8 clusters. Theft down 4%, traffic incidents increased 12%.',
      generatedBy: 'SentinelX AI Engine Automated Pipeline',
    },
    {
      id: 'REP-2026-M08',
      title: 'Monthly Geospatial Law Enforcement Review',
      period: 'August 2026',
      highlights: 'Total 1,024 CAD calls handled. Average response latency reduced to 6.2 mins.',
      generatedBy: 'Command Analytics Bureau',
    },
  ];

  const handleExport = (title: string) => {
    if (Platform.OS !== 'web') {
      Alert.alert('Report Exported', `PDF intelligence brief for "${title}" has been saved.`);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Intelligence Reports" subtitle="Exportable Crime Pattern Briefs" showBack />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {reports.map((r) => (
          <View key={r.id} style={styles.card}>
            <View style={styles.topRow}>
              <Text style={styles.repId}>{r.id}</Text>
              <Text style={styles.repPeriod}>{r.period}</Text>
            </View>

            <Text style={styles.repTitle}>{r.title}</Text>
            <Text style={styles.repHighlights}>{r.highlights}</Text>
            <Text style={styles.repGen}>Generated: {r.generatedBy}</Text>

            <TouchableOpacity
              style={styles.downloadBtn}
              onPress={() => handleExport(r.title)}
              activeOpacity={0.8}
            >
              <Text style={styles.downloadBtnText}>📥 Export PDF Intelligence Brief</Text>
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
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  repId: {
    color: Colors.cyan,
    fontSize: 12,
    fontWeight: Typography.weights.heavy,
  },
  repPeriod: {
    color: Colors.textDim,
    fontSize: 11,
  },
  repTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: Typography.weights.bold,
    marginBottom: 6,
  },
  repHighlights: {
    color: Colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  repGen: {
    color: Colors.textDim,
    fontSize: 11,
    marginBottom: Spacing.md,
  },
  downloadBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 10,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  downloadBtnText: {
    color: Colors.cyan,
    fontSize: 13,
    fontWeight: Typography.weights.semibold,
  },
});
