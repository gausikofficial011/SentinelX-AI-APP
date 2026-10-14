import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { DarkTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors, Radius, Shadows } from '@/constants/theme';
import { socketService } from '@/services/socketService';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  useEffect(() => {
    // Hide native splash screen once ready
    SplashScreen.hideAsync().catch(() => {});
    // Connect Socket.IO client in background
    socketService.connect();

    return () => {
      socketService.disconnect();
    };
  }, []);

  const stackContent = (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="auth/welcome" />
      <Stack.Screen name="auth/role-selection" />
      <Stack.Screen name="auth/login" />
      <Stack.Screen name="auth/register" />
      <Stack.Screen name="citizen/home" />
      <Stack.Screen name="citizen/sos" />
      <Stack.Screen name="citizen/map" />
      <Stack.Screen name="citizen/report-crime" />
      <Stack.Screen name="citizen/stolen-vehicle" />
      <Stack.Screen name="citizen/missing-person" />
      <Stack.Screen name="citizen/anonymous-tip" />
      <Stack.Screen name="citizen/fir-status" />
      <Stack.Screen name="citizen/alerts" />
      <Stack.Screen name="citizen/safety" />
      <Stack.Screen name="citizen/profile" />
      <Stack.Screen name="officer/dashboard" />
      <Stack.Screen name="officer/incidents" />
      <Stack.Screen name="officer/incident-details" />
      <Stack.Screen name="officer/fir" />
      <Stack.Screen name="officer/evidence" />
      <Stack.Screen name="officer/suspect-dossier" />
      <Stack.Screen name="officer/patrol" />
      <Stack.Screen name="officer/profile" />
      <Stack.Screen name="dispatcher/dashboard" />
      <Stack.Screen name="dispatcher/emergency-queue" />
      <Stack.Screen name="dispatcher/emergency-details" />
      <Stack.Screen name="dispatcher/dispatch-unit" />
      <Stack.Screen name="dispatcher/active-units" />
      <Stack.Screen name="dispatcher/fleet-map" />
      <Stack.Screen name="analyst/dashboard" />
      <Stack.Screen name="analyst/hotspots" />
      <Stack.Screen name="analyst/forecast" />
      <Stack.Screen name="analyst/patrol-planning" />
      <Stack.Screen name="analyst/reports" />
      <Stack.Screen name="admin/dashboard" />
      <Stack.Screen name="admin/users" />
      <Stack.Screen name="admin/alerts" />
      <Stack.Screen name="admin/system-health" />
      <Stack.Screen name="admin/audit-logs" />
      <Stack.Screen name="copilot/index" />
    </Stack>
  );

  return (
    <SafeAreaProvider>
      <ThemeProvider value={DarkTheme}>
        <StatusBar style="light" />
        <View style={styles.root}>{stackContent}</View>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // Web Desktop Simulator Backdrop
  webDesktopBackdrop: {
    flex: 1,
    backgroundColor: '#02050D',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  ambientBackdropGlow: {
    position: 'absolute',
    top: '20%',
    left: '25%',
    width: 600,
    height: 600,
    borderRadius: 300,
    backgroundColor: 'rgba(0, 163, 255, 0.04)',
    pointerEvents: 'none',
  },
  webTopBar: {
    width: '100%',
    maxWidth: 960,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
    marginBottom: 4,
  },
  webBranding: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  webShield: {
    fontSize: 20,
  },
  webTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  webLivePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: Colors.success,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 5,
  },
  webGreenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
  },
  webLiveText: {
    color: Colors.success,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  frameToggleBtn: {
    backgroundColor: 'rgba(13, 21, 39, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  frameToggleText: {
    color: Colors.cyan,
    fontSize: 12,
    fontWeight: '600',
  },

  // Realistic Flagship Phone Frame
  deviceFrameOuter: {
    width: 420,
    height: '92vh' as any,
    maxHeight: 900,
    minHeight: 680,
    backgroundColor: '#000000',
    borderRadius: 48,
    borderWidth: 3,
    borderColor: 'rgba(56, 189, 248, 0.35)',
    overflow: 'hidden',
    position: 'relative',
    ...Shadows.glowBlue,
  },
  dynamicIsland: {
    position: 'absolute',
    top: 10,
    left: '50%',
    marginLeft: -60,
    width: 120,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    zIndex: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  cameraDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0D1527',
    borderWidth: 1.5,
    borderColor: '#1E293B',
  },
  sensorPill: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#060B14',
  },
  phoneScreenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    overflow: 'hidden',
  },
  homeIndicatorWrap: {
    height: 18,
    backgroundColor: Colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeIndicator: {
    width: 130,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },

  // Fullwidth fallback mode on web
  fullWidthContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 960,
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
});
