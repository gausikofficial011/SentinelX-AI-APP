import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { Header } from '@/components/common/Header';
import { BottomNav } from '@/components/common/BottomNav';
import { PRESET_ACCOUNTS } from '@/store/authStore';

export default function AdminUsersScreen() {
  const [personnel, setPersonnel] = useState(Object.values(PRESET_ACCOUNTS));

  const handleToggleActive = (name: string) => {
    if (Platform.OS !== 'web') {
      Alert.alert('Status Updated', `Permissions for ${name} re-validated.`);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Personnel & Roles" subtitle="Authorized Operative Directory" showBack />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {personnel.map((p) => (
          <View key={p.id} style={styles.userCard}>
            <View style={styles.topRow}>
              <View>
                <Text style={styles.name}>{p.fullName}</Text>
                <Text style={styles.email}>{p.email}</Text>
              </View>
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>{p.role}</Text>
              </View>
            </View>

            <View style={styles.metaRow}>
              <Text style={styles.metaText}>📍 {p.stationName || 'Headquarters'}</Text>
              <Text style={styles.metaText}>🏷️ {p.badgeNumber || 'Civilian'}</Text>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => handleToggleActive(p.fullName)}
              >
                <Text style={styles.actionBtnText}>Audit Access Permissions</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
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
  userCard: {
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  name: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: Typography.weights.bold,
  },
  email: {
    color: Colors.textDim,
    fontSize: 12,
    marginTop: 1,
  },
  roleBadge: {
    backgroundColor: Colors.cyanGlow,
    borderWidth: 1,
    borderColor: Colors.cyan,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.pill,
  },
  roleText: {
    color: Colors.cyan,
    fontSize: 10,
    fontWeight: Typography.weights.heavy,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: Spacing.xs,
  },
  metaText: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  actionRow: {
    marginTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingTop: Spacing.sm,
  },
  actionBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingVertical: 8,
    borderRadius: Radius.sm,
    alignItems: 'center',
  },
  actionBtnText: {
    color: Colors.cyan,
    fontSize: 12,
    fontWeight: Typography.weights.semibold,
  },
});
