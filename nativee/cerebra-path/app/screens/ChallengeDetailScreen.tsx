import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProgress } from '../context/ProgressContext';
import { getChallenge, CATEGORIES } from '../data/challenges';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';

export default function ChallengeDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { progress, completeChallenge } = useProgress();
  
  const { challengeId } = route.params as { challengeId: string };
  const challenge = getChallenge(challengeId);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  if (!challenge) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Challenge not found</Text>
      </View>
    );
  }

  const category = CATEGORIES.find(c => c.id === challenge.category);
  const isCompleted = progress.completedChallenges.includes(challenge.id);
  const currentStepData = challenge.steps[currentStep];
  const isLastStep = currentStep === challenge.steps.length - 1;

  const handleStepComplete = () => {
    if (!completedSteps.includes(currentStepData.id)) {
      setCompletedSteps([...completedSteps, currentStepData.id]);
    }

    if (isLastStep) {
      // Complete the challenge
      completeChallenge(challenge.id, challenge.skillGains);
      navigation.goBack();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleLinkPress = (url?: string) => {
    if (url) {
      Linking.openURL(url);
    }
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
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backText}>← Back</Text>
          </Pressable>

          <View style={styles.headerContent}>
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: category?.color + '20' },
              ]}
            >
              <Text style={styles.categoryEmoji}>{category?.icon}</Text>
              <Text style={styles.categoryText}>{category?.name}</Text>
            </View>

            {isCompleted && (
              <View style={styles.completedBadge}>
                <Text style={styles.completedText}>✓ Completed</Text>
              </View>
            )}
          </View>

          <Text style={styles.title}>{challenge.title}</Text>
          <Text style={styles.description}>{challenge.description}</Text>

          <View style={styles.meta}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Duration:</Text>
              <Text style={styles.metaValue}>{challenge.duration}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Difficulty:</Text>
              <Text style={styles.metaValue}>{challenge.difficulty}</Text>
            </View>
          </View>

          {/* Progress bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${((currentStep + 1) / challenge.steps.length) * 100}%`,
                    backgroundColor: category?.color,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              Step {currentStep + 1} of {challenge.steps.length}
            </Text>
          </View>
        </View>

        {/* Step content */}
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.stepCard}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepNumber}>Step {currentStep + 1}</Text>
              <Text style={styles.stepTitle}>{currentStepData.title}</Text>
            </View>

            <Text style={styles.stepContent}>{currentStepData.content}</Text>

            {/* Type-specific content */}
            {currentStepData.type === 'link' && currentStepData.link && (
              <Pressable
                onPress={() => handleLinkPress(currentStepData.link)}
                style={({ pressed }) => [
                  styles.linkButton,
                  pressed && { opacity: 0.8 },
                ]}
              >
                <Text style={styles.linkButtonText}>Open Resource →</Text>
              </Pressable>
            )}

            {currentStepData.type === 'code' && currentStepData.codeSnippet && (
              <View style={styles.codeBlock}>
                <Text style={styles.codeText}>{currentStepData.codeSnippet}</Text>
              </View>
            )}

            {currentStepData.type === 'task' && (
              <View style={styles.taskBox}>
                <Text style={styles.taskEmoji}>✅</Text>
                <Text style={styles.taskText}>
                  Complete this task to move forward
                </Text>
              </View>
            )}
          </View>

          {/* Tips section */}
          {challenge.tips.length > 0 && (
            <View style={styles.tipsCard}>
              <Text style={styles.tipsTitle}> Pro Tips</Text>
              {challenge.tips.map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <Text style={styles.tipBullet}>•</Text>
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Skills you'll gain */}
          <View style={styles.skillsCard}>
            <Text style={styles.skillsTitle}>Skills You'll Gain</Text>
            <View style={styles.skillsList}>
              {challenge.skills.map((skill, index) => (
                <View key={index} style={styles.skillChip}>
                  <Text style={styles.skillText}>{skill}</Text>
                  <Text style={styles.skillPoints}>
                    +{challenge.skillGains[skill] || 0}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Navigation footer */}
        <View style={styles.footer}>
          {currentStep > 0 && (
            <Pressable
              onPress={() => setCurrentStep(currentStep - 1)}
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && { opacity: 0.7 },
              ]}
            >
              <Text style={styles.secondaryButtonText}>← Previous</Text>
            </Pressable>
          )}

          <Pressable
            onPress={handleStepComplete}
            style={({ pressed }) => [
              styles.primaryButton,
              currentStep === 0 && { flex: 1 },
              pressed && { opacity: 0.9 },
            ]}
          >
            <LinearGradient
              colors={[category?.color || COLORS.brand.purple, category?.color + 'CC' || COLORS.brand.purpleLight]}
              style={styles.primaryButtonGradient}
            >
              <Text style={styles.primaryButtonText}>
                {isLastStep ? '✓ Complete Challenge' : 'Next Step →'}
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
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
    marginBottom: SPACING.md,
  },
  backText: {
    fontSize: 16,
    color: COLORS.brand.teal,
    fontWeight: '600',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  categoryEmoji: {
    fontSize: 16,
    marginRight: SPACING.xs,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  completedBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  completedText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  description: {
    fontSize: 14,
    color: COLORS.text.secondary,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  meta: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
  },
  metaItem: {
    flexDirection: 'row',
    marginRight: SPACING.lg,
  },
  metaLabel: {
    fontSize: 13,
    color: COLORS.text.tertiary,
    marginRight: SPACING.xs,
  },
  metaValue: {
    fontSize: 13,
    color: COLORS.text.primary,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  progressContainer: {
    marginTop: SPACING.md,
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.background.tertiary,
    borderRadius: BORDER_RADIUS.sm,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: BORDER_RADIUS.sm,
  },
  progressText: {
    fontSize: 12,
    color: COLORS.text.tertiary,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: 100,
  },
  stepCard: {
    backgroundColor: COLORS.background.tertiary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  stepHeader: {
    marginBottom: SPACING.md,
  },
  stepNumber: {
    fontSize: 12,
    color: COLORS.brand.teal,
    fontWeight: '700',
    marginBottom: SPACING.xs,
    textTransform: 'uppercase',
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  stepContent: {
    fontSize: 15,
    color: COLORS.text.secondary,
    lineHeight: 22,
    marginBottom: SPACING.md,
  },
  linkButton: {
    backgroundColor: COLORS.brand.teal + '20',
    borderWidth: 1,
    borderColor: COLORS.brand.teal,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
  },
  linkButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.brand.teal,
  },
  codeBlock: {
    backgroundColor: COLORS.background.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.brand.purple,
  },
  codeText: {
    fontFamily: 'Courier',
    fontSize: 13,
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
  taskBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent.green + '20',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
  },
  taskEmoji: {
    fontSize: 20,
    marginRight: SPACING.md,
  },
  taskText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text.primary,
    fontWeight: '600',
  },
  tipsCard: {
    backgroundColor: COLORS.background.tertiary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.brand.teal,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  tipBullet: {
    fontSize: 14,
    color: COLORS.brand.teal,
    marginRight: SPACING.sm,
    fontWeight: '700',
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
  skillsCard: {
    backgroundColor: COLORS.background.tertiary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
  },
  skillsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  skillsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  skillText: {
    fontSize: 13,
    color: COLORS.text.primary,
    fontWeight: '600',
    marginRight: SPACING.xs,
  },
  skillPoints: {
    fontSize: 12,
    color: COLORS.brand.teal,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    padding: SPACING.lg,
    backgroundColor: COLORS.background.secondary,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: COLORS.background.tertiary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginRight: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text.secondary,
  },
  primaryButton: {
    flex: 2,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
  },
  primaryButtonGradient: {
    padding: SPACING.md,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
});