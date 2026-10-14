import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { Header } from '@/components/common/Header';
import { BottomNav } from '@/components/common/BottomNav';
import { IncidentCard } from '@/components/ui/IncidentCard';
import { useIncidentStore } from '@/store/incidentStore';

export default function OfficerIncidentsScreen() {
  const router = useRouter();
  const { incidents, selectIncident } = useIncidentStore();
  const [filter, setFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'REPORTED'>('ALL');
  const [search, setSearch] = useState('');

  const filtered = incidents.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === 'ALL') return true;
    if (filter === 'CRITICAL') return item.severity === 'CRITICAL';
    if (filter === 'HIGH') return item.severity === 'HIGH';
    if (filter === 'REPORTED') return item.status === 'REPORTED';
    return true;
  });

  const handleSelectIncident = (inc: any) => {
    selectIncident(inc);
    router.push('/officer/incident-details');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Live Incident Queue" subtitle="Active Patrol & Investigation Feed" showBack />
      <View style={styles.container}>
        {/* Search Input */}
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.input}
            value={search}
            onChangeText={setSearch}
            placeholder="Filter incidents by keyword..."
            placeholderTextColor={Colors.textDim}
          />
        </View>

        {/* Filter Pills */}
        <View style={styles.filterRow}>
          {(['ALL', 'CRITICAL', 'HIGH', 'REPORTED'] as const).map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, filter === f && styles.filterChipActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Incidents List */}
        <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
          {filtered.map((inc) => (
            <IncidentCard key={inc.id} incident={inc} onPress={() => handleSelectIncident(inc)} />
          ))}
        </ScrollView>
      </View>
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
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    height: 44,
    marginBottom: Spacing.sm,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    color: Colors.text,
    fontSize: 14,
  },
  filterRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.pill,
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.cyanGlow,
    borderColor: Colors.cyan,
  },
  filterText: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: Typography.weights.bold,
  },
  filterTextActive: {
    color: Colors.cyan,
  },
  listContent: {
    paddingBottom: Spacing.xl,
  },
});
