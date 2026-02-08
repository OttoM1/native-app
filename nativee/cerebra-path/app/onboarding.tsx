import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProgress } from './context/ProgressContext';
import { CATEGORIES } from './data/challenges';
import { C, SPACING, BORDER_RADIUS, WEIGHT } from './constants/theme';

export default function OnboardingScreen() {
  const router = useRouter();
  const { updateInterests } = useProgress();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [scaleAnims] = useState(CATEGORIES.map(() => new Animated.Value(1)));
  const [fadeAnim] = useState(CATEGORIES.map(() => new Animated.Value(1)));
  const [pageOpacity] = useState(new Animated.Value(0));
    const [bounceAnim] = useState(new Animated.Value(0.9));


  useEffect(() => {
    Animated.timing(pageOpacity, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
 
    Animated.timing(bounceAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
     },
    []);

  const toggleInterest = (categoryId: string, index: number) => {
    Animated.sequence([
      Animated.timing(scaleAnims[index], {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnims[index], {
        toValue: 1,
        tension: 20,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim[index], {
        toValue: 1,
        duration: 1200,
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
      colors={['white', 'white']}
      style={[styles.container]}
    >
      <Animated.View style={[styles.safeArea, { opacity: pageOpacity }, {transform: [{scale: bounceAnim}] }]}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <Text style={styles.title}>Basics and Personal Data</Text>
              <Text style={styles.subtitle}>
                Select what describes you the best
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
              onPress={() => router.push('./screens/DashboardScreen')} //./screens/DashboardScreen
              style={({ pressed }) => [
                styles.button,
                pressed && { opacity: 0.6 },
              ]}
            >
              <LinearGradient
                colors={
                  selectedInterests.length === 0
                    ? ['#71d8fa', '#ecfbff']
                    : ['#71facc', 'white']
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
      </Animated.View>
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
    color: C.h.baby,
    marginBottom: SPACING.lg,

    textAlign: 'center',
    fontFamily: 'System',
    letterSpacing: -1,
  },
  subtitle: {
    marginTop: SPACING.lg,
    fontSize: 18,
    color: C.h.graphite,
    lineHeight: 24,
    fontWeight: 100,
  },
  grid: {
    marginTop: SPACING.lg,
    paddingBottom: SPACING.xxl,
    flexDirection: 'column',
    flexWrap: 'wrap',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    display: 'flex'
  },
  card: {
    width: 'auto',
    alignSelf: 'center',
    minWidth: 340,
    marginBottom:  SPACING.md,
    backgroundColor: 'white',
    borderRadius:  BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: C.h.baby,
    overflow: 'hidden',
  },
  cardSelected: {
    borderColor: C.h.mint,
    borderWidth: 1,
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
    color: C.h.graphite,
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
    color:  C.h.baby,
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
      SPACING.sm,
    marginBottom: SPACING.xxl
  },
  counterText: {
    fontSize: 14, color:
      C.h.baby
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding:  SPACING.sm,
    backgroundColor: 'transparent',
    
  },
  button: {
    borderRadius:  BORDER_RADIUS.lg,
    overflow: 'hidden',
    shadowColor: C.h.graphite,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    transform: 'scale(0.9)',
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
    color:  '#202020',
  },
  buttonTextDisabled: {
    color:  C.h.graphite
  },
});
