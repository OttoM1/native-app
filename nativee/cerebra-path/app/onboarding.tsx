import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProgress } from './context/ProgressContext';
import { CATEGORIES } from './data/challenges';
import { COLORS, SPACING, BORDER_RADIUS } from './constants/theme';

export default function OnboardingScreen() {
  const router = useRouter();
  const { updateInterests } = useProgress();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [scaleAnims] = useState(CATEGORIES.map(() => new Animated.Value(1)));

  const toggleInterest = (categoryId: string, index: number) => {
    Animated.sequence([
      Animated.timing(scaleAnims[index], {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnims[index], {
        toValue: 1,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();

    setSelectedInterests(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleContinue = () => {
    if (selectedInterests.length > 0) {
      updateInterests(selectedInterests);
      router.push('/');
    }
  };

  return (
    <LinearGradient
       colors={[COLORS.background.primary, COLORS.background.primary]}

      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>What do you want to learn?</Text>
            <Text style={styles.subtitle}>
              Select your interests to get personalized challenges
            </Text>
          </View>

          <View style={styles.grid}>
            {CATEGORIES.map((category, index) => {
              const isSelected = selectedInterests.includes(category.id);
              
              return (
                <Animated.View
                  key={category.id}
                  style={{ transform: [{ scale: scaleAnims[index] }] }}
                >
                  <Pressable
                    onPress={() => toggleInterest(category.id, index)}
                    style={({ pressed }) => [
                      styles.card,
                      isSelected && styles.cardSelected,
                      pressed && { opacity: 0.8 },
                    ]}
                  >
                    <View style={styles.cardContent}>
                      <View
                        style={[
                          styles.iconContainer,
                          { backgroundColor: category.color + '20' },
                        ]}
                      >
                        <Text style={styles.icon}>{category.icon}</Text>
                      </View>
                      <Text style={styles.cardTitle}>{category.name}</Text>
                      
                      {isSelected && (
                        <View
                          style={[
                            styles.checkmark,
                            { backgroundColor: category.color },
                          ]}
                        >
                          <Text style={styles.checkmarkText}>✓</Text>
                        </View>
                      )}
                    </View>

                    {isSelected && (
                      <View
                        style={[
                          styles.cardGlow,
                          { backgroundColor: category.color },
                        ]}
                      />
                    )}
                  </Pressable>
                </Animated.View>
              );
            })}
          </View>

          <View style={styles.counter}>
            <Text style={styles.counterText}>
              {selectedInterests.length} selected
            </Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            onPress={() => router.push('./screens/DashboardScreen')}
            style={({ pressed }) => [
              styles.button,
              pressed && { opacity: 0.6 },
            ]}
          >
            <LinearGradient
              colors={ 
               
                selectedInterests.length === 0
                  ? [COLORS.text.disabled, COLORS.text.disabled]
                  : [COLORS.brand.purple, COLORS.brand.purpleLight]
             }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text
                style={[
                  styles.buttonText,
                  selectedInterests.length === 0 && styles.buttonTextDisabled,
                ]}
              >
                Continue to Dashboard
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: 100
  },
  header: {
    marginBottom: SPACING.xl
  },
  title: {
    fontSize: 40,
    fontWeight: '500',
    color: COLORS.text.primary,
    marginBottom: SPACING.lg,

    textAlign: 'center',
    fontFamily: 'Georgia',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.text.secondary,
    lineHeight: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: 'auto',
    marginBottom:  SPACING.md,
    backgroundColor: 'white',
    borderRadius:  BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.hotpink,
    overflow: 'hidden',
  },
  cardSelected: {
    borderColor: COLORS.brand.teal,
    borderWidth: 2,
  },
  cardContent: {
    padding: SPACING.lg,
    alignItems: 'center',
    position: 'relative',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  icon: { fontSize: 32 },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  checkmark: {
    position: 'absolute',
    top: SPACING.sm,
    right:  SPACING.sm,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color:  COLORS.text.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  cardGlow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 0,
    opacity: 0,
  },
  counter: {
    alignItems: 'center', marginTop:
       SPACING.lg
  },
  counterText: {
    fontSize: 14, color:
      COLORS.text.tertiary
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding:  SPACING.lg,
    backgroundColor:  COLORS.background.secondary,
    borderTopWidth: 1,
    borderTopColor:  COLORS.border,
  },
  button: {
    borderRadius:  BORDER_RADIUS.lg,
    overflow: 'hidden',
    shadowColor: COLORS.brand.purple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: { shadowOpacity: 0, elevation: 0 },
  buttonPressed: { transform: [{ scale: 0.98 }] },
  buttonGradient: {
    paddingVertical:
      SPACING.lg,
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color:  COLORS.text.primary,
  },
  buttonTextDisabled: {
    color:  COLORS.text.tertiary
  },
});
