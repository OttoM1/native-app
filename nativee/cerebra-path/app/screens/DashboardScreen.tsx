import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProgress } from '../context/ProgressContext';
import { CATEGORIES, getChallengesByInterests } from '../data/challenges';
import { getRandomTip } from '../data/tips';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { useRouter } from 'expo-router';
import { MenuButton, MenuOverlay } from './MenuOverlay';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
          const router = useRouter();
      const [menuVisible, setMenuVisible] = useState(false);

  const { progress } = useProgress();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const motivationalTip = getRandomTip();
  const recommendedChallenges = getChallengesByInterests(progress.selectedInterests).slice(0, 3);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const topSkills = Object.entries(progress.skillLevels)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

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
          <Animated.View
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >



            <View style={styles.headerRow}>
              <View>
                <Text style={styles.title}>Home</Text>
                                <Text style={styles.greeting}>Welcome back!</Text>

              </View>
              <MenuButton onPress={() => setMenuVisible(true)} />
            </View>
          </Animated.View>

          {/* Stats Cards */}
          <Animated.View
            style={[
              styles.statsContainer,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            <View style={styles.statCard}>
              <LinearGradient
                colors={['white', COLORS.brand.teal]}
                style={styles.statGradient}
              >
                <Text style={styles.statValue}>{progress.totalPoints}</Text>
                <Text style={styles.statLabel}>Total Points</Text>
              </LinearGradient>
            </View>

            <View style={styles.statCard}>
              <LinearGradient
                colors={['white', COLORS.brand.teal]}
                style={styles.statGradient}
              >
                <Text style={styles.statValue}>{progress.completedChallenges.length}</Text>
                <Text style={styles.statLabel}>Completed</Text>
              </LinearGradient>
            </View>

            <View style={styles.statCard}>
              <LinearGradient
                colors={['white', COLORS.brand.teal]}
                style={styles.statGradient}
              >
                <Text style={styles.statValue}>{progress.streak}</Text>
                <Text style={styles.statLabel}>Day Streak </Text>
              </LinearGradient>
            </View>
          </Animated.View>

          {/* Motivational Tip */}
          <Animated.View
            style={[
              styles.tipCard,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            <View style={styles.tipHeader}>
              <Text style={styles.tipEmoji}></Text>
              <Text style={styles.tipTitle}>Cerebra Tip</Text>
            </View>
            <Text style={styles.tipMessage}>{motivationalTip.message}</Text>
          </Animated.View>

          {/* Top Skills */}
          {topSkills.length > 0 && (
            <Animated.View
              style={[
                styles.section,
                {
                  opacity: fadeAnim,
                },
              ]}
            >
              <Text style={styles.sectionTitle}>Your Top Skills</Text>
              {topSkills.map(([skill, level]) => (
                <View key={skill} style={styles.skillRow}>
                  <Text style={styles.skillName}>{skill}</Text>
                  <View style={styles.progressBarContainer}>
                    <View
                      style={[
                        styles.progressBar,
                        { width: `${level}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.skillLevel}>{Math.round(level)}%</Text>
                </View>
              ))}
            </Animated.View>
          )}

          {/* Quick Actions */}
          <Animated.View
            style={[
              styles.section,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            
                      <Pressable
                          onPress={() => router.push('./ChallengesScreen')}

              style={({ pressed }) => [
                styles.actionCard,
                pressed && { opacity: 0.8 },
              ]}
            >
              <View style={styles.actionIcon}>
                <Text style={styles.actionEmoji}>!</Text>
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Browse All Challenges</Text>
                <Text style={styles.actionSubtitle}>
                  Explore {CATEGORIES.length} categories
                </Text>
              </View>
              <Text style={styles.actionArrow}>→</Text>
            </Pressable>

            <Pressable
                          onPress={() => router.push('./ProgressScreen')}

              style={({ pressed }) => [
                styles.actionCard,
                pressed && { opacity: 0.8 },
              ]}
            >
              <View style={styles.actionIcon}>
                <Text style={styles.actionEmoji}>!</Text>
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>View Progress</Text>
                <Text style={styles.actionSubtitle}>
                  Track your skill levels
                </Text>
              </View>
              <Text style={styles.actionArrow}>→</Text>
            </Pressable>
          </Animated.View>

          {/* Recommended Challenges */}
          {recommendedChallenges.length > 0 && (
            <Animated.View
              style={[
                styles.section,
                {
                  opacity: fadeAnim,
                },
              ]}
            >
              <Text style={styles.sectionTitle}>Recommended for You</Text>
              {recommendedChallenges.map(challenge => {
                const category = CATEGORIES.find(c => c.id === challenge.category);
                
                return (
                  <Pressable
                        key={challenge.id}
                        onPress={() => router.push('./ChallengeDetailScreen')}
                        
                        
                        
                        //, {challengeId: challenge.id }
                  
                    style={({ pressed }) => [
                      styles.challengeCard,
                      pressed && { opacity: 0.8 },
                    ]}
                  >
                    <View
                      style={[
                        styles.challengeIcon,
                        { backgroundColor: category?.color + '20' },
                      ]}
                    >
                      <Text style={styles.challengeEmoji}>{category?.icon}</Text>
                    </View>
                    <View style={styles.challengeContent}>
                      <Text style={styles.challengeTitle}>{challenge.title}</Text>
                      <View style={styles.challengeMeta}>
                        <View
                          style={[
                            styles.difficultyBadge,
                            challenge.difficulty === 'beginner' && styles.difficultyBeginner,
                            challenge.difficulty === 'intermediate' && styles.difficultyIntermediate,
                            challenge.difficulty === 'advanced' && styles.difficultyAdvanced,
                          ]}
                        >
                          <Text style={styles.difficultyText}>
                            {challenge.difficulty}
                          </Text>
                        </View>
                        <Text style={styles.duration}>⏱ {challenge.duration}</Text>
                      </View>
                    </View>
                  </Pressable>
                );
              })}
            </Animated.View>
          )}
        </ScrollView>
      </SafeAreaView>
            <MenuOverlay visible={menuVisible} onClose={() => setMenuVisible(false)} />

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
  greeting: {
    fontSize: 16,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xl,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
    title: {
      marginBottom: SPACING.xs,
      fontSize: 56,
      textAlign: 'center',
      fontWeight: '500',
        fontFamily: 'System',
      letterSpacing: -1,
    color: COLORS.text.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xxl,
  },
  statCard: {
    flex: 1,
    marginHorizontal: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
  },
  statGradient: {
    padding: SPACING.md,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.text.disabled,
    opacity: 0.9,
  },
  tipCard: {
    backgroundColor: 'white',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xxl,
    borderWidth: 1,
    borderColor: COLORS.brand.teal,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  tipEmoji: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.brand.teal,
  },
  tipMessage: {
    fontSize: 14,
    color: COLORS.text.secondary,
    lineHeight: 20,
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
  skillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  skillName: {
    fontSize: 14,
    color: COLORS.text.primary,
    width: 100,
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.background.tertiary,
    borderRadius: BORDER_RADIUS.sm,
    overflow: 'hidden',
    marginHorizontal: SPACING.md,
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.brand.teal,
  },
  skillLevel: {
    fontSize: 12,
    color: COLORS.text.secondary,
    width: 40,
    textAlign: 'right',
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  actionEmoji: {
    fontSize: 24,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  actionSubtitle: {
    fontSize: 13,
    color: COLORS.text.secondary,
  },
  actionArrow: {
    fontSize: 20,
    color: COLORS.text.tertiary,
  },
  challengeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  challengeIcon: {
    width: 50,
    height: 50,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  challengeEmoji: {
    fontSize: 24,
  },
  challengeContent: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  challengeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
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
});