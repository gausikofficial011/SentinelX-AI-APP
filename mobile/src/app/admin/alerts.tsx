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
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { Header } from '@/components/common/Header';
import { BottomNav } from '@/components/common/BottomNav';
import { useAlertStore } from '@/store/alertStore';

export default function AdminAlertsScreen() {
  const { broadcastAlert } = useAlertStore();

  const [title, setTitle] = useState('High Security Advisory: Sector 4 North');
  const [area, setArea] = useState('RS Puram District');
  const [severity, setSeverity] = useState<'CRITICAL' | 'WARNING' | 'LOW'>('CRITICAL');
  const [message, setMessage] = useState(
    'Tactical mobile patrol units actively sweeping Sector 4. Citizens are advised to report suspicious activity immediately.'
  );
  const [broadcasting, setBroadcasting] = useState(false);

  const handleBroadcast = async () => {
    if (!title.trim() || !message.trim()) {
      if (Platform.OS !== 'web') Alert.alert('Required', 'Please input title and message.');
      return;
    }

    setBroadcasting(true);
    await broadcastAlert(title, message, severity, area);
    setBroadcasting(false);

    if (Platform.OS !== 'web') {
      Alert.alert(
        'Public Advisory Broadcasted',
        'Emergency alert transmitted to all civilian push feeds and CAD consoles.'
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Emergency Broadcast" subtitle="Citywide Civilian Alert Transmitter" showBack />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.label}>Advisory Title *</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Flash Flood Alert / High Security Advisory"
            placeholderTextColor={Colors.textDim}
          />

          <Text style={styles.label}>Severity Level</Text>
          <View style={styles.chipRow}>
            {(['CRITICAL', 'WARNING', 'LOW'] as const).map((s) => (
              <TouchableOpacity
                key={s}
                style={[styles.chip, severity === s && styles.chipActive]}
                onPress={() => setSeverity(s)}
              >
                <Text style={[styles.chipText, severity === s && styles.chipTextActive]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Target Sector / Geographical Area</Text>
          <TextInput
            style={styles.input}
            value={area}
            onChangeText={setArea}
            placeholder="e.g. Citywide / Sector 4"
            placeholderTextColor={Colors.textDim}
          />

          <Text style={styles.label}>Advisory Notification Body *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
            placeholder="Full emergency broadcast directive text..."
            placeholderTextColor={Colors.textDim}
          />

          <TouchableOpacity
            style={styles.broadcastBtn}
            onPress={handleBroadcast}
            disabled={broadcasting}
            activeOpacity={0.85}
          >
            <Text style={styles.broadcastBtnText}>
              {broadcasting ? 'Transmitting Broadcast...' : '🚨 Broadcast Citywide Alert Now'}
            </Text>
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
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  chip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: Radius.pill,
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  chipActive: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderColor: Colors.emergency,
  },
  chipText: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: Typography.weights.bold,
  },
  chipTextActive: {
    color: Colors.emergency,
  },
  broadcastBtn: {
    backgroundColor: Colors.emergency,
    paddingVertical: 15,
    borderRadius: Radius.md,
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  broadcastBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: Typography.weights.heavy,
    letterSpacing: 0.3,
  },
});
