import React from 'react';
import {
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useGame } from '@/context/GameContext';
import { COLORS } from '@/constants/colors';
import BgWrapper from '@/components/BgWrapper';
import { useRewardedAd } from '@/hooks/useRewardedAd';
import MiniCardBg from '@/components/MiniCardBg';

function fmt(n: number): string {
  return n.toLocaleString('id-ID');
}

const BONUS_PER_FRIEND = 5000;

export default function FrensScreen() {
  const insets = useSafeAreaInsets();
  const { gameState } = useGame();
  const { showAd } = useRewardedAd();
  const topPad = Platform.OS === 'web' ? 67 : insets.top + 8;

  // Generate referral code based on username hash
  const referralCode = `ALTO${gameState.username
    .toUpperCase()
    .replace(/\s/g, '')
    .slice(0, 6)
    .padEnd(6, 'X')}`;
  const referralLink = `https://altotap.app/join?ref=${referralCode}`;

  /** Tonton iklan reward → lalu buka share sheet */
  const handleShare = () => {
    showAd(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      Share.share({
        message: `Ayo bergabung dengan AltoTap dan dapatkan bonus 5.000 poin!\nGunakan kode referral saya: ${referralCode}\n${referralLink}`,
        title: 'Undang Teman ke AltoTap',
      }).catch(() => {});
    });
  };

  const bonusEarned = gameState.friendsInvited * BONUS_PER_FRIEND;

  return (
    <BgWrapper>
    <ScrollView
      style={[styles.container, { paddingTop: topPad }]}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 90 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <Text style={styles.heading}>Undang Teman</Text>
      <Text style={styles.subheading}>
        Dapatkan {fmt(BONUS_PER_FRIEND)} poin untuk setiap teman yang bergabung!
      </Text>

      {/* Referral Card */}
      <View style={styles.refCard}>
        <MiniCardBg radius={16} />
        <View style={styles.refIconRow}>
          <View style={styles.refIconBg}>
            <Ionicons name="link" size={22} color={COLORS.gold} />
          </View>
          <Text style={styles.refCardTitle}>Tautan Referral Anda</Text>
        </View>

        <View style={styles.refLinkBox}>
          <Text style={styles.refLinkText} numberOfLines={1}>
            {referralLink}
          </Text>
        </View>

        <View style={styles.codeRow}>
          <View style={styles.codeBox}>
            <Text style={styles.codeLabel}>Kode Referral</Text>
            <Text style={styles.codeValue}>{referralCode}</Text>
          </View>
        </View>

        {/* Tombol share: tonton iklan → share */}
        <TouchableOpacity
          style={styles.shareBtn}
          onPress={handleShare}
          testID="share-btn"
        >
          <Ionicons name="play-circle-outline" size={18} color="#000" />
          <Ionicons name="share-social" size={18} color="#000" />
          <Text style={styles.shareText}>Bagikan Sekarang</Text>
        </TouchableOpacity>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <MiniCardBg radius={14} />
          <Ionicons name="people" size={24} color={COLORS.blue} />
          <Text style={styles.statValue}>{gameState.friendsInvited}</Text>
          <Text style={styles.statLabel}>Teman Diundang</Text>
        </View>
        <View style={styles.statCard}>
          <MiniCardBg radius={14} />
          <Ionicons name="star" size={24} color={COLORS.gold} />
          <Text style={styles.statValue}>{fmt(bonusEarned)}</Text>
          <Text style={styles.statLabel}>Bonus Diperoleh</Text>
        </View>
      </View>

      {/* How it works */}
      <View style={styles.howCard}>
        <MiniCardBg radius={16} />
        <Text style={styles.howTitle}>Cara Kerja</Text>
        {[
          { step: '1', text: 'Tonton iklan singkat untuk membuka share' },
          { step: '2', text: 'Bagikan tautan referral ke teman' },
          { step: '3', text: 'Teman mendaftar dan menggunakan kode referralmu' },
          { step: '4', text: 'Kamu mendapat 5.000 poin bonus secara otomatis' },
        ].map(item => (
          <View key={item.step} style={styles.howRow}>
            <View style={styles.stepBubble}>
              <Text style={styles.stepNum}>{item.step}</Text>
            </View>
            <Text style={styles.howText}>{item.text}</Text>
          </View>
        ))}
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
    paddingBottom: Platform.OS === 'web' ? 34 : 24,
    gap: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textPrimary,
    
    paddingHorizontal: 4,
  },
  subheading: {
    fontSize: 14,
    color: COLORS.textMuted,
    
    paddingHorizontal: 4,
    marginTop: -8,
  },
  refCard: {
    borderRadius: 16,
    overflow: 'hidden',
    padding: 16,
    gap: 12,
  },
  refIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  refIconBg: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.gold + '22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  refCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    
  },
  refLinkBox: {
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  refLinkText: {
    fontSize: 13,
    color: COLORS.textMuted,
    
  },
  codeRow: {
    alignItems: 'center',
  },
  codeBox: {
    alignItems: 'center',
    backgroundColor: COLORS.gold + '15',
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.gold + '44',
  },
  codeLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    
  },
  codeValue: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.gold,
    
    letterSpacing: 3,
  },
  shareBtn: {
    backgroundColor: COLORS.gold,
    borderRadius: 12,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  shareText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
    
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
    padding: 16,
    alignItems: 'center',
    gap: 6,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
    
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    
    textAlign: 'center',
  },
  howCard: {
    borderRadius: 16,
    overflow: 'hidden',
    padding: 16,
    gap: 12,
  },
  howTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    
  },
  howRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepBubble: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.gold + '22',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepNum: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.gold,
    
  },
  howText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    
    flex: 1,
  },
});
