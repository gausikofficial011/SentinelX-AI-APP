import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius, Shadows } from '@/constants/theme';
import { useAuthStore, PRESET_CREDENTIALS } from '@/store/authStore';
import { UserRole } from '@/types';

interface RoleOption {
  role: UserRole;
  title: string;
  desc: string;
  icon: string;
  color: string;
  route: string;
  features: string;
}

export default function RoleSelectionScreen() {
  const router = useRouter();
  const { setRoleForOnboarding, loginWithRole } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState<UserRole>('CITIZEN');

  const roles: RoleOption[] = [
    {
      role: 'CITIZEN',
      title: 'Citizen',
      desc: 'Report, Get Help, Stay Safe',
      icon: '👤',
      color: '#3B82F6',
      route: '/citizen/home',
      features: 'SOS Emergency • E-FIR Status • Safe Corridors',
    },
    {
      role: 'OFFICER',
      title: 'Police Officer',
      desc: 'Field Patrol & E-FIR Filing',
      icon: '🛡️',
      color: '#10B981',
      route: '/officer/dashboard',
      features: 'CAD Missions • Patrol Map • Suspect Dossiers',
    },
    {
      role: 'DISPATCHER',
      title: 'CAD Dispatcher',
      desc: '911 Emergency Coordination',
      icon: '🎧',
      color: '#F59E0B',
      route: '/dispatcher/dashboard',
      features: 'Live Call Queue • Fleet GPS • 1-Click Dispatch',
    },
    {
      role: 'INTELLIGENCE_ANALYST',
      title: 'Intelligence Analyst',
      desc: 'Crime Prediction & Hotspots',
      icon: '📊',
      color: '#8B5CF6',
      route: '/analyst/dashboard',
      features: 'DBSCAN Clusters • Prophet Forecast • Patrol AI',
    },
    {
      role: 'ADMIN',
      title: 'System Admin',
      desc: 'Platform Governance & Roster',
      icon: '⚙️',
      color: '#64748B',
      route: '/admin/dashboard',
      features: 'Personnel Roster • Alerts • Cluster Diagnostics',
    },
    {
      role: 'SUPER_ADMIN',
      title: 'Master Administrator / Copilot',
      desc: 'AI Copilot & Security Root',
      icon: '🧠',
      color: '#00F0FF',
      route: '/copilot',
      features: 'Legal RAG Assistant • IPC Guidance • Security Root',
    },
  ];

  const handleContinueToLogin = () => {
    setRoleForOnboarding(selectedRole);
    router.push({
      pathname: '/auth/login',
      params: { role: selectedRole },
    });
  };

  const handleDirectLaunch = (roleOpt: RoleOption) => {
    loginWithRole(roleOpt.role);
    router.replace(roleOpt.route as any);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backLink}
            onPress={() => router.replace('/')}
            activeOpacity={0.7}
          >
            <Text style={styles.backLinkText}>‹ Back to Frontpage</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Choose Operational Role</Text>
          <Text style={styles.subtitle}>
            Select your assigned role or launch tailored tools directly
          </Text>
        </View>

        {/* Roles List */}
        <ScrollView
          style={styles.rolesList}
          contentContainerStyle={styles.rolesContent}
          showsVerticalScrollIndicator={false}
        >
          {roles.map((item) => {
            const isSelected = selectedRole === item.role;
            const cred = PRESET_CREDENTIALS[item.role] || PRESET_CREDENTIALS.CITIZEN;
            return (
              <TouchableOpacity
                key={item.role}
                style={[
                  styles.roleCard,
                  isSelected && styles.roleCardActive,
                  { borderColor: isSelected ? item.color : Colors.border },
                ]}
                onPress={() => setSelectedRole(item.role)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.iconBox,
                    { backgroundColor: `${item.color}20`, borderColor: `${item.color}50` },
                  ]}
                >
                  <Text style={styles.icon}>{item.icon}</Text>
                </View>

                <View style={styles.roleInfo}>
                  <View style={styles.titleRow}>
                    <Text style={styles.roleTitle}>{item.title}</Text>
                    {isSelected && (
                      <View style={[styles.selectedPill, { backgroundColor: `${item.color}30` }]}>
                        <Text style={[styles.selectedPillText, { color: item.color }]}>SELECTED</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.roleDesc}>{item.desc}</Text>
                  <Text style={styles.roleFeatures}>{item.features}</Text>
                  <Text style={styles.operativeTag}>Demo: {cred.name}</Text>
                </View>

                <TouchableOpacity
                  style={[styles.directLaunchBtn, { backgroundColor: item.color }]}
                  onPress={() => handleDirectLaunch(item)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.directLaunchText}>Launch →</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Bottom Bar */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.continueBtn}
            onPress={handleContinueToLogin}
            activeOpacity={0.85}
          >
            <Text style={styles.continueBtnText}>
              Continue to Sign In as {selectedRole.replace('_', ' ')} →
            </Text>
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
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  backLink: {
    alignSelf: 'flex-start',
    marginBottom: Spacing.sm,
  },
  backLinkText: {
    color: Colors.cyan,
    fontSize: 13,
    fontWeight: Typography.weights.bold,
  },
  title: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: Typography.weights.heavy,
    letterSpacing: 0.3,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  rolesList: {
    flex: 1,
  },
  rolesContent: {
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  roleCard: {
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1.5,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  roleCardActive: {
    backgroundColor: 'rgba(13, 21, 39, 0.95)',
    ...Shadows.glowBlue,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 22,
  },
  roleInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  roleTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: Typography.weights.bold,
  },
  selectedPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.pill,
  },
  selectedPillText: {
    fontSize: 9,
    fontWeight: Typography.weights.heavy,
  },
  roleDesc: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  roleFeatures: {
    color: Colors.textDim,
    fontSize: 10,
    marginTop: 2,
  },
  operativeTag: {
    color: Colors.cyan,
    fontSize: 10,
    fontWeight: Typography.weights.semibold,
    marginTop: 3,
  },
  directLaunchBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  directLaunchText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: Typography.weights.bold,
  },
  bottomBar: {
    paddingVertical: Spacing.md,
  },
  continueBtn: {
    backgroundColor: '#0284C7',
    paddingVertical: 14,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.glowBlue,
  },
  continueBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: Typography.weights.bold,
  },
});
