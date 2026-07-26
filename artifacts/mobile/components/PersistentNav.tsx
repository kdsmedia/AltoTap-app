import React from 'react';
import {
  Image,
  ImageSourcePropType,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/colors';

// ─── Constants ────────────────────────────────────────────────────────────────

export const NAV_BAR_HEIGHT = 70;

// ─── Nav items ────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  {
    key: 'home',
    icon: require('@/assets/images/nav-home.png') as ImageSourcePropType,
    route: '/',
  },
  {
    key: 'tasks',
    icon: require('@/assets/images/nav-tasks.png') as ImageSourcePropType,
    route: '/tasks',
  },
  {
    key: 'upgrade',
    icon: require('@/assets/images/nav-upgrade.png') as ImageSourcePropType,
    route: '/upgrades',
    isUpgrade: true,
  },
  {
    key: 'frens',
    icon: require('@/assets/images/nav-friends.png') as ImageSourcePropType,
    route: '/frens',
  },
  {
    key: 'profile',
    icon: require('@/assets/images/nav-profile.png') as ImageSourcePropType,
    route: '/profile',
  },
] as const;

// ─── Active-state helper ──────────────────────────────────────────────────────

function isActive(pathname: string, key: string): boolean {
  switch (key) {
    case 'home':
      return pathname === '/' || pathname === '/index';
    case 'tasks':
      return pathname.startsWith('/tasks');
    case 'upgrade':
      return pathname.startsWith('/upgrades');
    case 'frens':
      return pathname.startsWith('/frens');
    case 'profile':
      return pathname.startsWith('/profile');
    default:
      return false;
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PersistentNav() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  // Hide on login and splash (no route yet)
  if (pathname === '/login' || pathname === '') return null;

  const totalHeight = NAV_BAR_HEIGHT + insets.bottom;

  return (
    <View style={[styles.container, { height: totalHeight, paddingBottom: insets.bottom }]}>
      {/* Separator line */}
      <View style={styles.separator} />

      {/* Icons row */}
      <View style={styles.row}>
        {NAV_ITEMS.map((item) => {
          const focused = isActive(pathname, item.key);
          const isUpgrade = 'isUpgrade' in item && item.isUpgrade;

          return (
            <TouchableOpacity
              key={item.key}
              style={styles.tab}
              onPress={() => router.push(item.route as never)}
              activeOpacity={0.7}
            >
              <Image
                source={item.icon}
                style={[
                  styles.icon,
                  isUpgrade && styles.iconUpgrade,
                  { opacity: focused ? 1 : 0.55 },
                ]}
                resizeMode="contain"
              />
              {/* Gold dot indicator for active tab */}
              <View style={[styles.dot, { opacity: focused ? 1 : 0 }]} />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Platform.OS === 'web' ? COLORS.surface : 'rgba(18,18,20,0.97)',
    zIndex: 100,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  icon: {
    width: 52,
    height: 52,
  },
  iconUpgrade: {
    width: 66,
    height: 66,
    marginBottom: 6,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.gold,
    marginTop: 2,
  },
});
