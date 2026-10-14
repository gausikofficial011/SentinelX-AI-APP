import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { Header } from '@/components/common/Header';
import { BottomNav } from '@/components/common/BottomNav';
import { EmergencyCard } from '@/components/ui/EmergencyCard';
import { UnitCard } from '@/components/ui/UnitCard';
import { useEmergencyStore } from '@/store/emergencyStore';
import { useFleetStore } from '@/store/fleetStore';
import { EmergencyRequest } from '@/types';

export default function DispatcherDashboardScreen() {
  const router = useRouter();
  const { cadQueue, assignUnitToEmergency } = useEmergencyStore();
  const { units } = useFleetStore();

  const [activeTab, setActiveTab] = useState<'QUEUE' | 'UNITS'>('QUEUE');
  const [dispatchModalVisible, setDispatchModalVisible] = useState(false);
  const [selectedEmergency, setSelectedEmergency] = useState<EmergencyRequest | null>(null);

  const handleOpenAssign = (emergency: EmergencyRequest) => {
    setSelectedEmergency(emergency);
    setDispatchModalVisible(true);
  };

  const handleAssignUnit = (callSign: string) => {
    if (selectedEmergency) {
      assignUnitToEmergency(selectedEmergency.id, callSign);
    }
    setDispatchModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Dispatcher" showLiveBadge />

      {/* Segment Switcher matching screen #7 */}
      <View style={styles.segmentContainer}>
        <TouchableOpacity
          style={[styles.segmentBtn, activeTab === 'QUEUE' && styles.segmentBtnActive]}
          onPress={() => setActiveTab('QUEUE')}
          activeOpacity={0.8}
        >
          <Text style={[styles.segmentText, activeTab === 'QUEUE' && styles.segmentTextActive]}>
            Emergency Queue ({cadQueue.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.segmentBtn, activeTab === 'UNITS' && styles.segmentBtnActive]}
          onPress={() => setActiveTab('UNITS')}
          activeOpacity={0.8}
        >
          <Text style={[styles.segmentText, activeTab === 'UNITS' && styles.segmentTextActive]}>
            Active Units ({units.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {activeTab === 'QUEUE' ? (
          <View>
            {cadQueue.map((item) => (
              <EmergencyCard
                key={item.id}
                emergency={item}
                onPress={() => {
                  setSelectedEmergency(item);
                  router.push('/dispatcher/emergency-details');
                }}
                onAssignPress={() => handleOpenAssign(item)}
              />
            ))}
          </View>
        ) : (
          <View>
            {units.map((u) => (
              <UnitCard key={u.id} unit={u} />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Unit Dispatch Assignment Modal */}
      <Modal visible={dispatchModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Dispatch Patrol Unit</Text>
            <Text style={styles.modalSub}>
              Assign nearest available unit to: {selectedEmergency?.type} (
              {selectedEmergency?.location.address})
            </Text>

            <View style={styles.unitList}>
              {units.map((u) => (
                <TouchableOpacity
                  key={u.id}
                  style={styles.unitSelectRow}
                  onPress={() => handleAssignUnit(u.callSign)}
                  activeOpacity={0.7}
                >
                  <View style={styles.unitLeft}>
                    <Text style={styles.unitCall}>{u.callSign}</Text>
                    <Text style={styles.unitOfficer}>
                      {u.officer} • {u.sector}
                    </Text>
                  </View>
                  <View style={styles.dispatchPill}>
                    <Text style={styles.dispatchPillText}>Dispatch Unit →</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.closeModalBtn}
              onPress={() => setDispatchModalVisible(false)}
            >
              <Text style={styles.closeModalText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.pill,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.md,
    padding: 3,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentBtnActive: {
    backgroundColor: Colors.cyanGlow,
  },
  segmentText: {
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: Typography.weights.semibold,
  },
  segmentTextActive: {
    color: Colors.cyan,
    fontWeight: Typography.weights.bold,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: Colors.backgroundCard,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modalTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: Typography.weights.bold,
  },
  modalSub: {
    color: Colors.textMuted,
    fontSize: 13,
    marginTop: 4,
    marginBottom: Spacing.lg,
  },
  unitList: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  unitSelectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.backgroundSecondary,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  unitLeft: {
    flex: 1,
  },
  unitCall: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: Typography.weights.bold,
  },
  unitOfficer: {
    color: Colors.textDim,
    fontSize: 12,
    marginTop: 2,
  },
  dispatchPill: {
    backgroundColor: Colors.cyanGlow,
    borderColor: Colors.cyan,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.sm,
  },
  dispatchPillText: {
    color: Colors.cyan,
    fontSize: 12,
    fontWeight: Typography.weights.bold,
  },
  closeModalBtn: {
    paddingVertical: 14,
    borderRadius: Radius.md,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  closeModalText: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: Typography.weights.semibold,
  },
});
