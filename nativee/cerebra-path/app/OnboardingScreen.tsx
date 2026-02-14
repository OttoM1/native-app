import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Animated, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useProgress } from './context/ProgressContext';
import { C, SPACING, BORDER_RADIUS } from './constants/theme';

import { useUser } from './context/UserContext';

const CATEGORIES = [
  { id: 'Relaxed', icon: '', group: 0, category: 'intensity' },
  { id: 'Competitive', icon: '', group: 0, category: 'intensity' },
  { id: 'Short Game', icon: '', group: 1, category: 'focus' },
  { id: 'Long Distance', icon: '', group: 1, category: 'focus' },
  { id: 'Fast Track', icon: '', group: 2, category: 'time' },
  { id: 'Deep Session', icon: '', group: 2, category: 'time' },
  { id: 'Over 36', icon: '', group: 3, category: 'HCP' },
  { id: 'Under 36', icon: '', group: 3, category: 'HCP' },
  { id: 'Under 2 years', icon: '', group: 4, category: 'experience' },
  { id: 'Over 2 years', icon: '', group: 4, category: 'experience' },
];

const GOLF_CLUBS = [
  { id: 'Driver', icon: '' },
  { id: '3-Wood', icon: '' },
  { id: '5-Wood', icon: '' },
  { id: 'Hybrid', icon: '' },
  { id: '3-iron', icon: '' },
  { id: '4-iron', icon: '' },
  { id: '5-iron', icon: '' },
  { id: '6-iron', icon: '' },
  { id: '7-iron', icon: '' },
  { id: '8-iron', icon: '' },
  { id: '9-iron', icon: '' },
  { id: 'P-Wedge', icon: '' },
  { id: 'S-Wedge', icon: '' },
  { id: '60°-Wedge', icon: '' },
];

const GROUP_TITLES = [
  'Play Intensity', 
  'Focus Area',     
  'Time Commitment',
  'Your HCP',
  'Experience Level',
];

export default function OnboardingScreen() {
  const { name, clubYardages, setClubYardage, playPreferences, setPlayPreference, experienceLevels, setExperienceLevel } = useUser();
  const router = useRouter();
  const { updateInterests } = useProgress();
  
  const [showIntro, setShowIntro] = useState(true);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [canDismiss, setCanDismiss] = useState(false);
  const introFadeAnim = useRef(new Animated.Value(0)).current;
  const introPulseAnim = useRef(new Animated.Value(1)).current;
  const textFadeAnim = useRef(new Animated.Value(0)).current;
  const contentFadeAnim = useRef(new Animated.Value(0)).current;

  const TEXT_SNIPPETS = [
    { main: `Hello ${name}`, sub: "Let's dial in your game." },
    { main: "Personalized", sub: "data-driven progress starts here." },
    { main: "Let's Start", sub: "with setting up your profile." },
  ];
  
  const TEXT_DURATION = 2600; 
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const [cardAnims] = useState(CATEGORIES.map(() => new Animated.Value(1)));

  useEffect(() => {
    Animated.sequence([
      Animated.delay(200),
      Animated.timing(textFadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.delay(220),
        Animated.timing(introPulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(introPulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    if (!showIntro) return;

    const timer = setTimeout(() => {
      if (currentTextIndex < TEXT_SNIPPETS.length - 1) {
        Animated.timing(textFadeAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }).start(() => {
          setCurrentTextIndex(prev => prev + 1);
          Animated.timing(textFadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }).start();
        });
      } else {
        setCanDismiss(true);
      }
    }, TEXT_DURATION);

    return () => clearTimeout(timer);
  }, [currentTextIndex, showIntro]);

  useEffect(() => {
    if (!showIntro) {
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
    }
  }, [showIntro]);

  const handleIntroTap = () => {
    if (!canDismiss) return;

    Animated.parallel([
      Animated.timing(textFadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(contentFadeAnim, {
        toValue: 1,
        duration: 800,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowIntro(false);
    });
  };

  const togglePreference = (categoryId: string, categoryType: string, index: number) => {
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




    if (categoryType === 'intensity' || categoryType === 'focus' || categoryType === 'time') {
      setPlayPreference(categoryType as 'intensity' | 'focus' | 'time', categoryId);
    } else if (categoryType === 'HCP' || categoryType === 'experience') {
      setExperienceLevel(categoryType as 'HCP' | 'experience', categoryId);
    }
  };

  const handleContinue = () => {

    if (!playPreferences.intensity || !playPreferences.focus || !playPreferences.time || !experienceLevels.HCP || !experienceLevels.experience) {
      alert('Please select one option from each category');
      return;
    }


    const allClubsFilled = GOLF_CLUBS.every(club => 
      clubYardages[club.id] && clubYardages[club.id].trim() !== ''
    );

    if (!allClubsFilled) {
      alert('Please enter yardage for all golf clubs');
      return;
    }

    const interests = [
      playPreferences.intensity,
      playPreferences.focus,
      playPreferences.time,
    ];
    updateInterests(interests);
    
    router.push('./screens/DashboardScreen');
  };

  const handleYardageChange = (clubId: string, value: string) => {

    const numericValue = value.replace(/[^0-9]/g, '');
    setClubYardage(clubId, numericValue);
  };

  const renderGroup = (groupIndex: number) => {
    const groupCategories = CATEGORIES.filter(c => c.group === groupIndex);
    
    return (
      <View key={groupIndex} style={styles.section}>
        <Text style={styles.sectionTitle}>{GROUP_TITLES[groupIndex]}</Text>
        
        <View style={styles.cardRow}>
          {groupCategories.map((category) => {
            const globalIndex = CATEGORIES.findIndex(c => c.id === category.id);
            

            let isSelected = false;
            if (category.category === 'intensity' || category.category === 'focus' || category.category === 'time') {
              isSelected = playPreferences[category.category as keyof typeof playPreferences] === category.id;
            } else if (category.category === 'HCP' || category.category === 'experience') {
              isSelected = experienceLevels[category.category as keyof typeof experienceLevels] === category.id;
            }

            return (
              <Animated.View
                key={category.id}
                style={[
                  styles.cardWrapper,
                  { transform: [{ scale: cardAnims[globalIndex] }] },
                ]}
              >
                <Pressable
                  onPress={() => togglePreference(category.id, category.category, globalIndex)}
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

  const renderClubInputs = () => {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Club Yardages</Text>
        <Text style={styles.sectionSubtitle}>Enter your average distance for each club</Text>
        
        <View style={styles.clubInputsContainer}>
          {GOLF_CLUBS.map((club, index) => (
            <View key={club.id} style={styles.clubInputRow}>
              <View style={styles.clubLabelContainer}>
                <Text style={styles.clubIcon}>{club.icon}</Text>
                <Text style={styles.clubLabel}>{club.id}</Text>
              </View>
              
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.yardageInput}
                  placeholder="0"
                  placeholderTextColor={C.h.graphite + '40'}
                  value={clubYardages[club.id]}
                  onChangeText={(value) => handleYardageChange(club.id, value)}
                  keyboardType="number-pad"
                  maxLength={3}
                />
                <Text style={styles.yardageUnit}>yds</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  if (showIntro) {
    const currentSnippet = TEXT_SNIPPETS[currentTextIndex];
    
    return (
      <Pressable 
        onPress={handleIntroTap} 
        style={styles.introContainer}
        disabled={!canDismiss}
      >
        <LinearGradient
          colors={["#000000", "#000000"]}
          style={styles.introGradient}
        >
          <Animated.View
            style={[
              styles.introContent,
              {
                opacity: textFadeAnim,
              },
            ]}
          >
            <Text style={styles.introHello}>{currentSnippet.main}</Text>
            <Text style={styles.introSubtext}>{currentSnippet.sub}</Text>
          </Animated.View>

          {canDismiss && (
            <Animated.View 
              style={[
                styles.tapIndicator, 
                {
                  opacity: textFadeAnim,
                  transform: [{ scale: introPulseAnim }],
                }
              ]}
            >
              <Text style={styles.tapIndicatorText}>tap anywhere to continue</Text>
            </Animated.View>
          )}

          <View style={styles.introParticlesContainer}>
            {[...Array(8)].map((_, i) => (
              <Animated.View
                key={i}
                style={[
                  styles.introParticle,
                  {
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    opacity: textFadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, Math.random() * 0.4],
                    }),
                  },
                ]}
              />
            ))}
          </View>
        </LinearGradient>
      </Pressable>
    );
  }





  const preferencesSelected = 
    (playPreferences.intensity ? 1 : 0) + 
    (playPreferences.focus ? 1 : 0) + 
    (playPreferences.time ? 1 : 0) +
    (experienceLevels.HCP ? 1 : 0) +
    (experienceLevels.experience ? 1 : 0);
  
  const clubsFilled = GOLF_CLUBS.filter(club => 
    clubYardages[club.id] && clubYardages[club.id].trim() !== ''
  ).length;

  const totalCompleted = preferencesSelected + clubsFilled;
  const totalRequired = 5 + GOLF_CLUBS.length; 

  return (
    <LinearGradient
      colors={["#101010", "#050505", "#050505", "#000", "#000"]}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.container}
    >
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
            <Text style={styles.title}>Profile Setup</Text>
            <Text style={styles.subtitle}>Complete your golf profile</Text>
          </Animated.View>

          <Animated.View style={{ opacity: fadeAnim }}>
            {[0, 1, 2, 3, 4].map(groupIndex => renderGroup(groupIndex))}
            {renderClubInputs()}
          </Animated.View>

          <View style={styles.counter}>
            <Text style={styles.counterText}>
              {totalCompleted} of {totalRequired} completed
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
              totalCompleted < totalRequired && styles.buttonDisabled,
            ]}
          >
            <LinearGradient
              colors={
                totalCompleted < totalRequired
                  ? ['rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 1)']
                  : ['#000', '#000']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text
                style={[
                  styles.buttonText,
                  totalCompleted < totalRequired && styles.buttonTextDisabled,
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
  introContainer: {
    flex: 1,
  },
  introGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  introContent: {
    alignItems: 'center',
    zIndex: 2,
  },
  introHello: {
    fontSize: 48,
    fontWeight: '700',
    color: 'rgb(220, 220, 220)',
    textAlign: 'center',
    marginBottom: SPACING.xxl,
    fontFamily: 'System',
    letterSpacing: -1,
    marginLeft: SPACING.sm,
  },
  introSubtext: {
    fontSize: 19,
    color: C.h.r,
    textAlign: 'center',
    opacity: 0.7,
    letterSpacing: 2,
    textTransform: 'lowercase',
  },
  introParticlesContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  introParticle: {
    position: 'absolute',
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: C.h.r,
  },
  tapIndicator: {
    position: 'absolute',
    bottom: 60,
    alignSelf: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
  },
  tapIndicatorText: {
    fontSize: 13,
    color: C.h.graphite,
    opacity: 0.6,
    letterSpacing: 1,
    textTransform: 'lowercase',
  },
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
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
    fontSize: 36,
    fontWeight: '600',
    color: C.h.graphite,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    fontFamily: 'System',
    letterSpacing: -0.5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: C.h.graphite,
    textAlign: 'center',
    opacity: 0.6,
    marginTop: -SPACING.md,
    marginBottom: SPACING.xl,
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
    overflow: 'hidden',
    position: 'relative',
    shadowColor: C.h.r,
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 6,
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



  clubInputsContainer: {
    gap: SPACING.md,
  },
  clubInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(113, 250, 204, 0.1)',
  },
  clubLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flex: 1,
  },
  clubIcon: {
    fontSize: 24,
  },
  clubLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: C.h.graphite,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: C.h.bluemint + '40',
    minWidth: 100,
  },
  yardageInput: {
    fontSize: 18,
    fontWeight: '700',
    color: C.h.bluemint,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    textAlign: 'right',
    flex: 1,
  },
  yardageUnit: {
    fontSize: 14,
    color: C.h.graphite,
    opacity: 0.6,
    marginLeft: SPACING.xs,
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
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: BORDER_RADIUS.xl,
    elevation: 7,
    borderWidth: 2,
    borderColor: C.h.bluemint,
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
  buttonDisabled: {
    borderColor: C.h.error,
    borderWidth: 1,
  },
  buttonTextDisabled: {
    color: '#555',
  },
});