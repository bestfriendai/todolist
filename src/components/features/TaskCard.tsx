import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { colors, spacing, radius, typography, shadows, priorityColors } from '@/src/constants/theme';
import { Task, Priority } from '@/src/stores/taskStore';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface TaskCardProps {
  task: Task;
  onPress?: () => void;
  onComplete?: () => void;
  onDelete?: () => void;
  categoryColor?: string;
  categoryName?: string;
}

const SWIPE_THRESHOLD = 100;

export function TaskCard({
  task,
  onPress,
  onComplete,
  onDelete,
  categoryColor = colors.primary[500],
  categoryName,
}: TaskCardProps) {
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);
  const checkScale = useSharedValue(task.is_completed ? 1 : 0);

  const handleComplete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    checkScale.value = withSpring(task.is_completed ? 0 : 1, { damping: 12 });
    onComplete?.();
  };

  const triggerDelete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    onDelete?.();
  };

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((event) => {
      translateX.value = Math.max(-150, Math.min(0, event.translationX));
    })
    .onEnd((event) => {
      if (translateX.value < -SWIPE_THRESHOLD) {
        translateX.value = withSpring(-150);
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { scale: scale.value },
    ],
  }));

  const animatedDeleteStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-150, 0], [1, 0]),
    transform: [
      { scale: interpolate(translateX.value, [-150, 0], [1, 0.5]) },
    ],
  }));

  const animatedCheckStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
    opacity: checkScale.value,
  }));

  const priorityColor = priorityColors[task.priority as Priority];

  const formatDueDate = (dateString: string | null): string | null => {
    if (!dateString) return null;

    const date = new Date(dateString);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === now.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const isOverdue = task.due_date && !task.is_completed && new Date(task.due_date) < new Date();

  return (
    <View style={styles.container}>
      {/* Delete background */}
      <Animated.View style={[styles.deleteBackground, animatedDeleteStyle]}>
        <Pressable onPress={triggerDelete} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={24} color={colors.white} />
          <Text style={styles.deleteText}>Delete</Text>
        </Pressable>
      </Animated.View>

      <GestureDetector gesture={panGesture}>
        <AnimatedPressable
          style={[styles.card, animatedCardStyle]}
          onPress={onPress}
          onPressIn={() => {
            scale.value = withSpring(0.98, { damping: 15 });
          }}
          onPressOut={() => {
            scale.value = withSpring(1, { damping: 15 });
          }}
        >
          {/* Priority indicator */}
          <View style={[styles.priorityIndicator, { backgroundColor: priorityColor }]} />

          {/* Checkbox */}
          <Pressable onPress={handleComplete} style={styles.checkbox}>
            <View
              style={[
                styles.checkboxOuter,
                task.is_completed && { backgroundColor: colors.success.main, borderColor: colors.success.main },
              ]}
            >
              <Animated.View style={animatedCheckStyle}>
                <Ionicons name="checkmark" size={14} color={colors.white} />
              </Animated.View>
            </View>
          </Pressable>

          {/* Content */}
          <View style={styles.content}>
            <Text
              style={[
                styles.title,
                task.is_completed && styles.completedTitle,
              ]}
              numberOfLines={1}
            >
              {task.title}
            </Text>

            {task.description && (
              <Text style={styles.description} numberOfLines={1}>
                {task.description}
              </Text>
            )}

            <View style={styles.meta}>
              {categoryName && (
                <View style={[styles.categoryBadge, { backgroundColor: categoryColor + '20' }]}>
                  <View style={[styles.categoryDot, { backgroundColor: categoryColor }]} />
                  <Text style={[styles.categoryText, { color: categoryColor }]}>
                    {categoryName}
                  </Text>
                </View>
              )}

              {task.due_date && (
                <View style={styles.dueDateContainer}>
                  <Ionicons
                    name="calendar-outline"
                    size={12}
                    color={isOverdue ? colors.error.main : colors.gray[400]}
                  />
                  <Text
                    style={[
                      styles.dueDate,
                      isOverdue && styles.overdue,
                    ]}
                  >
                    {formatDueDate(task.due_date)}
                  </Text>
                </View>
              )}

              {task.tags.length > 0 && (
                <View style={styles.tagsContainer}>
                  {task.tags.slice(0, 2).map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>#{tag}</Text>
                    </View>
                  ))}
                  {task.tags.length > 2 && (
                    <Text style={styles.moreTagsText}>+{task.tags.length - 2}</Text>
                  )}
                </View>
              )}
            </View>
          </View>

          {/* Chevron */}
          <Ionicons name="chevron-forward" size={18} color={colors.gray[600]} />
        </AnimatedPressable>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.lg,
    marginVertical: spacing.xs,
  },
  deleteBackground: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 150,
    backgroundColor: colors.error.main,
    borderRadius: radius.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    alignItems: 'center',
  },
  deleteText: {
    color: colors.white,
    fontSize: typography.sizes.xs,
    marginTop: spacing.xs,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[900],
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.gray[800],
    ...shadows.sm,
  },
  priorityIndicator: {
    position: 'absolute',
    left: 0,
    top: spacing.md,
    bottom: spacing.md,
    width: 3,
    borderRadius: radius.full,
  },
  checkbox: {
    marginRight: spacing.md,
    padding: spacing.xs,
  },
  checkboxOuter: {
    width: 22,
    height: 22,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: colors.gray[600],
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginRight: spacing.sm,
  },
  title: {
    fontSize: typography.sizes.md,
    fontWeight: '600',
    color: colors.white,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: colors.gray[500],
  },
  description: {
    fontSize: typography.sizes.sm,
    color: colors.gray[400],
    marginTop: spacing.xxs,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.full,
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: spacing.xs,
  },
  categoryText: {
    fontSize: typography.sizes.xs,
    fontWeight: '500',
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
  },
  dueDate: {
    fontSize: typography.sizes.xs,
    color: colors.gray[400],
  },
  overdue: {
    color: colors.error.main,
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  tag: {
    backgroundColor: colors.gray[800],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.sm,
  },
  tagText: {
    fontSize: typography.sizes.xs,
    color: colors.gray[400],
  },
  moreTagsText: {
    fontSize: typography.sizes.xs,
    color: colors.gray[500],
  },
});

export default TaskCard;
