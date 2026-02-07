import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProgress } from '../context/ProgressContext';
import { CATEGORIES } from '../data/challenges';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function ProgressScreen() {
      const router = useRouter();

  const navigation = useNavigation();
  const { progress } = useProgress();

  const skillsArray = Object.entries(progress.skillLevels).sort((a, b) => b[1] - a[1]);

  const getSkillLevel = (level: number) => {
    if (level >= 75) return { title: 'Expert', color: COLORS.accent.orange };
    if (level >= 50) return { title: 'Advanced', color: COLORS.brand.purple };
    if (level >= 25) return { title: 'Intermediate', color: COLORS.brand.teal };
    return { title: 'Beginner', color: COLORS.accent.blue };
  };

  return (
    <LinearGradient
      colors={[COLORS.background.primary, COLORS.background.secondary]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Text style={styles.backText}>← Back</Text>
            </Pressable>
            <Text style={styles.title}>Your Progress</Text>
            <Text style={styles.subtitle}>Track your skills and achievements</Text>
          </View>

          {/* Overall stats */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <LinearGradient
                colors={[COLORS.brand.purple, COLORS.brand.purpleLight]}
                style={styles.statGradient}
              >
                <Text style={styles.statValue}>{progress.totalPoints}</Text>
                <Text style={styles.statLabel}>Total Points</Text>
              </LinearGradient>
            </View>

            <View style={styles.statCard}>
              <LinearGradient
                colors={[COLORS.brand.teal, COLORS.brand.tealLight]}
                style={styles.statGradient}
              >
                <Text style={styles.statValue}>{progress.completedChallenges.length}</Text>
                <Text style={styles.statLabel}>Challenges</Text>
              </LinearGradient>
            </View>

            <View style={styles.statCard}>
              <LinearGradient
                colors={[COLORS.accent.orange, COLORS.accent.pink]}
                style={styles.statGradient}
              >
                <Text style={styles.statValue}>{progress.streak}</Text>
                <Text style={styles.statLabel}>Day Streak 🔥</Text>
              </LinearGradient>
            </View>

            <View style={styles.statCard}>
              <LinearGradient
                colors={[COLORS.accent.blue, COLORS.accent.green]}
                style={styles.statGradient}
              >
                <Text style={styles.statValue}>{Object.keys(progress.skillLevels).length}</Text>
                <Text style={styles.statLabel}>Skills</Text>
              </LinearGradient>
            </View>
          </View>

          {/* Skill breakdown */}
          {skillsArray.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Skill Breakdown</Text>
              
              {skillsArray.map(([skill, level]) => {
                const skillInfo = getSkillLevel(level);
                
                return (
                  <View key={skill} style={styles.skillCard}>
                    <View style={styles.skillHeader}>
                      <Text style={styles.skillName}>{skill}</Text>
                      <View
                        style={[
                          styles.levelBadge,
                          { backgroundColor: skillInfo.color + '30' },
                        ]}
                      >
                        <Text
                          style={[
                            styles.levelText,
                            { color: skillInfo.color },
                          ]}
                        >
                          {skillInfo.title}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.progressContainer}>
                      <View style={styles.progressBar}>
                        <LinearGradient
                          colors={[skillInfo.color, skillInfo.color + 'CC']}
                          style={[
                            styles.progressFill,
                            { width: `${level}%` },
                          ]}
                        />
                      </View>
                      <Text style={styles.progressPercent}>{Math.round(level)}%</Text>
                    </View>

                    {/* Milestone indicators */}
                    <View style={styles.milestones}>
                      {[25, 50, 75, 100].map(milestone => (
                        <View
                          key={milestone}
                          style={[
                            styles.milestone,
                            level >= milestone && {
                              backgroundColor: skillInfo.color,
                            },
                          ]}
                        >
                          {level >= milestone && (
                            <Text style={styles.milestoneCheck}>✓</Text>
                          )}
                        </View>
                      ))}
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📊</Text>
              <Text style={styles.emptyTitle}>No Progress Yet</Text>
              <Text style={styles.emptyText}>
                Complete challenges to start building your skills!
              </Text>
              <Pressable
                onPress={() => router.push('./DashboardScreen')}
            style={({ pressed }) => [
              styles.ctaButton,
              pressed && { opacity: 0.6 },
            ]}
                
              >
                <LinearGradient
                  colors={[COLORS.brand.teal, COLORS.brand.tealLight]}
                  style={styles.ctaGradient}
                >
                  <Text style={styles.ctaText}>Browse Challenges</Text>
                </LinearGradient>
              </Pressable>
            </View>
          )}

          {/* Interests */}
          {progress.selectedInterests.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Your Interests</Text>
              <View style={styles.interestsGrid}>
                {progress.selectedInterests.map(interestId => {
                  const category = CATEGORIES.find(c => c.id === interestId);
                  if (!category) return null;

                  return (
                    <View
                      key={category.id}
                      style={[
                        styles.interestCard,
                        { backgroundColor: category.color + '20' },
                      ]}
                    >
                      <Text style={styles.interestEmoji}>{category.icon}</Text>
                      <Text style={styles.interestName}>{category.name}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* Achievements (placeholder for future) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Achievements 🏆</Text>
            <View style={styles.achievementsPlaceholder}>
              <Text style={styles.placeholderEmoji}>🚧</Text>
              <Text style={styles.placeholderText}>
                Achievement system coming soon!
              </Text>
            </View>
          </View>
        </ScrollView>
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
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  header: {
    marginBottom: SPACING.xl,
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  statCard: {
    width: '48%',
    marginBottom: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
  },
  statGradient: {
    padding: SPACING.lg,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: 13,
    color: COLORS.text.primary,
    opacity: 0.9,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  skillCard: {
    backgroundColor: COLORS.background.tertiary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  skillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  skillName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  levelBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.md,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '700',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  progressBar: {
    flex: 1,
    height: 10,
    backgroundColor: COLORS.background.secondary,
    borderRadius: BORDER_RADIUS.sm,
    overflow: 'hidden',
    marginRight: SPACING.md,
  },
  progressFill: {
    height: '100%',
    borderRadius: BORDER_RADIUS.sm,
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text.secondary,
    width: 45,
    textAlign: 'right',
  },
  milestones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
  },
  milestone: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  milestoneCheck: {
    fontSize: 12,
    color: COLORS.text.primary,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: SPACING.lg,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  ctaButton: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  ctaGradient: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
  },
  ctaText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -SPACING.xs,
  },
  interestCard: {
    width: '48%',
    margin: SPACING.xs,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  interestEmoji: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  interestName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text.primary,
    textAlign: 'center',
  },
  achievementsPlaceholder: {
    backgroundColor: COLORS.background.tertiary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xxl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  placeholderEmoji: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  placeholderText: {
    fontSize: 14,
    color: COLORS.text.tertiary,
  },
});