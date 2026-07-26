import React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { useGame } from '@/context/GameContext';

// ─── Constants ─────────────────────────────────────────────────────────────────

/** Content height of the persistent header (excluding safe-area inset). */
export const HEADER_HEIGHT = 52;

// ─── Page title map ────────────────────────────────────────────────────────────

const PAGE_TITLES: Record<string, string> = {
  '/': 'AltoTap',
  '/upgrades': 'Peningkatan',
  '/tasks': 'Tugas',
  '/frens': 'Teman',
  '/profile': 'Profil',
  '/stats': 'Statistik',
  '/withdraw': 'Tarik Poin',
  '/topup': 'Isi Ulang VIP',
  '/transactions': 'Riwayat',
};

/** Routes that are pushed onto the Stack (not tab roots). */
const STACK_ROUTES = new Set(['/stats', '/withdraw', '/topup', '/transactions']);

function fmt(n: number): string {
  return n.toLocaleString('id-ID');
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function PersistentHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { gameState } = useGame();

  // Hide on login, splash, and spin (full-screen experiences)
  if (pathname === '/login' || pathname === '' || pathname === '/spin') return null;

  const totalHeight = HEADER_HEIGHT + insets.top;
  const isStack = STACK_ROUTES.has(pathname);
  const title = PAGE_TITLES[pathname] ?? 'AltoTap';

  return (
    <View
      style={[
        styles.container,
        { height: totalHeight, paddingTop: insets.top },
      ]}
    >
      {/* Bottom separator */}
      <View style={styles.separator} />

      {/* Left slot: back button (stack) or spin gift button (tabs) */}
      <View style={styles.slot}>
        {isStack ? (
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.iconBtn}
            hitSlop={8}
            testID="header-back"
          >
            <Ionicons name="chevron-back" size={26} color={COLORS.textPrimary} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => router.push('/spin')}
            style={styles.iconBtn}
            testID="header-spin"
          >
            <Image
              source={require('@/assets/images/gift-spin.png')}
              style={styles.giftIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Center: page title */}
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      {/* Right slot: points balance chip */}
      <View style={[styles.slot, styles.slotRight]}>
        <TouchableOpacity
          onPress={() => router.push('/withdraw')}
          style={styles.pointsPill}
          testID="header-points"
        >
          <Ionicons name="star" size={11} color={COLORS.gold} />
          <Text style={styles.pointsText}>{fmt(gameState.points)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor:
      Platform.OS === 'web' ? COLORS.surface : 'rgba(18,18,20,0.97)',
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  separator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: COLORS.border,
  },
  slot: {
    width: 56,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  slotRight: {
    alignItems: 'flex-end',
  },
  iconBtn: {
    padding: 4,
  },
  giftIcon: {
    width: 38,
    height: 38,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  pointsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.surfaceVariant,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 16,
  },
  pointsText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.gold,
  },
});
