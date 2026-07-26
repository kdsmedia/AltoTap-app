import React from 'react';
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useGame, type Transaction } from '@/context/GameContext';
import { COLORS } from '@/constants/colors';
import BgWrapper from '@/components/BgWrapper';
import MiniCardBg from '@/components/MiniCardBg';

function fmt(n: number): string {
  return Math.abs(n).toLocaleString('id-ID');
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function txIcon(type: Transaction['type']): string {
  switch (type) {
    case 'topup': return 'arrow-down-circle';
    case 'withdraw': return 'arrow-up-circle';
    case 'reward': return 'star';
    case 'upgrade': return 'flash';
    default: return 'swap-horizontal';
  }
}

function txColor(type: Transaction['type']): string {
  switch (type) {
    case 'topup': return COLORS.green;
    case 'withdraw': return COLORS.red;
    case 'reward': return COLORS.gold;
    case 'upgrade': return COLORS.amber;
    default: return COLORS.blue;
  }
}

function txLabel(type: Transaction['type']): string {
  switch (type) {
    case 'topup': return 'Top-up VIP';
    case 'withdraw': return 'Penarikan';
    case 'reward': return 'Hadiah Tugas';
    case 'upgrade': return 'Upgrade';
    default: return 'Transaksi';
  }
}

function statusColor(status: Transaction['status']): string {
  switch (status) {
    case 'completed': return COLORS.green;
    case 'pending': return COLORS.amber;
    case 'rejected': return COLORS.red;
    default: return COLORS.textMuted;
  }
}

function statusLabel(status: Transaction['status']): string {
  switch (status) {
    case 'completed': return 'Selesai';
    case 'pending': return 'Diproses';
    case 'rejected': return 'Ditolak';
    default: return status;
  }
}

function TxCard({ tx }: { tx: Transaction }) {
  const color = txColor(tx.type);
  const isPositive = tx.amount > 0;

  return (
    <View style={styles.card}>
      <MiniCardBg radius={14} />
      <View style={[styles.txIcon, { backgroundColor: color + '22' }]}>
        <Ionicons name={txIcon(tx.type) as any} size={20} color={color} />
      </View>
      <View style={styles.txBody}>
        <Text style={styles.txType}>{txLabel(tx.type)}</Text>
        <Text style={styles.txDesc} numberOfLines={1}>{tx.description}</Text>
        <Text style={styles.txDate}>{formatDate(tx.date)}</Text>
      </View>
      <View style={styles.txRight}>
        <Text style={[styles.txAmount, { color: isPositive ? COLORS.green : COLORS.red }]}>
          {isPositive ? '+' : '-'}{fmt(tx.amount)}
        </Text>
        <Text style={styles.txAmountSub}>poin</Text>
        <View style={[styles.statusChip, { backgroundColor: statusColor(tx.status) + '22' }]}>
          <Text style={[styles.statusText, { color: statusColor(tx.status) }]}>
            {statusLabel(tx.status)}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function TransactionsScreen() {
  const insets = useSafeAreaInsets();
  const { gameState } = useGame();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  return (
    <BgWrapper style={[styles.container, { paddingTop: topPad }]}>
      {gameState.transactions.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="receipt-outline" size={48} color={COLORS.textMuted} />
          <Text style={styles.emptyTitle}>Belum ada transaksi</Text>
          <Text style={styles.emptyText}>
            Transaksi top-up, penarikan, dan hadiah tugas akan muncul di sini
          </Text>
        </View>
      ) : (
        <FlatList
          data={gameState.transactions}
          keyExtractor={tx => tx.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <TxCard tx={item} />}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </BgWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    borderRadius: 14,
    overflow: 'hidden',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  txIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  txBody: {
    flex: 1,
    gap: 2,
  },
  txType: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    
  },
  txDesc: {
    fontSize: 12,
    color: COLORS.textMuted,
    
  },
  txDate: {
    fontSize: 11,
    color: COLORS.textMuted,
    
    marginTop: 2,
  },
  txRight: {
    alignItems: 'flex-end',
    gap: 2,
    flexShrink: 0,
  },
  txAmount: {
    fontSize: 16,
    fontWeight: '700',
    
  },
  txAmountSub: {
    fontSize: 10,
    color: COLORS.textMuted,
    
  },
  statusChip: {
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginTop: 4,
  },
  statusText: {
    fontSize: 10,
    
    fontWeight: '600',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    
  },
  emptyText: {
    fontSize: 13,
    color: COLORS.textMuted,
    
    textAlign: 'center',
    lineHeight: 19,
  },
});
