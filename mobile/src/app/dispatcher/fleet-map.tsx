import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { Colors } from '@/constants/theme';
import { Header } from '@/components/common/Header';
import { BottomNav } from '@/components/common/BottomNav';
import { GISMap } from '@/components/ui/GISMap';

export default function DispatcherFleetMapScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Tactical Fleet CAD Map" subtitle="Unit Coordinates & Hotspot Sectors" showBack />
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
});
