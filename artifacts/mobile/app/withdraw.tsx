import React, { useState } from 'react';
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useGame } from '@/context/GameContext';
import { COLORS } from '@/constants/colors';
import BgWrapper from '@/components/BgWrapper';

function fmt(n: number): string {
  return n.toLocaleString('id-ID');
}

const WITHDRAWAL_OPTIONS = [
  { id: 'w1', points: 10000, rupiah: 10000 },
  { id: 'w2', points: 25000, rupiah: 25000 },
  { id: 'w3', points: 50000, rupiah: 50000 },
  { id: 'w4', points: 100000, rupiah: 100000 },
];

const PAYMENT_METHODS = [
  { id: 'dana',  label: 'DANA',  image: require('@/assets/images/dana-icon.png') },
  { id: 'ovo',   label: 'OVO',   image: require('@/assets/images/ovo-icon.png') },
  { id: 'gopay', label: 'GoPay', image: require('@/assets/images/gopay-icon.png') },
];

const MIN_WITHDRAW = 10000;

export default function WithdrawScreen() {
  const insets = useSafeAreaInsets();
  const { gameState, addTransaction } = useGame();
  const [selectedOption, setSelectedOption] = useState(WITHDRAWAL_OPTIONS[0]);
  const [selectedMethod, setSelectedMethod] = useState(PAYMENT_METHODS[0]);
  const [accountNum, setAccountNum] = useState('');
  const [accountName, setAccountName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const canWithdraw =
    gameState.points >= selectedOption.points &&
    accountNum.trim().length >= 6 &&
    accountName.trim().length >= 2;

  const handleWithdraw = async () => {
    if (!canWithdraw) return;

    Alert.alert(
      'Konfirmasi Penarikan',
      `Tarik ${fmt(selectedOption.points)} poin ke ${selectedMethod.label} (${accountNum})?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Ya, Tarik',
          onPress: () => {
            setSubmitting(true);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            addTransaction({
              type: 'withdraw',
              amount: -selectedOption.points,
              description: `Penarikan via ${selectedMethod.label} – ${accountNum}`,
              status: 'pending',
            });
            setSubmitting(false);
            Alert.alert(
              'Penarikan Dikirim',
              'Permintaan penarikan kamu sedang diproses. Harap tunggu 1-3 hari kerja.',
              [{ text: 'OK' }]
            );
            setAccountNum('');
            setAccountName('');
          },
        },
      ]
    );
  };

  return (
    <BgWrapper>
    <ScrollView
      style={[styles.container, { paddingTop: topPad }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Balance */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Saldo Tersedia</Text>
        <Text style={styles.balanceValue}>{fmt(gameState.points)}</Text>
        <Text style={styles.balanceSub}>poin</Text>
        {gameState.points < MIN_WITHDRAW && (
          <View style={styles.warningRow}>
            <Ionicons name="warning" size={14} color={COLORS.amber} />
            <Text style={styles.warningText}>
              Minimum penarikan {fmt(MIN_WITHDRAW)} poin
            </Text>
          </View>
        )}
      </View>

      {/* Withdrawal amount */}
      <Text style={styles.sectionLabel}>Pilih Jumlah Penarikan</Text>
      <View style={styles.optionsGrid}>
        {WITHDRAWAL_OPTIONS.map(opt => (
          <TouchableOpacity
            key={opt.id}
            style={[
              styles.optionCard,
              selectedOption.id === opt.id && styles.optionSelected,
              gameState.points < opt.points && styles.optionDisabled,
            ]}
            onPress={() => {
              if (gameState.points >= opt.points) setSelectedOption(opt);
            }}
            testID={`withdraw-opt-${opt.id}`}
          >
            <Text
              style={[
                styles.optionPoints,
                selectedOption.id === opt.id && styles.optionSelectedText,
              ]}
            >
              {fmt(opt.points)}
            </Text>
            <Text style={styles.optionPts}>poin</Text>
            <Text style={styles.optionRupiah}>= Rp {fmt(opt.rupiah)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Payment method */}
      <Text style={styles.sectionLabel}>Metode Penarikan</Text>
      <View style={styles.methodsList}>
        {PAYMENT_METHODS.map(m => (
          <TouchableOpacity
            key={m.id}
            style={[
              styles.methodRow,
              selectedMethod.id === m.id && styles.methodSelected,
            ]}
            onPress={() => setSelectedMethod(m)}
            testID={`method-${m.id}`}
          >
            <Image
              source={m.image}
              style={styles.methodIcon}
              resizeMode="contain"
            />
            <Text style={styles.methodLabel}>{m.label}</Text>
            {selectedMethod.id === m.id && (
              <Ionicons name="checkmark-circle" size={20} color={COLORS.gold} />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Account details */}
      <Text style={styles.sectionLabel}>Detail Rekening</Text>
      <View style={styles.inputCard}>
        <TextInput
          style={styles.input}
          value={accountNum}
          onChangeText={setAccountNum}
          placeholder="Nomor rekening / nomor HP"
          placeholderTextColor={COLORS.textMuted}
          keyboardType="number-pad"
          maxLength={20}
          testID="account-number"
        />
        <View style={styles.inputDivider} />
        <TextInput
          style={styles.input}
          value={accountName}
          onChangeText={setAccountName}
          placeholder="Nama pemilik rekening"
          placeholderTextColor={COLORS.textMuted}
          autoCapitalize="words"
          maxLength={40}
          testID="account-name"
        />
      </View>

      {/* Submit */}
      <TouchableOpacity
        style={[
          styles.submitBtn,
          (!canWithdraw || submitting) && styles.submitDisabled,
        ]}
        onPress={handleWithdraw}
        disabled={!canWithdraw || submitting}
        testID="submit-withdraw"
      >
        <Ionicons
          name="arrow-up-circle"
          size={18}
          color={canWithdraw ? '#000' : COLORS.textMuted}
        />
        <Text
          style={[styles.submitText, !canWithdraw && styles.submitTextDisabled]}
        >
          Tarik {fmt(selectedOption.points)} Poin
        </Text>
      </TouchableOpacity>

      <Text style={styles.disclaimer}>
        Proses penarikan membutuhkan 1-3 hari kerja. Pastikan data rekening benar.
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
    gap: 12,
    paddingBottom: 32,
  },
  balanceCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.gold + '44',
    gap: 2,
  },
  balanceLabel: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontFamily: 'Inter_400Regular',
  },
  balanceValue: {
    fontSize: 40,
    fontWeight: '700',
    color: COLORS.gold,
    fontFamily: 'Inter_700Bold',
  },
  balanceSub: {
    fontSize: 14,
    color: COLORS.textMuted,
    fontFamily: 'Inter_400Regular',
  },
  warningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    backgroundColor: COLORS.amber + '22',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  warningText: {
    fontSize: 12,
    color: COLORS.amber,
    fontFamily: 'Inter_500Medium',
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    fontFamily: 'Inter_600SemiBold',
    paddingHorizontal: 2,
    marginBottom: -4,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionCard: {
    flex: 1,
    minWidth: '44%',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    gap: 2,
  },
  optionSelected: {
    borderColor: COLORS.gold,
    backgroundColor: COLORS.gold + '18',
  },
  optionDisabled: {
    opacity: 0.4,
  },
  optionPoints: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    fontFamily: 'Inter_700Bold',
  },
  optionSelectedText: {
    color: COLORS.gold,
  },
  optionPts: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontFamily: 'Inter_400Regular',
  },
  optionRupiah: {
    fontSize: 12,
    color: COLORS.green,
    fontFamily: 'Inter_500Medium',
    marginTop: 4,
  },
  methodsList: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  methodSelected: {
    backgroundColor: COLORS.gold + '12',
  },
  methodIcon: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: COLORS.gold + '22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodLabel: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
    fontFamily: 'Inter_500Medium',
  },
  inputCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  input: {
    paddingHorizontal: 14,
    paddingVertical: 13,
    color: COLORS.textPrimary,
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
  },
  inputDivider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  submitBtn: {
    backgroundColor: COLORS.gold,
    borderRadius: 14,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  submitDisabled: {
    backgroundColor: COLORS.surfaceVariant,
  },
  submitText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Inter_700Bold',
  },
  submitTextDisabled: {
    color: COLORS.textMuted,
  },
  disclaimer: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: 18,
  },
});
