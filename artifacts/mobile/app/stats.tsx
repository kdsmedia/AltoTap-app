import React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useGame } from '@/context/GameContext';
import { COLORS } from '@/constants/colors';
import { MULTI_TAP_UPGRADES, ENERGY_CAP_UPGRADES, RECHARGE_UPGRADES } from '@/context/GameContext';
import BgWrapper from '@/components/BgWrapper';

function fmt(n: number): string {
  return n.toLocaleString('id-ID');
}

function StatRow({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <View style={styles.statRow}>
      <View style={[styles.statIcon, { backgroundColor: (color ?? COLORS.gold) + '22' }]}>
        <Ionicons name={icon as any} size={18} color={color ?? COLORS.gold} />
      </View>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, { color: color ?? COLORS.gold }]}>{value}</Text>
    </View>
  );
}

export default function StatsScreen() {
  const insets = useSafeAreaInsets();
  const { gameState } = useGame();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const multiTap = MULTI_TAP_UPGRADES[gameState.multiTapLevel];
  const energyCap = ENERGY_CAP_UPGRADES[gameState.energyCapLevel];
  const recharge = RECHARGE_UPGRADES[gameState.rechargeLevel];

  const completedTasks = gameState.tasks.filter(t => t.completed).length;

  return (
    <BgWrapper>
    <ScrollView
      style={[styles.container, { paddingTop: topPad }]}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 86 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Gameplay stats */}
      <Text style={styles.sectionTitle}>Statistik Permainan</Text>
      <View style={styles.card}>
        <StatRow icon="hand-left" label="Total Ketukan" value={fmt(gameState.totalTaps)} color={COLORS.amber} />
        <View style={styles.divider} />
        <StatRow icon="star" label="Total Poin Diperoleh" value={fmt(gameState.lifetimePoints)} color={COLORS.gold} />
        <View style={styles.divider} />
        <StatRow icon="wallet" label="Poin Saat Ini" value={fmt(gameState.points)} color={COLORS.green} />
        <View style={styles.divider} />
        <StatRow icon="checkmark-circle" label="Tugas Selesai" value={`${completedTasks} / ${gameState.tasks.length}`} color={COLORS.blue} />
        <View style={styles.divider} />
        <StatRow icon="people" label="Teman Diundang" value={fmt(gameState.friendsInvited)} color={COLORS.blue} />
      </View>

      {/* Upgrade levels */}
      <Text style={styles.sectionTitle}>Level Peningkatan</Text>
      <View style={styles.card}>
        <StatRow
          icon="hand-left"
          label="Multi-tap"
          value={`${multiTap.label} (${multiTap.value} poin/ketuk)`}
          color={COLORS.gold}
        />
        <View style={styles.divider} />
        <StatRow
          icon="battery-charging"
          label="Kapasitas Energi"
          value={`${energyCap.label} (${fmt(energyCap.value)})`}
          color={COLORS.blue}
        />
        <View style={styles.divider} />
        <StatRow
          icon="flash"
          label="Isi Ulang Energi"
          value={`${recharge.label} (${recharge.value}/detik)`}
          color={COLORS.amber}
        />
      </View>

      {/* Transactions summary */}
      <Text style={styles.sectionTitle}>Ringkasan Transaksi</Text>
      <View style={styles.card}>
        <StatRow
          icon="receipt"
          label="Total Transaksi"
          value={fmt(gameState.transactions.length)}
          color={COLORS.amber}
        />
        <View style={styles.divider} />
        <StatRow
          icon="arrow-up-circle"
          label="Penarikan"
          value={fmt(gameState.transactions.filter(t => t.type === 'withdraw').length)}
          color={COLORS.red}
        />
        <View style={styles.divider} />
        <StatRow
          icon="arrow-down-circle"
          label="Top-up VIP"
          value={fmt(gameState.transactions.filter(t => t.type === 'topup').length)}
          color={COLORS.green}
        />
      </View>
    </ScrollView>
    </BgWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 10,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    
    marginTop: 6,
    marginBottom: 2,
    paddingHorizontal: 4,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  statIcon: {
    width: 34,
    height: 34,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  statLabel: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textSecondary,
    
  },
  statValue: {
    fontSize: 14,
    
    fontWeight: '600',
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 14,
  },
});
