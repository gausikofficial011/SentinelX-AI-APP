import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuthStore();

  const role = user?.role || 'CITIZEN';

  // Role-specific bottom navigation tabs matching mockups
  const getTabsForRole = () => {
    switch (role) {
      case 'OFFICER':
        return [
          { key: 'home', label: 'Home', icon: '🛡️', route: '/officer/dashboard' },
          { key: 'map', label: 'Map', icon: '📍', route: '/officer/patrol' },
          { key: 'tasks', label: 'Tasks', icon: '📋', route: '/officer/incidents' },
          { key: 'copilot', label: 'Copilot', icon: '🧠', route: '/copilot' },
          { key: 'profile', label: 'Profile', icon: '👤', route: '/officer/profile' },
        ];
      case 'DISPATCHER':
        return [
          { key: 'queue', label: 'Queue', icon: '🚨', route: '/dispatcher/dashboard' },
          { key: 'map', label: 'Map', icon: '📍', route: '/dispatcher/fleet-map' },
          { key: 'units', label: 'Units', icon: '🚔', route: '/dispatcher/active-units' },
          { key: 'copilot', label: 'Copilot', icon: '🧠', route: '/copilot' },
          { key: 'profile', label: 'Profile', icon: '👤', route: '/citizen/profile' },
        ];
      case 'INTELLIGENCE_ANALYST':
        return [
          { key: 'dashboard', label: 'Dashboard', icon: '📊', route: '/analyst/dashboard' },
          { key: 'analytics', label: 'Analytics', icon: '📈', route: '/analyst/forecast' },
          { key: 'hotspots', label: 'Hotspots', icon: '📍', route: '/analyst/hotspots' },
          { key: 'copilot', label: 'Copilot', icon: '🧠', route: '/copilot' },
          { key: 'profile', label: 'Profile', icon: '👤', route: '/citizen/profile' },
        ];
      case 'ADMIN':
      case 'SUPER_ADMIN':
        return [
          { key: 'dashboard', label: 'Dashboard', icon: '🛡️', route: '/admin/dashboard' },
          { key: 'users', label: 'Users', icon: '👥', route: '/admin/users' },
          { key: 'alerts', label: 'Alerts', icon: '📢', route: '/admin/alerts' },
          { key: 'system', label: 'System', icon: '⚙️', route: '/admin/system-health' },
          { key: 'profile', label: 'Profile', icon: '👤', route: '/citizen/profile' },
        ];
      case 'CITIZEN':
      default:
        return [
          { key: 'home', label: 'Home', icon: '🏠', route: '/citizen/home' },
          { key: 'map', label: 'Map', icon: '📍', route: '/citizen/map' },
          { key: 'report', label: 'Report', icon: '📝', route: '/citizen/report-crime' },
          { key: 'alerts', label: 'Alerts', icon: '🔔', route: '/citizen/alerts' },
          { key: 'profile', label: 'Profile', icon: '👤', route: '/citizen/profile' },
        ];
    }
  };

  const tabs = getTabsForRole();

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = pathname.startsWith(tab.route);
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tabItem}
            onPress={() => router.push(tab.route as any)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconWrapper, isActive && styles.iconActive]}>
              <Text style={[styles.iconText, isActive && styles.iconTextActive]}>{tab.icon}</Text>
            </View>
            <Text style={[styles.label, isActive && styles.labelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: Colors.backgroundSecondary,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    elevation: 12,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconWrapper: {
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: Radius.md,
    marginBottom: 2,
  },
  iconActive: {
    backgroundColor: Colors.cyanGlow,
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.4)',
  },
  iconText: {
    fontSize: 18,
    opacity: 0.6,
  },
  iconTextActive: {
    opacity: 1,
  },
  label: {
    fontSize: 10,
    fontWeight: Typography.weights.semibold,
    color: Colors.textDim,
    letterSpacing: 0.2,
  },
  labelActive: {
    color: Colors.cyan,
    fontWeight: Typography.weights.bold,
  },
});
