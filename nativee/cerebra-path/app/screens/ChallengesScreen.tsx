import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProgress } from '../context/ProgressContext';
import { CATEGORIES, CHALLENGES, Challenge } from '../data/challenges';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { useRouter } from 'expo-router';

export default function ChallengesScreen() {
    const router = useRouter();
  const { progress } = useProgress();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredChallenges = selectedCategory
    ? CHALLENGES.filter(c => c.category === selectedCategory)
    : CHALLENGES;

  const renderChallenge = ({ item: challenge }: { item: Challenge }) => {
    const category = CATEGORIES.find(c => c.id === challenge.category);
    const isCompleted = progress.completedChallenges.includes(challenge.id);

    return (
      <Pressable
        onPress={() => router.push('./screens/ChallengesDetailScreen')}
        // , { challengeId: challenge.id }

       
       
            
        style={({ pressed }) => [
          styles.challengeCard,
          isCompleted && styles.challengeCardCompleted,
          pressed && { opacity: 0.8 },
        ]}
      >
        <View style={styles.challengeHeader}>
          <View
            style={[
              styles.categoryIcon,
              { backgroundColor: category?.color + '20' },
            ]}
          >
            <Text style={styles.categoryEmoji}>{category?.icon}</Text>
          </View>
          {isCompleted && (
            <View style={styles.completedBadge}>
              <Text style={styles.completedText}>✓ Completed</Text>
            </View>
          )}
        </View>

        <Text style={styles.challengeTitle}>{challenge.title}</Text>
        <Text style={styles.challengeDescription} numberOfLines={2}>
          {challenge.description}
        </Text>

        <View style={styles.challengeFooter}>
          <View style={styles.tags}>
            <View
              style={[
                styles.difficultyBadge,
                challenge.difficulty === 'beginner' && styles.difficultyBeginner,
                challenge.difficulty === 'intermediate' && styles.difficultyIntermediate,
                challenge.difficulty === 'advanced' && styles.difficultyAdvanced,
              ]}
            >
              <Text style={styles.difficultyText}>{challenge.difficulty}</Text>
            </View>
            <Text style={styles.duration}>⏱ {challenge.duration}</Text>
          </View>

          <View style={styles.skillTags}>
            {challenge.skills.slice(0, 2).map((skill, index) => (
              <View key={index} style={styles.skillTag}>
                <Text style={styles.skillTagText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <LinearGradient
      colors={[COLORS.background.primary, COLORS.background.secondary]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backText}>← Back</Text>
          </Pressable>
          <Text style={styles.title}>All Challenges</Text>
          <Text style={styles.subtitle}>
            {filteredChallenges.length} challenges available
          </Text>
        </View>

        {/* Category filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          <Pressable
            onPress={() => setSelectedCategory(null)}
            style={({ pressed }) => [
              styles.filterChip,
              selectedCategory === null && styles.filterChipActive,
              pressed && { opacity: 0.7 },
            ]}
          >
            <Text
              style={[
                styles.filterText,
                selectedCategory === null && styles.filterTextActive,
              ]}
            >
              All
            </Text>
          </Pressable>

          {CATEGORIES.map(category => (
            <Pressable
              key={category.id}
              onPress={() => setSelectedCategory(category.id)}
              style={({ pressed }) => [
                styles.filterChip,
                selectedCategory === category.id && styles.filterChipActive,
                selectedCategory === category.id && {
                  backgroundColor: category.color + '30',
                  borderColor: category.color,
                },
                pressed && { opacity: 0.7 },
              ]}
            >
              <Text style={styles.filterEmoji}>{category.icon}</Text>
              <Text
                style={[
                  styles.filterText,
                  selectedCategory === category.id && styles.filterTextActive,
                ]}
              >
                {category.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Challenges list */}
        <FlatList
          data={filteredChallenges}
          renderItem={renderChallenge}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    marginBottom: SPACING.sm,
  },
  backText: {
    fontSize: 16,
    color: COLORS.brand.teal,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.text.tertiary,
  },
  filterContainer: {
    maxHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterContent: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.background.tertiary,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: SPACING.sm,
  },
  filterChipActive: {
    backgroundColor: COLORS.brand.purple + '30',
    borderColor: COLORS.brand.purple,
  },
  filterEmoji: {
    fontSize: 16,
    marginRight: SPACING.xs,
  },
  filterText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    fontWeight: '600',
  },
  filterTextActive: {
    color: COLORS.text.primary,
  },
  listContent: {
    padding: SPACING.lg,
  },
  challengeCard: {
    backgroundColor: COLORS.background.tertiary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  challengeCardCompleted: {
    borderColor: COLORS.success,
    backgroundColor: COLORS.success + '10',
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryEmoji: {
    fontSize: 20,
  },
  completedBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  completedText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  challengeDescription: {
    fontSize: 14,
    color: COLORS.text.secondary,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  challengeFooter: {
    flexDirection: 'column',
  },
  tags: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  difficultyBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
    marginRight: SPACING.sm,
  },
  difficultyBeginner: {
    backgroundColor: COLORS.accent.green + '30',
  },
  difficultyIntermediate: {
    backgroundColor: COLORS.accent.yellow + '30',
  },
  difficultyAdvanced: {
    backgroundColor: COLORS.accent.orange + '30',
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.text.primary,
    textTransform: 'capitalize',
  },
  duration: {
    fontSize: 12,
    color: COLORS.text.tertiary,
  },
  skillTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillTag: {
    backgroundColor: COLORS.background.secondary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  skillTagText: {
    fontSize: 11,
    color: COLORS.text.secondary,
  },
});