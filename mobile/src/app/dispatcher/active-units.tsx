import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import { Header } from '@/components/common/Header';
import { BottomNav } from '@/components/common/BottomNav';
import { UnitCard } from '@/components/ui/UnitCard';
import { useFleetStore } from '@/store/fleetStore';

export default function ActiveUnitsScreen() {
  const { units } = useFleetStore();

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Fleet Unit Telemetry" subtitle="Live Patrol Vehicle Diagnostics" showBack />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {units.map((unit) => (
          <UnitCard key={unit.id} unit={unit} />
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
});
