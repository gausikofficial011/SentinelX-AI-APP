import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
  Easing,
  Platform,
  StatusBar as RNStatusBar,
  useWindowDimensions,
  Image,
} from 'react-native';
import Svg, {
  Path,
  Rect,
  Circle,
  Polygon,
  Polyline,
  Line,
  G,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
} from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Shadows } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types';

export default function IndexScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, isAuthenticated, loginWithRole, logout } = useAuthStore();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  // Responsive width tracking
  const [containerWidth, setContainerWidth] = useState<number>(windowWidth);
  const isDesktop = containerWidth >= 1024;
  const isTablet = containerWidth >= 768 && containerWidth < 1024;
  const isMobile = containerWidth < 768;

  const topInset = Math.max(
    insets.top,
    Platform.OS === 'android' ? (RNStatusBar.currentHeight || 28) : 0
  );
  const bottomInset = Math.max(insets.bottom, 12);

  // Active navigation sidebar tab
  const [activeNavTab, setActiveNavTab] = useState<string>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Search input state
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected Sector
  const [selectedSector, setSelectedSector] = useState<string>('Sector 04');

  // Live Digital Clock & Date
  const [timeString, setTimeString] = useState<string>('12:00:00');
  const [dateString, setDateString] = useState<string>('Wed, 8 Oct 2026');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      setDateString(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Radar Sweeping Animation
  const radarAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const sweep = Animated.loop(
      Animated.timing(radarAnim, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    sweep.start();
    return () => sweep.stop();
  }, [radarAnim]);

  const radarSpin = radarAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Active Radar Node Selection
  const [selectedThreatZone, setSelectedThreatZone] = useState<'high' | 'elevated' | 'surveillance'>('high');
  const scrollRef = useRef<ScrollView>(null);

  const handleLaunchClearance = (role: UserRole, targetRoute: string) => {
    loginWithRole(role);
    router.push(targetRoute as any);
  };

  // Nav items for left sidebar
  const navItems = [
    { id: 'overview', label: 'Overview', icon: '⊞', route: '/' },
    { id: 'console', label: 'Command Console', icon: '🛡️', route: '/admin/dashboard' },
    { id: 'map', label: 'Live Map', icon: '🗺️', route: '/citizen/map' },
    { id: 'intel', label: 'Threat Intelligence', icon: '🎯', route: '/analyst/forecast' },
    { id: 'sensors', label: 'Sensor Networks', icon: '📡', route: '/admin/system-health' },
    { id: 'drone', label: 'UAV / Drone Control', icon: '🛸', route: '/officer/patrol' },
    { id: 'forecast', label: 'Incident Forecasting', icon: '🧠', route: '/analyst/forecast' },
    { id: 'gis', label: 'GIS & 3D Twin', icon: '🏙️', route: '/citizen/map' },
    { id: 'units', label: 'Response Units', icon: '🚓', route: '/dispatcher/dashboard' },
    { id: 'reports', label: 'Reports & Analytics', icon: '📊', route: '/analyst/reports' },
    { id: 'settings', label: 'Settings', icon: '⚙️', route: '/citizen/profile' },
  ];

  return (
    <View
      style={styles.screenRoot}
      onLayout={(e) => {
        const w = e.nativeEvent.layout.width;
        if (w > 0) setContainerWidth(w);
      }}
    >
      {/* ========================================================================= */}
      {/* 1. TOP GLOBAL NAVIGATION BAR */}
      {/* ========================================================================= */}
      <View style={[styles.topBar, { paddingTop: topInset, height: 60 + topInset }]}>
        <View style={styles.topBarInner}>
          {/* Left: Brand Logo & Mobile Menu Toggle */}
          <View style={styles.topBarLeft}>
            {!isDesktop && (
              <TouchableOpacity
                style={styles.mobileMenuBtn}
                onPress={() => setMobileMenuOpen(!mobileMenuOpen)}
                activeOpacity={0.8}
              >
                <Text style={styles.mobileMenuBtnText}>{mobileMenuOpen ? '✕' : '☰'}</Text>
              </TouchableOpacity>
            )}

            <View style={styles.brandGroup}>
              <View style={styles.hexagonShieldBox}>
                <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M12 2L3 7V12C3 17.5 7 21.5 12 22C17 21.5 21 17.5 21 12V7L12 2Z"
                    stroke="#00f2ff"
                    strokeWidth="2"
                    fill="rgba(0, 242, 255, 0.2)"
                  />
                  <Circle cx="12" cy="12" r="3" fill="#00f2ff" />
                </Svg>
              </View>
              <Text style={styles.brandTitle}>SENTINELX AI</Text>
            </View>
          </View>

          {/* Center: Search Bar with Ctrl+K shortcut (hidden on small mobile) */}
          {!isMobile && (
            <View style={styles.searchBarContainer}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search locations, threats, sensors..."
                placeholderTextColor="#849495"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <View style={styles.ctrlKBadge}>
                <Text style={styles.ctrlKText}>Ctrl + K</Text>
              </View>
            </View>
          )}

          {/* Right: Notifications, Settings, and Operator Profile */}
          <View style={styles.topBarRight}>
            <TouchableOpacity style={styles.iconActionBtn} activeOpacity={0.8}>
              <Text style={styles.iconActionGlyph}>🔔</Text>
              <View style={styles.notifBadgeDot} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconActionBtn}
              onPress={() => router.push('/citizen/profile')}
              activeOpacity={0.8}
            >
              <Text style={styles.iconActionGlyph}>⚙</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.operatorProfileBox}
              onPress={() => router.push(isAuthenticated ? '/citizen/profile' : '/auth/login')}
              activeOpacity={0.85}
            >
              <View style={styles.operatorAvatarWrap}>
                <View style={styles.operatorAvatar}>
                  <Text style={{ fontSize: 13 }}>👨‍✈️</Text>
                </View>
                <View style={styles.operatorStatusDot} />
              </View>
              {!isMobile && (
                <View style={styles.operatorInfo}>
                  <Text style={styles.operatorName}>
                    {user?.fullName || 'GAURAV S'}
                  </Text>
                  <Text style={styles.operatorRole}>
                    {user?.role?.replace('_', ' ') || 'Command Operator'}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ========================================================================= */}
      {/* 2. BODY LAYOUT: LEFT SIDEBAR + MAIN SCROLLABLE DASHBOARD */}
      {/* ========================================================================= */}
      <View style={styles.bodyLayout}>
        {/* Left Tactical Navigation Sidebar (Desktop or Opened Mobile Drawer) */}
        {(isDesktop || mobileMenuOpen) && (
          <View style={[styles.sidebarRail, !isDesktop && styles.sidebarRailMobile]}>
            <ScrollView style={styles.sidebarScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.navItemsList}>
                {navItems.map((item) => {
                  const isActive = activeNavTab === item.id;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[styles.navItemBtn, isActive && styles.navItemBtnActive]}
                      onPress={() => {
                        setActiveNavTab(item.id);
                        if (!isDesktop) setMobileMenuOpen(false);
                        if (item.route !== '/') {
                          router.push(item.route as any);
                        }
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.navItemIcon, isActive && styles.navItemIconActive]}>
                        {item.icon}
                      </Text>
                      <Text style={[styles.navItemLabel, isActive && styles.navItemLabelActive]}>
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Sidebar Bottom Telemetry Status Box */}
              <View style={styles.sidebarFooterBox}>
                <View style={styles.systemOnlinePill}>
                  <View style={styles.greenBeaconDot} />
                  <Text style={styles.systemOnlineText}>System Online</Text>
                </View>

                <Text style={styles.sidebarClockText}>{timeString}</Text>
                <Text style={styles.sidebarDateText}>{dateString}</Text>
              </View>
            </ScrollView>
          </View>
        )}

        {/* Main Dashboard Canvas */}
        <ScrollView
          ref={scrollRef}
          style={styles.mainCanvas}
          contentContainerStyle={[styles.mainCanvasContent, { paddingBottom: 60 + bottomInset }]}
          showsVerticalScrollIndicator={false}
        >
          {/* ======================================================================= */}
          {/* A. HERO BANNER: AUTONOMOUS URBAN DEFENSE GRID */}
          {/* ======================================================================= */}
          <View style={styles.heroBanner}>
            <View style={styles.heroBackgroundGlow} />

            <View style={[styles.heroRow, !isDesktop && styles.heroRowStacked]}>
              {/* Left Column: Headlines & Actions */}
              <View style={styles.heroLeftCol}>
                <View style={styles.heroSubheadTag}>
                  <Text style={styles.heroSubheadTagText}>
                    AUTONOMOUS MUNICIPAL DEFENSE GRID
                  </Text>
                </View>

                <Text style={styles.heroTitle}>
                  AUTONOMOUS URBAN{'\n'}DEFENSE & PREDICTIVE{'\n'}INTELLIGENCE
                </Text>

                <Text style={styles.heroDesc}>
                  Empowering municipal command, tactical units, and first responders with real-time neural
                  threat forecasting, drone swarm orchestration, and biometric GIS vectors.
                </Text>

                <View style={styles.heroCtaRow}>
                  <TouchableOpacity
                    style={styles.primaryHeroCta}
                    onPress={() => router.push('/auth/login')}
                    activeOpacity={0.85}
                  >
                    <Text style={{ fontSize: 16 }}>🛡️</Text>
                    <Text style={styles.primaryHeroCtaText}>ACCESS COMMAND CONSOLE</Text>
                    <Text style={styles.ctaArrow}>➔</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.secondaryHeroCta}
                    onPress={() => scrollRef.current?.scrollTo({ y: 460, animated: true })}
                    activeOpacity={0.8}
                  >
                    <Text style={{ fontSize: 15 }}>🎯</Text>
                    <Text style={styles.secondaryHeroCtaText}>INSPECT THREAT TOPOLOGY</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Right Column: 3D Holographic Globe / City Visualization & Weather Card */}
              <View style={styles.heroRightCol}>
                {/* Live City Feed Badge */}
                <View style={styles.liveFeedBadge}>
                  <View style={styles.redBeaconPulse} />
                  <Text style={styles.liveFeedBadgeText}>LIVE CITY FEED</Text>
                </View>

                {/* Holographic Cyber City Globe Visualization */}
                <View style={styles.hologramVisualBox}>
                  <Svg width="260" height="190" viewBox="0 0 260 190">
                    <Defs>
                      <RadialGradient id="hologramGlow" cx="50%" cy="50%" r="50%">
                        <Stop offset="0%" stopColor="#00f2ff" stopOpacity="0.4" />
                        <Stop offset="70%" stopColor="#00A3FF" stopOpacity="0.1" />
                        <Stop offset="100%" stopColor="#030712" stopOpacity="0" />
                      </RadialGradient>
                      <LinearGradient id="buildingGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
                        <Stop offset="0%" stopColor="#00f2ff" stopOpacity="0.8" />
                        <Stop offset="100%" stopColor="#080f10" stopOpacity="0.2" />
                      </LinearGradient>
                      <LinearGradient id="buildingGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                        <Stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
                        <Stop offset="100%" stopColor="#080f10" stopOpacity="0.2" />
                      </LinearGradient>
                    </Defs>

                    {/* Central Wireframe Globe */}
                    <Circle cx="160" cy="70" r="55" fill="url(#hologramGlow)" />
                    <Circle cx="160" cy="70" r="55" stroke="rgba(0, 242, 255, 0.35)" strokeWidth="1" strokeDasharray="3 3" />
                    <Circle cx="160" cy="70" r="38" stroke="rgba(0, 242, 255, 0.45)" strokeWidth="1" />
                    <Line x1="105" y1="70" x2="215" y2="70" stroke="rgba(0, 242, 255, 0.25)" strokeWidth="1" />
                    <Line x1="160" y1="15" x2="160" y2="125" stroke="rgba(0, 242, 255, 0.25)" strokeWidth="1" />

                    {/* 3D Isometric Buildings */}
                    <Polygon points="50,110 75,95 100,110 75,125" fill="#00dbe7" opacity="0.7" />
                    <Polygon points="50,110 75,125 75,165 50,150" fill="url(#buildingGrad1)" />
                    <Polygon points="75,125 100,110 100,150 75,165" fill="#004f54" />

                    <Polygon points="120,85 150,68 180,85 150,102" fill="#00f2ff" opacity="0.9" />
                    <Polygon points="120,85 150,102 150,175 120,158" fill="url(#buildingGrad1)" />
                    <Polygon points="150,102 180,85 180,158 150,175" fill="#00696f" />

                    <Polygon points="190,100 215,86 240,100 215,114" fill="#ddb7ff" opacity="0.8" />
                    <Polygon points="190,100 215,114 215,165 190,151" fill="url(#buildingGrad2)" />
                    <Polygon points="215,114 240,100 240,151 215,165" fill="#490080" />

                    {/* Glowing Threat Vector Dots */}
                    <Circle cx="150" cy="68" r="4" fill="#00f2ff" />
                    <Circle cx="75" cy="95" r="3" fill="#fed83a" />
                    <Circle cx="215" cy="86" r="3" fill="#a855f7" />
                  </Svg>
                </View>

                {/* Coimbatore TN Real-time Weather Widget */}
                <View style={styles.weatherWidget}>
                  <Text style={styles.weatherCity}>Coimbatore, TN</Text>
                  <View style={styles.weatherDetailRow}>
                    <Text style={styles.weatherTemp}>☁️ 28°C Light Rain</Text>
                    <View style={styles.aqiPill}>
                      <Text style={styles.aqiText}>AQI: 42 (Good)</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* ======================================================================= */}
          {/* B. 4 TACTICAL TELEMETRY HUD CARDS WITH NEON WAVE SPARKLINES */}
          {/* ======================================================================= */}
          <View style={styles.hudGridRow}>
            {/* 1. Active Sensors */}
            <View style={[styles.hudCard, styles.hudCardCyan]}>
              <View style={styles.hudCardHeader}>
                <View style={[styles.hudIconBox, { backgroundColor: 'rgba(0, 242, 255, 0.15)' }]}>
                  <Text style={styles.hudIconGlyph}>📡</Text>
                </View>
                <Text style={styles.hudLabel}>ACTIVE SENSORS</Text>
              </View>
              <Text style={styles.hudValWhite}>148,920</Text>
              <View style={styles.hudDeltaRow}>
                <Text style={styles.hudDeltaGreen}>↑ +12.4%</Text>
                <Text style={styles.hudDeltaSub}>vs last day</Text>
              </View>
              {/* Cyan Sparkline Wave */}
              <View style={styles.sparklineWrap}>
                <Svg width="100%" height="32" viewBox="0 0 160 32">
                  <Path
                    d="M 0 24 Q 40 8, 80 20 T 160 10"
                    fill="none"
                    stroke="#00f2ff"
                    strokeWidth="2.5"
                  />
                  <Path
                    d="M 0 24 Q 40 8, 80 20 T 160 10 L 160 32 L 0 32 Z"
                    fill="rgba(0, 242, 255, 0.12)"
                  />
                </Svg>
              </View>
            </View>

            {/* 2. Intercept Rate */}
            <View style={[styles.hudCard, styles.hudCardPurple]}>
              <View style={styles.hudCardHeader}>
                <View style={[styles.hudIconBox, { backgroundColor: 'rgba(221, 183, 255, 0.15)' }]}>
                  <Text style={styles.hudIconGlyph}>🎯</Text>
                </View>
                <Text style={styles.hudLabel}>INTERCEPT RATE</Text>
              </View>
              <Text style={styles.hudValPurple}>99.82%</Text>
              <View style={styles.hudDeltaRow}>
                <Text style={styles.hudDeltaGreen}>↑ +2.1%</Text>
                <Text style={styles.hudDeltaSub}>Edge neural prediction</Text>
              </View>
              {/* Purple Sparkline Wave */}
              <View style={styles.sparklineWrap}>
                <Svg width="100%" height="32" viewBox="0 0 160 32">
                  <Path
                    d="M 0 18 Q 40 28, 80 12 T 160 14"
                    fill="none"
                    stroke="#ddb7ff"
                    strokeWidth="2.5"
                  />
                  <Path
                    d="M 0 18 Q 40 28, 80 12 T 160 14 L 160 32 L 0 32 Z"
                    fill="rgba(221, 183, 255, 0.12)"
                  />
                </Svg>
              </View>
            </View>

            {/* 3. Response Time */}
            <View style={[styles.hudCard, styles.hudCardAmber]}>
              <View style={styles.hudCardHeader}>
                <View style={[styles.hudIconBox, { backgroundColor: 'rgba(254, 216, 58, 0.15)' }]}>
                  <Text style={styles.hudIconGlyph}>⚡</Text>
                </View>
                <Text style={styles.hudLabel}>RESPONSE TIME</Text>
              </View>
              <Text style={styles.hudValWhite}>0.84s</Text>
              <View style={styles.hudDeltaRow}>
                <Text style={styles.hudDeltaAmber}>↓ -18.6%</Text>
                <Text style={styles.hudDeltaSub}>Sub-second vectoring</Text>
              </View>
              {/* Amber Sparkline Wave */}
              <View style={styles.sparklineWrap}>
                <Svg width="100%" height="32" viewBox="0 0 160 32">
                  <Path
                    d="M 0 10 Q 40 24, 80 14 T 160 22"
                    fill="none"
                    stroke="#fed83a"
                    strokeWidth="2.5"
                  />
                  <Path
                    d="M 0 10 Q 40 24, 80 14 T 160 22 L 160 32 L 0 32 Z"
                    fill="rgba(254, 216, 58, 0.12)"
                  />
                </Svg>
              </View>
            </View>

            {/* 4. Incident Delta */}
            <View style={[styles.hudCard, styles.hudCardCyan]}>
              <View style={styles.hudCardHeader}>
                <View style={[styles.hudIconBox, { backgroundColor: 'rgba(0, 242, 255, 0.15)' }]}>
                  <Text style={styles.hudIconGlyph}>🛡️</Text>
                </View>
                <Text style={styles.hudLabel}>INCIDENT DELTA</Text>
              </View>
              <Text style={styles.hudValWhite}>-91.4%</Text>
              <View style={styles.hudDeltaRow}>
                <Text style={styles.hudDeltaGreen}>↓ -7.3%</Text>
                <Text style={styles.hudDeltaSub}>Predictive model drop</Text>
              </View>
              {/* Cyan Sparkline Wave */}
              <View style={styles.sparklineWrap}>
                <Svg width="100%" height="32" viewBox="0 0 160 32">
                  <Path
                    d="M 0 26 Q 40 10, 80 22 T 160 16"
                    fill="none"
                    stroke="#00f2ff"
                    strokeWidth="2.5"
                  />
                  <Path
                    d="M 0 26 Q 40 10, 80 22 T 160 16 L 160 32 L 0 32 Z"
                    fill="rgba(0, 242, 255, 0.12)"
                  />
                </Svg>
              </View>
            </View>
          </View>

          {/* ======================================================================= */}
          {/* C. TACTICAL THREAT MAPPING // SECTOR 04 (GIS MAP + VECTOR ANALYSIS) */}
          {/* ======================================================================= */}
          <View style={styles.threatMappingSection}>
            {/* Section Header */}
            <View style={styles.threatMapHeader}>
              <View style={styles.threatMapTitleGroup}>
                <Text style={styles.threatMapCrosshairIcon}>⛶</Text>
                <View>
                  <Text style={styles.threatMapTitle}>TACTICAL THREAT MAPPING</Text>
                  <Text style={styles.threatMapSubtitle}>
                    SECTOR 04 <Text style={{ color: '#00f2ff' }}>// LIVE FEED: 120 FPS</Text>
                  </Text>
                </View>
              </View>

              <View style={styles.threatMapControls}>
                <View style={styles.sectorDropdown}>
                  <Text style={styles.sectorDropdownText}>{selectedSector} ▾</Text>
                </View>
                <View style={styles.realtimePill}>
                  <View style={styles.greenBeaconDot} />
                  <Text style={styles.realtimePillText}>Real-Time</Text>
                </View>
                <TouchableOpacity style={styles.expandMapBtn}>
                  <Text style={styles.expandMapText}>⛶</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Split Content: Satellite GIS Canvas + Threat Vector Analysis */}
            <View style={[styles.threatMapBody, !isDesktop && styles.threatMapBodyStacked]}>
              {/* Left Column: Interactive GIS Map */}
              <View style={styles.gisMapContainer}>
                {/* SVG Tactical Vector Map with Polygons & Grid */}
                <Svg width="100%" height="340" viewBox="0 0 540 340">
                  <Defs>
                    <LinearGradient id="mapGridGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <Stop offset="0%" stopColor="#080f10" stopOpacity="1" />
                      <Stop offset="100%" stopColor="#030712" stopOpacity="1" />
                    </LinearGradient>
                  </Defs>
                  {/* Dark Map Base */}
                  <Rect width="540" height="340" fill="url(#mapGridGrad)" />

                  {/* Satellite Street Grid Matrix */}
                  <Line x1="40" y1="0" x2="40" y2="340" stroke="rgba(0, 242, 255, 0.08)" strokeWidth="1" />
                  <Line x1="120" y1="0" x2="120" y2="340" stroke="rgba(0, 242, 255, 0.08)" strokeWidth="1" />
                  <Line x1="220" y1="0" x2="220" y2="340" stroke="rgba(0, 242, 255, 0.12)" strokeWidth="1.5" />
                  <Line x1="340" y1="0" x2="340" y2="340" stroke="rgba(0, 242, 255, 0.08)" strokeWidth="1" />
                  <Line x1="440" y1="0" x2="440" y2="340" stroke="rgba(0, 242, 255, 0.08)" strokeWidth="1" />

                  <Line x1="0" y1="60" x2="540" y2="60" stroke="rgba(0, 242, 255, 0.08)" strokeWidth="1" />
                  <Line x1="0" y1="140" x2="540" y2="140" stroke="rgba(0, 242, 255, 0.12)" strokeWidth="1.5" />
                  <Line x1="0" y1="220" x2="540" y2="220" stroke="rgba(0, 242, 255, 0.08)" strokeWidth="1" />
                  <Line x1="0" y1="290" x2="540" y2="290" stroke="rgba(0, 242, 255, 0.08)" strokeWidth="1" />

                  {/* Diagonal Avenues */}
                  <Line x1="30" y1="340" x2="380" y2="0" stroke="rgba(0, 242, 255, 0.15)" strokeWidth="2" strokeDasharray="6 4" />
                  <Line x1="140" y1="340" x2="520" y2="40" stroke="rgba(0, 242, 255, 0.1)" strokeWidth="1.5" />

                  {/* RED HIGH THREAT POLYGON */}
                  <Polygon
                    points="180,90 320,80 360,150 280,180 170,140"
                    fill="rgba(239, 68, 68, 0.28)"
                    stroke="#ef4444"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />
                  <Circle cx="260" cy="130" r="14" fill="rgba(239, 68, 68, 0.2)" />
                  <Circle cx="260" cy="130" r="6" fill="#ef4444" />
                  <Rect x="300" y="85" width="85" height="18" rx="4" fill="#93000a" />

                  {/* AMBER ELEVATED RISK POLYGON */}
                  <Polygon
                    points="80,180 180,180 170,250 80,240"
                    fill="rgba(254, 216, 58, 0.2)"
                    stroke="#fed83a"
                    strokeWidth="1.5"
                  />
                  <Circle cx="125" cy="210" r="5" fill="#fed83a" />

                  {/* CYAN SURVEILLANCE SENSORS */}
                  <Circle cx="440" cy="180" r="7" fill="rgba(0, 242, 255, 0.25)" stroke="#00f2ff" strokeWidth="1.5" />
                  <Circle cx="440" cy="180" r="3" fill="#00f2ff" />
                  <Circle cx="70" cy="100" r="6" fill="rgba(0, 242, 255, 0.2)" stroke="#00f2ff" strokeWidth="1" />

                  {/* GREEN SAFE ZONE */}
                  <Circle cx="370" cy="270" r="7" fill="rgba(16, 185, 129, 0.25)" stroke="#10b981" strokeWidth="1.5" />
                  <Circle cx="370" cy="270" r="3" fill="#10b981" />
                </Svg>

                {/* Floating Map Layers Toolbar (Left Edge) */}
                <View style={styles.floatingMapToolbar}>
                  <TouchableOpacity style={styles.mapToolBtn}><Text style={styles.mapToolText}>⊞</Text></TouchableOpacity>
                  <TouchableOpacity style={styles.mapToolBtn}><Text style={styles.mapToolText}>🎯</Text></TouchableOpacity>
                  <TouchableOpacity style={styles.mapToolBtn}><Text style={styles.mapToolText}>🛡️</Text></TouchableOpacity>
                  <TouchableOpacity style={styles.mapToolBtn}><Text style={styles.mapToolText}>🛸</Text></TouchableOpacity>
                  <TouchableOpacity style={styles.mapToolBtn}><Text style={styles.mapToolText}>⟳</Text></TouchableOpacity>
                  <TouchableOpacity style={styles.mapToolBtn}><Text style={styles.mapToolText}>⚙</Text></TouchableOpacity>
                </View>

                {/* Map Bottom Legend */}
                <View style={styles.mapLegendRow}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#10b981' }]} />
                    <Text style={styles.legendText}>Safe Zone</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#00f2ff' }]} />
                    <Text style={styles.legendText}>Surveillance</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#fed83a' }]} />
                    <Text style={styles.legendText}>Elevated Risk</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#ef4444' }]} />
                    <Text style={styles.legendText}>High Threat</Text>
                  </View>
                </View>
              </View>

              {/* Right Column: Threat Vector Analysis Readout */}
              <View style={styles.threatAnalysisCard}>
                <Text style={styles.analysisHeaderLabel}>THREAT VECTOR ANALYSIS</Text>

                {/* Surveillance Aerial Thumbnail */}
                <View style={styles.analysisThumbnailBox}>
                  <Svg width="100%" height="80" viewBox="0 0 240 80">
                    <Rect width="240" height="80" fill="#080f10" />
                    <Line x1="20" y1="10" x2="100" y2="70" stroke="rgba(254, 216, 58, 0.4)" strokeWidth="2" />
                    <Line x1="100" y1="70" x2="220" y2="20" stroke="rgba(254, 216, 58, 0.4)" strokeWidth="2" />
                    <Circle cx="100" cy="70" r="10" fill="rgba(239, 68, 68, 0.4)" stroke="#ef4444" strokeWidth="2" />
                    <Rect x="40" y="25" width="45" height="30" fill="rgba(0, 242, 255, 0.15)" stroke="#00f2ff" strokeWidth="1" />
                    <Rect x="140" y="35" width="55" height="25" fill="rgba(0, 242, 255, 0.15)" stroke="#00f2ff" strokeWidth="1" />
                  </Svg>
                </View>

                {/* Incident Title & High Risk Badge */}
                <View style={styles.threatTitleRow}>
                  <Text style={styles.threatHeadline}>Unusual Crowd Convergence</Text>
                  <View style={styles.highRiskPill}>
                    <Text style={styles.highRiskPillText}>HIGH RISK</Text>
                  </View>
                </View>

                <Text style={styles.threatDescription}>
                  Downtown Core Sector 04-B. High probability of flash gathering at subterranean pedestrian junction.
                </Text>

                {/* Telemetry Metric Rows */}
                <View style={styles.telemetryTable}>
                  <View style={styles.tableRow}>
                    <Text style={styles.tableKey}>Coordinates</Text>
                    <Text style={styles.tableVal}>11.0176° N, 76.9558° E</Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={styles.tableKey}>Probability</Text>
                    <Text style={[styles.tableVal, { color: '#fed83a' }]}>87.4%</Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={styles.tableKey}>ETA to Perimeter</Text>
                    <Text style={[styles.tableVal, { color: '#00f2ff' }]}>8m 24s</Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={styles.tableKey}>Recommended Action</Text>
                    <Text style={[styles.tableVal, { color: '#ddb7ff' }]}>
                      Deploy Drone Unit + Alert Rapid Response
                    </Text>
                  </View>
                </View>

                {/* Override Button */}
                <TouchableOpacity
                  style={styles.overrideVectoringBtn}
                  onPress={() => router.push('/dispatcher/dashboard')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.overrideVectoringText}>OVERRIDE AUTOMATED VECTORING</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* ======================================================================= */}
          {/* D. TWO-COLUMN ROW: LIVE INCIDENT TIMELINE & DRONE SWARM STATUS */}
          {/* ======================================================================= */}
          <View style={[styles.twoColRow, !isDesktop && styles.twoColRowStacked]}>
            {/* Left: Live Incident Timeline */}
            <View style={styles.incidentTimelineCard}>
              <View style={styles.timelineHeaderRow}>
                <View style={styles.timelineTitleGroup}>
                  <Text style={{ fontSize: 16 }}>⛶</Text>
                  <Text style={styles.timelineTitle}>LIVE INCIDENT TIMELINE</Text>
                </View>
                <View style={styles.dropdownMini}>
                  <Text style={styles.dropdownMiniText}>All Incidents ▾</Text>
                </View>
              </View>

              <View style={styles.timelineList}>
                {/* Item 1 */}
                <View style={styles.timelineItem}>
                  <Text style={styles.timelineTime}>11:58</Text>
                  <View style={[styles.timelineNodeDot, { backgroundColor: '#ef4444' }]} />
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineItemTitle}>Crowd Density Spike Detected</Text>
                    <Text style={styles.timelineItemSub}>Sector 04-B ● <Text style={{ color: '#ef4444' }}>87% Probability</Text></Text>
                  </View>
                  <View style={[styles.severityBadge, { backgroundColor: '#93000a' }]}>
                    <Text style={styles.severityText}>High</Text>
                  </View>
                </View>

                {/* Item 2 */}
                <View style={styles.timelineItem}>
                  <Text style={styles.timelineTime}>11:52</Text>
                  <View style={[styles.timelineNodeDot, { backgroundColor: '#00f2ff' }]} />
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineItemTitle}>Drone Unit Deployed</Text>
                    <Text style={styles.timelineItemSub}>Unit DR-7 ● Aerial Surveillance</Text>
                  </View>
                  <View style={[styles.severityBadge, { backgroundColor: '#00363a' }]}>
                    <Text style={styles.severityText}>Info</Text>
                  </View>
                </View>

                {/* Item 3 */}
                <View style={styles.timelineItem}>
                  <Text style={styles.timelineTime}>11:47</Text>
                  <View style={[styles.timelineNodeDot, { backgroundColor: '#fed83a' }]} />
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineItemTitle}>Traffic Anomaly Detected</Text>
                    <Text style={styles.timelineItemSub}>Sector 04-A ● AI Analysis</Text>
                  </View>
                  <View style={[styles.severityBadge, { backgroundColor: '#725e00' }]}>
                    <Text style={styles.severityText}>Medium</Text>
                  </View>
                </View>

                {/* Item 4 */}
                <View style={styles.timelineItem}>
                  <Text style={styles.timelineTime}>11:40</Text>
                  <View style={[styles.timelineNodeDot, { backgroundColor: '#10b981' }]} />
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineItemTitle}>Situation Stabilized</Text>
                    <Text style={styles.timelineItemSub}>Sector 03 ● No Further Action</Text>
                  </View>
                  <View style={[styles.severityBadge, { backgroundColor: '#004d40' }]}>
                    <Text style={styles.severityText}>Resolved</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Right: Drone Swarm Status */}
            <View style={styles.droneSwarmCard}>
              <View style={styles.timelineHeaderRow}>
                <View style={styles.timelineTitleGroup}>
                  <Text style={{ fontSize: 16 }}>🛡️</Text>
                  <Text style={styles.timelineTitle}>DRONE SWARM STATUS</Text>
                </View>
                <TouchableOpacity
                  style={styles.viewAllBtn}
                  onPress={() => handleLaunchClearance('OFFICER', '/officer/patrol')}
                >
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              </View>

              {/* Donut Chart + Legend + Drone Graphic */}
              <View style={styles.droneDonutRow}>
                {/* SVG Donut Chart */}
                <View style={styles.donutChartBox}>
                  <Svg width="110" height="110" viewBox="0 0 110 110">
                    <Circle cx="55" cy="55" r="42" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="12" fill="none" />
                    {/* Active: Cyan Segment */}
                    <Circle
                      cx="55"
                      cy="55"
                      r="42"
                      stroke="#00f2ff"
                      strokeWidth="12"
                      strokeDasharray="264"
                      strokeDashoffset="66"
                      strokeLinecap="round"
                      fill="none"
                      transform="rotate(-90 55 55)"
                    />
                    {/* Standby: Amber Segment */}
                    <Circle
                      cx="55"
                      cy="55"
                      r="42"
                      stroke="#fed83a"
                      strokeWidth="12"
                      strokeDasharray="264"
                      strokeDashoffset="230"
                      strokeLinecap="round"
                      fill="none"
                      transform="rotate(60 55 55)"
                    />
                  </Svg>
                  <View style={styles.donutCenterLabel}>
                    <Text style={styles.donutCenterNum}>12 / 16</Text>
                    <Text style={styles.donutCenterSub}>Drones Active</Text>
                  </View>
                </View>

                {/* Drone Status Legend */}
                <View style={styles.droneLegendList}>
                  <View style={styles.droneLegendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#00f2ff' }]} />
                    <Text style={styles.droneLegendLabel}>12 Active</Text>
                  </View>
                  <View style={styles.droneLegendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#fed83a' }]} />
                    <Text style={styles.droneLegendLabel}>2 Standby</Text>
                  </View>
                  <View style={styles.droneLegendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#94a3b8' }]} />
                    <Text style={styles.droneLegendLabel}>1 Maintenance</Text>
                  </View>
                  <View style={styles.droneLegendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#ef4444' }]} />
                    <Text style={styles.droneLegendLabel}>1 Offline</Text>
                  </View>
                </View>

                {/* Holographic Drone Wireframe Graphic */}
                <View style={styles.droneGraphicBox}>
                  <Text style={{ fontSize: 38 }}>🛸</Text>
                </View>
              </View>

              {/* Patrol Route Polyline Wave */}
              <View style={styles.patrolRouteBox}>
                <Text style={styles.patrolRouteLabel}>PATROL ROUTE</Text>
                <Svg width="100%" height="45" viewBox="0 0 280 45">
                  <Path
                    d="M 10 32 Q 50 10, 100 28 T 190 20 T 270 30"
                    fill="none"
                    stroke="#00f2ff"
                    strokeWidth="2"
                    strokeDasharray="4 3"
                  />
                  <Circle cx="20" cy="30" r="4" fill="#00f2ff" />
                  <Circle cx="100" cy="28" r="4" fill="#00f2ff" />
                  <Circle cx="190" cy="20" r="4" fill="#fed83a" />
                  <Circle cx="260" cy="28" r="4" fill="#00f2ff" />
                </Svg>
              </View>
            </View>
          </View>

          {/* ======================================================================= */}
          {/* E. DEFENSE CORE MODULES (Next-Generation Defense Intelligence Suite) */}
          {/* ======================================================================= */}
          <View style={styles.defenseModulesSection}>
            <View style={styles.modulesSectionHeader}>
              <View style={styles.modulesHeaderLeft}>
                <View style={styles.moduleTagRow}>
                  <Text style={styles.moduleTagIcon}>⚙</Text>
                  <Text style={styles.moduleTagText}>DEFENSE CORE MODULES</Text>
                </View>
                <Text style={styles.modulesHeaderTitle}>
                  Next-Generation Defense Intelligence Suite
                </Text>
              </View>

              <TouchableOpacity style={styles.viewAllModulesBtn}>
                <Text style={styles.viewAllModulesText}>View All Modules ➔</Text>
              </TouchableOpacity>
            </View>

            {/* 4 Cards Grid */}
            <View style={styles.modulesCardsGrid}>
              {/* Module 1: Neural Incident Forecasting */}
              <View style={[styles.defenseModuleCard, styles.cardBorderCyan]}>
                <View style={[styles.moduleVisualHeader, { backgroundColor: '#081f26' }]}>
                  <Text style={{ fontSize: 32 }}>🧠</Text>
                </View>
                <Text style={styles.moduleCardTitle}>Neural Incident Forecasting</Text>
                <Text style={styles.moduleCardDesc}>
                  4D spatio-temporal deep learning analyzes sensor telemetry, environmental variables, and historical city patterns.
                </Text>
                <TouchableOpacity
                  style={styles.moduleCardLinkRow}
                  onPress={() => handleLaunchClearance('INTELLIGENCE_ANALYST', '/analyst/forecast')}
                >
                  <Text style={styles.moduleCardLinkCyan}>Explore Templates ➔</Text>
                </TouchableOpacity>
              </View>

              {/* Module 2: Volumetric GIS & 3D City Twin */}
              <View style={[styles.defenseModuleCard, styles.cardBorderPurple]}>
                <View style={[styles.moduleVisualHeader, { backgroundColor: '#210c3b' }]}>
                  <Text style={{ fontSize: 32 }}>🏙️</Text>
                </View>
                <Text style={styles.moduleCardTitle}>Volumetric GIS & 3D City Twin</Text>
                <Text style={styles.moduleCardDesc}>
                  Millimeter-level multi-spectral city twin mapping rendered in real-time with interior architectural layers.
                </Text>
                <TouchableOpacity
                  style={styles.moduleCardLinkRow}
                  onPress={() => handleLaunchClearance('CITIZEN', '/citizen/map')}
                >
                  <Text style={styles.moduleCardLinkPurple}>Launch Digital Twin ➔</Text>
                </TouchableOpacity>
              </View>

              {/* Module 3: Autonomous Swarm Intercept */}
              <View style={[styles.defenseModuleCard, styles.cardBorderAmber]}>
                <View style={[styles.moduleVisualHeader, { backgroundColor: '#2b2308' }]}>
                  <Text style={{ fontSize: 32 }}>🛸</Text>
                </View>
                <Text style={styles.moduleCardTitle}>Autonomous Swarm Intercept</Text>
                <Text style={styles.moduleCardDesc}>
                  AI drone swarms for rapid response, synchronized triggers, and perimeter control.
                </Text>
                <TouchableOpacity
                  style={styles.moduleCardLinkRow}
                  onPress={() => handleLaunchClearance('OFFICER', '/officer/patrol')}
                >
                  <Text style={styles.moduleCardLinkAmber}>Review Protocol ➔</Text>
                </TouchableOpacity>
              </View>

              {/* Module 4: Post-Quantum Federation */}
              <View style={[styles.defenseModuleCard, styles.cardBorderTeal]}>
                <View style={[styles.moduleVisualHeader, { backgroundColor: '#09252c' }]}>
                  <Text style={{ fontSize: 32 }}>🌐</Text>
                </View>
                <Text style={styles.moduleCardTitle}>Post-Quantum Federation</Text>
                <Text style={styles.moduleCardDesc}>
                  Zero-knowledge channels, lattice cryptography, and emergency management integration.
                </Text>
                <TouchableOpacity
                  style={styles.moduleCardLinkRow}
                  onPress={() => handleLaunchClearance('ADMIN', '/admin/system-health')}
                >
                  <Text style={styles.moduleCardLinkTeal}>Verify Lattice Standard ➔</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* ======================================================================= */}
          {/* F. SELECT CLEARANCE GATEWAY (PORTAL ROUTING) */}
          {/* ======================================================================= */}
          <View style={styles.clearanceCardContainer}>
            <View style={styles.clearanceCardHeader}>
              <Text style={{ fontSize: 28 }}>👆</Text>
              <Text style={styles.clearanceCardHeading}>SELECT CLEARANCE GATEWAY</Text>
              <Text style={styles.clearanceCardSub}>
                Provide agency hardware biometric token or cryptographic passkey to initialize an authorized session vector.
              </Text>
            </View>

            {/* 4 Clearance Cards Row */}
            <View style={styles.clearanceGatewaysGrid}>
              {/* ROOT Tier 0 */}
              <TouchableOpacity
                style={[styles.gatewayCard, styles.gatewayBorderCyan]}
                onPress={() => handleLaunchClearance('SUPER_ADMIN', '/admin/dashboard')}
                activeOpacity={0.8}
              >
                <View style={styles.gatewayCardLeft}>
                  <View style={[styles.gatewayIconBox, { backgroundColor: 'rgba(0, 242, 255, 0.15)' }]}>
                    <Text style={{ fontSize: 20 }}>🛡️</Text>
                  </View>
                  <View>
                    <Text style={styles.gatewayTierTitle}>ROOT // TIER-0</Text>
                    <Text style={styles.gatewayTierSub}>Supreme Municipal Command</Text>
                  </View>
                </View>
                <Text style={styles.gatewayArrowGlyph}>➔</Text>
              </TouchableOpacity>

              {/* ENFORCE Tier 1 */}
              <TouchableOpacity
                style={[styles.gatewayCard, styles.gatewayBorderPurple]}
                onPress={() => handleLaunchClearance('OFFICER', '/officer/dashboard')}
                activeOpacity={0.8}
              >
                <View style={styles.gatewayCardLeft}>
                  <View style={[styles.gatewayIconBox, { backgroundColor: 'rgba(221, 183, 255, 0.15)' }]}>
                    <Text style={{ fontSize: 20 }}>👮</Text>
                  </View>
                  <View>
                    <Text style={styles.gatewayTierTitle}>ENFORCE // TIER-1</Text>
                    <Text style={styles.gatewayTierSub}>Tactical Police Operations</Text>
                  </View>
                </View>
                <Text style={styles.gatewayArrowGlyph}>➔</Text>
              </TouchableOpacity>

              {/* DISPATCH Tier 2 */}
              <TouchableOpacity
                style={[styles.gatewayCard, styles.gatewayBorderAmber]}
                onPress={() => handleLaunchClearance('DISPATCHER', '/dispatcher/dashboard')}
                activeOpacity={0.8}
              >
                <View style={styles.gatewayCardLeft}>
                  <View style={[styles.gatewayIconBox, { backgroundColor: 'rgba(254, 216, 58, 0.15)' }]}>
                    <Text style={{ fontSize: 20 }}>⭐</Text>
                  </View>
                  <View>
                    <Text style={styles.gatewayTierTitle}>DISPATCH // TIER-2</Text>
                    <Text style={styles.gatewayTierSub}>EMT, Fire & Rescue Grid</Text>
                  </View>
                </View>
                <Text style={styles.gatewayArrowGlyph}>➔</Text>
              </TouchableOpacity>

              {/* CIVIC Secure */}
              <TouchableOpacity
                style={[styles.gatewayCard, styles.gatewayBorderTeal]}
                onPress={() => handleLaunchClearance('CITIZEN', '/citizen/home')}
                activeOpacity={0.8}
              >
                <View style={styles.gatewayCardLeft}>
                  <View style={[styles.gatewayIconBox, { backgroundColor: 'rgba(0, 219, 231, 0.15)' }]}>
                    <Text style={{ fontSize: 20 }}>❄️</Text>
                  </View>
                  <View>
                    <Text style={styles.gatewayTierTitle}>CIVIC // SECURE</Text>
                    <Text style={styles.gatewayTierSub}>Survival Citizen Safe Portal</Text>
                  </View>
                </View>
                <Text style={styles.gatewayArrowGlyph}>➔</Text>
              </TouchableOpacity>
            </View>

            {/* Big Initialize Authentication Button */}
            <TouchableOpacity
              style={styles.initAuthSequenceBtn}
              onPress={() => router.push('/auth/login')}
              activeOpacity={0.85}
            >
              <Text style={{ fontSize: 16 }}>🔑</Text>
              <Text style={styles.initAuthSequenceText}>INITIALIZE AUTHENTICATION SEQUENCE</Text>
              <Text style={{ fontSize: 15, fontWeight: '900', color: '#00363a' }}>➔</Text>
            </TouchableOpacity>
          </View>

          {/* ======================================================================= */}
          {/* G. COMPLIANCE & CERTIFICATION BADGES */}
          {/* ======================================================================= */}
          <View style={styles.complianceSealsRow}>
            <View style={styles.sealBox}>
              <View style={[styles.sealHexIcon, { borderColor: '#00f2ff' }]}>
                <Text style={{ fontSize: 16 }}>🛡️</Text>
              </View>
              <View>
                <Text style={styles.sealTitleText}>CJIS COMPLIANT</Text>
                <Text style={styles.sealSubText}>ISO 27001, SOC 1/2/3</Text>
              </View>
            </View>

            <View style={styles.sealBox}>
              <View style={[styles.sealHexIcon, { borderColor: '#38bdf8' }]}>
                <Text style={{ fontSize: 16 }}>🔒</Text>
              </View>
              <View>
                <Text style={styles.sealTitleText}>FIPS 140-3 CERTIFIED</Text>
                <Text style={styles.sealSubText}>Federal Security Standard</Text>
              </View>
            </View>

            <View style={styles.sealBox}>
              <View style={[styles.sealHexIcon, { borderColor: '#ddb7ff' }]}>
                <Text style={{ fontSize: 16 }}>🛡️</Text>
              </View>
              <View>
                <Text style={styles.sealTitleText}>ZERO-TRUST FEDERATION</Text>
                <Text style={styles.sealSubText}>Multi-Agency Secure Network</Text>
              </View>
            </View>

            <View style={styles.sealBox}>
              <View style={[styles.sealHexIcon, { borderColor: '#00dbe7' }]}>
                <Text style={{ fontSize: 16 }}>🌐</Text>
              </View>
              <View>
                <Text style={styles.sealTitleText}>POST-QUANTUM LATTICE</Text>
                <Text style={styles.sealSubText}>CRYSTALS-KYBER, NIST</Text>
              </View>
            </View>
          </View>

          {/* ======================================================================= */}
          {/* H. FOOTER */}
          {/* ======================================================================= */}
          <View style={styles.footerBar}>
            <View style={styles.footerLeft}>
              <Text style={{ fontSize: 18 }}>🛡️</Text>
              <Text style={styles.footerBrand}>SENTINELX AI COMMAND CENTER</Text>
            </View>

            <View style={styles.footerCenterLinks}>
              <Text style={styles.footerLink}>Multi-Layer Security</Text>
              <Text style={styles.footerPipe}>|</Text>
              <Text style={styles.footerLink}>Real-Time Sync</Text>
              <Text style={styles.footerPipe}>|</Text>
              <Text style={styles.footerLink}>AI Hub</Text>
              <Text style={styles.footerPipe}>|</Text>
              <Text style={styles.footerLink}>Documentation</Text>
            </View>

            <View style={styles.footerRight}>
              <View style={styles.greenBeaconDot} />
              <Text style={styles.footerSecText}>SECURE_EST_2024</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    backgroundColor: '#030712',
  },

  // ---------------------------------------------------------------------------
  // 1. Top Bar
  // ---------------------------------------------------------------------------
  topBar: {
    backgroundColor: 'rgba(7, 13, 27, 0.98)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 242, 255, 0.2)',
    zIndex: 100,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  topBarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mobileMenuBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#0d1527',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 255, 0.3)',
  },
  mobileMenuBtnText: {
    color: '#00f2ff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  hexagonShieldBox: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    color: '#00f2ff',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  searchBarContainer: {
    flex: 1,
    maxWidth: 420,
    marginHorizontal: 16,
    height: 38,
    backgroundColor: '#080f1e',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 255, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
  },
  searchIcon: {
    fontSize: 14,
  },
  searchInput: {
    flex: 1,
    color: '#dce4e4',
    fontSize: 12,
  },
  ctrlKBadge: {
    backgroundColor: '#151d2e',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  ctrlKText: {
    color: '#849495',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 10,
    fontWeight: '600',
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconActionBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#0d1527',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconActionGlyph: {
    fontSize: 15,
  },
  notifBadgeDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ef4444',
  },
  operatorProfileBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: '#0d1527',
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 255, 0.25)',
  },
  operatorAvatarWrap: {
    position: 'relative',
  },
  operatorAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1a2744',
    alignItems: 'center',
    justifyContent: 'center',
  },
  operatorStatusDot: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#10b981',
    borderWidth: 1,
    borderColor: '#030712',
  },
  operatorInfo: {
    paddingRight: 4,
  },
  operatorName: {
    color: '#f8fafc',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  operatorRole: {
    color: '#00f2ff',
    fontSize: 9,
    fontWeight: '600',
  },

  // ---------------------------------------------------------------------------
  // 2. Body Layout & Sidebar
  // ---------------------------------------------------------------------------
  bodyLayout: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebarRail: {
    width: 220,
    backgroundColor: '#060a16',
    borderRightWidth: 1,
    borderRightColor: 'rgba(0, 242, 255, 0.15)',
  },
  sidebarRailMobile: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    zIndex: 999,
    width: 240,
    backgroundColor: '#060a16',
    borderRightWidth: 1,
    borderRightColor: 'rgba(0, 242, 255, 0.3)',
    ...Shadows.glowBlue,
  },
  sidebarScroll: {
    flex: 1,
  },
  navItemsList: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    gap: 4,
  },
  navItemBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  navItemBtnActive: {
    backgroundColor: 'rgba(0, 242, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 255, 0.4)',
  },
  navItemIcon: {
    fontSize: 15,
    color: '#849495',
  },
  navItemIconActive: {
    color: '#00f2ff',
  },
  navItemLabel: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  navItemLabelActive: {
    color: '#00f2ff',
    fontWeight: '800',
  },
  sidebarFooterBox: {
    padding: 16,
    margin: 8,
    borderRadius: 10,
    backgroundColor: '#0a1020',
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 255, 0.15)',
    gap: 6,
  },
  systemOnlinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  greenBeaconDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#10b981',
  },
  systemOnlineText: {
    color: '#10b981',
    fontSize: 11,
    fontWeight: '800',
  },
  sidebarClockText: {
    color: '#f8fafc',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  sidebarDateText: {
    color: '#849495',
    fontSize: 10,
    fontWeight: '600',
  },

  // ---------------------------------------------------------------------------
  // Main Dashboard Scrollable Canvas
  // ---------------------------------------------------------------------------
  mainCanvas: {
    flex: 1,
    backgroundColor: '#030712',
  },
  mainCanvasContent: {
    padding: 16,
    gap: 18,
  },

  // ---------------------------------------------------------------------------
  // A. Hero Banner
  // ---------------------------------------------------------------------------
  heroBanner: {
    backgroundColor: '#070f1e',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 255, 0.25)',
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  heroBackgroundGlow: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 400,
    height: 300,
    backgroundColor: 'rgba(0, 163, 255, 0.08)',
    borderRadius: 200,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20,
  },
  heroRowStacked: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  heroLeftCol: {
    flex: 1,
    gap: 8,
  },
  heroSubheadTag: {
    marginBottom: 2,
  },
  heroSubheadTagText: {
    color: '#00f2ff',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  heroTitle: {
    color: '#f8fafc',
    fontSize: 26,
    fontWeight: '900',
    lineHeight: 32,
    letterSpacing: -0.5,
  },
  heroDesc: {
    color: '#b9cacb',
    fontSize: 13,
    lineHeight: 20,
    maxWidth: 540,
    marginTop: 4,
    marginBottom: 8,
  },
  heroCtaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 6,
  },
  primaryHeroCta: {
    backgroundColor: '#00f2ff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    ...Shadows.glowBlue,
  },
  primaryHeroCtaText: {
    color: '#00363a',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  ctaArrow: {
    color: '#00363a',
    fontSize: 14,
    fontWeight: '900',
  },
  secondaryHeroCta: {
    backgroundColor: '#101a2e',
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 255, 0.35)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  secondaryHeroCtaText: {
    color: '#e1fdff',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 11,
    fontWeight: '700',
  },
  heroRightCol: {
    width: 280,
    alignItems: 'center',
    position: 'relative',
  },
  liveFeedBadge: {
    position: 'absolute',
    top: -6,
    right: 0,
    backgroundColor: 'rgba(147, 0, 10, 0.4)',
    borderWidth: 1,
    borderColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    zIndex: 10,
  },
  redBeaconPulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ef4444',
  },
  liveFeedBadgeText: {
    color: '#ffb4ab',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  hologramVisualBox: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weatherWidget: {
    width: '100%',
    backgroundColor: 'rgba(10, 18, 35, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 255, 0.2)',
    borderRadius: 10,
    padding: 10,
    marginTop: 6,
    gap: 4,
  },
  weatherCity: {
    color: '#f8fafc',
    fontSize: 11,
    fontWeight: '800',
  },
  weatherDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  weatherTemp: {
    color: '#b9cacb',
    fontSize: 11,
  },
  aqiPill: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  aqiText: {
    color: '#10b981',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 9,
    fontWeight: '700',
  },

  // ---------------------------------------------------------------------------
  // B. HUD Cards
  // ---------------------------------------------------------------------------
  hudGridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  hudCard: {
    flex: 1,
    minWidth: 180,
    backgroundColor: '#0a1224',
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    position: 'relative',
    overflow: 'hidden',
  },
  hudCardCyan: {
    borderColor: 'rgba(0, 242, 255, 0.25)',
  },
  hudCardPurple: {
    borderColor: 'rgba(221, 183, 255, 0.25)',
  },
  hudCardAmber: {
    borderColor: 'rgba(254, 216, 58, 0.25)',
  },
  hudCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  hudIconBox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hudIconGlyph: {
    fontSize: 14,
  },
  hudLabel: {
    color: '#849495',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  hudValWhite: {
    color: '#f8fafc',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  hudValPurple: {
    color: '#ddb7ff',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  hudDeltaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  hudDeltaGreen: {
    color: '#10b981',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 10,
    fontWeight: '700',
  },
  hudDeltaAmber: {
    color: '#fed83a',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 10,
    fontWeight: '700',
  },
  hudDeltaSub: {
    color: '#64748b',
    fontSize: 10,
  },
  sparklineWrap: {
    marginTop: 8,
    height: 32,
    overflow: 'hidden',
  },

  // ---------------------------------------------------------------------------
  // C. Tactical Threat Mapping (GIS Map + Vector Analysis)
  // ---------------------------------------------------------------------------
  threatMappingSection: {
    backgroundColor: '#070f1e',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 255, 0.25)',
    padding: 16,
    gap: 14,
  },
  threatMapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
  },
  threatMapTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  threatMapCrosshairIcon: {
    fontSize: 20,
    color: '#00f2ff',
  },
  threatMapTitle: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  threatMapSubtitle: {
    color: '#849495',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 10,
    fontWeight: '700',
  },
  threatMapControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectorDropdown: {
    backgroundColor: '#101a2e',
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 255, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  sectorDropdownText: {
    color: '#e1fdff',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 11,
    fontWeight: '700',
  },
  realtimePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: '#10b981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  realtimePillText: {
    color: '#10b981',
    fontSize: 10,
    fontWeight: '800',
  },
  expandMapBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#101a2e',
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  expandMapText: {
    color: '#00f2ff',
    fontSize: 14,
  },
  threatMapBody: {
    flexDirection: 'row',
    gap: 14,
  },
  threatMapBodyStacked: {
    flexDirection: 'column',
  },
  gisMapContainer: {
    flex: 2,
    backgroundColor: '#030712',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 255, 0.2)',
    overflow: 'hidden',
    position: 'relative',
  },
  floatingMapToolbar: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(7, 15, 30, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 255, 0.25)',
    borderRadius: 6,
    padding: 4,
    gap: 4,
  },
  mapToolBtn: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  mapToolText: {
    color: '#00f2ff',
    fontSize: 13,
  },
  mapLegendRow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(3, 7, 18, 0.85)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 242, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legendText: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '600',
  },
  threatAnalysisCard: {
    flex: 1,
    backgroundColor: '#0a1324',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 255, 0.2)',
    padding: 14,
    gap: 8,
  },
  analysisHeaderLabel: {
    color: '#849495',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  analysisThumbnailBox: {
    height: 70,
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  threatTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  threatHeadline: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '800',
    flex: 1,
  },
  highRiskPill: {
    backgroundColor: '#93000a',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  highRiskPillText: {
    color: '#ffdad6',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 9,
    fontWeight: '800',
  },
  threatDescription: {
    color: '#94a3b8',
    fontSize: 11,
    lineHeight: 16,
  },
  telemetryTable: {
    gap: 4,
    marginTop: 4,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  tableKey: {
    color: '#849495',
    fontSize: 11,
  },
  tableVal: {
    color: '#f8fafc',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 11,
    fontWeight: '700',
  },
  overrideVectoringBtn: {
    backgroundColor: 'rgba(0, 242, 255, 0.1)',
    borderWidth: 1,
    borderColor: '#00f2ff',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  overrideVectoringText: {
    color: '#00f2ff',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  // ---------------------------------------------------------------------------
  // D. Two-Column Row (Timeline & Drone Swarm)
  // ---------------------------------------------------------------------------
  twoColRow: {
    flexDirection: 'row',
    gap: 14,
  },
  twoColRowStacked: {
    flexDirection: 'column',
  },
  incidentTimelineCard: {
    flex: 1,
    backgroundColor: '#070f1e',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 255, 0.2)',
    padding: 14,
    gap: 12,
  },
  timelineHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timelineTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timelineTitle: {
    color: '#f8fafc',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  dropdownMini: {
    backgroundColor: '#101a2e',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  dropdownMiniText: {
    color: '#849495',
    fontSize: 10,
    fontWeight: '600',
  },
  timelineList: {
    gap: 10,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  timelineTime: {
    color: '#849495',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 10,
    width: 36,
  },
  timelineNodeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  timelineContent: {
    flex: 1,
  },
  timelineItemTitle: {
    color: '#f8fafc',
    fontSize: 11,
    fontWeight: '700',
  },
  timelineItemSub: {
    color: '#849495',
    fontSize: 10,
  },
  severityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  severityText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '700',
  },

  // Drone Swarm Card
  droneSwarmCard: {
    flex: 1,
    backgroundColor: '#070f1e',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 255, 0.2)',
    padding: 14,
    gap: 10,
  },
  viewAllBtn: {
    backgroundColor: '#101a2e',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 255, 0.25)',
  },
  viewAllText: {
    color: '#00f2ff',
    fontSize: 10,
    fontWeight: '700',
  },
  droneDonutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  donutChartBox: {
    width: 110,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  donutCenterLabel: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutCenterNum: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '900',
  },
  donutCenterSub: {
    color: '#849495',
    fontSize: 8,
  },
  droneLegendList: {
    gap: 4,
  },
  droneLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  droneLegendLabel: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600',
  },
  droneGraphicBox: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  patrolRouteBox: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: 8,
  },
  patrolRouteLabel: {
    color: '#849495',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 4,
  },

  // ---------------------------------------------------------------------------
  // E. Defense Core Modules
  // ---------------------------------------------------------------------------
  defenseModulesSection: {
    gap: 12,
  },
  modulesSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  modulesHeaderLeft: {
    gap: 2,
  },
  moduleTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  moduleTagIcon: {
    color: '#00f2ff',
    fontSize: 13,
  },
  moduleTagText: {
    color: '#00f2ff',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  modulesHeaderTitle: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '900',
  },
  viewAllModulesBtn: {
    backgroundColor: '#0a1324',
    borderWidth: 1,
    borderColor: '#00f2ff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  viewAllModulesText: {
    color: '#00f2ff',
    fontSize: 11,
    fontWeight: '700',
  },
  modulesCardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  defenseModuleCard: {
    flex: 1,
    minWidth: 220,
    backgroundColor: '#070f1e',
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    gap: 8,
  },
  cardBorderCyan: {
    borderColor: 'rgba(0, 242, 255, 0.3)',
  },
  cardBorderPurple: {
    borderColor: 'rgba(221, 183, 255, 0.3)',
  },
  cardBorderAmber: {
    borderColor: 'rgba(254, 216, 58, 0.3)',
  },
  cardBorderTeal: {
    borderColor: 'rgba(0, 219, 231, 0.3)',
  },
  moduleVisualHeader: {
    height: 70,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleCardTitle: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '800',
  },
  moduleCardDesc: {
    color: '#94a3b8',
    fontSize: 11,
    lineHeight: 16,
    flex: 1,
  },
  moduleCardLinkRow: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  moduleCardLinkCyan: {
    color: '#00f2ff',
    fontSize: 11,
    fontWeight: '800',
  },
  moduleCardLinkPurple: {
    color: '#ddb7ff',
    fontSize: 11,
    fontWeight: '800',
  },
  moduleCardLinkAmber: {
    color: '#fed83a',
    fontSize: 11,
    fontWeight: '800',
  },
  moduleCardLinkTeal: {
    color: '#74f5ff',
    fontSize: 11,
    fontWeight: '800',
  },

  // ---------------------------------------------------------------------------
  // F. Select Clearance Gateway
  // ---------------------------------------------------------------------------
  clearanceCardContainer: {
    backgroundColor: '#070f1e',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 255, 0.3)',
    padding: 18,
    gap: 16,
  },
  clearanceCardHeader: {
    alignItems: 'center',
    gap: 4,
  },
  clearanceCardHeading: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  clearanceCardSub: {
    color: '#94a3b8',
    fontSize: 11,
    textAlign: 'center',
    maxWidth: 580,
  },
  clearanceGatewaysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gatewayCard: {
    flex: 1,
    minWidth: 200,
    backgroundColor: '#0a1324',
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gatewayBorderCyan: {
    borderColor: 'rgba(0, 242, 255, 0.3)',
  },
  gatewayBorderPurple: {
    borderColor: 'rgba(221, 183, 255, 0.3)',
  },
  gatewayBorderAmber: {
    borderColor: 'rgba(254, 216, 58, 0.3)',
  },
  gatewayBorderTeal: {
    borderColor: 'rgba(0, 219, 231, 0.3)',
  },
  gatewayCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  gatewayIconBox: {
    width: 34,
    height: 34,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gatewayTierTitle: {
    color: '#f8fafc',
    fontSize: 12,
    fontWeight: '800',
  },
  gatewayTierSub: {
    color: '#849495',
    fontSize: 10,
  },
  gatewayArrowGlyph: {
    color: '#00f2ff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  initAuthSequenceBtn: {
    backgroundColor: '#00f2ff',
    borderRadius: 8,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...Shadows.glowBlue,
  },
  initAuthSequenceText: {
    color: '#00363a',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  // ---------------------------------------------------------------------------
  // G. Compliance Seals
  // ---------------------------------------------------------------------------
  complianceSealsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  sealBox: {
    flex: 1,
    minWidth: 180,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#070f1e',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  sealHexIcon: {
    width: 32,
    height: 32,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  sealTitleText: {
    color: '#f8fafc',
    fontSize: 10,
    fontWeight: '800',
  },
  sealSubText: {
    color: '#849495',
    fontSize: 9,
  },

  // ---------------------------------------------------------------------------
  // H. Footer Bar
  // ---------------------------------------------------------------------------
  footerBar: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerBrand: {
    color: '#00f2ff',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  footerCenterLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerLink: {
    color: '#849495',
    fontSize: 10,
  },
  footerPipe: {
    color: '#334155',
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerSecText: {
    color: '#10b981',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 10,
    fontWeight: '700',
  },
});
