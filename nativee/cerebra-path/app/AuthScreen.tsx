import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { C, SPACING, BORDER_RADIUS } from './constants/theme';
import { useUser } from './context/UserContext';

export default function AuthScreen() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState('');
  const { email, setEmail, name, setName, password, setPassword } = useUser();
const scrollViewRef = useRef(null);

  // anim
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const inputFadeAnim = useRef(new Animated.Value(0)).current;

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


    Animated.stagger(100, [
      Animated.timing(inputFadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);


  const animateToggle = () => {
    Animated.sequence([
      Animated.timing(inputFadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(inputFadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleAuth = () => {
    if (!isLogin) {
      if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      if (password.length <= 3) {
        alert('Password is too short. Need to be more than 3 characters');
        return;
      }
      console.log('Signup:', { name, email, password });
      router.replace('/OnboardingScreen');
    } else if (password !== '69') {
      alert('You are not that guy');
      return;
    }
    else if (name !== 'dev') {
      alert('You are not that guy');
      return;
    }
    
    else {
      router.push('/OnboardingScreen');
    }
  };


const toggleMode = () => {
  Animated.sequence([
    Animated.timing(inputFadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }),
  ]).start(() => {
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    
    Animated.timing(inputFadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  });
};




  return (
    <LinearGradient
      colors={["#101010", "#050505", "#050505", "#000", "#000"]}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.container}
    >
     

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            

            ref={scrollViewRef}
  contentContainerStyle={styles.scrollContent}
  showsVerticalScrollIndicator={false}
  keyboardShouldPersistTaps="handled"
  scrollEnabled={true}
  bounces={false}
          >

            <View style={styles.topSpacer} />



            <Animated.View
              style={[
                styles.header,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <Text style={styles.title}>
                {isLogin ? 'Welcome Back' : (
    <>
      Join 
       <Text style={{color: C.h.r, filter: 'brightness(.6)'}}> Go</Text>
                      
                      <Text style={{ color: C.h.bluemint,  }}>Birdie</Text>
                                 
    </>
  )}
              </Text>
              <Text style={styles.subtitle}>
                {isLogin ? 'Sign in' : 'Let the birdies sing'}
              </Text>
            </Animated.View>

            <Animated.View
              style={[
                styles.formContainer,
                { opacity: inputFadeAnim },
              ]}
            >
              {!isLogin && (
                <View style={styles.inputGroup}>
                  <TextInput
                    style={styles.input}
                    placeholder="Email address"
                    placeholderTextColor={C.h.graphite}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                </View>
              )}


              <View style={styles.inputGroup}>
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  placeholderTextColor={C.h.graphite}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>


              <View style={styles.inputGroup}>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor={C.h.graphite}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>

              {!isLogin && (
                <View style={styles.inputGroup}>
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm password"
                    placeholderTextColor={C.h.graphite}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    autoCapitalize="none"
                  />
                </View>
              )}

              {isLogin && (
                <Pressable
                  style={({ pressed }) => [
                    styles.forgotPassword,
                    pressed && { opacity: 0.6 },
                  ]}
                >
                  <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                </Pressable>
              )}




              <Pressable
                onPress={handleAuth}
                style={({ pressed }) => [
                  styles.submitButton,
                  pressed && styles.submitButtonPressed,
                ]}
              >
                <LinearGradient
                  colors={['rgba(8, 8, 10, 0.3)',
 'rgba(8, 8, 10, 0.3)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.submitGradient}
                >
                  <Text style={styles.submitText}>
                    {isLogin ? 'Sign In' : 'Create Account'}
                  </Text>
                </LinearGradient>
              </Pressable>


              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.socialButton,
                  pressed && { opacity: 0.8 },
                ]}
                onPress={toggleMode}
              >
                <Text style={styles.socialButtonText}>
                  {isLogin ? 'Create an Account' : 'Sign In'}
                     {/**  <MaterialIcons name="golf-course" color="whitesmoke" size={18} /> */}

                </Text>
              </Pressable>
            </Animated.View>

            <View style={styles.bottomSpacer} />

            <Animated.View style={[styles.toggleContainer, { opacity: fadeAnim }]}>
              <Text style={styles.toggleText}>
                {isLogin ? "Do you have GAMEBOOK? " : 'Do you have GAMEBOOK? '}
              </Text>
              <Pressable
                                onPress={() => router.push('https://www.golfgamebook.com/?r=0')}

                style={({ pressed }) => pressed && { opacity: 0.6 }}
              >
                <Text style={styles.toggleLink}>
                  {isLogin ? 'Sign In' : 'Sign Up'}
                </Text>
              </Pressable>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    justifyContent: 'space-between',
  },
  topSpacer: {
    height: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xxl * 1.5,
  },
  title: {
    fontSize: 48,
    fontWeight: '700',
    color: C.h.bluemint,
    textAlign: 'center',
    marginBottom: SPACING.md,
    fontFamily: 'System',
    letterSpacing: -1,

        filter: 'brightness(1.4)',

      
  },
  subtitle: {
    fontSize: 15,
    color: C.h.graphite,
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.8,
  },
  formContainer: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    fontSize: 16,
    color: C.h.graphite,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.lg,
    marginTop: SPACING.xs,
  },
  forgotPasswordText: {
    fontSize: 13,
    color: C.h.r,
    fontWeight: '500',
  },
  submitButton: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    marginTop: SPACING.md,
    marginBottom: SPACING.xl,

    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: BORDER_RADIUS.xl,
    elevation: 7,
    filter: 'opacity(0.9)',


    borderWidth: 2,
    borderColor: C.h.bluemint,



  },
  submitButtonPressed: {
    transform: [{ scale: 0.98 }],
  },
  submitGradient: {
    paddingVertical: SPACING.lg,
    alignItems: 'center',
  },
  submitText: {
    fontSize: 17,
    fontWeight: '700',
    color: C.h.graphite,
    letterSpacing: 0.5,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dividerText: {
    fontSize: 13,
    color: C.h.graphite,
    marginHorizontal: SPACING.lg,
    opacity: 0.5,
  },
  socialButton: {
    backgroundColor: 'rgba(8, 8, 10, 0.3)',
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.lg,
    borderWidth: 1.6,
    borderColor:  C.h.r,

    alignItems: 'center',
    filter: 'opacity(0.9)',
        

    shadowColor: 'black',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: BORDER_RADIUS.lg,
    elevation: 6,

  },
  socialButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: C.h.graphite,
  },
  bottomSpacer: {
    height: 40,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: SPACING.xl,
  },
  toggleText: {
    fontSize: 14,
    color: C.h.graphite,
    opacity: 0.7,
  },
  toggleLink: {
    fontSize: 14,
    color:  C.h.r,
    fontWeight: '700',
  },
});