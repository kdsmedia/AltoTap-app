import React, { useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import {
  ENERGY_CAP_UPGRADES,
  MULTI_TAP_UPGRADES,
  RECHARGE_UPGRADES,
  useGame,
} from '@/context/GameContext';
import { COLORS } from '@/constants/colors';
import BgWrapper from '@/components/BgWrapper';

function fmt(n: number): string {
  return n.toLocaleString('id-ID');
}

type UpgradeType = 'multiTap' | 'energyCap' | 'recharge';

interface UpgradeCardProps {
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  currentLevel: number;
  maxLevel: number;
  currentDesc: string;
  nextDesc: string;
  nextCost: number;
  userPoints: number;
  type: UpgradeType;
  onBuy: (type: UpgradeType) => void;
}

function UpgradeCard({
  title,
  subtitle,
  icon,
  color,
  currentLevel,
  maxLevel,
  currentDesc,
  nextDesc,
  nextCost,
  userPoints,
  type,
  onBuy,
}: UpgradeCardProps) {
  const isMax = currentLevel >= maxLevel - 1;
  const canAfford = userPoints >= nextCost;

  return (
    <View style={styles.card}>
      {/* Card header */}
      <View style={styles.cardHeader}>
        <View style={[styles.iconBox, { backgroundColor: color + '22' }]}>
          <Ionicons name={icon as any} size={24} color={color} />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardSubtitle}>{subtitle}</Text>
        </View>
        <View style={[styles.levelBadge, { borderColor: color }]}>
          <Text style={[styles.levelText, { color }]}>
            {currentLevel + 1}/{maxLevel}
          </Text>
        </View>
      </View>

      {/* Level progress */}
      <View style={styles.levelBarBg}>
        <View
          style={[
            styles.levelBarFill,
            {
              width: `${((currentLevel + 1) / maxLevel) * 100}%` as unknown as number,
              backgroundColor: color,
            },
          ]}
        />
      </View>

      {/* Current / Next */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Saat ini</Text>
          <Text style={styles.statValue}>{currentDesc}</Text>
        </View>
        {!isMax && (
          <>
            <Ionicons name="arrow-forward" size={16} color={COLORS.textMuted} />
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Berikutnya</Text>
              <Text style={[styles.statValue, { color }]}>{nextDesc}</Text>
            </View>
          </>
        )}
      </View>

      {/* Buy button */}
      {isMax ? (
        <View style={styles.maxTag}>
          <Ionicons name="checkmark-circle" size={16} color={COLORS.green} />
          <Text style={styles.maxText}>Level Maksimal</Text>
        </View>
      ) : (
        <TouchableOpacity
          style={[
            styles.buyBtn,
            { backgroundColor: canAfford ? color : COLORS.surfaceVariant },
          ]}
          onPress={() => onBuy(type)}
          testID={`upgrade-${type}`}
          disabled={!canAfford}
        >
          <Ionicons
            name="flash"
            size={14}
            color={canAfford ? '#000' : COLORS.textMuted}
          />
          <Text
            style={[styles.buyText, { color: canAfford ? '#000' : COLORS.textMuted }]}
          >
            {fmt(nextCost)} poin
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function UpgradesScreen() {
  const insets = useSafeAreaInsets();
  const { gameState, buyUpgrade } = useGame();
  const topPad = Platform.OS === 'web' ? 67 : insets.top + 8;

  const handleBuy = (type: UpgradeType) => {
    const result = buyUpgrade(type);
    Haptics.notificationAsync(
      result.success
        ? Haptics.NotificationFeedbackType.Success
        : Haptics.NotificationFeedbackType.Error
    );
    if (!result.success) {
      Alert.alert('Gagal', result.message);
    }
  };

  const mt = MULTI_TAP_UPGRADES;
  const ec = ENERGY_CAP_UPGRADES;
  const rc = RECHARGE_UPGRADES;
  const lmt = gameState.multiTapLevel;
  const lec = gameState.energyCapLevel;
  const lrc = gameState.rechargeLevel;

  return (
    <BgWrapper style={[styles.container, { paddingTop: topPad }]}>
      <Text style={styles.heading}>Peningkatan</Text>
      <Text style={styles.subheading}>
        Poin kamu:{' '}
        <Text style={styles.pointsHighlight}>{fmt(gameState.points)}</Text>
      </Text>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        <UpgradeCard
          title="Multi-tap"
          subtitle="Poin per ketukan"
          icon="hand-left"
          color={COLORS.gold}
          type="multiTap"
          currentLevel={lmt}
          maxLevel={mt.length}
          currentDesc={mt[lmt].description}
          nextDesc={lmt + 1 < mt.length ? mt[lmt + 1].description : '-'}
          nextCost={lmt + 1 < mt.length ? mt[lmt + 1].cost : 0}
          userPoints={gameState.points}
          onBuy={handleBuy}
        />

        <UpgradeCard
          title="Kapasitas Energi"
          subtitle="Batas energi maksimal"
          icon="battery-charging"
          color={COLORS.blue}
          type="energyCap"
          currentLevel={lec}
          maxLevel={ec.length}
          currentDesc={ec[lec].description}
          nextDesc={lec + 1 < ec.length ? ec[lec + 1].description : '-'}
          nextCost={lec + 1 < ec.length ? ec[lec + 1].cost : 0}
          userPoints={gameState.points}
          onBuy={handleBuy}
        />

        <UpgradeCard
          title="Kecepatan Isi Ulang"
          subtitle="Energi yang diisi per detik"
          icon="flash"
          color={COLORS.amber}
          type="recharge"
          currentLevel={lrc}
          maxLevel={rc.length}
          currentDesc={rc[lrc].description}
          nextDesc={lrc + 1 < rc.length ? rc[lrc + 1].description : '-'}
          nextCost={lrc + 1 < rc.length ? rc[lrc + 1].cost : 0}
          userPoints={gameState.points}
          onBuy={handleBuy}
        />
      </ScrollView>
    </BgWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textPrimary,
    fontFamily: 'Inter_700Bold',
    paddingHorizontal: 20,
  },
  subheading: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontFamily: 'Inter_400Regular',
    paddingHorizontal: 20,
    paddingTop: 2,
    paddingBottom: 16,
  },
  pointsHighlight: {
    color: COLORS.gold,
    fontFamily: 'Inter_600SemiBold',
  },
  list: {
    paddingHorizontal: 16,
    gap: 14,
    paddingBottom: Platform.OS === 'web' ? 34 : 24,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    fontFamily: 'Inter_700Bold',
  },
  cardSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontFamily: 'Inter_400Regular',
  },
  levelBadge: {
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  levelText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  levelBarBg: {
    height: 4,
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 2,
    overflow: 'hidden',
  },
  levelBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statBox: {
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontFamily: 'Inter_400Regular',
  },
  statValue: {
    fontSize: 13,
    color: COLORS.textPrimary,
    fontFamily: 'Inter_600SemiBold',
    marginTop: 2,
  },
  buyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 10,
    paddingVertical: 11,
  },
  buyText: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    fontWeight: '700',
  },
  maxTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    justifyContent: 'center',
    paddingVertical: 8,
  },
  maxText: {
    fontSize: 13,
    color: COLORS.green,
    fontFamily: 'Inter_600SemiBold',
  },
});
