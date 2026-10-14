import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { Colors, Typography, Radius, Shadows } from '@/constants/theme';

interface SOSButtonProps {
  onPress: () => void;
  isLoading?: boolean;
}

export function SOSButton({ onPress, isLoading = false }: SOSButtonProps) {
  const pulseScale = useSharedValue(1);
  const ringScale = useSharedValue(1);
  const ringOpacity = useSharedValue(0.6);

  useEffect(() => {
    // Pulse animation for the central button
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Ripple wave for the outer ring
    ringScale.value = withRepeat(
      withTiming(1.35, { duration: 2400, easing: Easing.out(Easing.ease) }),
      -1,
      false
    );
    ringOpacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 0 }),
        withTiming(0, { duration: 2400, easing: Easing.out(Easing.ease) })
      ),
      -1,
      false
    );
  }, [pulseScale, ringScale, ringOpacity]);

  const animatedRingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: ringOpacity.value,
  }));

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  return (
    <View style={styles.wrapper}>
      {/* Outer Ripple Ring */}
      <Animated.View style={[styles.outerWave, animatedRingStyle]} />

      {/* Middle Translucent Layer */}
      <View style={styles.middleGlow} />

      {/* Primary Pressable SOS Button */}
      <Animated.View style={animatedButtonStyle}>
        <TouchableOpacity
          style={styles.coreButton}
          onPress={onPress}
          activeOpacity={0.85}
          disabled={isLoading}
        >
          <View style={styles.innerGlow}>
            <Text style={styles.alertIcon}>⚠️</Text>
            <Text style={styles.sosText}>{isLoading ? '...' : 'SOS'}</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>

      <Text style={styles.caption}>Tap for Emergency</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 18,
    position: 'relative',
  },
  outerWave: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'rgba(239, 68, 68, 0.4)',
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    top: 5,
  },
  middleGlow: {
    position: 'absolute',
    width: 175,
    height: 175,
    borderRadius: 87.5,
    backgroundColor: 'rgba(220, 38, 38, 0.22)',
    borderWidth: 1.5,
    borderColor: 'rgba(239, 68, 68, 0.35)',
    top: 17.5,
  },
  coreButton: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.glowEmergency,
    borderWidth: 3,
    borderColor: '#F87171',
  },
  innerGlow: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertIcon: {
    fontSize: 22,
    marginBottom: 2,
  },
  sosText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: Typography.weights.heavy,
    letterSpacing: 2,
  },
  caption: {
    marginTop: 22,
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: Typography.weights.semibold,
    letterSpacing: 0.5,
  },
});
