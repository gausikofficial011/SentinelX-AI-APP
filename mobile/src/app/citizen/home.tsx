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
import { Colors, Typography, Spacing, Radius, Shadows } from '@/constants/theme';
import { Header } from '@/components/common/Header';
import { BottomNav } from '@/components/common/BottomNav';
import { SOSButton } from '@/components/ui/SOSButton';
import { useEmergencyStore } from '@/store/emergencyStore';

export default function CitizenHomeScreen() {
  const router = useRouter();
  const { triggerSOS, isLoading } = useEmergencyStore();
  const [confirmVisible, setConfirmVisible] = useState(false);

  const handleSOSPress = () => {
    setConfirmVisible(true);
  };

  const handleConfirmSOS = async () => {
    setConfirmVisible(false);
    await triggerSOS({
      latitude: 11.0168,
      longitude: 76.9558,
      address: 'RS Puram, Coimbatore',
    });
    router.push('/citizen/sos');
  };

  const quickActions = [
    {
      id: 'report',
      label: 'Report Crime',
      icon: '🚨',
      color: Colors.emergency,
      route: '/citizen/report-crime',
    },
    {
      id: 'stolen',
      label: 'Stolen Vehicle',
      icon: '🚗',
      color: Colors.cyan,
      route: '/citizen/stolen-vehicle',
    },
    {
      id: 'missing',
      label: 'Missing Person',
      icon: '👥',
      color: Colors.warning,
      route: '/citizen/missing-person',
    },
    {
      id: 'fir',
      label: 'Check FIR Status',
      icon: '📋',
      color: Colors.primary,
      route: '/citizen/fir-status',
    },
    {
      id: 'safety',
      label: 'Safety Tips',
      icon: '💡',
      color: '#EAB308',
      route: '/citizen/safety',
    },
    {
      id: 'helpline',
      label: 'Helpline Numbers',
      icon: '📞',
      color: Colors.danger,
      route: '/citizen/safety',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Prominent Large SOS Emergency Button matching screen #3 */}
        <View style={styles.sosSection}>
          <SOSButton onPress={handleSOSPress} isLoading={isLoading} />
        </View>

        {/* Quick Action Grid (3x2) matching screen #3 */}
        <View style={styles.grid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.actionCard}
              onPress={() => router.push(action.route as any)}
              activeOpacity={0.75}
            >
              <View
                style={[
                  styles.actionIconBox,
                  { backgroundColor: `${action.color}15`, borderColor: `${action.color}35` },
                ]}
              >
                <Text style={styles.actionIcon}>{action.icon}</Text>
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Community Crime Hotspot Shortcut */}
        <TouchableOpacity
          style={styles.mapBanner}
          onPress={() => router.push('/citizen/map')}
          activeOpacity={0.8}
        >
          <View style={styles.bannerLeft}>
            <Text style={styles.bannerTitle}>🗺️ Live Safety & Hotspot Map</Text>
            <Text style={styles.bannerSub}>View high risk sectors & safe transit corridors</Text>
          </View>
          <Text style={styles.bannerArrow}>›</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* SOS Confirmation Dialog */}
      <Modal visible={confirmVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.confirmBox}>
            <Text style={styles.confirmIcon}>🚨</Text>
            <Text style={styles.confirmTitle}>BROADCAST EMERGENCY SOS?</Text>
            <Text style={styles.confirmDesc}>
              This will immediately send your live GPS coordinates to Central CAD Dispatch and route
              nearby police patrol units to your position.
            </Text>

            <View style={styles.confirmButtonsRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setConfirmVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sendSosBtn}
                onPress={handleConfirmSOS}
                activeOpacity={0.85}
              >
                <Text style={styles.sendSosText}>SEND SOS NOW</Text>
              </TouchableOpacity>
            </View>
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
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  sosSection: {
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  actionCard: {
    width: '30%',
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  actionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  actionIcon: {
    fontSize: 20,
  },
  actionLabel: {
    color: Colors.text,
    fontSize: 11,
    fontWeight: Typography.weights.semibold,
    textAlign: 'center',
    lineHeight: 14,
  },
  mapBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 163, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0, 163, 255, 0.3)',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginTop: Spacing.lg,
  },
  bannerLeft: {
    flex: 1,
  },
  bannerTitle: {
    color: Colors.cyan,
    fontSize: 14,
    fontWeight: Typography.weights.bold,
  },
  bannerSub: {
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  bannerArrow: {
    color: Colors.cyan,
    fontSize: 24,
    marginLeft: Spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  confirmBox: {
    width: '100%',
    backgroundColor: '#0F172A',
    borderWidth: 2,
    borderColor: Colors.emergency,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    ...Shadows.glowEmergency,
  },
  confirmIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  confirmTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: Typography.weights.heavy,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  confirmDesc: {
    color: Colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: Spacing.xl,
  },
  confirmButtonsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 14,
    borderRadius: Radius.pill,
    alignItems: 'center',
  },
  cancelText: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: Typography.weights.bold,
  },
  sendSosBtn: {
    flex: 2,
    backgroundColor: Colors.emergency,
    paddingVertical: 14,
    borderRadius: Radius.pill,
    alignItems: 'center',
    ...Shadows.glowEmergency,
  },
  sendSosText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: Typography.weights.heavy,
    letterSpacing: 0.5,
  },
});
