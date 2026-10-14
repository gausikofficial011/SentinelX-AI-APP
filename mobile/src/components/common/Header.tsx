import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';
import { useAlertStore } from '@/store/alertStore';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  showDutyToggle?: boolean;
  showLiveBadge?: boolean;
  onNotificationPress?: () => void;
}

export function Header({
  title,
  subtitle,
  showBack = false,
  showDutyToggle = false,
  showLiveBadge = false,
  onNotificationPress,
}: HeaderProps) {
  const router = useRouter();
  const { user, dutyStatus, toggleDutyStatus } = useAuthStore();
  const { unreadCount } = useAlertStore();

  const isOfficer = user?.role === 'OFFICER';
  const isCitizen = user?.role === 'CITIZEN';

  const defaultTitle = isCitizen
    ? 'SentinelX AI'
    : isOfficer
    ? 'Officer Dashboard'
    : user?.role === 'DISPATCHER'
    ? 'Dispatcher'
    : user?.role === 'INTELLIGENCE_ANALYST'
    ? 'Crime Analytics'
    : 'Admin Command';

  const defaultSubtitle = isCitizen
    ? `Good Morning, ${user?.fullName?.split(' ')[0] || 'Citizen'}`
    : isOfficer
    ? `${user?.fullName} • Badge ${user?.badgeNumber || '#TN-4587'}`
    : 'Stay alert, stay safe!';

  return (
    <View style={styles.container}>
      <View style={styles.leftRow}>
        {showBack ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.avatarWrap}
            activeOpacity={0.8}
            onPress={() => {
              if (isCitizen) router.push('/citizen/profile' as any);
              else if (isOfficer) router.push('/officer/profile' as any);
            }}
          >
            {user?.avatarUrl ? (
              <Image source={{ uri: user.avatarUrl }} style={styles.avatarImg} />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarText}>{user?.fullName?.charAt(0) || 'U'}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}

        <View style={styles.titleCol}>
          <Text style={styles.title} numberOfLines={1}>
            {title || defaultTitle}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle || defaultSubtitle}
          </Text>
        </View>
      </View>

      <View style={styles.rightRow}>
        {showDutyToggle && (
          <TouchableOpacity
            style={[
              styles.dutyBadge,
              dutyStatus === 'ON_DUTY' ? styles.dutyOn : styles.dutyOff,
            ]}
            onPress={toggleDutyStatus}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.dot,
                { backgroundColor: dutyStatus === 'ON_DUTY' ? Colors.success : Colors.danger },
              ]}
            />
            <Text
              style={[
                styles.dutyText,
                { color: dutyStatus === 'ON_DUTY' ? Colors.success : Colors.textMuted },
              ]}
            >
              {dutyStatus === 'ON_DUTY' ? 'On Duty' : 'Off Duty'}
            </Text>
          </TouchableOpacity>
        )}

        {showLiveBadge && (
          <View style={styles.liveBadge}>
            <View style={[styles.dot, { backgroundColor: Colors.success }]} />
            <Text style={styles.liveText}>Live</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.portalBadgeBtn}
          onPress={() => router.push('/' as any)}
          activeOpacity={0.7}
        >
          <Text style={styles.portalBadgeText}>🏛️ Portals</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bellBtn}
          onPress={onNotificationPress || (() => router.push('/citizen/alerts' as any))}
          activeOpacity={0.7}
        >
          <Text style={styles.bellIcon}>🔔</Text>
          {unreadCount > 0 && (
            <View style={styles.badgeCount}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarWrap: {
    marginRight: Spacing.md,
  },
  avatarImg: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1.5,
    borderColor: Colors.cyan,
  },
  avatarFallback: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.backgroundCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  avatarText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: Typography.weights.bold,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.backgroundCard,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  backArrow: {
    color: Colors.text,
    fontSize: 26,
    lineHeight: 28,
    marginTop: -2,
  },
  titleCol: {
    flex: 1,
  },
  title: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: Typography.weights.bold,
    letterSpacing: 0.3,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 2,
    fontWeight: Typography.weights.medium,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  dutyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  dutyOn: {
    backgroundColor: Colors.successSoft,
    borderColor: Colors.success,
  },
  dutyOff: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: Colors.danger,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.successSoft,
    borderColor: Colors.success,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.pill,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },
  dutyText: {
    fontSize: 12,
    fontWeight: Typography.weights.semibold,
  },
  liveText: {
    color: Colors.success,
    fontSize: 11,
    fontWeight: Typography.weights.heavy,
    textTransform: 'uppercase',
  },
  portalBadgeBtn: {
    backgroundColor: 'rgba(0, 163, 255, 0.12)',
    borderColor: 'rgba(0, 240, 255, 0.35)',
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: Radius.pill,
  },
  portalBadgeText: {
    color: Colors.cyan,
    fontSize: 11,
    fontWeight: Typography.weights.bold,
  },
  bellBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.backgroundCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    position: 'relative',
  },
  bellIcon: {
    fontSize: 16,
  },
  badgeCount: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: Colors.emergency,
    width: 17,
    height: 17,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: Typography.weights.heavy,
  },
});
