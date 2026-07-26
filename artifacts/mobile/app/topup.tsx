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
import { VIP_PACKAGES, useGame } from '@/context/GameContext';
import { COLORS } from '@/constants/colors';
import BgWrapper from '@/components/BgWrapper';
import MiniCardBg from '@/components/MiniCardBg';
import { HEADER_HEIGHT } from '@/components/PersistentHeader';

function fmt(n: number): string {
  return n.toLocaleString('id-ID');
}

export default function TopupScreen() {
  const insets = useSafeAreaInsets();
  const { gameState, addTransaction } = useGame();
  const [selected, setSelected] = useState<string | null>(null);
  const topPad = HEADER_HEIGHT + (Platform.OS === 'web' ? 8 : insets.top + 8);

  const handleBuy = (pkg: (typeof VIP_PACKAGES)[0]) => {
    Alert.alert(
      `Beli ${pkg.name}`,
      `Tambahkan ${fmt(pkg.points)} poin dengan harga Rp ${fmt(pkg.priceRupiah)}?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Konfirmasi',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            addTransaction({
              type: 'topup',
              amount: pkg.points,
              description: `Top-up ${pkg.name} – ${fmt(pkg.points)} poin`,
              status: 'pending',
            });
            Alert.alert(
              'Pembayaran Dikirim',
              `Top-up ${pkg.name} sedang diproses. Poin akan ditambahkan setelah pembayaran dikonfirmasi.`,
              [{ text: 'OK' }]
            );
          },
        },
      ]
    );
  };

  return (
    <BgWrapper>
    <ScrollView
      style={[styles.container, { paddingTop: topPad }]}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 86 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Balance */}
      <View style={styles.balanceCard}>
        <MiniCardBg radius={14} />
        <Ionicons name="wallet-outline" size={20} color={COLORS.gold} />
        <View>
          <Text style={styles.balanceLabel}>Saldo Poin Kamu</Text>
          <Text style={styles.balanceValue}>{fmt(gameState.points)} poin</Text>
        </View>
      </View>

      {/* VIP Info */}
      <View style={styles.infoCard}>
        <MiniCardBg radius={14} />
        <View style={styles.infoHeader}>
          <Ionicons name="diamond" size={20} color={COLORS.gold} />
          <Text style={styles.infoTitle}>Paket VIP AltoTap</Text>
        </View>
        <Text style={styles.infoText}>
          Tingkatkan poin kamu dengan paket VIP premium. Poin langsung masuk ke akunmu setelah pembayaran dikonfirmasi.
        </Text>
      </View>

      {/* VIP Packages */}
      <Text style={styles.sectionLabel}>Pilih Paket</Text>

      {VIP_PACKAGES.map((pkg, idx) => {
        const isSelected = selected === pkg.id;
        const colors = [COLORS.gold, COLORS.amber, COLORS.blue];
        const color = colors[idx % colors.length];
        const bonusPct = idx === 0 ? null : idx === 1 ? '+10% Bonus' : '+25% Bonus';

        return (
          <TouchableOpacity
            key={pkg.id}
            style={[styles.packageCard]}
            onPress={() => setSelected(isSelected ? null : pkg.id)}
            testID={`pkg-${pkg.id}`}
          >
            <MiniCardBg radius={14} />
            {isSelected && (
              <View style={[StyleSheet.absoluteFillObject, { backgroundColor: color + '28', borderRadius: 14 }]} />
            )}
            {bonusPct && (
              <View style={[styles.bonusBadge, { backgroundColor: color }]}>
                <Text style={styles.bonusBadgeText}>{bonusPct}</Text>
              </View>
            )}

            <View style={[styles.pkgIconBox, { backgroundColor: color + '22' }]}>
              <Ionicons name="diamond" size={26} color={color} />
            </View>

            <View style={styles.pkgInfo}>
              <Text style={[styles.pkgName, isSelected && { color }]}>{pkg.name}</Text>
              <Text style={styles.pkgPoints}>{fmt(pkg.points)} poin</Text>
            </View>

            <View style={styles.pkgPriceCol}>
              <Text style={styles.pkgPrice}>Rp {fmt(pkg.priceRupiah)}</Text>
              <TouchableOpacity
                style={[styles.buyBtn, { backgroundColor: color }]}
                onPress={() => handleBuy(pkg)}
                testID={`buy-${pkg.id}`}
              >
                <Text style={styles.buyText}>Beli</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        );
      })}

      {/* Benefits */}
      <View style={styles.benefitsCard}>
        <MiniCardBg radius={14} />
        <Text style={styles.benefitsTitle}>Keuntungan VIP</Text>
        {[
          'Poin instan tanpa grind panjang',
          'Unlock upgrade lebih cepat',
          'Mendukung pengembangan AltoTap',
          'Prioritas dalam program hadiah',
        ].map(b => (
          <View key={b} style={styles.benefitRow}>
            <Ionicons name="checkmark-circle" size={16} color={COLORS.green} />
            <Text style={styles.benefitText}>{b}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.disclaimer}>
        Pembayaran diproses oleh sistem AltoTap. Butuh bantuan? Hubungi support kami.
      </Text>
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
    gap: 14,
    paddingBottom: 32,
  },
  balanceCard: {
    borderRadius: 14,
    overflow: 'hidden',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  balanceLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    
  },
  balanceValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.gold,
    
  },
  infoCard: {
    borderRadius: 14,
    overflow: 'hidden',
    padding: 14,
    gap: 8,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    
  },
  infoText: {
    fontSize: 13,
    color: COLORS.textMuted,
    
    lineHeight: 19,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    
    paddingHorizontal: 2,
    marginBottom: -6,
  },
  packageCard: {
    borderRadius: 14,
    overflow: 'hidden',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    position: 'relative',
  },
  bonusBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderBottomLeftRadius: 10,
  },
  bonusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#000',
    
  },
  pkgIconBox: {
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  pkgInfo: {
    flex: 1,
    gap: 2,
  },
  pkgName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    
  },
  pkgPoints: {
    fontSize: 14,
    color: COLORS.textMuted,
    
  },
  pkgPriceCol: {
    alignItems: 'flex-end',
    gap: 6,
    flexShrink: 0,
  },
  pkgPrice: {
    fontSize: 13,
    color: COLORS.textSecondary,
    
  },
  buyBtn: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 8,
  },
  buyText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000000',
    
  },
  benefitsCard: {
    borderRadius: 14,
    overflow: 'hidden',
    padding: 14,
    gap: 10,
  },
  benefitsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    
    marginBottom: 2,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  benefitText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    
    flex: 1,
  },
  disclaimer: {
    fontSize: 12,
    color: COLORS.textMuted,
    
    textAlign: 'center',
    lineHeight: 18,
  },
});
