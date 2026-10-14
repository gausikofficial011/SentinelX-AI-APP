import React, { useState } from 'react';
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
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { Header } from '@/components/common/Header';
import { BottomNav } from '@/components/common/BottomNav';
import { useEmergencyStore } from '@/store/emergencyStore';
import { useFleetStore } from '@/store/fleetStore';
import { UnitCard } from '@/components/ui/UnitCard';

export default function DispatchUnitScreen() {
  const router = useRouter();
  const { cadQueue, assignUnitToEmergency } = useEmergencyStore();
  const { units } = useFleetStore();
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);

  const activeEmergency = cadQueue.find((e) => e.status === 'PENDING_DISPATCH') || cadQueue[0];

  const handleConfirmDispatch = () => {
    if (!selectedUnit || !activeEmergency) return;

    assignUnitToEmergency(activeEmergency.id, selectedUnit);
    if (Platform.OS !== 'web') {
      Alert.alert(
        'Unit Dispatched',
        `Unit ${selectedUnit} has been dispatched to Incident ${activeEmergency.trackingId}.`
      );
    }
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Dispatch Police Unit" subtitle="Select nearest response unit" showBack />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {activeEmergency && (
          <View style={styles.targetBanner}>
            <Text style={styles.targetLabel}>TARGET INCIDENT</Text>
            <Text style={styles.targetTitle}>
              {activeEmergency.trackingId} • {activeEmergency.type}
            </Text>
            <Text style={styles.targetLoc}>📍 {activeEmergency.location.address}</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>AVAILABLE PATROL UNITS</Text>

        <View style={styles.unitList}>
          {units.map((unit) => {
            const isSelected = selectedUnit === unit.callSign;
            return (
              <TouchableOpacity
                key={unit.id}
                onPress={() => setSelectedUnit(unit.callSign)}
                activeOpacity={0.8}
                style={[
                  styles.unitWrapper,
                  isSelected && styles.unitWrapperSelected,
                ]}
              >
                <UnitCard unit={unit} />
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[
            styles.dispatchBtn,
            !selectedUnit && styles.dispatchBtnDisabled,
          ]}
          onPress={handleConfirmDispatch}
          disabled={!selectedUnit}
          activeOpacity={0.8}
        >
          <Text style={styles.dispatchBtnText}>
            {selectedUnit ? `ROUTE ${selectedUnit} TO SCENE` : 'SELECT A UNIT TO ROUTE'}
          </Text>
        </TouchableOpacity>
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
    padding: Spacing.md,
    paddingBottom: 90,
  },
  targetBanner: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.emergencySoft,
    marginBottom: Spacing.md,
  },
  targetLabel: {
    fontSize: 10,
    color: Colors.emergency,
    fontWeight: Typography.weights.bold,
    letterSpacing: 1,
    marginBottom: 4,
  },
  targetTitle: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: Typography.weights.bold,
    marginBottom: 2,
  },
  targetLoc: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  sectionTitle: {
    fontSize: 12,
    color: Colors.textDim,
    letterSpacing: 1,
    fontWeight: Typography.weights.bold,
    marginBottom: Spacing.sm,
  },
  unitList: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  unitWrapper: {
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  unitWrapperSelected: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(0, 163, 255, 0.05)',
  },
  dispatchBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  dispatchBtnDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  dispatchBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: Typography.weights.bold,
    letterSpacing: 0.5,
  },
});
