import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Easing, Animated, Pressable, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { C, SPACING, BORDER_RADIUS } from './constants/theme';

export default function HomeScreen() {
  
  const router = useRouter();

  const [showLoading, setShowLoading] = useState(false);
  const [subtitleIndex, setSubtitleIndex] = useState(0);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeOutAnim = useRef(new Animated.Value(1)).current;
  const fadeOutAnimProgress = useRef(new Animated.Value(1)).current;
  const addRightBorder = useRef(new Animated.Value(0)).current;
    const addBottomBorder = useRef(new Animated.Value(0)).current;
  const addLeftBorder = useRef(new Animated.Value(0)).current;

  const shine = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();


    const autoNavigateTimer = setTimeout(() => {
      router.push('./ui_assets/IntroVideo');
    }, 12800);

    let subtitleInterval: ReturnType<typeof setInterval> | null = null;
    let subtitleStopTimer: ReturnType<typeof setTimeout> | null = null;

    const progressTimer = setTimeout(() => {
      setShowLoading(true);
      
      Animated.loop(
        Animated.sequence([
          Animated.timing(progressAnim, { toValue: 0.40, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
          Animated.delay(0),
          Animated.timing(progressAnim, { toValue: 0.60, duration: 1200,  useNativeDriver: false }), 
          Animated.delay(0),
          Animated.timing(progressAnim, { toValue: 0.90, duration: 1200, useNativeDriver: false }),
          Animated.delay(0),
          Animated.timing(progressAnim, { toValue: 0.95, duration: 500,  useNativeDriver: false }),
          Animated.delay(0),
          Animated.timing(progressAnim, { toValue: 1, duration: 900, useNativeDriver: false }),
          Animated.timing(progressAnim, { toValue: 0, duration: 0, useNativeDriver: false }),
        ]),
        { iterations: 1 }
      ).start();

      subtitleInterval = setInterval(() => {
        setSubtitleIndex(prev => (prev + 1) % 3);
      }, 2100);

      subtitleStopTimer = setTimeout(() => {
        if (subtitleInterval) {
          clearInterval(subtitleInterval);
        }
      }, 7500);
    }, 5600);

    Animated.timing(fadeOutAnim, {
      toValue: 0,
      duration: 1400,
      delay: 5500,
      useNativeDriver: true,
    }).start();

    Animated.timing(fadeOutAnimProgress, {
      toValue: 0,
      duration: 1200,
      delay: 10600,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(shine, {
          toValue: 1.4,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false, 
        }),
        Animated.timing(shine, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
      ])
    ).start();

    return () => {
      clearTimeout(autoNavigateTimer);
      clearTimeout(progressTimer);
      if (subtitleInterval) {
        clearInterval(subtitleInterval);
      }
      if (subtitleStopTimer) {
        clearTimeout(subtitleStopTimer);
      }
    };
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const animatedBrightness = shine.interpolate({
    inputRange: [0.8, 1.1],
    outputRange: ['brightness(0.8)', 'brightness(1.1)'],
  });

  const subtitleText =
    subtitleIndex === 0
      ? 'Syncing GPS data...'
      : subtitleIndex === 1
      ? 'Locating weather API...'
      : 'Locking in your session';

  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    rotateAnim.setValue(0);

    Animated.sequence([
      Animated.timing(rotateAnim, {
        toValue: 3,
        duration: 3800,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(addRightBorder, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false, 
      }),
       Animated.timing(addBottomBorder, {
         toValue: 1,
         delay: 180,
        duration: 300,
        useNativeDriver: false, 
       }),
        Animated.timing(addLeftBorder, {
          toValue: 1,
                   delay: 360,

        duration: 300,
        useNativeDriver: false, 
      }),
    ]).start();
  }, []);
  
  const borderColorAnim = addRightBorder.interpolate({
    inputRange: [0, 1],
    outputRange: ['transparent', '#730000'],
  });

  const borderColorAnim2 = addBottomBorder.interpolate({
    inputRange: [0, 1],
    outputRange: ['transparent', '#730000'],
  });


  const borderColorAnim3 = addLeftBorder.interpolate({
    inputRange: [0, 1],
    outputRange: ['transparent', '#730000'],
  });
  
  const spin = rotateAnim.interpolate({
    inputRange: [0, 3],
    outputRange: ['0deg', '1440deg'],
  });

  return (
    <LinearGradient
      colors={["#000", "#000", "#000000"]} //060505
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.container}
    >
     

        <View         style={styles.imageContainer}
 >


        <View style={styles.particlesContainer}>
          {[...Array(16)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.particle,
                {
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.6,
                },
              ]}
            />
          ))}
        </View>

        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <Text style={styles.title}>
            <Text style={{color: '#4d0202'}}>Go</Text>Birdie
          </Text>

          <View style={styles.card}>
            <ImageBackground
              source={require('./ui_assets/mattBlack.png')}
              style={styles.cardBorder}
              imageStyle={styles.cardImageBitmap}
              resizeMode="cover"
            >
              <View style={styles.cardContent}>
                <Animated.View style={[styles.logoContainer,  { filter: animatedBrightness }]}>
                  <ImageBackground
                    source={require('./ui_assets/icon.png')}
                    style={styles.logoCircle}
                    imageStyle={styles.cardImageBitmap2}
                    resizeMode="cover"
                  />
                  <Animated.View
                    style={[
                      styles.logoSpinner,
                      {
                        borderBottomColor: borderColorAnim2,
                        borderLeftColor: borderColorAnim3,
                        borderRightColor: borderColorAnim,
                        transform: [{ rotate: spin }], 
                        opacity: fadeOutAnim 
                      },
                    ]}
                  />
                </Animated.View>

                <Animated.View
                  style={[
                    styles.progressBarContainer,
                    !showLoading && { display: 'none' },
                    { opacity: fadeOutAnimProgress },
                  ]}
                >
                  <View style={styles.progressBarTrack}>
                    <Animated.View style={[styles.progressBarFill, { width: progressWidth }]}>
                      <View style={styles.leadingEdgeGlow} />
                      <View style={styles.leadingEdgeCore} />
                    </Animated.View>
                  </View>
                </Animated.View>

                {showLoading && (
                  <>
                    <Animated.Text style={[styles.loadingTitle, { opacity: fadeOutAnimProgress }]}>
                      INITIALIZING GoBirdie...
                    </Animated.Text>
                    <Animated.Text style={[styles.loadingSubtitle, { opacity: fadeOutAnimProgress }]}>
                      {subtitleText}
                    </Animated.Text>
                  </>
                )}
              </View>
            </ImageBackground>
          </View>
        </Animated.View>
        </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
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
    backgroundColor: 'red',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    zIndex: 1,
  },
  title: {
    fontSize: 63,
    fontWeight: '800',
    position: 'absolute',
    top: 60,
    color: '#302e2e',
    textAlign: 'center',
    marginBottom: SPACING.xxl * 1.5,
    letterSpacing: -1,
  },
  card: {
    width: '100%',
    maxWidth: 480,
    aspectRatio: 1.4,
    marginBottom: SPACING.xl,
    borderRadius: SPACING.lg,
  },
  cardImageBitmap: {
    width: '100%',
    height: '100%',
    display: 'none',
    borderRadius: SPACING.lg,
  },
  cardBorder: {
    flex: 1,
    borderRadius: SPACING.lg,
    padding: 0,
  },
  cardContent: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0)',
    borderRadius: SPACING.lg,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  logoContainer: {
    position: 'absolute',
    top: 30,
    width: 160,
    backgroundColor: 'transparent',
    height: 160,
    borderRadius: 80,
    shadowColor: '#730000',
    shadowOpacity: 0.5,
    shadowRadius: 42,
    elevation: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    flexDirection: 'row',
    filter: 'contrast(1.1) brightness(0.7)',
    overflow: 'hidden',
    backgroundColor: 'transparent',
    shadowColor: 'black',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  logoSpinner: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1,
    borderTopColor: '#730000',
    opacity: 0.6,
  },
  cardImageBitmap2: {
    width: 160,
    height: 160,
    borderRadius: 80,
    opacity: 0.8,
    filter: 'saturate(1.1)',
  },
  progressBarContainer: {
    position: 'absolute',
    top: 195,
    width: '80%',
    marginBottom: SPACING.md,
    marginTop: SPACING.xl,
    borderWidth: 1,
    borderColor: '#401016',
    borderRadius: 2,
  },
  progressBarTrack: {
    height: 2,
    backgroundColor: 'rgba(22, 9, 9, 0.6)',
    borderRadius: 2,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#401016',
    borderRadius: 2,
    position: 'relative', 
  },
  leadingEdgeGlow: {
    position: 'absolute',
    right: -4, 
    top: -4,
    bottom: -4,
    width: 8,
    backgroundColor: 'rgba(255, 0, 0, 0.9)', 
    shadowColor: '#ff0000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 18,
    elevation: 12,
    borderRadius: 4,
  },
  leadingEdgeCore: {
    position: 'absolute',
    right: -1.5,
    top: -1,
    bottom: -1,
    width: 2,
    backgroundColor: '#ffffff',
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 7,
    elevation: 9,
    borderRadius: 2,
  },
  loadingTitle: {
    position: 'absolute',
    top: 242,
    fontSize: 19,
    fontWeight: '700',
    color: '#6f605a',
    textAlign: 'center',
    marginBottom: SPACING.xs,
    letterSpacing: 1,
  },
  loadingSubtitle: {
    position: 'absolute',
    top: 270,
    fontSize: 14,
    fontWeight: '100',
    color: 'whitesmoke',
    textAlign: 'center',
  },
});






//settings = golf clubs
//onboarding = clubs
//hcp + experience