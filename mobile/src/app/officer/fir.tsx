import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { Header } from '@/components/common/Header';
import { BottomNav } from '@/components/common/BottomNav';
import { FIRStepper } from '@/components/ui/FIRStepper';

export default function OfficerFIRScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Official Police E-FIR" subtitle="Statutory First Information Filing" showBack />
      <FIRStepper
        onSuccess={() => router.push('/officer/incidents')}
        onCancel={() => router.back()}
      />
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
