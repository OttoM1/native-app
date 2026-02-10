import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProgress } from './context/ProgressContext';
import { C, SPACING, BORDER_RADIUS, WEIGHT } from './constants/theme';

export default function OnboardingScreen() {
  const router = useRouter();
  const { updateInterests } = useProgress();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [scaleAnim0] = useState(new Animated.Value(1));
  const [scaleAnim1] = useState(new Animated.Value(1));
  const [scaleAnim2] = useState(new Animated.Value(1));
  const [scaleAnim3] = useState(new Animated.Value(1));
  const [scaleAnim4] = useState(new Animated.Value(1));
  const [scaleAnim5] = useState(new Animated.Value(1));
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
  }, []);







const toggleInterest = (categoryId: string, scaleAnim: Animated.Value) => {

  const groups = [
    ['Casual', 'Serious'],
    ['Short Game', 'Long Range'],
    ['Under 30min', 'Over 30min']
  ];
  const group = groups.find(g => g.includes(categoryId));




    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.97,
        duration: 110,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 10,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  
  
  
setSelectedInterests(prev => {


  if (group) {

    const withoutGroup = prev.filter(id => !group.includes(id));
      


    if (prev.includes(categoryId)) {
        return withoutGroup;
      }
      return [...withoutGroup, categoryId];
    }
    

  return prev.includes(categoryId)
      ? prev.filter(id => id !== categoryId)
      : [...prev, categoryId];
  });
};

  

  const handleContinue = () => {

    if (selectedInterests.length > 0) {
      updateInterests(selectedInterests);
      router.push('/');
    }
  };

  const confirmCheckOut = () => { 


    if (selectedInterests.length < 3) {
      updateInterests(selectedInterests);
      alert('Choose one option from every field');
      router.canGoBack();
    }

    else {
            router.push('./screens/DashboardScreen');

    }

  };



  return (
    <LinearGradient
     colors={["#101010", "#101010", "#101010", "#000", "#000"]}
            start={{ x: 0, y: 1 }}
                   end={{ x: 0, y: 0 }}
           style={styles.container}
         >
           <View style={styles.particlesContainer}>
             {[...Array(28)].map((_, i) => (
               <View
                 key={i}
                 style={[
                   styles.particle,
                   {
                     left: `${Math.random() * 100}%`,
                     top: `${Math.random() * 100}%`,
                     opacity: Math.random() * 0.5,
                   },
                 ]}
               />
             ))}
           </View>


      <Animated.View style={[styles.safeArea, { opacity: pageOpacity }, {transform: [{scale: bounceAnim}] }]}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <Text style={styles.title}>Lets get started</Text>
              <Text style={styles.subtitle}>
                Select your stats
              </Text>
            </View>

            <View style={styles.grid}>
              
              
              
              {/*  1  */}

              

              <Text style={styles.sectionTitle}>Use Objective</Text>



              <View style={styles.cardWrapper}>
              <Animated.View
            style={[styles.aw, { transform: [{ scale: scaleAnim0 }] }]}
              >
                <Pressable
                  onPress={() => toggleInterest('Casual', scaleAnim0)}
                  style={({ pressed }) => [
                    styles.card,
                    selectedInterests.includes('Casual') && styles.cardSelected,
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <View style={styles.cardContent}>
                    <View
                      style={[
                        styles.iconContainer,
                        { backgroundColor: 'transparent' },
                      ]}
                    >
                      <Text style={styles.icon}>😄</Text>
                    </View>
                    <Text style={styles.cardTitle}>Casual</Text>
                    
                    {selectedInterests.includes('Casual') && (
                      <View
                        style={[
                          styles.checkmark,
                          { backgroundColor: C.h.bluemint },
                        ]}
                      >
                        <Text style={styles.checkmarkText}>✓</Text>
                      </View>
                    )}
                  </View>

                  {selectedInterests.includes('Casual') && (
                    <View
                      style={[
                        styles.cardGlow,
                        { backgroundColor: C.h.bluemint },
                      ]}
                    />
                  )}
                  </Pressable>
                  
                  </Animated.View>

{/* split */}

                <Animated.View
            style={[styles.aw, { transform: [{ scale: scaleAnim1 }] }]}

              >
                 <Pressable
                  onPress={() => toggleInterest('Serious', scaleAnim1)}
                  style={({ pressed }) => [
                    styles.card,
                    selectedInterests.includes('Serious') && styles.cardSelected,
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <View style={styles.cardContent}>
                    <View
                      style={[
                        styles.iconContainer,
                        { backgroundColor: 'transparent' },
                      ]}
                    >
                      <Text style={styles.icon}>💪</Text>
                    </View>
                    <Text style={styles.cardTitle}>Serious</Text>
                    
                    {selectedInterests.includes('Serious') && (
                      <View
                        style={[
                          styles.checkmark,
                          { backgroundColor: C.h.bluemint },
                        ]}
                      >
                        <Text style={styles.checkmarkText}>✓</Text>
                      </View>
                    )}
                  </View>

                  {selectedInterests.includes('Serious') && (
                    <View
                      style={[
                        styles.cardGlow,
                        { backgroundColor: C.h.bluemint },
                      ]}
                    />
                  )}
                </Pressable>

              </Animated.View>

                </View>
            
              






              {/* 2  */}

              <Text style={styles.sectionTitle}>Main Weakness</Text>




              <View style={styles.cardWrapper}>



              <Animated.View
                style={[styles.aw, { transform: [{ scale: scaleAnim2 }] }]}
              >
                <Pressable
                  onPress={() => toggleInterest('Short Game', scaleAnim2)}
                  style={({ pressed }) => [
                    styles.card,
                    selectedInterests.includes('Short Game') && styles.cardSelected,
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <View style={styles.cardContent}>
                    <View
                      style={[
                        styles.iconContainer,
                        { backgroundColor: 'transparent' },
                      ]}
                    >
                      <Text style={styles.icon}>⛳</Text>
                    </View>
                    <Text style={styles.cardTitle}>Short Game</Text>
                    
                    {selectedInterests.includes('Short Game') && (
                      <View
                        style={[
                          styles.checkmark,
                          { backgroundColor: C.h.bluemint },
                        ]}
                      >
                        <Text style={styles.checkmarkText}>✓</Text>
                      </View>
                    )}
                  </View>

                  {selectedInterests.includes('Short Game') && (
                    <View
                      style={[
                        styles.cardGlow,
                        { backgroundColor: C.h.bluemint },
                      ]}
                    />
                  )}
                  </Pressable>
                  
                  </Animated.View>

                {/* splitti */}


                <Animated.View
                                style={[styles.aw, { transform: [{ scale: scaleAnim3 }] }]}

                >
                
                 <Pressable
                  onPress={() => toggleInterest('Long Range', scaleAnim3)}
                  style={({ pressed }) => [
                    styles.card,
                    selectedInterests.includes('Long Range') && styles.cardSelected,
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <View style={styles.cardContent}>
                    <View
                      style={[
                        styles.iconContainer,
                        { backgroundColor: 'transparent' },
                      ]}
                    >
                      <Text style={styles.icon}>🏌️‍♂️</Text>
                    </View>
                    <Text style={styles.cardTitle}>Long Range</Text>
                    
                    {selectedInterests.includes('Long Range') && (
                      <View
                        style={[
                          styles.checkmark,
                          { backgroundColor: C.h.bluemint },
                        ]}
                      >
                        <Text style={styles.checkmarkText}>✓</Text>
                      </View>
                    )}
                  </View>

                  {selectedInterests.includes('Long Range') && (
                    <View
                      style={[
                        styles.cardGlow,
                        { backgroundColor: C.h.bluemint },
                      ]}
                    />
                  )}
                </Pressable>

              </Animated.View>

            </View>
              








                {/*  3  */}
                
              <Text style={styles.sectionTitle}>Practice Duration</Text>


<View style={styles.cardWrapper}>


              <Animated.View
                style={[styles.aw, { transform: [{ scale: scaleAnim4 }] }]}
              >
                <Pressable
                  onPress={() => toggleInterest('Under 30min', scaleAnim4)}
                  style={({ pressed }) => [
                    styles.card,
                    selectedInterests.includes('Under 30min') && styles.cardSelected,
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <View style={styles.cardContent}>
                    <View
                      style={[
                        styles.iconContainer,
                        { backgroundColor: 'transparent' },
                      ]}
                    >
                      <Text style={styles.icon}>⏳</Text>
                    </View>
                    <Text style={styles.cardTitle}>Under 30min</Text>
                    
                    {selectedInterests.includes('Under 30min') && (
                      <View
                        style={[
                          styles.checkmark,
                          { backgroundColor: C.h.bluemint },
                        ]}
                      >
                        <Text style={styles.checkmarkText}>✓</Text>
                      </View>
                    )}
                  </View>

                  {selectedInterests.includes('Under 30min') && (
                    <View
                      style={[
                        styles.cardGlow,
                        { backgroundColor: C.h.bluemint },
                      ]}
                    />
                  )}
                  </Pressable>
                  
                  </Animated.View>


                {/*splwt */}


                 <Animated.View
                style={[styles.aw, { transform: [{ scale: scaleAnim5 }] }]}
              >
                
                 <Pressable
                  onPress={() => toggleInterest('Over 30min', scaleAnim5)}
                  style={({ pressed }) => [
                    styles.card,
                    selectedInterests.includes('Over 30min') && styles.cardSelected,
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <View style={styles.cardContent}>
                    <View
                      style={[
                        styles.iconContainer,
                        { backgroundColor: 'transparent' },
                      ]}
                    >
                      <Text style={styles.icon}>🗿</Text>
                    </View>
                    <Text style={styles.cardTitle}>Over 30min</Text>
                    
                    {selectedInterests.includes('Over 30min') && (
                      <View
                        style={[
                          styles.checkmark,
                          { backgroundColor: C.h.bluemint },
                        ]}
                      >
                        <Text style={styles.checkmarkText}>✓</Text>
                      </View>
                    )}
                  </View>

                  {selectedInterests.includes('Over 30min') && (
                    <View
                      style={[
                        styles.cardGlow,
                        { backgroundColor: C.h.bluemint },
                      ]}
                    />
                  )}
                </Pressable>






              </Animated.View>
</View>
            
              


            </View>

            <View style={styles.counter}>
              <Text style={styles.counterText}>
                {selectedInterests.length} selected
              </Text>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Pressable
              onPress={() => confirmCheckOut()} //router.push('./screens/DashboardScreen')
              style={({ pressed }) => [
                styles.button,
                pressed && { opacity: 0.6 },
              ]}
            >
              <LinearGradient
                colors={
                  selectedInterests.length === 0
                    ? ['#71d8fa', C.h.baby]
                    : ['#71facc', C.h.mint]
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
    color: C.h.bluemint,
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
    fontWeight: '100',
    textAlign: 'center',
  },
  grid: {
    marginTop: SPACING.lg,
    paddingBottom: SPACING.xxl,
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: SPACING.xxl,
  },

  sectionTitle: {
    fontSize: 32,
    fontWeight: '600',
    color: C.h.graphite,
    marginTop: SPACING.xxl,
    textAlign: 'center',
    fontFamily: 'System',
    letterSpacing: -0.5,
  },


  cardWrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'space-around',
justifyContent: 'space-around',
    alignItems: 'center',
        marginBottom: SPACING.lg,
  },

  aw: {
    width: '42%',
  },

  card: {
    width: '100%',
    backgroundColor: '#10101040',
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: C.h.bluemint,
    overflow: 'hidden',
  },
  cardSelected: {
    borderColor: C.h.mint,
    borderWidth: 2,

    shadowColor: C.h.bluemint,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
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
    right: SPACING.sm,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: C.h.baby,
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
    alignItems: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.xxl
  },
  counterText: {
    fontSize: 14,
    color: C.h.baby
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.sm,
    backgroundColor: 'transparent',
  },
  button: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
    transform: 'scale(.92)',
  },
  buttonDisabled: { shadowOpacity: 0, elevation: 0 },
  buttonPressed: { transform: [{ scale: 0.98 }] },
  buttonGradient: {
    paddingVertical: SPACING.lg,
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  buttonTextDisabled: {
    color: '#333'
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
});