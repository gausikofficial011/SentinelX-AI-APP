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
import { api } from '@/services/api';

export default function StolenVehicleScreen() {
  const router = useRouter();
  const [vehicleNumber, setVehicleNumber] = useState('TN 38 BJ 4092');
  const [makeModel, setMakeModel] = useState('Hyundai Creta SX');
  const [color, setColor] = useState('Polar White');
  const [lastSeenLocation, setLastSeenLocation] = useState('Cross Cut Road, Gandhipuram');
  const [incidentDate, setIncidentDate] = useState('15 Sept 2026, 08:15 AM');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!vehicleNumber.trim()) {
      if (Platform.OS !== 'web') Alert.alert('Required', 'Please input vehicle registration plate.');
      return;
    }

    setIsSubmitting(true);
    await api.reportStolenVehicle({
      vehicleNumber,
      makeModel,
      color,
      lastSeenLocation,
      incidentDate,
    });
    setIsSubmitting(false);

    if (Platform.OS !== 'web') {
      Alert.alert(
        'Vehicle Registered to ANPR Surveillance',
        `Plate ${vehicleNumber} has been uploaded to City Highway ANPR and Patrol Interceptors.`
      );
    }
    router.push('/citizen/home');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Stolen Vehicle Alert" subtitle="Broadcast to City ANPR & Police Cameras" showBack />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.label}>Vehicle License Plate *</Text>
          <TextInput
            style={[styles.input, styles.plateInput]}
            value={vehicleNumber}
            onChangeText={setVehicleNumber}
            autoCapitalize="characters"
            placeholder="e.g. TN 38 BJ 4092"
            placeholderTextColor={Colors.textDim}
          />

          <Text style={styles.label}>Make & Model</Text>
          <TextInput
            style={styles.input}
            value={makeModel}
            onChangeText={setMakeModel}
            placeholder="e.g. Hyundai Creta, Honda Activa"
            placeholderTextColor={Colors.textDim}
          />

          <Text style={styles.label}>Color</Text>
          <TextInput
            style={styles.input}
            value={color}
            onChangeText={setColor}
            placeholder="e.g. Polar White, Metallic Grey"
            placeholderTextColor={Colors.textDim}
          />

          <Text style={styles.label}>Last Seen Location</Text>
          <TextInput
            style={styles.input}
            value={lastSeenLocation}
            onChangeText={setLastSeenLocation}
            placeholder="Street or Parking Lot"
            placeholderTextColor={Colors.textDim}
          />

          <Text style={styles.label}>Date / Time Last Seen</Text>
          <TextInput
            style={styles.input}
            value={incidentDate}
            onChangeText={setIncidentDate}
            placeholder="e.g. 15 Sept 2026, 08:15 AM"
            placeholderTextColor={Colors.textDim}
          />

          <View style={styles.anprBadge}>
            <Text style={styles.anprText}>
              ⚡ Submitting triggers instant ANPR optical character recognition across 140+ traffic junctions.
            </Text>
          </View>

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={isSubmitting}>
            <Text style={styles.submitBtnText}>{isSubmitting ? 'Transmitting...' : 'Broadcast Stolen Vehicle →'}</Text>
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
  plateInput: {
    fontSize: 16,
    fontWeight: Typography.weights.heavy,
    letterSpacing: 1,
    color: Colors.cyan,
  },
  anprBadge: {
    backgroundColor: 'rgba(0, 163, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0, 163, 255, 0.3)',
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginVertical: Spacing.md,
  },
  anprText: {
    color: Colors.cyan,
    fontSize: 12,
    lineHeight: 17,
  },
  submitBtn: {
    backgroundColor: Colors.danger,
    paddingVertical: 14,
    borderRadius: Radius.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  submitBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: Typography.weights.bold,
  },
});
