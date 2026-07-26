import React from 'react';
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useGame, type Task } from '@/context/GameContext';
import { COLORS } from '@/constants/colors';
import BgWrapper from '@/components/BgWrapper';

function fmt(n: number): string {
  return n.toLocaleString('id-ID');
}

function taskIcon(type: Task['type']) {
  if (type === 'social') return 'share-social';
  if (type === 'referral') return 'people';
  return 'game-controller';
}

function taskColor(type: Task['type']) {
  if (type === 'social') return COLORS.blue;
  if (type === 'referral') return COLORS.green;
  return COLORS.amber;
}

function TaskCard({ task, onClaim }: { task: Task; onClaim: () => void }) {
  const iconName = taskIcon(task.type);
  const color = taskColor(task.type);

  return (
    <View style={[styles.card, task.completed && styles.cardDone]}>
      <View style={[styles.iconBox, { backgroundColor: color + '22' }]}>
        <Ionicons name={iconName as any} size={22} color={color} />
      </View>
      <View style={styles.cardBody}>
        <Text style={[styles.cardTitle, task.completed && styles.textDone]}>
          {task.title}
        </Text>
        <Text style={styles.cardDesc}>{task.description}</Text>
        <View style={styles.rewardRow}>
          <Ionicons name="star" size={12} color={COLORS.gold} />
          <Text style={styles.rewardText}>+{fmt(task.reward)} poin</Text>
        </View>
      </View>
      {task.completed ? (
        <View style={styles.doneTag}>
          <Ionicons name="checkmark-circle" size={22} color={COLORS.green} />
        </View>
      ) : (
        <TouchableOpacity style={styles.claimBtn} onPress={onClaim} testID={`claim-${task.id}`}>
          <Text style={styles.claimText}>Klaim</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function TasksScreen() {
  const insets = useSafeAreaInsets();
  const { gameState, completeTask } = useGame();

  const completed = gameState.tasks.filter(t => t.completed).length;
  const total = gameState.tasks.length;
  const topPad = Platform.OS === 'web' ? 67 : insets.top + 8;

  const handleClaim = (taskId: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    completeTask(taskId);
  };

  return (
    <BgWrapper style={[styles.container, { paddingTop: topPad }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.heading}>Tugas</Text>
        <View style={styles.progressChip}>
          <Text style={styles.progressText}>
            {completed}/{total}
          </Text>
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

      {/* Summary */}
      <View style={styles.summaryRow}>
        <Ionicons name="trophy-outline" size={14} color={COLORS.gold} />
        <Text style={styles.summaryText}>
          {completed === total
            ? 'Semua tugas selesai!'
            : `${total - completed} tugas tersisa`}
        </Text>
      </View>

      {/* Task list */}
      <FlatList
        data={gameState.tasks}
        keyExtractor={t => t.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TaskCard task={item} onClaim={() => handleClaim(item.id)} />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </BgWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textPrimary,
    fontFamily: 'Inter_700Bold',
  },
  progressChip: {
    backgroundColor: COLORS.surfaceVariant,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  progressText: {
    fontSize: 13,
    color: COLORS.gold,
    fontFamily: 'Inter_600SemiBold',
  },
  progressBarBg: {
    height: 4,
    backgroundColor: COLORS.surfaceVariant,
    marginHorizontal: 20,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.gold,
    borderRadius: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  summaryText: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontFamily: 'Inter_400Regular',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'web' ? 34 : 16,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardDone: {
    opacity: 0.55,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardBody: {
    flex: 1,
    gap: 3,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    fontFamily: 'Inter_600SemiBold',
  },
  textDone: {
    textDecorationLine: 'line-through',
    color: COLORS.textMuted,
  },
  cardDesc: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontFamily: 'Inter_400Regular',
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  rewardText: {
    fontSize: 12,
    color: COLORS.gold,
    fontFamily: 'Inter_600SemiBold',
  },
  doneTag: {
    flexShrink: 0,
  },
  claimBtn: {
    backgroundColor: COLORS.gold,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    flexShrink: 0,
  },
  claimText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Inter_700Bold',
  },
});
