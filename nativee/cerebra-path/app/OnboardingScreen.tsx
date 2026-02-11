import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProgress } from './context/ProgressContext';
import { C, SPACING, BORDER_RADIUS } from './constants/theme';

const CATEGORIES = [
  { id: 'Casual', icon: '😄', group: 0 },
  { id: 'Serious', icon: '💪', group: 0 },
  { id: 'Short Game', icon: '⛳', group: 1 },
  { id: 'Long Range', icon: '🏌️', group: 1 },
  { id: 'Under 30min', icon: '⚡', group: 2 },
  { id: 'Over 30min', icon: '🗿', group: 2 },
];

const GROUP_TITLES = [
  'Use Objective',
  'Main Weakness',
  'Session Length',
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { updateInterests } = useProgress();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const [cardAnims] = useState(CATEGORIES.map(() => new Animated.Value(1)));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const toggleInterest = (categoryId: string, index: number) => {

    Animated.sequence([
      Animated.timing(cardAnims[index], {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(cardAnims[index], {
        toValue: 1,
        tension: 200,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    const category = CATEGORIES[index];
    const groupItems = CATEGORIES.filter(c => c.group === category.group).map(c => c.id);

    setSelectedInterests(prev => {
      const withoutGroup = prev.filter(id => !groupItems.includes(id));
      if (prev.includes(categoryId)) {
        return withoutGroup; 
      }
      return [...withoutGroup, categoryId]; 
    });
  };

  const handleContinue = () => {
    if (selectedInterests.length < 3) {
      alert('Please select one option from each category');
      return;
    }
    updateInterests(selectedInterests);
    router.push('./screens/DashboardScreen');
  };

  const renderGroup = (groupIndex: number) => {
    const groupCategories = CATEGORIES.filter(c => c.group === groupIndex);
    
    return (
      <View key={groupIndex} style={styles.section}>
        <Text style={styles.sectionTitle}>{GROUP_TITLES[groupIndex]}</Text>
        
        <View style={styles.cardRow}>
          {groupCategories.map((category, localIndex) => {
            const globalIndex = CATEGORIES.findIndex(c => c.id === category.id);
            const isSelected = selectedInterests.includes(category.id);
            
            return (
              <Animated.View
                key={category.id}
                style={[
                  styles.cardWrapper,
                  { transform: [{ scale: cardAnims[globalIndex] }] },
                ]}
              >
                <Pressable
                  onPress={() => toggleInterest(category.id, globalIndex)}
                  style={({ pressed }) => [
                    styles.card,
                    isSelected && styles.cardSelected,
                    pressed && { opacity: 0.9 },
                  ]}
                >
                  {isSelected && (
                    <View style={styles.cardGlowOverlay} />
                  )}

                  <View style={styles.cardContent}>


                    <View style={styles.iconContainer}>
                      <Text style={styles.icon}>{category.icon}</Text>
                    </View>


                    <Text style={styles.cardTitle}>{category.id}</Text>

                    {isSelected && (
                      <View style={styles.checkmark}>
                        <Text style={styles.checkmarkText}>✓</Text>
                      </View>
                    )}
                  </View>

                  {isSelected && (
                    <View style={styles.cardGlowBottom} />
                  )}
                </Pressable>
              </Animated.View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={["#101010", "#101010", "#050505", "#000", "#000"]}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.container}
    >
      <View style={styles.particlesContainer}>
        {[...Array(15)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.particle,
              {
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.3,
              },
            ]}
          />
        ))}
      </View>

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.title}>Lets Get Started</Text>
            <Text style={styles.subtitle}>Choose one from each category</Text>
          </Animated.View>

          <Animated.View style={{ opacity: fadeAnim }}>
            {[0, 1, 2].map(groupIndex => renderGroup(groupIndex))}
          </Animated.View>

          <View style={styles.counter}>
            <Text style={styles.counterText}>
              {selectedInterests.length} of 3 selected
            </Text>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            onPress={handleContinue}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
          >
            <LinearGradient
              colors={
                selectedInterests.length < 3
                  ? ['rgba(0, 0, 0, 0.7)', 'rgba(0, 0, 0, 0.4)']
                  : ['#000', '#000']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text
                style={[
                  styles.buttonText,
                  selectedInterests.length < 3 && styles.buttonTextDisabled,
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
  container: {
    flex: 1,
  },
  particlesContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  particle: {
    position: 'absolute',
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: C.h.bluemint,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxl,
    paddingBottom: 120, 
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xxl * 1.5,
  },
  title: {
    fontSize: 42,
    fontWeight: '700',
    color: C.h.bluemint,
    textAlign: 'center',
    marginBottom: SPACING.md,
    fontFamily: 'System',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 15,
    color: C.h.graphite,
    textAlign: 'center',
    opacity: 0.8,
  },
  section: {
    marginBottom: SPACING.xxl * 1.5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: C.h.graphite,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    fontFamily: 'System',
    letterSpacing: -0.5,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  cardWrapper: {
    flex: 1,
  },
  card: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: 'rgba(113, 216, 250, 0.3)',
    overflow: 'hidden',
    position: 'relative',
  },
  cardSelected: {
    borderColor: C.h.mint,
    borderWidth: 1.5,
    backgroundColor: 'rgba(113, 250, 204, 0.08)',
  },
  cardGlowOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: C.h.bluemint,
    opacity: 0.05,
  },
  cardContent: {
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
    position: 'relative',
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  icon: {
    fontSize: 40,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: C.h.graphite,
    textAlign: 'center',
  },
  checkmark: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: C.h.mint,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: C.h.mint,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  checkmarkText: {
    color: '#111',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cardGlowBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'transparent',
  },
  counter: {
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  counterText: {
    fontSize: 14,
    color: C.h.graphite,
    opacity: 0.6,
  },
  bottomSpacer: {
    height: 40,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.lg,
    backgroundColor: 'transparent',
  },
  button: {
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',


    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: BORDER_RADIUS.xl,
    elevation: 7,

        filter: 'opacity(0.9)',

    borderBottomWidth: 2,
    borderBottomColor: '#00ffd1',

    
    borderRightWidth: 2,
    borderRightColor: "#baff00",


    borderTopWidth: 2,
    borderTopColor: '#00ffd1',

    
    borderLeftWidth: 2,
    borderLeftColor: "#baff00",
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
  },
  buttonGradient: {
    paddingVertical: SPACING.lg,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '700',
    color: C.h.graphite,
    letterSpacing: 0.5,
  },
  buttonTextDisabled: {
    color: '#555',
  },








});