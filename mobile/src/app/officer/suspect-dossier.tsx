import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { Header } from '@/components/common/Header';
import { BottomNav } from '@/components/common/BottomNav';
import { SuspectDossier } from '@/types';

export default function SuspectDossierScreen() {
  const [search, setSearch] = useState('');

  const dossiers: SuspectDossier[] = [
    {
      id: 'SUSP-4091',
      fullName: 'Vikram "Karuvan" Sethuraman',
      aliases: ['Karuva Sethu', 'Vicky 40'],
      age: 32,
      status: 'WANTED',
      riskLevel: 'CRITICAL',
      primaryOffense: 'Armed Burglary & Extortion (Sec. 392/397)',
      lastKnownLocation: 'Gandhipuram Bus Stand Outskirts',
      associatedCases: ['INC-2026-881', 'INC-2026-882', 'FIR-2026-44091'],
      physicalDescription: 'Height 5ft 10in, athletic build, deep scar across left eyebrow, dragon tattoo on right forearm.',
      warrantIssued: true,
    },
    {
      id: 'SUSP-4092',
      fullName: 'M. Dharmalingam',
      aliases: ['Dharma', 'Bullet Dharma'],
      age: 28,
      status: 'UNDER_SURVEILLANCE',
      riskLevel: 'HIGH',
      primaryOffense: 'Automobile Theft & Chop Shop Trafficking',
      lastKnownLocation: 'Sathy Road Industrial Estate Gate 4',
      associatedCases: ['INC-2026-884'],
      physicalDescription: 'Height 5ft 7in, slight limp on right leg, black mustache, wears aviator sunglasses.',
      warrantIssued: false,
    },
  ];

  const filtered = dossiers.filter(
    (d) =>
      d.fullName.toLowerCase().includes(search.toLowerCase()) ||
      d.aliases.some((a) => a.toLowerCase().includes(search.toLowerCase())) ||
      d.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Suspect Dossier Search" subtitle="Restricted Law Enforcement Intelligence" showBack />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search suspect by Name, Alias or Dossier ID..."
            placeholderTextColor={Colors.textDim}
          />
        </View>

        {/* Dossiers List */}
        {filtered.map((suspect) => (
          <View key={suspect.id} style={styles.dossierCard}>
            <View style={styles.dossierTop}>
              <View style={styles.avatarBox}>
                <Text style={styles.avatarEmoji}>👤</Text>
              </View>

              <View style={styles.headerInfo}>
                <View style={styles.dossierIdRow}>
                  <Text style={styles.dossierId}>{suspect.id}</Text>
                  {suspect.warrantIssued && (
                    <View style={styles.warrantBadge}>
                      <Text style={styles.warrantText}>WARRANT ISSUED</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.suspectName}>{suspect.fullName}</Text>
                <Text style={styles.aliases}>AKA: {suspect.aliases.join(', ')}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.key}>Age / Status:</Text>
              <Text style={styles.val}>
                {suspect.age} yrs • <Text style={{ color: Colors.emergency, fontWeight: 'bold' }}>{suspect.status}</Text>
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.key}>Primary Charge:</Text>
              <Text style={styles.val}>{suspect.primaryOffense}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.key}>Last Known Sector:</Text>
              <Text style={styles.val}>📍 {suspect.lastKnownLocation}</Text>
            </View>

            <View style={styles.descBox}>
              <Text style={styles.descHeader}>Physical Identification Marks:</Text>
              <Text style={styles.descText}>{suspect.physicalDescription}</Text>
            </View>

            <View style={styles.casesRow}>
              <Text style={styles.casesLabel}>Linked Cases:</Text>
              <View style={styles.casePills}>
                {suspect.associatedCases.map((c) => (
                  <View key={c} style={styles.casePill}>
                    <Text style={styles.casePillText}>{c}</Text>
                  </View>
                ))}
              </View>
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
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    height: 48,
    marginBottom: Spacing.lg,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: Colors.text,
    fontSize: 14,
  },
  dossierCard: {
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  dossierTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatarBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 2,
    borderColor: Colors.emergency,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  avatarEmoji: {
    fontSize: 28,
  },
  headerInfo: {
    flex: 1,
  },
  dossierIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  dossierId: {
    color: Colors.cyan,
    fontSize: 12,
    fontWeight: Typography.weights.heavy,
  },
  warrantBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderColor: Colors.emergency,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.xs,
  },
  warrantText: {
    color: Colors.emergency,
    fontSize: 9,
    fontWeight: Typography.weights.heavy,
  },
  suspectName: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: Typography.weights.bold,
  },
  aliases: {
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 1,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  key: {
    color: Colors.textDim,
    fontSize: 13,
  },
  val: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: Typography.weights.semibold,
    flex: 1,
    textAlign: 'right',
    marginLeft: Spacing.md,
  },
  descBox: {
    backgroundColor: Colors.backgroundSecondary,
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginVertical: Spacing.md,
  },
  descHeader: {
    color: Colors.cyan,
    fontSize: 11,
    fontWeight: Typography.weights.bold,
    marginBottom: 4,
  },
  descText: {
    color: Colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
  },
  casesRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  casesLabel: {
    color: Colors.textDim,
    fontSize: 12,
    marginRight: Spacing.sm,
  },
  casePills: {
    flexDirection: 'row',
    gap: Spacing.xs,
    flexWrap: 'wrap',
  },
  casePill: {
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.xs,
  },
  casePillText: {
    color: Colors.cyan,
    fontSize: 11,
    fontWeight: Typography.weights.bold,
  },
});
