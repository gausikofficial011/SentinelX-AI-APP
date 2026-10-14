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

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  const menuItems = [
    { id: 'reports', label: 'My Reports', icon: '📁', route: '/citizen/report-crime' },
    { id: 'fir', label: 'FIR Status', icon: '📋', route: '/citizen/fir-status' },
    { id: 'locations', label: 'Saved Locations', icon: '📍', route: '/citizen/map' },
    { id: 'contacts', label: 'Safety Contacts', icon: '👥', route: '/citizen/safety' },
    { id: 'settings', label: 'App Settings', icon: '⚙️', route: '/citizen/profile' },
    { id: 'help', label: 'Help & Support', icon: '❓', route: '/citizen/safety' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="My Profile" subtitle="Civilian Account & Settings" />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* User Card matching screen #10 */}
        <View style={styles.userCard}>
          <View style={styles.avatarWrap}>
            {user?.avatarUrl ? (
              <Image source={{ uri: user.avatarUrl }} style={styles.avatarImg} />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarText}>{user?.fullName?.charAt(0) || 'G'}</Text>
              </View>
            )}
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.fullName || 'Gausik Srinivasan'}</Text>
            <Text style={styles.userRole}>{user?.role?.replace('_', ' ') || 'Citizen'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'gausik@example.com'}</Text>
          </View>

          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items List matching screen #10 */}
        <View style={styles.menuCard}>
          {menuItems.map((item, idx) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuItem, idx < menuItems.length - 1 && styles.menuItemBorder]}
              onPress={() => router.push(item.route as any)}
              activeOpacity={0.7}
            >
              <View style={styles.menuLeft}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Switch Portal Button */}
        <TouchableOpacity
          style={styles.switchRoleBtn}
          onPress={() => router.push('/')}
          activeOpacity={0.8}
        >
          <Text style={styles.switchRoleText}>🏛️ Explore & Switch Portal</Text>
        </TouchableOpacity>

        {/* Big Red Logout Button matching screen #10 */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
          <Text style={styles.logoutText}>Logout</Text>
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
  userCard: {
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  avatarWrap: {
    marginRight: Spacing.md,
  },
  avatarImg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: Colors.cyan,
  },
  avatarFallback: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: Typography.weights.heavy,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: Typography.weights.bold,
  },
  userRole: {
    color: Colors.cyan,
    fontSize: 12,
    fontWeight: Typography.weights.semibold,
    marginTop: 2,
  },
  userEmail: {
    color: Colors.textDim,
    fontSize: 12,
    marginTop: 2,
  },
  editBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  editText: {
    color: Colors.cyan,
    fontSize: 12,
    fontWeight: Typography.weights.bold,
  },
  menuCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xl,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 15,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 18,
    marginRight: Spacing.md,
  },
  menuLabel: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: Typography.weights.medium,
  },
  chevron: {
    color: Colors.textDim,
    fontSize: 22,
  },
  switchRoleBtn: {
    backgroundColor: 'rgba(0, 163, 255, 0.12)',
    borderWidth: 1,
    borderColor: Colors.cyan,
    paddingVertical: 13,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  switchRoleText: {
    color: Colors.cyan,
    fontSize: 14,
    fontWeight: Typography.weights.bold,
  },
  logoutBtn: {
    backgroundColor: '#DC2626',
    paddingVertical: 15,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  logoutText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: Typography.weights.heavy,
    letterSpacing: 0.5,
  },
});
