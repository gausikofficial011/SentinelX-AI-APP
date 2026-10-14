import { Tabs } from 'expo-router';
import { StyleSheet, Text, View, Platform } from 'react-native';

export default function AppTabs() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#00F0FF',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          backgroundColor: '#040810',
          borderTopColor: 'rgba(0, 240, 255, 0.2)',
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 86 : 68,
          paddingBottom: Platform.OS === 'ios' ? 24 : 10,
          paddingTop: 8,
          elevation: 12,
          shadowColor: '#00F0FF',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '800',
          letterSpacing: 0.5,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'INTEL',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconActive]}>
              <Text style={{ fontSize: 17 }}>🛡️</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="hotspots"
        options={{
          title: 'GIS / AI',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconActive]}>
              <Text style={{ fontSize: 17 }}>🗺️</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="copilot"
        options={{
          title: 'COPILOT',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconActive]}>
              <Text style={{ fontSize: 17 }}>🧠</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="incidents"
        options={{
          title: 'INCIDENTS',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconActive]}>
              <Text style={{ fontSize: 17 }}>📋</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="citizen"
        options={{
          title: 'CITIZEN',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconActive]}>
              <Text style={{ fontSize: 17 }}>👤</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  iconActive: {
    backgroundColor: 'rgba(0, 240, 255, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.4)',
  },
});
