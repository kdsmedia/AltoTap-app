import React, { useCallback, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useGame } from '@/context/GameContext';
import { COLORS } from '@/constants/colors';
import BgWrapper from '@/components/BgWrapper';
import { AD_STRIP_HEIGHT } from '@/components/AdBannerBar';

interface Particle {
  id: number;
  text: string;
  x: number;
  y: number;
}

function fmt(n: number): string {
  return n.toLocaleString('id-ID');
}

export default function TapScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { gameState, tap } = useGame();
  const [particles, setParticles] = useState<Particle[]>([]);
  const particleId = useRef(0);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(1)).current;

  const handleTap = useCallback(
    (event: { nativeEvent: { locationX: number; locationY: number } }) => {
      const result = tap();
      if (!result.success) {
        // Flash shake on empty energy
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        return;
      }

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Coin press animation
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.91,
          duration: 70,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 60,
          useNativeDriver: true,
        }),
      ]).start();

      // Glow pulse
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1.15,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Floating particle
      const id = ++particleId.current;
      const x = (event.nativeEvent.locationX ?? 100) - 24;
      const y = (event.nativeEvent.locationY ?? 100) - 60;
      setParticles(prev => [...prev, { id, text: `+${result.pointsEarned}`, x, y }]);
      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== id));
      }, 700);
    },
    [tap, scaleAnim, glowAnim]
  );

  const energyPct = gameState.maxEnergy > 0 ? gameState.energy / gameState.maxEnergy : 0;
  const isLowEnergy = energyPct < 0.2;
  const energyColor = isLowEnergy ? COLORS.red : COLORS.amber;

  const topPad = Platform.OS === 'web' ? 67 : insets.top + 8;

  return (
    <BgWrapper style={styles.container}>
      {/* Header – balance */}
      <View style={[styles.header, { paddingTop: topPad }]}>
        <View style={styles.balanceRow}>
          <Ionicons name="wallet-outline" size={20} color={COLORS.gold} />
          <Text style={styles.balanceValue}>{fmt(gameState.points)}</Text>
          <Text style={styles.balanceSuffix}>poin</Text>
        </View>

        <View style={styles.headerRight}>
          <View style={styles.energyChip}>
            <Ionicons name="flash" size={14} color={COLORS.amber} />
            <Text style={styles.energyLabel}>
              {fmt(gameState.energy)}/{fmt(gameState.maxEnergy)}
            </Text>
          </View>
          {/* Wallet / Withdraw button */}
          <TouchableOpacity
            onPress={() => router.push('/withdraw')}
            style={styles.walletBtn}
            testID="wallet-btn"
          >
            <Image
              source={require('@/assets/images/wallet-icon.png')}
              style={styles.walletIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tap Zone */}
      <View style={styles.tapZone}>
        {/* Outer glow ring */}
        <Animated.View
          style={[styles.glowRing, { transform: [{ scale: glowAnim }] }]}
        />

        {/* Coin button */}
        <Pressable onPress={handleTap} testID="tap-coin">
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Image
              source={require('@/assets/images/coin-tap.png')}
              style={styles.coin}
              resizeMode="contain"
            />
          </Animated.View>
        </Pressable>

        {/* Particles */}
        {particles.map(p => (
          <View
            key={p.id}
            style={[styles.particle, { left: p.x, top: p.y, pointerEvents: 'none' }]}
          >
            <Text style={styles.particleText}>{p.text}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.tapHint}>
        {gameState.energy > 0 ? 'Ketuk koin untuk mendapatkan poin' : 'Energi habis! Tunggu isi ulang...'}
      </Text>

      {/* Energy Bar — sits above the floating tab bar */}
      <View style={[styles.energySection, { paddingBottom: Platform.OS === 'web' ? 34 : insets.bottom + 74 + 10 + AD_STRIP_HEIGHT + 8 }]}>
        <View style={styles.energyBarBg}>
          <Animated.View
            style={[
              styles.energyBarFill,
              {
                width: `${Math.max(0, Math.min(1, energyPct)) * 100}%` as unknown as number,
                backgroundColor: energyColor,
              },
            ]}
          />
        </View>
        <Text style={[styles.energyText, { color: energyColor }]}>
          Energi: {fmt(gameState.energy)} / {fmt(gameState.maxEnergy)}
        </Text>
      </View>
    </BgWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  balanceValue: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.gold,
    fontFamily: 'Inter_700Bold',
  },
  balanceSuffix: {
    fontSize: 14,
    color: COLORS.textMuted,
    fontFamily: 'Inter_400Regular',
    marginTop: 4,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  energyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.surfaceVariant,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  energyLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontFamily: 'Inter_500Medium',
  },
  walletBtn: {
    padding: 2,
  },
  walletIcon: {
    width: 40,
    height: 40,
  },
  tapZone: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  glowRing: {
    position: 'absolute',
    width: 270,
    height: 270,
    borderRadius: 135,
    borderWidth: 1.5,
    borderColor: '#22AA22' + '55',
    backgroundColor: '#22AA22' + '0A',
  },
  coin: {
    width: 240,
    height: 240,
  },
  particle: {
    position: 'absolute',
    backgroundColor: 'transparent',
  },
  particleText: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.gold,
    fontFamily: 'Inter_700Bold',
    textShadowColor: COLORS.goldDark,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  tapHint: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontFamily: 'Inter_400Regular',
    marginBottom: 20,
  },
  energySection: {
    width: '100%',
    paddingHorizontal: 20,
    gap: 6,
  },
  energyBarBg: {
    width: '100%',
    height: 8,
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 4,
    overflow: 'hidden',
  },
  energyBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  energyText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
  },
});
