import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { Header } from '@/components/common/Header';
import { BottomNav } from '@/components/common/BottomNav';
import { EmergencyCard } from '@/components/ui/EmergencyCard';
import { useEmergencyStore } from '@/store/emergencyStore';

export default function EmergencyQueueScreen() {
  const router = useRouter();
  const { cadQueue } = useEmergencyStore();
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM'>('ALL');

  const filtered = cadQueue.filter((e) => {
    if (priorityFilter === 'ALL') return true;
    return e.priority === priorityFilter;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="CAD Emergency Queue" subtitle="Active 911 Distress Telemetry" showBack />
      <View style={styles.filterRow}>
        {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'] as const).map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.filterChip, priorityFilter === p && styles.filterChipActive]}
            onPress={() => setPriorityFilter(p)}
          >
            <Text style={[styles.filterText, priorityFilter === p && styles.filterTextActive]}>{p}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {filtered.map((item) => (
          <EmergencyCard
            key={item.id}
            emergency={item}
            onPress={() => router.push('/dispatcher/emergency-details')}
          />
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
  filterRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.pill,
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.cyanGlow,
    borderColor: Colors.cyan,
  },
  filterText: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: Typography.weights.bold,
  },
  filterTextActive: {
    color: Colors.cyan,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
});
