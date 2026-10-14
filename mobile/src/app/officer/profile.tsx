import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { Header } from '@/components/common/Header';
import { BottomNav } from '@/components/common/BottomNav';
import { useAuthStore } from '@/store/authStore';

export default function OfficerProfileScreen() {
  const router = useRouter();
  const { user, dutyStatus, toggleDutyStatus, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Officer Credentials" subtitle="Service Record & Department Roster" showBack />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Officer Dossier Card */}
        <View style={styles.card}>
          <View style={styles.topProfile}>
            {user?.avatarUrl ? (
              <Image source={{ uri: user.avatarUrl }} style={styles.avatarImg} />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarText}>P</Text>
              </View>
            )}

            <View style={styles.infoCol}>
              <Text style={styles.name}>{user?.fullName || 'PC. Arjun Kumar'}</Text>
              <Text style={styles.badgeNumber}>BADGE {user?.badgeNumber || '#TN-4587'}</Text>
              <Text style={styles.department}>{user?.department || 'Tactical Crime Suppression'}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.metaRow}>
            <Text style={styles.metaKey}>Station Outpost:</Text>
            <Text style={styles.metaVal}>{user?.stationName || 'Central District Police HQ'}</Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaKey}>Radio Call Sign:</Text>
            <Text style={[styles.metaVal, { color: Colors.cyan }]}>VIPER-3</Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaKey}>Shift Status:</Text>
            <TouchableOpacity onPress={toggleDutyStatus} style={styles.dutyBtn}>
              <Text style={[styles.dutyText, { color: dutyStatus === 'ON_DUTY' ? Colors.success : Colors.danger }]}>
                {dutyStatus === 'ON_DUTY' ? '🟢 Active On Duty' : '🔴 Off Duty'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaKey}>Encrypted Comms:</Text>
            <Text style={styles.metaVal}>AES-256 GCM Live</Text>
          </View>
        </View>

        {/* Switch Role Quick Link */}
        <TouchableOpacity
          style={styles.switchRoleBtn}
          onPress={() => router.push('/auth/role-selection')}
          activeOpacity={0.8}
        >
          <Text style={styles.switchRoleText}>⇄ Switch Operational Role</Text>
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
          <Text style={styles.logoutText}>End Shift & Sign Out</Text>
        </TouchableOpacity>
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
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  topProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatarImg: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: Colors.cyan,
    marginRight: Spacing.md,
  },
  avatarFallback: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: Typography.weights.heavy,
  },
  infoCol: {
    flex: 1,
  },
  name: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: Typography.weights.bold,
  },
  badgeNumber: {
    color: Colors.cyan,
    fontSize: 12,
    fontWeight: Typography.weights.heavy,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  department: {
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: Spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    alignItems: 'center',
  },
  metaKey: {
    color: Colors.textDim,
    fontSize: 13,
  },
  metaVal: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: Typography.weights.semibold,
  },
  dutyBtn: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  dutyText: {
    fontSize: 13,
    fontWeight: Typography.weights.bold,
  },
  switchRoleBtn: {
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  switchRoleText: {
    color: Colors.cyan,
    fontSize: 14,
    fontWeight: Typography.weights.bold,
  },
  logoutBtn: {
    backgroundColor: '#DC2626',
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  logoutText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: Typography.weights.heavy,
    letterSpacing: 0.3,
  },
});
