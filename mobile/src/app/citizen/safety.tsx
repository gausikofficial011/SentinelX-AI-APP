import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Linking,
} from 'react-native';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { Header } from '@/components/common/Header';
import { BottomNav } from '@/components/common/BottomNav';

export default function SafetyTipsScreen() {
  const helplines = [
    { number: '112', title: 'National Emergency Helpline', desc: 'Unified Police, Fire, Ambulance & Disaster Response' },
    { number: '100', title: 'Police Control Room (PCR)', desc: 'Direct emergency police dispatch van' },
    { number: '108', title: 'Emergency Medical & Ambulance', desc: 'Critical care mobile hospital response' },
    { number: '1091', title: 'Women Safety Helpline', desc: '24/7 dedicated support & rapid intervention' },
    { number: '1930', title: 'Cyber Financial Fraud Helpline', desc: 'Report within 2 hours to freeze illicit bank debits' },
  ];

  const handleDial = (num: string) => {
    Linking.openURL(`tel:${num}`).catch(() => {});
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Safety & Emergency Helplines" subtitle="Immediate Contact & Citizen Guidelines" showBack />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.sectionHeader}>Emergency One-Tap Speed Dials</Text>
        {helplines.map((h) => (
          <TouchableOpacity
            key={h.number}
            style={styles.helplineCard}
            onPress={() => handleDial(h.number)}
            activeOpacity={0.8}
          >
            <View style={styles.dialBox}>
              <Text style={styles.dialNum}>{h.number}</Text>
            </View>
            <View style={styles.helplineInfo}>
              <Text style={styles.helplineTitle}>{h.title}</Text>
              <Text style={styles.helplineDesc}>{h.desc}</Text>
            </View>
            <Text style={styles.callArrow}>📞</Text>
          </TouchableOpacity>
        ))}

        <Text style={[styles.sectionHeader, { marginTop: Spacing.xl }]}>Essential Safety Protocols</Text>

        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>💡 Night Travel Precautions</Text>
          <Text style={styles.tipText}>
            Share live location with emergency contacts. Stick to illuminated main arterial roads. Keep your mobile battery above 20%.
          </Text>
        </View>

        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>🛡️ Digital & Financial Safety</Text>
          <Text style={styles.tipText}>
            Never share bank OTPs or download unknown .apk files. Police officers never request payment transfers for legal inquiries.
          </Text>
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
  sectionHeader: {
    color: Colors.cyan,
    fontSize: 14,
    fontWeight: Typography.weights.heavy,
    letterSpacing: 0.5,
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
  },
  helplineCard: {
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  dialBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialNum: {
    color: Colors.emergency,
    fontSize: 16,
    fontWeight: Typography.weights.heavy,
  },
  helplineInfo: {
    flex: 1,
  },
  helplineTitle: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: Typography.weights.bold,
    marginBottom: 2,
  },
  helplineDesc: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  callArrow: {
    fontSize: 20,
    marginLeft: Spacing.sm,
  },
  tipCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  tipTitle: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: Typography.weights.bold,
    marginBottom: 4,
  },
  tipText: {
    color: Colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
});
