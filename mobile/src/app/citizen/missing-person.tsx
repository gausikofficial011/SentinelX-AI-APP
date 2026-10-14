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

export default function MissingPersonScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('Rahul K. Verma');
  const [age, setAge] = useState('14');
  const [lastSeen, setLastSeen] = useState('Peelamedu Bus Stop near Govt High School');
  const [description, setDescription] = useState(
    'Height 5ft 2in, wearing navy blue school uniform, black backpack with yellow stripes. Contact urgently.'
  );
  const [contactPhone, setContactPhone] = useState('+91 94433 88990');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!fullName.trim()) {
      if (Platform.OS !== 'web') Alert.alert('Required', 'Please input missing person full name.');
      return;
    }

    setIsSubmitting(true);
    await api.reportMissingPerson({
      fullName,
      age,
      lastSeen,
      description,
      contactPhone,
    });
    setIsSubmitting(false);

    if (Platform.OS !== 'web') {
      Alert.alert(
        'Missing Person Alert Broadcasted',
        `Details for ${fullName} have been distributed to all patrol officers, transit hubs, and PCR vans.`
      );
    }
    router.push('/citizen/home');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Missing Person Alert" subtitle="Immediate Transit & Patrol Broadcast" showBack />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.label}>Missing Person Full Name *</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="e.g. Rahul K. Verma"
            placeholderTextColor={Colors.textDim}
          />

          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
            placeholder="e.g. 14"
            placeholderTextColor={Colors.textDim}
          />

          <Text style={styles.label}>Last Known Location & Time</Text>
          <TextInput
            style={styles.input}
            value={lastSeen}
            onChangeText={setLastSeen}
            placeholder="Where and when were they last seen?"
            placeholderTextColor={Colors.textDim}
          />

          <Text style={styles.label}>Physical Description / Clothing</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            placeholder="Height, clothing, identification marks..."
            placeholderTextColor={Colors.textDim}
          />

          <Text style={styles.label}>Emergency Family Contact Phone</Text>
          <TextInput
            style={styles.input}
            value={contactPhone}
            onChangeText={setContactPhone}
            keyboardType="phone-pad"
            placeholder="+91 Contact number"
            placeholderTextColor={Colors.textDim}
          />

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={isSubmitting}>
            <Text style={styles.submitBtnText}>{isSubmitting ? 'Broadcasting...' : 'Broadcast Missing Alert →'}</Text>
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
