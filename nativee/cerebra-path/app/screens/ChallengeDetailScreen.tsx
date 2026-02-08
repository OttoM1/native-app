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
import { C, SPACING, BORDER_RADIUS } from '../constants/theme';

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
      colors={['white', 'white']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
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





          <View style={styles.skillsCard}>
            <Text style={styles.skillsTitle}>Skills You Gain</Text>
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
              styles.babyButton,
              currentStep === 0 && { flex: 1 },
              pressed && { opacity: 0.9 },
            ]}
          >
            <LinearGradient
              colors={[category?.color || C.h.link, category?.color + 'CC' || C.h.bluemint]}
              style={styles.babyButtonGradient}
            >
              <Text style={styles.babyButtonText}>
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
    borderBottomColor:C.h.mint,
  },
  backButton: {
    marginBottom: SPACING.md,
  },
  backText: {
    fontSize: 16,
    color: C.h.graphite,
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
    color: C.h.graphite,
  },
  completedBadge: {
    backgroundColor: C.h.mint,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  completedText: {
    fontSize: 12,
    fontWeight: '600',
    color: C.h.graphite,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color:C.h.baby,
    marginBottom: SPACING.sm,
  },
  description: {
    fontSize: 14,
    color: C.h.graphite,
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
    color: C.h.baby,
    marginRight: SPACING.xs,
  },
  metaValue: {
    fontSize: 13,
    color: C.h.baby,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  progressContainer: {
    marginTop: SPACING.md,
  },
  progressBar: {
    height: 6,
    backgroundColor: C.h.bluemint,
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
    color: C.h.graphite,
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
    backgroundColor: C.h.baby,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: C.h.mint,
  },
  stepHeader: {
    marginBottom: SPACING.md,
  },
  stepNumber: {
    fontSize: 12,
    color: C.h.bluemint,
    fontWeight: '700',
    marginBottom: SPACING.xs,
    textTransform: 'uppercase',
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: C.h.graphite,
  },
  stepContent: {
    fontSize: 15,
    color: C.h.graphite,
    lineHeight: 22,
    marginBottom: SPACING.md,
  },
  linkButton: {
    backgroundColor: C.h.mint + '20',
    borderWidth: 1,
    borderColor: C.h.bluemint,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
  },
  linkButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: C.h.bluemint,
  },
  codeBlock: {
    backgroundColor: C.h.baby,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    borderLeftWidth: 4,
    borderLeftColor: C.h.link,
  },
  codeText: {
    fontFamily: 'Courier',
    fontSize: 13,
    color: C.h.graphite,
    lineHeight: 20,
  },
  taskBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.h.mint + '20',
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
    color: C.h.graphite,
    fontWeight: '600',
  },
  tipsCard: {
    backgroundColor:C.h.baby,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderLeftWidth: 4,
    borderLeftColor: C.h.bluemint,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: C.h.graphite,
    marginBottom: SPACING.md,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  tipBullet: {
    fontSize: 14,
    color: C.h.bluemint,
    marginRight: SPACING.sm,
    fontWeight: '700',
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: C.h.graphite,
    lineHeight: 20,
  },
  skillsCard: {
    backgroundColor: C.h.baby,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
  },
  skillsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: C.h.graphite,
    marginBottom: SPACING.md,
  },
  skillsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.h.baby,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  skillText: {
    fontSize: 13,
    color: C.h.graphite,
    fontWeight: '600',
    marginRight: SPACING.xs,
  },
  skillPoints: {
    fontSize: 12,
    color: C.h.bluemint,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    padding: SPACING.lg,
    backgroundColor: C.h.bluemint,
    borderTopWidth: 1,
    borderTopColor: C.h.mint,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: C.h.baby,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginRight: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: C.h.graphite,
  },
  babyButton: {
    flex: 2,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
  },
  babyButtonGradient: {
    padding: SPACING.md,
    alignItems: 'center',
  },
  babyButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: C.h.graphite,
  },
  errorText: {
    fontSize: 16,
    color: C.h.graphite,
    textAlign: 'center',
  },
});