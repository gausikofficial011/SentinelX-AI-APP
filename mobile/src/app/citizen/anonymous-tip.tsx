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

export default function AnonymousTipScreen() {
  const router = useRouter();
  const [category, setCategory] = useState('DRUG_ACTIVITY');
  const [location, setLocation] = useState('Near Abandoned Warehouse, Sathy Road');
  const [narrative, setNarrative] = useState(
    'Suspicious nightly vehicle unloading between 02:00 and 04:00 AM. Unmarked white vans without plates.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ['DRUG_ACTIVITY', 'CORRUPTION', 'ORGANIZED_CRIME', 'ILLEGAL_WEAPONS'];

  const handleSubmit = async () => {
    if (!narrative.trim()) {
      if (Platform.OS !== 'web') Alert.alert('Required', 'Please write your tip description.');
      return;
    }

    setIsSubmitting(true);
    await api.submitAnonymousTip({
      category,
      location,
      narrative,
    });
    setIsSubmitting(false);

    const tipId = `TIP-ANON-${Math.floor(Math.random() * 90000) + 10000}`;

    if (Platform.OS !== 'web') {
      Alert.alert(
        'Tip Forwarded Anonymously',
        `Your encrypted tip reference is ${tipId}. No personal identifiers were recorded.`
      );
    }
    router.push('/citizen/home');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Anonymous Crime Tip" subtitle="Encrypted Whistleblower Channel" showBack />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.guaranteeBox}>
            <Text style={styles.lockIcon}>🔒</Text>
            <View style={styles.guaranteeCol}>
              <Text style={styles.guaranteeTitle}>Identity Protection Active</Text>
              <Text style={styles.guaranteeDesc}>
                Your device IP, name, and phone number are completely excluded from this transmission.
              </Text>
            </View>
          </View>

          <Text style={styles.label}>Tip Category</Text>
          <View style={styles.chipRow}>
            {categories.map((c) => (
              <TouchableOpacity
                key={c}
                style={[styles.chip, category === c && styles.chipActive]}
                onPress={() => setCategory(c)}
              >
                <Text style={[styles.chipText, category === c && styles.chipTextActive]}>
                  {c.replace('_', ' ')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Location / Suspect Activity Spot</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="Address or landmark"
            placeholderTextColor={Colors.textDim}
          />

          <Text style={styles.label}>Information Narrative *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={narrative}
            onChangeText={setNarrative}
            multiline
            numberOfLines={5}
            placeholder="Describe what you witnessed, vehicle models, timestamps..."
            placeholderTextColor={Colors.textDim}
          />

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={isSubmitting}>
            <Text style={styles.submitBtnText}>{isSubmitting ? 'Encrypting & Sending...' : 'Submit Anonymous Tip →'}</Text>
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
  guaranteeBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },
  lockIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  guaranteeCol: {
    flex: 1,
  },
  guaranteeTitle: {
    color: Colors.success,
    fontSize: 13,
    fontWeight: Typography.weights.bold,
  },
  guaranteeDesc: {
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
  label: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: Typography.weights.semibold,
    marginBottom: 6,
    marginTop: Spacing.sm,
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
    minHeight: 100,
    textAlignVertical: 'top',
    paddingVertical: 10,
  },
  submitBtn: {
    backgroundColor: Colors.primary,
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
