import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius, Shadows } from '@/constants/theme';
import { useEmergencyStore } from '@/store/emergencyStore';

export default function EmergencySOSScreen() {
  const router = useRouter();
  const { activeEmergency, clearActiveEmergency } = useEmergencyStore();

  const handleCall112 = () => {
    Linking.openURL('tel:112').catch(() => {
      if (Platform.OS !== 'web') Alert.alert('Dial 112', 'Initiating call to Emergency Helpline 112...');
    });
  };

  const handleShareLocation = () => {
    if (Platform.OS !== 'web') {
      Alert.alert('Live Telemetry Broadcasted', 'GPS beacon shared with nearest Police PCR Van and CAD Dispatch.');
    }
  };

  const handleClose = () => {
    clearActiveEmergency();
    router.replace('/citizen/home');
  };

  const trackingId = activeEmergency?.trackingId || 'EMG-2026-0915-0042';
  const locationText = activeEmergency?.location.address || 'RS Puram, Coimbatore';
  const coordsText = '11.0168° N, 76.9558° E';
  const timeText = '15 Sept 2026, 09:41 AM';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Close Button */}
        <TouchableOpacity style={styles.closeBtn} onPress={handleClose} activeOpacity={0.7}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.headline}>Emergency Alert Sent!</Text>

        {/* Pulsing Concentric Green Checkmark with Red Ripple matching screen #5 */}
        <View style={styles.circleContainer}>
          <View style={styles.outerRing} />
          <View style={styles.midRing} />
          <View style={styles.coreCircle}>
            <Text style={styles.checkIcon}>✓</Text>
          </View>
        </View>

        {/* Reassurance Message */}
        <Text style={styles.subhead}>Help is on the way</Text>
        <Text style={styles.subtext}>
          Your location has been shared with nearest authorities.
        </Text>

        {/* Telemetry Details Card */}
        <View style={styles.card}>
          {/* Location */}
          <View style={styles.metaRow}>
            <Text style={styles.metaIcon}>📍</Text>
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>Location</Text>
              <Text style={styles.metaValue}>{locationText}</Text>
              <Text style={styles.metaSub}>{coordsText}</Text>
            </View>
          </View>

          {/* Time */}
          <View style={styles.metaRow}>
            <Text style={styles.metaIcon}>🕒</Text>
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>Time</Text>
              <Text style={styles.metaValue}>{timeText}</Text>
            </View>
          </View>

          {/* Tracking ID */}
          <View style={styles.metaRow}>
            <Text style={styles.metaIcon}>📋</Text>
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>Tracking ID</Text>
              <Text style={styles.metaValueHighlight}>{trackingId}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons matching screen #5 */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.call112Btn} onPress={handleCall112} activeOpacity={0.85}>
            <Text style={styles.call112Text}>📞 Call 112</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shareBtn}
            onPress={handleShareLocation}
            activeOpacity={0.85}
          >
            <Text style={styles.shareText}>↗ Share Live Location</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: Spacing.xl,
  },
  closeBtn: {
    alignSelf: 'flex-start',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    color: Colors.textMuted,
    fontSize: 16,
  },
  headline: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: Typography.weights.heavy,
    marginTop: Spacing.sm,
    letterSpacing: 0.3,
  },
  circleContainer: {
    width: 170,
    height: 170,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.md,
    position: 'relative',
  },
  outerRing: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1.5,
    borderColor: 'rgba(239, 68, 68, 0.25)',
  },
  midRing: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(220, 38, 38, 0.25)',
  },
  coreCircle: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: Colors.emergency,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.glowEmergency,
    borderWidth: 3,
    borderColor: '#FFF',
  },
  checkIcon: {
    color: '#FFF',
    fontSize: 40,
    fontWeight: 'bold',
  },
  subhead: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: Typography.weights.bold,
  },
  subtext: {
    color: Colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: Spacing.md,
  },
  card: {
    width: '100%',
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  metaIcon: {
    fontSize: 18,
    marginRight: Spacing.md,
    marginTop: 2,
  },
  metaCol: {
    flex: 1,
  },
  metaLabel: {
    color: Colors.textDim,
    fontSize: 11,
    fontWeight: Typography.weights.semibold,
    textTransform: 'uppercase',
  },
  metaValue: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: Typography.weights.bold,
    marginTop: 2,
  },
  metaSub: {
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 1,
  },
  metaValueHighlight: {
    color: Colors.cyan,
    fontSize: 14,
    fontWeight: Typography.weights.heavy,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  actions: {
    width: '100%',
    gap: Spacing.sm,
  },
  call112Btn: {
    backgroundColor: Colors.emergency,
    paddingVertical: 15,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.glowEmergency,
  },
  call112Text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: Typography.weights.heavy,
  },
  shareBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingVertical: 14,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: Typography.weights.semibold,
  },
});
