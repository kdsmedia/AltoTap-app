import React from 'react';
import {
  Linking,
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
import { useGame, type Task } from '@/context/GameContext';
import { COLORS } from '@/constants/colors';
import BgWrapper from '@/components/BgWrapper';
import { useRewardedAd } from '@/hooks/useRewardedAd';
import MiniCardBg from '@/components/MiniCardBg';

const GAP = 8;
const H_PAD = 14;

function fmt(n: number): string {
  return n.toLocaleString('id-ID');
}

function taskIcon(task: Task): string {
  if (task.id === 'daily-invite-5') return 'people';
  if (task.id === 'daily-capacity') return 'battery-charging';
  if (task.id === 'daily-energy') return 'flash';
  if (task.id.startsWith('daily-ad-')) return 'play-circle';
  if (task.id === 'mandatory-youtube') return 'logo-youtube';
  if (task.id === 'mandatory-instagram') return 'logo-instagram';
  if (task.id.startsWith('mandatory-tiktok-')) return 'logo-tiktok';
  const type = task.type;
  if (type === 'social') return 'share-social';
  if (type === 'referral') return 'people';
  return 'game-controller';
}

function taskColor(task: Task): string {
  if (task.id === 'mandatory-youtube') return '#FF0033';
  if (task.id === 'mandatory-instagram') return '#E1306C';
  if (task.id.startsWith('mandatory-tiktok-')) return '#25F4EE';
  if (task.id.startsWith('daily-ad-')) return COLORS.amber;
  if (task.id === 'daily-capacity') return COLORS.blue;
  if (task.id === 'daily-energy') return COLORS.amber;
  const type = task.type;
  if (type === 'social') return COLORS.blue;
  if (type === 'referral') return COLORS.green;
  return COLORS.amber;
}

function MiniTaskCard({
  task,
  cardWidth,
  onClaim,
  onOpen,
}: {
  task: Task;
  cardWidth: number;
  onClaim: () => void;
  onOpen: () => void;
}) {
  const iconName = taskIcon(task);
  const color = taskColor(task);

  return (
    <View
      style={[
        styles.card,
        { width: cardWidth },
        task.completed && styles.cardDone,
      ]}
    >
      <MiniCardBg radius={12} />
      {/* Icon */}
      <View style={[styles.iconCircle, { backgroundColor: color + '22' }]}>
        <Ionicons name={iconName as any} size={22} color={color} />
      </View>

      {/* Title */}
      <Text style={[styles.cardTitle, task.completed && styles.textDone]} numberOfLines={2}>
        {task.title}
      </Text>

      {/* Reward */}
      <View style={styles.rewardRow}>
        <Ionicons name="star" size={10} color={COLORS.gold} />
        <Text style={styles.rewardText}>+{fmt(task.reward)}</Text>
      </View>

      {/* Spacer */}
      <View style={styles.spacer} />

      {/* Action */}
      {task.completed ? (
        <View style={styles.doneRow}>
          <Ionicons name="checkmark-circle" size={20} color={COLORS.green} />
        </View>
      ) : task.link ? (
        /* Task with link: tonton iklan → buka link & selesaikan tugas */
        <TouchableOpacity style={[styles.openBtn, { borderColor: color }]} onPress={onOpen}>
          <Ionicons name="play-circle-outline" size={13} color={color} />
          <Text style={[styles.openBtnText, { color }]}>Buka</Text>
        </TouchableOpacity>
      ) : (
        /* Task tanpa link: tonton iklan → klaim reward */
        <TouchableOpacity style={styles.claimBtn} onPress={onClaim} testID={`claim-${task.id}`}>
          <Ionicons name="play-circle-outline" size={13} color="#000" />
          <Text style={styles.claimText}>Klaim</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function SectionGrid({
  tasks,
  cardWidth,
  onClaim,
  onOpen,
}: {
  tasks: Task[];
  cardWidth: number;
  onClaim: (id: string) => void;
  onOpen: (id: string, link: string) => void;
}) {
  return (
    <View style={styles.grid}>
      {tasks.map(task => (
        <MiniTaskCard
          key={task.id}
          task={task}
          cardWidth={cardWidth}
          onClaim={() => onClaim(task.id)}
          onOpen={() => onOpen(task.id, task.link!)}
        />
      ))}
    </View>
  );
}

export default function TasksScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { gameState, completeTask } = useGame();
  const { showAd } = useRewardedAd();

  const cardWidth = Math.floor((width - H_PAD * 2 - GAP * 2) / 3);
  const completed = gameState.tasks.filter(t => t.completed).length;
  const total = gameState.tasks.length;
  const topPad = Platform.OS === 'web' ? 67 : insets.top + 8;

  /** Tombol "Klaim" — tonton iklan dulu, lalu berikan reward */
  const handleClaim = (taskId: string) => {
    showAd(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      completeTask(taskId);
    });
  };

  /** Tombol "Buka" — tonton iklan dulu, lalu buka link & selesaikan tugas */
  const handleOpen = (taskId: string, link: string) => {
    showAd(() => {
      Linking.openURL(link).catch(() => {});
      completeTask(taskId);
    });
  };

  const dailyTasks = gameState.tasks.filter(t => t.section === 'daily');
  const mandatoryTasks = gameState.tasks.filter(t => t.section === 'mandatory');

  return (
    <BgWrapper style={[styles.container, { paddingTop: topPad }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.heading}>Tugas</Text>
        <View style={styles.progressChip}>
          <Text style={styles.progressText}>{completed}/{total}</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressBarBg}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${(completed / total) * 100}%` as unknown as number },
          ]}
        />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Platform.OS === 'web' ? 34 : insets.bottom + 90 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Daily section */}
        <View style={styles.sectionTitleRow}>
          <Ionicons name="calendar-outline" size={15} color={COLORS.amber} />
          <Text style={styles.sectionTitle}>Tugas Harian</Text>
          <Text style={styles.sectionCount}>{dailyTasks.length}</Text>
        </View>
        <SectionGrid
          tasks={dailyTasks}
          cardWidth={cardWidth}
          onClaim={handleClaim}
          onOpen={handleOpen}
        />

        {/* Mandatory section */}
        <View style={[styles.sectionTitleRow, { marginTop: 18 }]}>
          <Ionicons name="ribbon-outline" size={15} color={COLORS.gold} />
          <Text style={styles.sectionTitle}>Tugas Wajib</Text>
          <Text style={styles.sectionCount}>{mandatoryTasks.length}</Text>
        </View>
        <SectionGrid
          tasks={mandatoryTasks}
          cardWidth={cardWidth}
          onClaim={handleClaim}
          onOpen={handleOpen}
        />
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
    paddingBottom: 8,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
    
  },
  progressChip: {
    backgroundColor: COLORS.surfaceVariant,
    paddingHorizontal: 11,
    paddingVertical: 4,
    borderRadius: 20,
  },
  progressText: {
    fontSize: 12,
    color: COLORS.gold,
    
  },
  progressBarBg: {
    height: 3,
    backgroundColor: COLORS.surfaceVariant,
    marginHorizontal: H_PAD,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 14,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.gold,
    borderRadius: 2,
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
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    
  },
  sectionCount: {
    fontSize: 11,
    color: COLORS.textMuted,
    
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
  },
  /* Mini card */
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    padding: 10,
    alignItems: 'center',
    gap: 5,
    minHeight: 148,
  },
  cardDone: {
    opacity: 0.5,
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
    
    textAlign: 'center',
    lineHeight: 15,
  },
  textDone: {
    textDecorationLine: 'line-through',
    color: COLORS.textMuted,
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  rewardText: {
    fontSize: 10,
    color: COLORS.gold,
    
  },
  spacer: { flex: 1 },
  doneRow: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  claimBtn: {
    backgroundColor: COLORS.gold,
    borderRadius: 7,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: 'stretch',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  claimText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000',
    
  },
  openBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderWidth: 1,
    borderRadius: 7,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: 'stretch',
  },
  openBtnText: {
    fontSize: 12,
    fontWeight: '700',
    
  },
});
