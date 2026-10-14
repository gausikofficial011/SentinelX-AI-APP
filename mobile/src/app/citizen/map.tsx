import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { Header } from '@/components/common/Header';
import { BottomNav } from '@/components/common/BottomNav';
import { GISMap } from '@/components/ui/GISMap';
import { DBSCANCluster } from '@/types';

export default function CitizenMapScreen() {
  const router = useRouter();

  const handleSelectCluster = (cluster: DBSCANCluster) => {
    // Navigate to analytical detail or report
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="GIS Safety & Crime Map" subtitle="Live Heatmaps & Risk Zones" />
      <GISMap onSelectCluster={handleSelectCluster} />
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
