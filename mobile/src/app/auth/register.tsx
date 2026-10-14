import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types';

export default function RegisterScreen() {
  const router = useRouter();
  const { loginCustom } = useAuthStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('CITIZEN');

  const handleRegister = () => {
    if (!fullName.trim() || !email.trim()) {
      if (Platform.OS !== 'web') Alert.alert('Error', 'Please enter your name and email');
      return;
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      fullName,
      email,
      username: email.split('@')[0],
      phone,
      role: selectedRole,
      badgeNumber: selectedRole === 'OFFICER' ? '#TN-9921' : undefined,
      department: selectedRole === 'CITIZEN' ? 'Public Safety' : 'Law Enforcement',
      stationName: 'Central District Outpost',
    };

    loginCustom(newUser, 'jwt-new-user-token');

    if (selectedRole === 'OFFICER') router.replace('/officer/dashboard' as any);
    else if (selectedRole === 'DISPATCHER') router.replace('/dispatcher/dashboard' as any);
    else if (selectedRole === 'INTELLIGENCE_ANALYST') router.replace('/analyst/dashboard' as any);
    else if (selectedRole === 'ADMIN') router.replace('/admin/dashboard' as any);
    else router.replace('/citizen/home' as any);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backText}>‹ Back</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Register Account</Text>
          <Text style={styles.subtitle}>Create your SentinelX identity credentials</Text>

          <View style={styles.card}>
            <Text style={styles.label}>Account Role</Text>
            <View style={styles.roleRow}>
              {(['CITIZEN', 'OFFICER', 'DISPATCHER'] as UserRole[]).map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[styles.roleChip, selectedRole === r && styles.roleChipActive]}
                  onPress={() => setSelectedRole(r)}
                >
                  <Text style={[styles.roleChipText, selectedRole === r && styles.roleChipTextActive]}>
                    {r}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="e.g. Gausik Srinivasan"
              placeholderTextColor={Colors.textDim}
            />

            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="user@example.com"
              placeholderTextColor={Colors.textDim}
            />

            <Text style={styles.label}>Mobile Phone</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="+91 98400 00000"
              placeholderTextColor={Colors.textDim}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="••••••••••••"
              placeholderTextColor={Colors.textDim}
            />

            <TouchableOpacity style={styles.submitBtn} onPress={handleRegister} activeOpacity={0.85}>
              <Text style={styles.submitBtnText}>Create Account & Sign In →</Text>
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
    padding: Spacing.xl,
  },
  backBtn: {
    marginBottom: Spacing.md,
  },
  backText: {
    color: Colors.cyan,
    fontSize: 16,
    fontWeight: Typography.weights.bold,
  },
  title: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: Typography.weights.heavy,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 13,
    marginTop: 4,
    marginBottom: Spacing.xl,
  },
  card: {
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
  },
  label: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: Typography.weights.semibold,
    marginBottom: 6,
    marginTop: Spacing.sm,
  },
  roleRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  roleChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: Radius.sm,
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  roleChipActive: {
    backgroundColor: Colors.cyanGlow,
    borderColor: Colors.cyan,
  },
  roleChipText: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: Typography.weights.bold,
  },
  roleChipTextActive: {
    color: Colors.cyan,
  },
  input: {
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    height: 46,
    color: Colors.text,
    fontSize: 14,
    marginBottom: Spacing.xs,
  },
  submitBtn: {
    backgroundColor: '#0284C7',
    paddingVertical: 14,
    borderRadius: Radius.md,
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  submitBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: Typography.weights.bold,
  },
});
