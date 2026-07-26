import React from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import {
  ENERGY_CAP_UPGRADES,
  MULTI_TAP_UPGRADES,
  RECHARGE_UPGRADES,
  AUTO_TAP_ROBOTS,
  useGame,
} from '@/context/GameContext';
import { COLORS } from '@/constants/colors';
import BgWrapper from '@/components/BgWrapper';

const GAP = 8;
const H_PAD = 14;

function fmt(n: number): string {
  return n.toLocaleString('id-ID');
}

function formatRemaining(until: number): string {
  const seconds = Math.max(0, Math.ceil((until - Date.now()) / 1000));
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
}

type UpgradeType = 'multiTap' | 'energyCap' | 'recharge';

/* ── Upgrade mini card ── */
function UpgradeMiniCard({
  title,
  icon,
  color,
  currentLevel,
  maxLevel,
  nextCost,
  userPoints,
  type,
  cardWidth,
  onBuy,
}: {
  title: string;
  icon: string;
  color: string;
  currentLevel: number;
  maxLevel: number;
  nextCost: number;
  userPoints: number;
  type: UpgradeType;
  cardWidth: number;
  onBuy: (type: UpgradeType) => void;
}) {
  const isMax = currentLevel >= maxLevel - 1;
  const canAfford = userPoints >= nextCost;
  const progress = (currentLevel + 1) / maxLevel;

  return (
    <View style={[styles.card, { width: cardWidth }]}>
      {/* Icon */}
      <View style={[styles.iconCircle, { backgroundColor: color + '22' }]}>
        <Ionicons name={icon as any} size={22} color={color} />
      </View>

      {/* Title */}
      <Text style={styles.cardTitle} numberOfLines={2}>
        {title}
      </Text>

      {/* Level */}
      <View style={[styles.levelBadge, { borderColor: color }]}>
        <Text style={[styles.levelText, { color }]}>
          {currentLevel + 1}/{maxLevel}
        </Text>
      </View>

      {/* Progress bar */}
      <View style={styles.barBg}>
        <View
          style={[
            styles.barFill,
            {
              width: `${progress * 100}%` as unknown as number,
              backgroundColor: color,
            },
          ]}
        />
      </View>

      {/* Spacer */}
      <View style={styles.spacer} />

      {/* Action */}
      {isMax ? (
        <View style={styles.maxTag}>
          <Ionicons name="checkmark-circle" size={14} color={COLORS.green} />
          <Text style={styles.maxText}>MAX</Text>
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
          <Ionicons name="flash" size={11} color={canAfford ? '#000' : COLORS.textMuted} />
          <Text style={[styles.buyText, { color: canAfford ? '#000' : COLORS.textMuted }]}>
            {fmt(nextCost)}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

/* ── Robot mini card ── */
function RobotMiniCard({
  robot,
  isActive,
  activeRobot,
  userPoints,
  autoTapUntil,
  cardWidth,
  onRent,
}: {
  robot: (typeof AUTO_TAP_ROBOTS)[number];
  isActive: boolean;
  activeRobot: (typeof AUTO_TAP_ROBOTS)[number] | undefined;
  userPoints: number;
  autoTapUntil: number | null;
  cardWidth: number;
  onRent: (id: string) => void;
}) {
  const canAfford = userPoints >= robot.cost;
  const blocked = !!activeRobot && !isActive;

  return (
    <View
      style={[
        styles.card,
        { width: cardWidth },
        isActive && styles.cardActive,
      ]}
    >
      {/* Icon */}
      <View style={[styles.iconCircle, { backgroundColor: COLORS.gold + '22' }]}>
        <Ionicons name={robot.icon as any} size={22} color={COLORS.gold} />
      </View>

      {/* Name */}
      <Text style={styles.cardTitle} numberOfLines={1}>
        {robot.name}
      </Text>

      {/* Duration */}
      <Text style={styles.durationText}>{robot.durationMinutes} mnt</Text>

      {/* Spacer */}
      <View style={styles.spacer} />

      {/* Action */}
      {isActive && autoTapUntil ? (
        <View style={styles.activeBadge}>
          <Ionicons name="checkmark-circle" size={14} color={COLORS.green} />
          <Text style={styles.activeText}>{formatRemaining(autoTapUntil)}</Text>
        </View>
      ) : (
        <TouchableOpacity
          style={[
            styles.buyBtn,
            {
              backgroundColor:
                canAfford && !blocked ? COLORS.gold : COLORS.surfaceVariant,
            },
          ]}
          onPress={() => onRent(robot.id)}
          disabled={!canAfford || blocked}
          testID={`rent-${robot.id}`}
        >
          <Text
            style={[
              styles.buyText,
              { color: canAfford && !blocked ? '#000' : COLORS.textMuted },
            ]}
          >
            {fmt(robot.cost)}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function UpgradesScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { gameState, buyUpgrade, rentAutoTap } = useGame();
  const topPad = Platform.OS === 'web' ? 67 : insets.top + 8;

  const cardWidth = Math.floor((width - H_PAD * 2 - GAP * 2) / 3);

  const handleBuy = (type: UpgradeType) => {
    const result = buyUpgrade(type);
    Haptics.notificationAsync(
      result.success
        ? Haptics.NotificationFeedbackType.Success
        : Haptics.NotificationFeedbackType.Error
    );
    if (!result.success) Alert.alert('Gagal', result.message);
  };

  const handleRent = (robotId: string) => {
    const result = rentAutoTap(robotId);
    Haptics.notificationAsync(
      result.success
        ? Haptics.NotificationFeedbackType.Success
        : Haptics.NotificationFeedbackType.Error
    );
    if (!result.success) Alert.alert('Gagal', result.message);
  };

  const mt = MULTI_TAP_UPGRADES;
  const ec = ENERGY_CAP_UPGRADES;
  const rc = RECHARGE_UPGRADES;
  const lmt = gameState.multiTapLevel;
  const lec = gameState.energyCapLevel;
  const lrc = gameState.rechargeLevel;

  const activeRobot =
    gameState.autoTapUntil && gameState.autoTapUntil > Date.now()
      ? AUTO_TAP_ROBOTS.find(r => r.id === gameState.autoTapRobotId)
      : undefined;

  return (
    <BgWrapper style={[styles.container, { paddingTop: topPad }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.heading}>Peningkatan</Text>
        <View style={styles.pointsChip}>
          <Ionicons name="star" size={12} color={COLORS.gold} />
          <Text style={styles.pointsText}>{fmt(gameState.points)}</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Platform.OS === 'web' ? 34 : insets.bottom + 90 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Upgrades section */}
        <View style={styles.sectionTitleRow}>
          <Ionicons name="trending-up" size={15} color={COLORS.gold} />
          <Text style={styles.sectionTitle}>Upgrade</Text>
        </View>
        <View style={styles.grid}>
          <UpgradeMiniCard
            title="Multi-tap"
            icon="hand-left"
            color={COLORS.gold}
            type="multiTap"
            currentLevel={lmt}
            maxLevel={mt.length}
            nextCost={lmt + 1 < mt.length ? mt[lmt + 1].cost : 0}
            userPoints={gameState.points}
            cardWidth={cardWidth}
            onBuy={handleBuy}
          />
          <UpgradeMiniCard
            title="Kapasitas Energi"
            icon="battery-charging"
            color={COLORS.blue}
            type="energyCap"
            currentLevel={lec}
            maxLevel={ec.length}
            nextCost={lec + 1 < ec.length ? ec[lec + 1].cost : 0}
            userPoints={gameState.points}
            cardWidth={cardWidth}
            onBuy={handleBuy}
          />
          <UpgradeMiniCard
            title="Isi Energi"
            icon="flash"
            color={COLORS.amber}
            type="recharge"
            currentLevel={lrc}
            maxLevel={rc.length}
            nextCost={lrc + 1 < rc.length ? rc[lrc + 1].cost : 0}
            userPoints={gameState.points}
            cardWidth={cardWidth}
            onBuy={handleBuy}
          />
        </View>

        {/* Robots section */}
        <View style={[styles.sectionTitleRow, { marginTop: 18 }]}>
          <Ionicons name="hardware-chip-outline" size={15} color={COLORS.gold} />
          <Text style={styles.sectionTitle}>Sewa Auto Tap</Text>
        </View>
        <View style={styles.grid}>
          {AUTO_TAP_ROBOTS.map(robot => {
            const isActive =
              gameState.autoTapRobotId === robot.id &&
              !!gameState.autoTapUntil &&
              gameState.autoTapUntil > Date.now();
            return (
              <RobotMiniCard
                key={robot.id}
                robot={robot}
                isActive={isActive}
                activeRobot={activeRobot}
                userPoints={gameState.points}
                autoTapUntil={gameState.autoTapUntil}
                cardWidth={cardWidth}
                onRent={handleRent}
              />
            );
          })}
        </View>
      </ScrollView>
    </BgWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: H_PAD,
    paddingBottom: 12,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
    fontFamily: 'Inter_700Bold',
  },
  pointsChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.surfaceVariant,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  pointsText: {
    fontSize: 12,
    color: COLORS.gold,
    fontFamily: 'Inter_600SemiBold',
  },
  scrollContent: {
    paddingHorizontal: H_PAD,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    fontFamily: 'Inter_700Bold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
  },
  /* Mini card */
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 10,
    alignItems: 'center',
    gap: 5,
    minHeight: 152,
  },
  cardActive: {
    borderColor: COLORS.green + '88',
    backgroundColor: COLORS.green + '12',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textPrimary,
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
    lineHeight: 15,
  },
  levelBadge: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  levelText: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
  },
  barBg: {
    height: 3,
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 2,
    overflow: 'hidden',
    alignSelf: 'stretch',
  },
  barFill: {
    height: '100%',
    borderRadius: 2,
  },
  spacer: { flex: 1 },
  maxTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 5,
  },
  maxText: {
    fontSize: 11,
    color: COLORS.green,
    fontFamily: 'Inter_700Bold',
  },
  buyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderRadius: 7,
    paddingVertical: 7,
    alignSelf: 'stretch',
  },
  buyText: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    fontWeight: '700',
  },
  durationText: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontFamily: 'Inter_400Regular',
  },
  activeBadge: {
    alignItems: 'center',
    gap: 2,
    paddingVertical: 4,
  },
  activeText: {
    fontSize: 11,
    color: COLORS.green,
    fontFamily: 'Inter_700Bold',
  },
});
