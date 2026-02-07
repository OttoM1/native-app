import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
// import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
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

  return(
  
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
          <Text style={styles.title
           
        }
            >Cerebra Path</Text>
          <Text style={styles.subtitle}>
            Master digital skills through bite-sized challenges
          </Text>
        </Animated.View>


        <Animated.View
          style={{
            opacity: fadeAnim,
          //  transform: [{ translateY: slideAnim }],
          }}
        >
          <Pressable 
            onPress={() => router.push('/onboarding')}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
          >
            <LinearGradient
              colors={["transparent", "transparent"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Start Your Journey</Text>
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
            onPress={() => router.push('/onboarding')}
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
    backgroundColor: "black",
  },
  content: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',
    width: '100%',
    zIndex: 1,
  },
  

  titleContainer: {
    position: 'absolute',
    top: 60, 
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 2,
  },
  title: {
    fontSize: 56,
    fontWeight: '300',
    color: "#ff0f3b",
    textAlign: 'center',
    textShadowColor: '#2b2a2a4b',
    textShadowRadius: 2,
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 20,
    color: "grey",
    textAlign: 'center',
    lineHeight: 24,
  },

  button: {
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    shadowColor: "black",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
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
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 18,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: "#444",
    marginRight: 8,
  },
  buttonArrow: {
    fontSize: 24,
    color: "#2fe3e0",
    fontWeight: '200',
  },

  bottomContainer: {
    position: 'absolute',
    bottom: 50, 
    width: '100%',
    alignItems: 'center',
    zIndex: 2,
  },
  linkButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  linkText: {
    fontSize: 14,
    color: "#4f89df",
    textAlign: 'center',
  },
  decorTop: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "purple", 
    opacity: 0.05,
  },
  decorBottom: {
    position: 'absolute',
    bottom: -150,
    left: -100,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: "green",
    opacity: 0.05,
  },
});
