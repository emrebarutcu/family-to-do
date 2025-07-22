import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter, useSegments, Slot } from 'expo-router';
import { useEffect } from 'react';

const NAV_ITEMS = [
  { key: 'parent-dashboard-list', label: 'Tasks', icon: 'tasks' },
  { key: 'parent-rewards', label: 'Rewards', icon: 'gift' },
  { key: 'task-approvals', label: 'Approvals', icon: 'check-circle' },
  { key: 'parent-settings', label: 'Account', icon: 'user' },
];

type BottomNavbarProps = {
  currentRoute: string;
  onTabPress: (route: string) => void;
};

function BottomNavbar({ currentRoute, onTabPress }: BottomNavbarProps) {
  return (
    <View style={styles.navbarContainer}>
      {NAV_ITEMS.map((item) => {
        const focused = currentRoute === item.key;
        return (
          <TouchableOpacity
            key={item.key}
            style={[styles.navItem, focused && styles.navItemActive]}
            onPress={() => onTabPress(item.key)}
            activeOpacity={0.8}
          >
            <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
              <FontAwesome
                name={item.icon as React.ComponentProps<typeof FontAwesome>["name"]}
                size={22}
                color={focused ? '#121417' : '#5c738a'}
              />
            </View>
            <Text style={[styles.label, focused && styles.labelActive]}>{item.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  const router = useRouter();
  const segments = useSegments();
  // The last segment is the current tab route or sub-screen
  const currentRoute = segments[segments.length - 1] || '';

  const validTabs = NAV_ITEMS.map(item => item.key);
  // If the current route is a tab, show the navbar
  const isTabScreen = validTabs.includes(currentRoute);

  // Only redirect if user lands on /tabs (no tab or sub-screen selected)
  React.useEffect(() => {
    // Only redirect if on /tabs and not already on a valid tab
    if (
      segments.length === 1 &&
      String(segments[0]) === '(tabs)'
    ) {
      router.replace('/(tabs)/parent-dashboard-list');
    }
  }, [segments]);

  const handleTabPress = (route: string) => {
    if (route !== currentRoute) {
      router.replace('/(tabs)/' + route as any);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fafafa' }}>
      <Slot />
      {isTabScreen && (
        <BottomNavbar currentRoute={currentRoute} onTabPress={handleTabPress} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  navbarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 75,
    backgroundColor: '#fafafa',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderColor: '#ebedf2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
    paddingHorizontal: 8,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    paddingBottom: 16,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 18,
    paddingBottom: 4,
  },
  navItemActive: {
    backgroundColor: '#fff',
    borderRadius: 18,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  iconWrapActive: {
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 12,
    color: '#5c738a',
    fontWeight: '500',
  },
  labelActive: {
    color: '#121417',
    fontWeight: '700',
  },
});
