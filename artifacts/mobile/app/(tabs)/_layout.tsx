import React from 'react';
import { Image, ImageSourcePropType, Platform, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/colors';

const NAV_ICONS = {
  home:    require('@/assets/images/nav-home.png'),
  tasks:   require('@/assets/images/nav-tasks.png'),
  upgrade: require('@/assets/images/nav-upgrade.png'),
  friends: require('@/assets/images/nav-friends.png'),
  profile: require('@/assets/images/nav-profile.png'),
};

function NavIcon({
  source,
  focused,
  isUpgrade = false,
}: {
  source: ImageSourcePropType;
  focused: boolean;
  isUpgrade?: boolean;
}) {
  return (
    <Image
      source={source}
      style={[
        styles.tabIcon,
        isUpgrade && styles.upgradeIcon,
        { opacity: focused ? 1 : 0.45 },
      ]}
      resizeMode="contain"
    />
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const isIOS = Platform.OS === 'ios';
  const isWeb = Platform.OS === 'web';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.gold,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: isIOS ? 'transparent' : COLORS.surface,
          borderTopWidth: isWeb ? 1 : 0,
          borderTopColor: COLORS.border,
          elevation: 0,
          paddingBottom: isWeb ? 0 : insets.bottom,
          ...(isWeb ? { height: 84 } : {}),
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
          ) : null,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Ketuk',
          tabBarIcon: ({ focused }) => <NavIcon source={NAV_ICONS.home} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tugas',
          tabBarIcon: ({ focused }) => <NavIcon source={NAV_ICONS.tasks} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="upgrades"
        options={{
          title: 'Upgrade',
          tabBarIcon: ({ focused }) => (
            <NavIcon source={NAV_ICONS.upgrade} focused={focused} isUpgrade />
          ),
        }}
      />
      <Tabs.Screen
        name="frens"
        options={{
          title: 'Teman',
          tabBarIcon: ({ focused }) => <NavIcon source={NAV_ICONS.friends} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ focused }) => <NavIcon source={NAV_ICONS.profile} focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    width: 36,
    height: 36,
  },
  upgradeIcon: {
    width: 44,
    height: 44,
  },
});
