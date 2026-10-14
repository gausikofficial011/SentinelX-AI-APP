import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { Header } from '@/components/common/Header';
import { BottomNav } from '@/components/common/BottomNav';

interface EvidenceItem {
  id: string;
  tag: string;
  caseId: string;
  type: string;
  description: string;
  collectedBy: string;
  collectedAt: string;
  chainOfCustody: string;
}

export default function OfficerEvidenceScreen() {
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>([
    {
      id: 'EVD-881-01',
      tag: 'EVD-PHYSICAL-01',
      caseId: 'INC-2026-881',
      type: 'Physical (Shattered Glass Fragments)',
      description: 'Tempered vehicle quarter glass collected from ground with impact markings.',
      collectedBy: 'PC. Arjun Kumar (#TN-4587)',
      collectedAt: '15 Sept 2026, 08:45 AM',
      chainOfCustody: 'Logged in Central Police Forensic Evidence Locker #4B',
    },
    {
      id: 'EVD-881-02',
      tag: 'EVD-DIGITAL-02',
      caseId: 'INC-2026-881',
      type: 'Digital Video (CCTV Footages)',
      description: 'MP4 CCTV capture from store front entrance showing suspect flight path on motorcycle.',
      collectedBy: 'Insp. Vikram Rathore',
      collectedAt: '15 Sept 2026, 09:10 AM',
      chainOfCustody: 'SHA-256 Checksum verified on Secure Evidence Vault',
    },
    {
      id: 'EVD-882-01',
      tag: 'EVD-WEAPON-03',
      caseId: 'INC-2026-882',
      type: 'Weapon (Iron Rod 2.5ft)',
      description: 'Recovered blunt weapon used during terminal assault. Latent fingerprints lifted.',
      collectedBy: 'PC. V. Anitha (#TN-4591)',
      collectedAt: '15 Sept 2026, 07:30 AM',
      chainOfCustody: 'Transferred to State Forensic Science Laboratory',
    },
  ]);

  const [tag, setTag] = useState('');
  const [desc, setDesc] = useState('');
  const [caseId, setCaseId] = useState('INC-2026-881');

  const handleAddEvidence = () => {
    if (!tag.trim() || !desc.trim()) {
      if (Platform.OS !== 'web') Alert.alert('Required', 'Please input evidence tag and description.');
      return;
    }

    const newItem: EvidenceItem = {
      id: `EVD-${Date.now()}`,
      tag,
      caseId,
      type: 'Officer Field Collection',
      description: desc,
      collectedBy: 'PC. Arjun Kumar (#TN-4587)',
      collectedAt: 'Just now',
      chainOfCustody: 'Active officer custody',
    };

    setEvidenceList([newItem, ...evidenceList]);
    setTag('');
    setDesc('');
    if (Platform.OS !== 'web') {
      Alert.alert('Evidence Logged', 'Chain of custody digital timestamp has been generated.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Digital Evidence Locker" subtitle="Chain of Custody & Forensic Records" showBack />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* New Evidence Input */}
        <View style={styles.formCard}>
          <Text style={styles.formHeader}>+ Log New Evidence Item</Text>

          <Text style={styles.label}>Associated Case ID</Text>
          <TextInput
            style={styles.input}
            value={caseId}
            onChangeText={setCaseId}
            placeholder="e.g. INC-2026-881"
            placeholderTextColor={Colors.textDim}
          />

          <Text style={styles.label}>Evidence Tag / Barcode</Text>
          <TextInput
            style={styles.input}
            value={tag}
            onChangeText={setTag}
            placeholder="e.g. EVD-BLOOD-SWAB-04"
            placeholderTextColor={Colors.textDim}
          />

          <Text style={styles.label}>Forensic Description & Location</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={desc}
            onChangeText={setDesc}
            multiline
            numberOfLines={3}
            placeholder="Physical state, recovery spot, packaging method..."
            placeholderTextColor={Colors.textDim}
          />

          <TouchableOpacity style={styles.addBtn} onPress={handleAddEvidence} activeOpacity={0.85}>
            <Text style={styles.addBtnText}>Secure & Log Evidence →</Text>
          </TouchableOpacity>
        </View>

        {/* Existing Evidence List */}
        <Text style={styles.sectionHeader}>Vault Custody Roster ({evidenceList.length})</Text>
        {evidenceList.map((item) => (
          <View key={item.id} style={styles.evidenceCard}>
            <View style={styles.evidenceHeader}>
              <Text style={styles.evidenceTag}>{item.tag}</Text>
              <Text style={styles.caseBadge}>{item.caseId}</Text>
            </View>

            <Text style={styles.evidenceType}>{item.type}</Text>
            <Text style={styles.evidenceDesc}>{item.description}</Text>

            <View style={styles.custodyBox}>
              <Text style={styles.custodyHeader}>🔒 CHAIN OF CUSTODY</Text>
              <Text style={styles.custodyText}>{item.chainOfCustody}</Text>
              <Text style={styles.custodyMeta}>
                Collected by {item.collectedBy} • {item.collectedAt}
              </Text>
            </View>
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
  formCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xl,
  },
  formHeader: {
    color: Colors.cyan,
    fontSize: 15,
    fontWeight: Typography.weights.heavy,
    marginBottom: Spacing.sm,
  },
  label: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: Typography.weights.semibold,
    marginBottom: 4,
    marginTop: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    height: 44,
    color: Colors.text,
    fontSize: 13,
  },
  textArea: {
    minHeight: 70,
    textAlignVertical: 'top',
    paddingVertical: 8,
  },
  addBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: Radius.md,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  addBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: Typography.weights.bold,
  },
  sectionHeader: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: Typography.weights.bold,
    marginBottom: Spacing.md,
  },
  evidenceCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  evidenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  evidenceTag: {
    color: Colors.cyan,
    fontSize: 13,
    fontWeight: Typography.weights.heavy,
    letterSpacing: 0.5,
  },
  caseBadge: {
    color: Colors.textDim,
    fontSize: 11,
    fontWeight: Typography.weights.bold,
  },
  evidenceType: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: Typography.weights.bold,
    marginBottom: 4,
  },
  evidenceDesc: {
    color: Colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  custodyBox: {
    backgroundColor: Colors.backgroundSecondary,
    padding: Spacing.sm,
    borderRadius: Radius.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.cyan,
  },
  custodyHeader: {
    color: Colors.cyan,
    fontSize: 10,
    fontWeight: Typography.weights.heavy,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  custodyText: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: Typography.weights.medium,
  },
  custodyMeta: {
    color: Colors.textDim,
    fontSize: 11,
    marginTop: 3,
  },
});
