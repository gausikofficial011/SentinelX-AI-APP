import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { Header } from '@/components/common/Header';
import { BottomNav } from '@/components/common/BottomNav';
import { useIncidentStore } from '@/store/incidentStore';
import { IncidentType, SeverityLevel } from '@/types';

export default function ReportCrimeScreen() {
  const router = useRouter();
  const { addIncident } = useIncidentStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [incidentType, setIncidentType] = useState<IncidentType>('THEFT');
  const [severity, setSeverity] = useState<SeverityLevel>('HIGH');
  const [address, setAddress] = useState('RS Puram, Coimbatore');
  const [submitting, setSubmitting] = useState(false);

  const incidentTypes: IncidentType[] = ['THEFT', 'ROBBERY', 'ASSAULT', 'ACCIDENT', 'SURVEILLANCE', 'OTHER'];
  const severities: SeverityLevel[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      if (Platform.OS !== 'web') Alert.alert('Required Information', 'Please input title and description.');
      return;
    }

    setSubmitting(true);
    await addIncident({
      title,
      description,
      incidentType,
      severity,
      status: 'REPORTED',
      location: {
        latitude: 11.0168,
        longitude: 76.9558,
        address,
      },
      area: address,
      reportedBy: 'Citizen e-Report',
      evidenceCount: 1,
    });
    setSubmitting(false);

    if (Platform.OS !== 'web') {
      Alert.alert('Incident Reported', 'Your report has been logged and forwarded to CAD Dispatch.');
    }
    router.push('/citizen/home');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Report Crime" subtitle="Log Citizen Incident to Police CAD" showBack />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.label}>Incident Headline *</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Broken store window & trespassing"
            placeholderTextColor={Colors.textDim}
          />

          <Text style={styles.label}>Crime Classification</Text>
          <View style={styles.chipRow}>
            {incidentTypes.map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.chip, incidentType === t && styles.chipActive]}
                onPress={() => setIncidentType(t)}
              >
                <Text style={[styles.chipText, incidentType === t && styles.chipTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Severity Level</Text>
          <View style={styles.chipRow}>
            {severities.map((s) => (
              <TouchableOpacity
                key={s}
                style={[styles.chip, severity === s && styles.chipActive]}
                onPress={() => setSeverity(s)}
              >
                <Text style={[styles.chipText, severity === s && styles.chipTextActive]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Location / Landmark</Text>
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            placeholder="Enter location"
            placeholderTextColor={Colors.textDim}
          />

          <Text style={styles.label}>Detailed Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            placeholder="Provide context, suspect details, damages..."
            placeholderTextColor={Colors.textDim}
          />

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={submitting}>
            <Text style={styles.submitBtnText}>{submitting ? 'Submitting...' : 'Transmit Incident →'}</Text>
          </TouchableOpacity>
        </View>
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
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  label: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: Typography.weights.semibold,
    marginBottom: 6,
    marginTop: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    height: 46,
    color: Colors.text,
    fontSize: 14,
    marginBottom: Spacing.xs,
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: 'top',
    paddingVertical: 10,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.pill,
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.cyanGlow,
    borderColor: Colors.cyan,
  },
  chipText: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: Typography.weights.semibold,
  },
  chipTextActive: {
    color: Colors.cyan,
    fontWeight: Typography.weights.bold,
  },
  submitBtn: {
    backgroundColor: Colors.emergency,
    paddingVertical: 14,
    borderRadius: Radius.md,
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  submitBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: Typography.weights.bold,
  },
});
