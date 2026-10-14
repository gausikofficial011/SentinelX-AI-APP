import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = 'Unable to connect to SentinelX intelligence telemetry.',
  onRetry,
}: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.title}>Connection Interrupted</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.retryBtn} onPress={onRetry} activeOpacity={0.8}>
          <Text style={styles.retryText}>Retry Connection</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.backgroundCard,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
    margin: Spacing.lg,
  },
  icon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  title: {
    color: Colors.emergency,
    fontSize: 16,
    fontWeight: Typography.weights.bold,
    marginBottom: 4,
  },
  message: {
    color: Colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  retryBtn: {
    backgroundColor: Colors.emergencySoft,
    borderColor: Colors.emergency,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: Radius.md,
  },
  retryText: {
    color: Colors.emergency,
    fontSize: 13,
    fontWeight: Typography.weights.bold,
  },
});
