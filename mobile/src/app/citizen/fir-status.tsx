import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Modal,
} from 'react-native';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { Header } from '@/components/common/Header';
import { BottomNav } from '@/components/common/BottomNav';
import { FIRStepper } from '@/components/ui/FIRStepper';

export default function FIRStatusScreen() {
  const [searchId, setSearchId] = useState('FIR-2026-44091');
  const [modalVisible, setModalVisible] = useState(false);

  const [currentFIR, setCurrentFIR] = useState({
    firNumber: 'FIR-2026-44091',
    complainant: 'Gausik Srinivasan',
    offense: 'Vehicle Burglary & Theft (Sec. 379)',
    occurrenceDate: '15 Sept 2026, 08:30 AM',
    location: 'RS Puram Commercial Sector, Coimbatore',
    status: 'UNDER_INVESTIGATION',
    assignedOfficer: 'PC. Arjun Kumar (Badge #TN-4587)',
    station: 'Central District Police Station',
    currentStageIndex: 2, // 0: Reported, 1: Unit Dispatched, 2: Under Investigation, 3: Resolved
  });

  const stages = [
    { label: 'Reported', done: true },
    { label: 'Unit Dispatched', done: true },
    { label: 'Under Investigation', done: true },
    { label: 'Resolved / Court Filing', done: false },
  ];

  const handleFIRRegistered = (record: any) => {
    setCurrentFIR({
      firNumber: record.firNumber,
      complainant: record.complainantName,
      offense: `${record.incidentType} Case`,
      occurrenceDate: record.incidentDate,
      location: record.location,
      status: 'UNDER_INVESTIGATION',
      assignedOfficer: record.assignedOfficer,
      station: 'Central District Police Station',
      currentStageIndex: 1,
    });
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="E-FIR Status Tracking" subtitle="Real-time Investigation Milestones" showBack />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Search / Lookup Bar */}
        <View style={styles.lookupBar}>
          <TextInput
            style={styles.lookupInput}
            value={searchId}
            onChangeText={setSearchId}
            placeholder="Enter FIR Tracking ID"
            placeholderTextColor={Colors.textDim}
          />
          <TouchableOpacity style={styles.lookupBtn}>
            <Text style={styles.lookupBtnText}>Track</Text>
          </TouchableOpacity>
        </View>

        {/* Current FIR Card */}
        <View style={styles.card}>
          <View style={styles.firHeaderRow}>
            <View>
              <Text style={styles.firLabel}>FIR REFERENCE NUMBER</Text>
              <Text style={styles.firNumber}>{currentFIR.firNumber}</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>{currentFIR.status.replace('_', ' ')}</Text>
            </View>
          </View>

          {/* Stepper Progress Bar */}
          <View style={styles.stepperBox}>
            <Text style={styles.stepperHeader}>Investigation Progress</Text>
            <View style={styles.stepperRow}>
              {stages.map((stage, idx) => (
                <View key={stage.label} style={styles.stageCol}>
                  <View
                    style={[
                      styles.stageNode,
                      stage.done ? styles.stageNodeDone : styles.stageNodePending,
                    ]}
                  >
                    <Text style={styles.stageCheck}>{stage.done ? '✓' : String(idx + 1)}</Text>
                  </View>
                  <Text style={[styles.stageText, stage.done && styles.stageTextDone]}>
                    {stage.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Details Roster */}
          <View style={styles.metaRow}>
            <Text style={styles.metaKey}>Complainant:</Text>
            <Text style={styles.metaVal}>{currentFIR.complainant}</Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaKey}>Charge / Offense:</Text>
            <Text style={styles.metaVal}>{currentFIR.offense}</Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaKey}>Occurrence Date:</Text>
            <Text style={styles.metaVal}>{currentFIR.occurrenceDate}</Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaKey}>Place of Occurrence:</Text>
            <Text style={styles.metaVal}>{currentFIR.location}</Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaKey}>Investigating Officer:</Text>
            <Text style={[styles.metaVal, { color: Colors.cyan }]}>
              {currentFIR.assignedOfficer}
            </Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaKey}>Station Jurisdiction:</Text>
            <Text style={styles.metaVal}>{currentFIR.station}</Text>
          </View>
        </View>

        {/* File New FIR Button */}
        <TouchableOpacity
          style={styles.newFirBtn}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.85}
        >
          <Text style={styles.newFirText}>+ File New Electronic FIR (e-FIR)</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Multi-Step FIR Modal */}
      <Modal visible={modalVisible} animationType="slide">
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
          <FIRStepper
            onSuccess={handleFIRRegistered}
            onCancel={() => setModalVisible(false)}
          />
        </SafeAreaView>
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
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
  },
  lookupBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  lookupInput: {
    flex: 1,
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    height: 48,
    color: Colors.text,
    fontSize: 14,
    marginRight: Spacing.sm,
  },
  lookupBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    height: 48,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lookupBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: Typography.weights.bold,
  },
  card: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  firHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  firLabel: {
    color: Colors.textDim,
    fontSize: 11,
    fontWeight: Typography.weights.bold,
  },
  firNumber: {
    color: Colors.cyan,
    fontSize: 18,
    fontWeight: Typography.weights.heavy,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  statusBadge: {
    backgroundColor: Colors.cyanGlow,
    borderWidth: 1,
    borderColor: Colors.cyan,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.pill,
  },
  statusBadgeText: {
    color: Colors.cyan,
    fontSize: 11,
    fontWeight: Typography.weights.heavy,
  },
  stepperBox: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  stepperHeader: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: Typography.weights.bold,
    marginBottom: Spacing.md,
  },
  stepperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stageCol: {
    alignItems: 'center',
    width: '23%',
  },
  stageNode: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  stageNodeDone: {
    backgroundColor: Colors.success,
  },
  stageNodePending: {
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stageCheck: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stageText: {
    color: Colors.textDim,
    fontSize: 10,
    textAlign: 'center',
  },
  stageTextDone: {
    color: Colors.text,
    fontWeight: Typography.weights.semibold,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  metaKey: {
    color: Colors.textDim,
    fontSize: 13,
  },
  metaVal: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: Typography.weights.semibold,
    flex: 1,
    textAlign: 'right',
    marginLeft: Spacing.md,
  },
  newFirBtn: {
    backgroundColor: Colors.cyanGlow,
    borderWidth: 1,
    borderColor: Colors.cyan,
    paddingVertical: 14,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  newFirText: {
    color: Colors.cyan,
    fontSize: 15,
    fontWeight: Typography.weights.bold,
  },
});
