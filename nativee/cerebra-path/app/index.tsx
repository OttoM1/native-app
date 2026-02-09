import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { C, SPACING, BORDER_RADIUS } from './constants/theme';



export default function HomeScreen() {
  const router = useRouter();

  const logoAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;


  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 80,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const logoScale = logoAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  const logoRotate = logoAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-15deg', '0deg'],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    

   <LinearGradient
      colors={["white", "white"]}
      style={styles.container}
    >
      <View style={styles.particlesContainer}>
        {[...Array(20)].map((_, i) => (
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

      <View style={styles.content}>
        
        <Animated.View 
          style={[
            styles.titleContainer, 
            {  opacity: fadeAnim,
             }
          ]}
        >


         
          <Text style={styles.title}
          > Dih App </Text>


<Pressable onPress={() => router.push('https://ottomulari.tech')} >
        
            <Text style={styles.subtitle}>
            Dev @ottomulari.tech 
            </Text>
            
          </Pressable>
          



        </Animated.View>


        <Animated.View
          style={{
            opacity: fadeAnim,
          //  transform: [{ translateY: slideAnim }],
          }}
        >
          <Pressable 
            onPress={() => router.push('./AuthScreen')}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
          >
            <LinearGradient
              colors={[ C.h.mint, '#ecfbff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Continue</Text>
              <Text style={styles.buttonArrow}>→</Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>


         <Animated.View 
          style={[
            styles.bottomContainer,
            { opacity: fadeAnim } 
          ]}
        >
          <Pressable  
            onPress={() => router.push('./AuthScreen')}
            style={({ pressed }) => [
              styles.linkButton,
              pressed && { opacity: 0.6 },
            ]}
          >
            <Text style={styles.linkText}>Already started? Continue →</Text>
          </Pressable>
        </Animated.View>

      </View>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    zIndex: 1,
  },
  logoContainer: {
    marginBottom: SPACING.xxl,
    alignItems: 'center',
  },
  glow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'white',
    opacity: 0.3,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
  },
  logoText: {
    fontSize: 48,
    fontWeight: '800',
    letterSpacing: 2,
  },
  title: {
    fontSize: 54,
    fontWeight: '500',
    color: C.h.bluemint,
    textAlign: 'center',
    fontFamily: 'System',
    marginBottom: SPACING.xl,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 100,
    color: C.h.graphite,
    textAlign: 'center',
    marginBottom: SPACING.xxl,
    lineHeight: 24,
  },
  button: {
    marginBottom: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginTop: SPACING.xxl,
    overflow: 'hidden',
    shadowColor: 'grey',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xxl,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: C.h.graphite,
    marginRight: SPACING.sm,
  },
  buttonArrow: {
    fontSize: 20,
    color: C.h.bluemint,
    fontWeight: '700',
  },
  linkButton: {
    paddingVertical: SPACING.md,
  },
  linkText: {
    fontSize: 14,
    color: C.h.link,
    textAlign: 'center',
  },
  decorTop: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: C.h.error,
    opacity: 0.05,
  },
  decorBottom: {
    position: 'absolute',
    bottom: -150,
    left: -100,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: C.h.mint,
    opacity: 0.05,
  },


  bottomContainer: {
    position: 'absolute',
    bottom: 50, 
    width: '100%',
    alignItems: 'center',
    zIndex: 2,
  },


  titleContainer: {
    position: 'absolute',
    top: 60, 
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 2,
  },


});
