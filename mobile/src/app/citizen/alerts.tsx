import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { Header } from '@/components/common/Header';
import { BottomNav } from '@/components/common/BottomNav';
import { useAlertStore } from '@/store/alertStore';

export default function CitizenAlertsScreen() {
  const { alerts, markAsRead } = useAlertStore();

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Public Safety Advisories" subtitle="Real-time High-Priority Alerts" showBack />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {alerts.map((alert) => {
          const isCritical = alert.severity === 'CRITICAL';
          const isWarning = alert.severity === 'WARNING';
          const alertColor = isCritical ? Colors.emergency : isWarning ? Colors.warning : Colors.cyan;

          return (
            <TouchableOpacity
              key={alert.id}
              style={[
                styles.card,
                { borderLeftColor: alertColor, borderLeftWidth: 4 },
                !alert.read && styles.cardUnread,
              ]}
              onPress={() => markAsRead(alert.id)}
              activeOpacity={0.8}
            >
              <View style={styles.topRow}>
                <View style={styles.badgeWrap}>
                  <Text style={[styles.badgeText, { color: alertColor }]}>{alert.severity}</Text>
                </View>
                <Text style={styles.timestamp}>{alert.timestamp}</Text>
              </View>

              <Text style={styles.title}>{alert.title}</Text>
              <Text style={styles.message}>{alert.message}</Text>
              <Text style={styles.area}>📍 Affected Area: {alert.area}</Text>
            </TouchableOpacity>
          );
        })}
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
    gap: Spacing.md,
  },
  card: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardUnread: {
    backgroundColor: 'rgba(13, 21, 39, 0.95)',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  badgeWrap: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: Typography.weights.heavy,
    textTransform: 'uppercase',
  },
  timestamp: {
    color: Colors.textDim,
    fontSize: 11,
  },
  title: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: Typography.weights.bold,
    marginBottom: 4,
  },
  message: {
    color: Colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: Spacing.sm,
  },
  area: {
    color: Colors.cyan,
    fontSize: 12,
    fontWeight: Typography.weights.medium,
  },
});
