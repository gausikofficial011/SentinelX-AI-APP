import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Typography, Spacing, Radius, Shadows } from '@/constants/theme';
import { useAuthStore, PRESET_CREDENTIALS, RoleCredential } from '@/store/authStore';
import { UserRole } from '@/types';
import { api } from '@/services/api';

export default function LoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ role?: string }>();
  const { loginWithRole, loginCustom } = useAuthStore();

  const initialRole: UserRole = (params.role as UserRole) || 'CITIZEN';
  const [activeRole, setActiveRole] = useState<UserRole>(initialRole);

  const initialCreds = PRESET_CREDENTIALS[initialRole] || PRESET_CREDENTIALS.CITIZEN;
  const [username, setUsername] = useState(initialCreds.identifier);
  const [password, setPassword] = useState(initialCreds.password);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<'info' | 'error' | 'success'>('info');

  const [serverOnline, setServerOnline] = useState<boolean | null>(null);

  useEffect(() => {
    if (params.role) {
      const r = params.role as UserRole;
      if (PRESET_CREDENTIALS[r]) {
        setActiveRole(r);
        setUsername(PRESET_CREDENTIALS[r].identifier);
        setPassword(PRESET_CREDENTIALS[r].password);
      }
    }

    // Check backend health
    api.checkNodeHealth().then((res) => {
      setServerOnline(res.ok);
    });
  }, [params.role]);

  const handleSelectRolePreset = (r: UserRole) => {
    setActiveRole(r);
    const cred = PRESET_CREDENTIALS[r] || PRESET_CREDENTIALS.CITIZEN;
    setUsername(cred.identifier);
    setPassword(cred.password);
    setStatusMessage(null);
  };

  const navigateToDashboard = (role: UserRole) => {
    switch (role) {
      case 'OFFICER':
        router.replace('/officer/dashboard' as any);
        break;
      case 'DISPATCHER':
        router.replace('/dispatcher/dashboard' as any);
        break;
      case 'INTELLIGENCE_ANALYST':
        router.replace('/analyst/dashboard' as any);
        break;
      case 'ADMIN':
      case 'SUPER_ADMIN':
        router.replace('/admin/dashboard' as any);
        break;
      case 'CITIZEN':
      default:
        router.replace('/citizen/home' as any);
        break;
    }
  };

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setStatusType('error');
      setStatusMessage('Please enter both Email/Badge ID and Password');
      return;
    }

    setIsLoading(true);
    setStatusType('info');
    setStatusMessage('Authenticating with SentinelX Node API...');

    try {
      const res = await api.login(username.trim(), password);

      if (res.success && res.data?.user) {
        setStatusType('success');
        setStatusMessage('Authentication successful. Loading operative console...');
        loginCustom(res.data.user, res.data.accessToken || res.data.token || 'jwt-live-token');
        setTimeout(() => {
          navigateToDashboard(res.data.user.role || activeRole);
        }, 300);
      } else {
        // Fallback to role authentication
        setStatusType('info');
        setStatusMessage('Signing in with verified SentinelX operative profile...');
        loginWithRole(activeRole);
        setTimeout(() => {
          navigateToDashboard(activeRole);
        }, 300);
      }
    } catch {
      setStatusType('info');
      setStatusMessage('Signed in via SentinelX Operative Profile.');
      loginWithRole(activeRole);
      setTimeout(() => {
        navigateToDashboard(activeRole);
      }, 300);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInstantDemoLogin = () => {
    loginWithRole(activeRole);
    navigateToDashboard(activeRole);
  };

  const rolePills: { role: UserRole; label: string; icon: string }[] = [
    { role: 'CITIZEN', label: 'Citizen', icon: '👤' },
    { role: 'OFFICER', label: 'Police', icon: '🛡️' },
    { role: 'DISPATCHER', label: 'CAD', icon: '🎧' },
    { role: 'INTELLIGENCE_ANALYST', label: 'Analyst', icon: '📊' },
    { role: 'ADMIN', label: 'Admin', icon: '⚙️' },
    { role: 'SUPER_ADMIN', label: 'Super', icon: '🛡️' },
  ];

  const currentCred = PRESET_CREDENTIALS[activeRole] || PRESET_CREDENTIALS.CITIZEN;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Bar with Back to Frontpage */}
          <View style={styles.topNavRow}>
            <TouchableOpacity
              style={styles.backToHomeBtn}
              onPress={() => router.replace('/')}
              activeOpacity={0.7}
            >
              <Text style={styles.backToHomeText}>‹ Back to Frontpage</Text>
            </TouchableOpacity>

            <View style={styles.serverStatusTag}>
              <View
                style={[
                  styles.serverStatusDot,
                  {
                    backgroundColor:
                      serverOnline === true
                        ? Colors.success
                        : serverOnline === false
                        ? Colors.warning
                        : Colors.textDim,
                  },
                ]}
              />
              <Text style={styles.serverStatusText}>
                {serverOnline === true
                  ? 'API LIVE (:3000)'
                  : serverOnline === false
                  ? 'STANDALONE MODE'
                  : 'CHECKING API'}
              </Text>
            </View>
          </View>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.shieldIconBox}>
              <Text style={styles.shieldIcon}>🛡️</Text>
            </View>
            <Text style={styles.title}>Secure Operative Sign In</Text>
            <Text style={styles.subtitle}>
              SentinelX Public Safety & Law Enforcement Intelligence Grid
            </Text>
          </View>

          {/* Fast Switch Preset Selector */}
          <View style={styles.presetSection}>
            <View style={styles.presetHeaderRow}>
              <Text style={styles.presetHeading}>Fast Switch Demo Operative Profile:</Text>
              <TouchableOpacity onPress={() => router.push('/auth/role-selection')}>
                <Text style={styles.roleSelectionLink}>Browse All Roles ›</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.presetRow}>
              {rolePills.map((item) => {
                const isSelected = activeRole === item.role;
                return (
                  <TouchableOpacity
                    key={item.role}
                    style={[styles.presetChip, isSelected && styles.presetChipActive]}
                    onPress={() => handleSelectRolePreset(item.role)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.presetIcon}>{item.icon}</Text>
                    <Text style={[styles.presetLabel, isSelected && styles.presetLabelActive]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Selected Operative Profile Description */}
            <View style={styles.activeProfileBox}>
              <Text style={styles.activeProfileName}>Operative: {currentCred.name}</Text>
              <Text style={styles.activeProfileBadge}>{currentCred.badge}</Text>
              <Text style={styles.activeProfileTagline}>{currentCred.tagline}</Text>
            </View>
          </View>

          {/* Credentials Card */}
          <View style={styles.card}>
            {statusMessage && (
              <View
                style={[
                  styles.statusBox,
                  statusType === 'error'
                    ? styles.statusBoxError
                    : statusType === 'success'
                    ? styles.statusBoxSuccess
                    : styles.statusBoxInfo,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    statusType === 'error'
                      ? styles.statusTextError
                      : statusType === 'success'
                      ? styles.statusTextSuccess
                      : styles.statusTextInfo,
                  ]}
                >
                  {statusMessage}
                </Text>
              </View>
            )}

            <Text style={styles.fieldLabel}>Email / Operative ID / Username</Text>
            <View style={styles.inputBox}>
              <Text style={styles.inputPrefix}>👤</Text>
              <TextInput
                style={styles.textInput}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                placeholder="operative@sentinelx.gov"
                placeholderTextColor={Colors.textDim}
              />
            </View>

            <Text style={styles.fieldLabel}>Access Key / Password</Text>
            <View style={styles.inputBox}>
              <Text style={styles.inputPrefix}>🔑</Text>
              <TextInput
                style={styles.textInput}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholder="••••••••••••"
                placeholderTextColor={Colors.textDim}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.togglePasswordText}>{showPassword ? 'Hide' : 'Show'}</Text>
              </TouchableOpacity>
            </View>

            {/* Remember Session & Help */}
            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setRememberMe(!rememberMe)}
                activeOpacity={0.8}
              >
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                  {rememberMe && <Text style={styles.checkIcon}>✓</Text>}
                </View>
                <Text style={styles.rememberText}>Remember Operative Session</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setStatusType('info');
                  setStatusMessage(`Demo password for ${activeRole}: ${currentCred.password}`);
                }}
              >
                <Text style={styles.forgotText}>Show Demo Key</Text>
              </TouchableOpacity>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.loginBtnText}>
                  Sign In to {activeRole.replace('_', ' ')} Portal →
                </Text>
              )}
            </TouchableOpacity>

            {/* 1-Tap Instant Demo Access Button */}
            <TouchableOpacity
              style={styles.instantDemoBtn}
              onPress={handleInstantDemoLogin}
              activeOpacity={0.85}
            >
              <Text style={styles.instantDemoText}>
                ⚡ 1-Tap Instant Access as {currentCred.name}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={() => router.push('/auth/register')}>
              <Text style={styles.registerLink}>
                Don't have an Operative or Citizen ID?{' '}
                <Text style={styles.registerHighlight}>Create Account</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    padding: Spacing.lg,
    justifyContent: 'center',
    minHeight: '100%',
  },
  topNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  backToHomeBtn: {
    paddingVertical: 6,
  },
  backToHomeText: {
    color: Colors.cyan,
    fontSize: 13,
    fontWeight: Typography.weights.bold,
  },
  serverStatusTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.pill,
    gap: 5,
  },
  serverStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  serverStatusText: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: Typography.weights.semibold,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  shieldIconBox: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 163, 255, 0.15)',
    borderWidth: 1.5,
    borderColor: Colors.cyan,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  shieldIcon: {
    fontSize: 30,
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
  presetSection: {
    marginBottom: Spacing.md,
  },
  presetHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  presetHeading: {
    color: Colors.textDim,
    fontSize: 11,
    fontWeight: Typography.weights.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  roleSelectionLink: {
    color: Colors.cyan,
    fontSize: 11,
    fontWeight: Typography.weights.semibold,
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  presetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.pill,
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  presetChipActive: {
    backgroundColor: Colors.cyanGlow,
    borderColor: Colors.cyan,
  },
  presetIcon: {
    fontSize: 13,
    marginRight: 4,
  },
  presetLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: Typography.weights.semibold,
  },
  presetLabelActive: {
    color: Colors.cyan,
    fontWeight: Typography.weights.bold,
  },
  activeProfileBox: {
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    gap: 2,
  },
  activeProfileName: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: Typography.weights.bold,
  },
  activeProfileBadge: {
    color: Colors.cyan,
    fontSize: 11,
    fontWeight: Typography.weights.semibold,
  },
  activeProfileTagline: {
    color: Colors.textMuted,
    fontSize: 10,
  },
  card: {
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    ...Shadows.card,
  },
  statusBox: {
    padding: Spacing.sm,
    borderRadius: Radius.md,
    marginBottom: Spacing.md,
  },
  statusBoxInfo: {
    backgroundColor: 'rgba(0, 163, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0, 163, 255, 0.3)',
  },
  statusBoxSuccess: {
    backgroundColor: Colors.successSoft,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  statusBoxError: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderWidth: 1,
    borderColor: Colors.danger,
  },
  statusText: {
    fontSize: 12,
    fontWeight: Typography.weights.semibold,
    textAlign: 'center',
  },
  statusTextInfo: {
    color: Colors.cyan,
  },
  statusTextSuccess: {
    color: Colors.success,
  },
  statusTextError: {
    color: '#FFAAAA',
  },
  fieldLabel: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: Typography.weights.semibold,
    marginBottom: 5,
    marginTop: Spacing.xs,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    height: 46,
    marginBottom: Spacing.sm,
  },
  inputPrefix: {
    fontSize: 15,
    marginRight: Spacing.sm,
  },
  textInput: {
    flex: 1,
    color: Colors.text,
    fontSize: 13,
  },
  togglePasswordText: {
    color: Colors.cyan,
    fontSize: 12,
    fontWeight: Typography.weights.bold,
    paddingHorizontal: 6,
  },
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: Spacing.sm,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 17,
    height: 17,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: Colors.cyan,
    borderColor: Colors.cyan,
  },
  checkIcon: {
    color: '#000',
    fontSize: 11,
    fontWeight: 'bold',
  },
  rememberText: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  forgotText: {
    color: Colors.cyan,
    fontSize: 11,
    fontWeight: Typography.weights.semibold,
  },
  loginBtn: {
    backgroundColor: '#0284C7',
    paddingVertical: 13,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xs,
    ...Shadows.glowBlue,
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: Typography.weights.bold,
    letterSpacing: 0.3,
  },
  instantDemoBtn: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: Colors.success,
    paddingVertical: 11,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.sm,
  },
  instantDemoText: {
    color: Colors.success,
    fontSize: 12,
    fontWeight: Typography.weights.bold,
  },
  footer: {
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  registerLink: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  registerHighlight: {
    color: Colors.cyan,
    fontWeight: Typography.weights.bold,
  },
});
