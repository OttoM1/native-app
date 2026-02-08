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
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, BORDER_RADIUS } from './constants/theme';

export default function AuthScreen() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');

  //
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 40,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);



  const handleAuth = () => {
    if (isLogin) {

      

      console.log('Login:', { email, password });


      if (email !== 'dev69' && password !== 'dev69') {
 alert('Only the Dev has access!');
            // router.push('/AuthScreen');
        return;

      }

      else if (password !== 'dev69') {
      
 alert('Only the Dev has access!');
            // router.push('/AuthScreen');
        return;

      }
            router.replace('/onboarding');

    } else {


      if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
      }
      console.log('Signup:', { name, email, password });

      router.replace('/onboarding');
    }

    
    while (password.length <= 2) {
        alert('Passwords too short!');
      router.push('/AuthScreen');
      return;
    }


  };
  
  
  
  
  
  
  


  const toggleMode = () => {
    setIsLogin(!isLogin);


    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
  };

  return (
    <LinearGradient
      colors={[COLORS.background.primary, COLORS.background.secondary]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >

            <Animated.View
              style={[
                styles.backButtonContainer,
                { opacity: fadeAnim },
              ]}
            >
              <Pressable
                onPress={() => router.push('./AuthScreen')}
                style={({ pressed }) => [
                  styles.backButton,
                  pressed && { opacity: 0.6 },
                ]}
              >
                <Text style={styles.backText}>← Back</Text>
              </Pressable>
            </Animated.View>

            {/* Logo vittuun */}
            <Animated.View
              style={[
                styles.logoContainer,
                {
                  opacity: fadeAnim, 
                  transform: [{ scale: logoScale }],
                },
              ]}
            >
              <LinearGradient
                colors={[COLORS.brand.purpleLight, COLORS.brand.purple]}
                style={styles.logoCircle}
              >
                <Text style={styles.logoText}>CP</Text>
              </LinearGradient>
            </Animated.View>

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
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </Text>
              <Text style={styles.subtitle}>
                {isLogin
                  ? 'Sign in to continue'
                  : 'Start your journey'}
              </Text>
            </Animated.View>



            <Animated.View
              style={[
                styles.formContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >




              {!isLogin && (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Full Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your name"
                    placeholderTextColor={COLORS.text.tertiary}
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                  />
                </View>
              )}







              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor={COLORS.text.placeholder}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>





              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor={COLORS.text.placeholder}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>

              {!isLogin && (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Confirm Password</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Re-enter your password"
                    placeholderTextColor={COLORS.text.tertiary}
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
                  <Text style={styles.forgotPasswordText}>
                    Forgot Password?
                  </Text>
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
                  colors={[COLORS.brand.teal, COLORS.brand.tealLight]}
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
              >
                <Text style={styles.socialButtonText}>Continue with Apple</Text>
              </Pressable>

              {/* Toggle Login/Signup */}
              <View style={styles.toggleContainer}>
                <Text style={styles.toggleText}>
                  {isLogin
                    ? "Don't have an account? "
                    : 'Already have an account? '}
                </Text>
                <Pressable
                  onPress={toggleMode}
                  style={({ pressed }) => pressed && { opacity: 0.6 }}
                >
                  <Text style={styles.toggleLink}>
                    {isLogin ? 'Sign Up' : 'Sign In'}
                  </Text>
                </Pressable>
              </View>

              {/* 
              <Pressable
                onPress={() => router.replace('/onboarding')}
                style={({ pressed }) => [
                  styles.guestButton,
                  pressed && { opacity: 0.6 },
                ]}
              >
                <Text style={styles.guestButtonText}>
                  Continue as Guest
                </Text>
              </Pressable>
Guest Mode */}

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
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  backButtonContainer: {
    marginBottom: SPACING.lg,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 16,
    color: COLORS.brand.teal,
    fontWeight: '600',
  },
  logoContainer: {
    display: 'none',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logoCircle: {
    display: 'none',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.brand.tealLight,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.text.primary,
    letterSpacing: 1,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: 48,
    fontWeight: '500',
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    fontFamily: 'System',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.xl,
  },
  formContainer: {
    flex: 1,

  },
  inputContainer: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: 16,
    color: COLORS.text.disabled,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.xl,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: COLORS.brand.teal,
    fontWeight: '600',
  },
  submitButton: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    marginTop: SPACING.xl,
    marginBottom: SPACING.lg,

    shadowColor: COLORS.brand.teal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonPressed: {
    transform: [{ scale: 0.98 }],
  },
  submitGradient: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  submitText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text.secondary,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.lg,

  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    fontSize: 14,
    color: COLORS.text.tertiary,
    marginHorizontal: SPACING.md,
  },
  socialButton: {
    backgroundColor: COLORS.background.tertiary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginTop: SPACING.xl,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',

  },
  socialButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text.secondary,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.xxl,
    marginBottom: SPACING.lg,
  },
  toggleText: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  toggleLink: {
    fontSize: 14,
    color: COLORS.brand.teal,
    fontWeight: '700',
  },
  guestButton: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  guestButtonText: {
    fontSize: 14,
    color: COLORS.text.tertiary,
    fontWeight: '600',
  },
});