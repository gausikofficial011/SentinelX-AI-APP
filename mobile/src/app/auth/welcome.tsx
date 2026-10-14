import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius, Shadows } from '@/constants/theme';

const { height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* City Skyline Decorative Grid */}
        <View style={styles.decorativeBackground}>
          <View style={styles.ambientGlow} />
          <View style={styles.gridLine} />
          <View style={[styles.gridLine, { top: '30%' }]} />
          <View style={[styles.gridLine, { top: '60%' }]} />
        </View>

        {/* Center Hero Shield & Branding matching screen #1 */}
        <View style={styles.heroContent}>
          <View style={styles.shieldGlowWrap}>
            <View style={styles.shieldBackdrop} />
            <View style={styles.shieldCore}>
              <Text style={styles.shieldEmoji}>🛡️</Text>
            </View>
          </View>

          <Text style={styles.brandTitle}>
            Sentinel<Text style={styles.brandAccent}>X</Text> AI
          </Text>
          <Text style={styles.tagline}>Safer Cities. Smarter Decisions.</Text>
        </View>

        {/* Bottom CTA & Mission Motto */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.getStartedBtn}
            onPress={() => router.replace('/')}
            activeOpacity={0.85}
          >
            <Text style={styles.getStartedText}>Enter Platform Frontpage →</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.roleSelectionBtn}
            onPress={() => router.push('/auth/role-selection')}
            activeOpacity={0.8}
          >
            <Text style={styles.roleSelectionBtnText}>Choose Operative Role</Text>
          </TouchableOpacity>

          <Text style={styles.motto}>Protect  •  Prevent  •  Respond</Text>
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
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
  },
  decorativeBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  ambientGlow: {
    position: 'absolute',
    top: '20%',
    left: '10%',
    width: '80%',
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(0, 163, 255, 0.08)',
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  heroContent: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.18,
  },
  shieldGlowWrap: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
    position: 'relative',
  },
  shieldBackdrop: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 36,
    backgroundColor: 'rgba(0, 163, 255, 0.25)',
    ...Shadows.glowBlue,
  },
  shieldCore: {
    width: 96,
    height: 96,
    borderRadius: 30,
    backgroundColor: '#0D1B36',
    borderWidth: 2,
    borderColor: Colors.cyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shieldEmoji: {
    fontSize: 48,
  },
  brandTitle: {
    color: Colors.text,
    fontSize: 34,
    fontWeight: Typography.weights.heavy,
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
  },
  brandAccent: {
    color: Colors.cyan,
  },
  tagline: {
    color: Colors.textMuted,
    fontSize: 15,
    fontWeight: Typography.weights.medium,
  },
  bottomSection: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  getStartedBtn: {
    width: '100%',
    backgroundColor: '#0284C7',
    paddingVertical: 16,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.glowBlue,
    marginBottom: Spacing.sm,
  },
  getStartedText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: Typography.weights.bold,
    letterSpacing: 0.5,
  },
  roleSelectionBtn: {
    width: '100%',
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingVertical: 14,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  roleSelectionBtnText: {
    color: Colors.cyan,
    fontSize: 14,
    fontWeight: Typography.weights.semibold,
  },
  motto: {
    color: Colors.textDim,
    fontSize: 12,
    fontWeight: Typography.weights.semibold,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});
