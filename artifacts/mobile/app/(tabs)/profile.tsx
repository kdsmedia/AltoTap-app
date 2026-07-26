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
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useGame } from '@/context/GameContext';
import { useAuth } from '@/context/AuthContext';
import { COLORS } from '@/constants/colors';
import BgWrapper from '@/components/BgWrapper';

function fmt(n: number): string {
  return n.toLocaleString('id-ID');
}

function NavRow({
  icon,
  label,
  value,
  color,
  onPress,
}: {
  icon: string;
  label: string;
  value?: string;
  color?: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.navRow} onPress={onPress} testID={`nav-${label}`}>
      <View style={[styles.navIcon, { backgroundColor: (color ?? COLORS.gold) + '22' }]}>
        <Ionicons name={icon as any} size={20} color={color ?? COLORS.gold} />
      </View>
      <Text style={styles.navLabel}>{label}</Text>
      <View style={styles.navRight}>
        {value ? <Text style={styles.navValue}>{value}</Text> : null}
        <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
      </View>
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { gameState, updateUsername } = useGame();
  const { user, signOut } = useAuth();
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(gameState.username);
  const topPad = Platform.OS === 'web' ? 67 : insets.top + 8;

  const handleSignOut = () => {
    Alert.alert('Keluar', 'Yakin ingin keluar dari akun Google?', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Keluar', style: 'destructive', onPress: signOut },
    ]);
  };

  const saveUsername = () => {
    const trimmed = nameInput.trim();
    if (!trimmed) {
      Alert.alert('Error', 'Nama tidak boleh kosong');
      return;
    }
    updateUsername(trimmed);
    setEditingName(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <BgWrapper>
    <ScrollView
      style={[styles.container, { paddingTop: topPad }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Avatar & Name */}
      <View style={styles.avatarSection}>
        {user?.picture ? (
          <Image source={{ uri: user.picture }} style={styles.avatarPhoto} />
        ) : (
          <View style={styles.avatar}>
            <Text style={styles.avatarLetter}>
              {gameState.username.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}

        {editingName ? (
          <View style={styles.nameEditRow}>
            <TextInput
              style={styles.nameInput}
              value={nameInput}
              onChangeText={setNameInput}
              autoFocus
              placeholder="Masukkan nama"
              placeholderTextColor={COLORS.textMuted}
              maxLength={20}
              testID="name-input"
            />
            <TouchableOpacity style={styles.saveBtn} onPress={saveUsername}>
              <Ionicons name="checkmark" size={18} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => {
                setNameInput(gameState.username);
                setEditingName(false);
              }}
            >
              <Ionicons name="close" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.nameRow}
            onPress={() => setEditingName(true)}
            testID="edit-name"
          >
            <Text style={styles.username}>{gameState.username}</Text>
            <Ionicons name="pencil" size={14} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}

        {user?.email ? (
          <Text style={styles.emailLabel}>{user.email}</Text>
        ) : null}
        <Text style={styles.memberLabel}>Anggota AltoTap</Text>
      </View>

      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Saldo Poin</Text>
        <Text style={styles.balanceValue}>{fmt(gameState.points)}</Text>
        <View style={styles.balanceRow}>
          <View style={styles.balanceStat}>
            <Ionicons name="trending-up" size={14} color={COLORS.green} />
            <Text style={styles.balanceStatText}>{fmt(gameState.lifetimePoints)} total diperoleh</Text>
          </View>
        </View>
      </View>

      {/* Quick stats */}
      <View style={styles.statsGrid}>
        {[
          { label: 'Total Ketukan', value: fmt(gameState.totalTaps), icon: 'hand-left', color: COLORS.amber },
          { label: 'Tugas Selesai', value: `${gameState.tasksCompleted}`, icon: 'checkmark-circle', color: COLORS.green },
          { label: 'Teman Diundang', value: `${gameState.friendsInvited}`, icon: 'people', color: COLORS.blue },
          { label: 'Poin per Ketuk', value: `${gameState.pointsPerTap}`, icon: 'flash', color: COLORS.gold },
        ].map(stat => (
          <View key={stat.label} style={styles.statCard}>
            <Ionicons name={stat.icon as any} size={20} color={stat.color} />
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Navigation */}
      <View style={styles.navCard}>
        <NavRow
          icon="bar-chart"
          label="Statistik Lengkap"
          color={COLORS.blue}
          onPress={() => router.push('/stats')}
        />
        <View style={styles.divider} />
        <NavRow
          icon="diamond"
          label="Isi Ulang VIP"
          color={COLORS.gold}
          onPress={() => router.push('/topup')}
        />
        <View style={styles.divider} />
        <NavRow
          icon="wallet"
          label="Tarik Poin"
          value={`${fmt(gameState.points)} poin`}
          color={COLORS.green}
          onPress={() => router.push('/withdraw')}
        />
        <View style={styles.divider} />
        <NavRow
          icon="receipt"
          label="Riwayat Transaksi"
          color={COLORS.amber}
          onPress={() => router.push('/transactions')}
        />
        {user ? (
          <>
            <View style={styles.divider} />
            <NavRow
              icon="log-out"
              label="Keluar"
              color={COLORS.red ?? '#FF4444'}
              onPress={handleSignOut}
            />
          </>
        ) : null}
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
    paddingHorizontal: 16,
    gap: 16,
    paddingBottom: Platform.OS === 'web' ? 34 : 24,
  },
  avatarSection: {
    alignItems: 'center',
    paddingTop: 8,
    gap: 6,
  },
  avatarPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: COLORS.gold,
  },
  emailLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontFamily: 'Inter_400Regular',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.gold + '33',
    borderWidth: 2,
    borderColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.gold,
    fontFamily: 'Inter_700Bold',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  username: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    fontFamily: 'Inter_700Bold',
  },
  memberLabel: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontFamily: 'Inter_400Regular',
  },
  nameEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    paddingHorizontal: 20,
  },
  nameInput: {
    flex: 1,
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
    color: COLORS.textPrimary,
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  saveBtn: {
    backgroundColor: COLORS.gold,
    borderRadius: 10,
    padding: 10,
  },
  cancelBtn: {
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 10,
    padding: 10,
  },
  balanceCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.gold + '44',
    gap: 4,
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
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  balanceStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  balanceStatText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontFamily: 'Inter_400Regular',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '44%',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    fontFamily: 'Inter_700Bold',
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
  navCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  navIcon: {
    width: 36,
    height: 36,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
    fontFamily: 'Inter_500Medium',
  },
  navRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  navValue: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontFamily: 'Inter_400Regular',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 16,
  },
});
