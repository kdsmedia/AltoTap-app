import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BgWrapper from '@/components/BgWrapper';
import { COLORS } from '@/constants/colors';

export default function SpinScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <BgWrapper style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Roda Spin Bonus</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Placeholder — roda spin akan dipasang di sini */}
      <View style={styles.placeholder}>
        <Ionicons name="gift" size={72} color={COLORS.gold} />
        <Text style={styles.placeholderTitle}>Segera Hadir!</Text>
        <Text style={styles.placeholderSub}>
          Gambar roda spin belum dikirim.{'\n'}Kirim gambar roda untuk melanjutkan.
        </Text>
      </View>
    </BgWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: COLORS.surfaceVariant,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 32,
  },
  placeholderTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.gold,
    
  },
  placeholderSub: {
    fontSize: 14,
    color: COLORS.textMuted,
    
    textAlign: 'center',
    lineHeight: 22,
  },
});
