import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadows } from '@/constants/theme';
import { useHotspotStore } from '@/store/hotspotStore';
import { useIncidentStore } from '@/store/incidentStore';
import { DBSCANCluster } from '@/types';

interface GISMapProps {
  onSelectCluster?: (cluster: DBSCANCluster) => void;
}

export function GISMap({ onSelectCluster }: GISMapProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { clusters, selectedCluster, setSelectedCluster } = useHotspotStore();
  const { incidents } = useIncidentStore();

  const categories = ['All', 'Theft', 'Assault', 'Accident', 'Other'];

  const currentCluster = selectedCluster || clusters[0];

  const handleClusterPress = (cluster: DBSCANCluster) => {
    setSelectedCluster(cluster);
    if (onSelectCluster) onSelectCluster(cluster);
  };

  return (
    <View style={styles.container}>
      {/* Top Search Bar */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search location, incidents..."
          placeholderTextColor={Colors.textDim}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Category Filter Pills */}
      <View style={styles.pillScrollWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillContainer}
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.pill, isActive && styles.pillActive]}
                onPress={() => setActiveCategory(cat)}
                activeOpacity={0.7}
              >
                <Text style={[styles.pillText, isActive && styles.pillTextActive]}>{cat}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Simulated High-Tech Dark Satellite GIS Map View */}
      <View style={styles.mapCanvas}>
        {/* Tactical Grid Overlay */}
        <View style={styles.gridOverlay}>
          <View style={styles.gridLineHorizontal} />
          <View style={[styles.gridLineHorizontal, { top: '35%' }]} />
          <View style={[styles.gridLineHorizontal, { top: '70%' }]} />
          <View style={styles.gridLineVertical} />
          <View style={[styles.gridLineVertical, { left: '35%' }]} />
          <View style={[styles.gridLineVertical, { left: '70%' }]} />
        </View>

        {/* Street Lines / Topo Vectors */}
        <View style={styles.streetDiagonal1} />
        <View style={styles.streetDiagonal2} />
        <View style={styles.streetHorizontal} />

        {/* Hotspot Cluster 1 (RS Puram - High Risk) */}
        <TouchableOpacity
          style={[styles.hotspotCluster, styles.cluster1]}
          onPress={() => handleClusterPress(clusters[0])}
          activeOpacity={0.8}
        >
          <View style={styles.heatWaveOuter} />
          <View style={styles.heatWaveMid} />
          <View style={styles.heatCoreRed}>
            <Text style={styles.clusterCountText}>12</Text>
          </View>
        </TouchableOpacity>

        {/* Hotspot Cluster 2 (Gandhipuram - Critical Risk) */}
        <TouchableOpacity
          style={[styles.hotspotCluster, styles.cluster2]}
          onPress={() => handleClusterPress(clusters[1])}
          activeOpacity={0.8}
        >
          <View style={[styles.heatWaveOuter, { borderColor: 'rgba(239, 68, 68, 0.4)' }]} />
          <View style={[styles.heatWaveMid, { backgroundColor: 'rgba(239, 68, 68, 0.3)' }]} />
          <View style={[styles.heatCoreRed, { backgroundColor: '#B91C1C' }]}>
            <Text style={styles.clusterCountText}>9</Text>
          </View>
        </TouchableOpacity>

        {/* Hotspot Cluster 3 (Avinashi - Medium Risk) */}
        <TouchableOpacity
          style={[styles.hotspotCluster, styles.cluster3]}
          onPress={() => handleClusterPress(clusters[2])}
          activeOpacity={0.8}
        >
          <View style={[styles.heatWaveOuter, { borderColor: 'rgba(245, 158, 11, 0.3)' }]} />
          <View style={[styles.heatWaveMid, { backgroundColor: 'rgba(245, 158, 11, 0.25)' }]} />
          <View style={[styles.heatCoreRed, { backgroundColor: Colors.warning }]}>
            <Text style={styles.clusterCountText}>6</Text>
          </View>
        </TouchableOpacity>

        {/* Officer Patrol Unit Markers */}
        <View style={[styles.unitMarker, { top: '25%', left: '72%' }]}>
          <Text style={styles.unitMarkerEmoji}>🚔</Text>
        </View>
        <View style={[styles.unitMarker, { top: '65%', left: '30%' }]}>
          <Text style={styles.unitMarkerEmoji}>🚔</Text>
        </View>

        {/* Incident Pins */}
        <View style={[styles.incidentPin, { top: '38%', left: '42%' }]}>
          <Text style={styles.pinText}>🚨</Text>
        </View>
        <View style={[styles.incidentPin, { top: '55%', left: '78%' }]}>
          <Text style={styles.pinText}>⚠️</Text>
        </View>

        {/* Map Control Buttons */}
        <View style={styles.mapControls}>
          <TouchableOpacity style={styles.ctrlBtn}>
            <Text style={styles.ctrlBtnText}>➕</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ctrlBtn}>
            <Text style={styles.ctrlBtnText}>➖</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ctrlBtn}>
            <Text style={styles.ctrlBtnText}>🎯</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Floating Bottom Intelligence Card matching screen #4 */}
      {currentCluster && (
        <View style={styles.bottomCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.locIconBox}>
              <Text style={styles.locIcon}>📍</Text>
            </View>

            <View style={styles.cardDetailsCol}>
              <View style={styles.riskTitleRow}>
                <Text style={styles.riskTitle}>High Risk Area</Text>
                <View style={styles.highBadge}>
                  <Text style={styles.highBadgeText}>{currentCluster.severity}</Text>
                </View>
              </View>

              <Text style={styles.areaName}>{currentCluster.area_name}</Text>
              <Text style={styles.incidentStats}>
                {currentCluster.incident_count} incidents (Last 30 days)
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.viewDetailsBtn}
            onPress={() => onSelectCluster && onSelectCluster(currentCluster)}
            activeOpacity={0.8}
          >
            <Text style={styles.viewDetailsText}>View Details</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.pill,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.md,
    height: 46,
    zIndex: 10,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: Colors.text,
    fontSize: 14,
    fontWeight: Typography.weights.medium,
  },
  clearIcon: {
    color: Colors.textDim,
    fontSize: 14,
    paddingHorizontal: 6,
  },
  pillScrollWrap: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
    zIndex: 10,
  },
  pillContainer: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: Radius.pill,
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pillActive: {
    backgroundColor: Colors.cyanGlow,
    borderColor: Colors.cyan,
  },
  pillText: {
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: Typography.weights.semibold,
  },
  pillTextActive: {
    color: Colors.cyan,
    fontWeight: Typography.weights.bold,
  },
  mapCanvas: {
    flex: 1,
    minHeight: 380,
    backgroundColor: '#040914',
    position: 'relative',
    overflow: 'hidden',
    marginTop: Spacing.xs,
  },
  gridOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.15,
  },
  gridLineHorizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: Colors.cyan,
  },
  gridLineVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: Colors.cyan,
  },
  streetDiagonal1: {
    position: 'absolute',
    width: '120%',
    height: 3,
    backgroundColor: 'rgba(56, 189, 248, 0.18)',
    transform: [{ rotate: '35deg' }],
    top: '40%',
    left: '-10%',
  },
  streetDiagonal2: {
    position: 'absolute',
    width: '120%',
    height: 2,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    transform: [{ rotate: '-25deg' }],
    top: '60%',
    left: '-10%',
  },
  streetHorizontal: {
    position: 'absolute',
    width: '100%',
    height: 2.5,
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    top: '45%',
  },
  hotspotCluster: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  cluster1: {
    top: '28%',
    left: '25%',
  },
  cluster2: {
    top: '48%',
    left: '55%',
  },
  cluster3: {
    top: '68%',
    left: '20%',
  },
  heatWaveOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: 'rgba(239, 68, 68, 0.35)',
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    position: 'absolute',
  },
  heatWaveMid: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: 'rgba(239, 68, 68, 0.3)',
    position: 'absolute',
  },
  heatCoreRed: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.emergency,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.glowEmergency,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  clusterCountText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: Typography.weights.heavy,
  },
  unitMarker: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 163, 255, 0.2)',
    padding: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.primary,
    zIndex: 4,
  },
  unitMarkerEmoji: {
    fontSize: 16,
  },
  incidentPin: {
    position: 'absolute',
    zIndex: 4,
  },
  pinText: {
    fontSize: 18,
  },
  mapControls: {
    position: 'absolute',
    right: Spacing.lg,
    bottom: Spacing.lg,
    backgroundColor: Colors.backgroundCard,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 4,
    gap: 4,
    zIndex: 15,
  },
  ctrlBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  ctrlBtnText: {
    fontSize: 14,
  },
  bottomCard: {
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  locIconBox: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  locIcon: {
    fontSize: 22,
  },
  cardDetailsCol: {
    flex: 1,
  },
  riskTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  riskTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: Typography.weights.bold,
  },
  highBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.18)',
    borderColor: Colors.emergency,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.pill,
  },
  highBadgeText: {
    color: Colors.emergency,
    fontSize: 10,
    fontWeight: Typography.weights.heavy,
  },
  areaName: {
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: Typography.weights.medium,
  },
  incidentStats: {
    color: Colors.textDim,
    fontSize: 12,
    marginTop: 2,
  },
  viewDetailsBtn: {
    backgroundColor: Colors.cyanGlow,
    borderColor: Colors.cyan,
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewDetailsText: {
    color: Colors.cyan,
    fontSize: 14,
    fontWeight: Typography.weights.bold,
    letterSpacing: 0.3,
  },
});
