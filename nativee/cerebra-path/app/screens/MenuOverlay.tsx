import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { useRouter, Href } from 'expo-router';
const { width, height } = Dimensions.get('window');
interface MenuOverlayProps {
  visible: boolean;
  onClose: () => void;
}

export function MenuOverlay({ visible, onClose }: MenuOverlayProps) {
  const router = useRouter();
  const slideAnim = useRef(new Animated.Value(width)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [shouldRender, setShouldRender] = React.useState(visible);

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: width, duration: 250, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]).start(() => setShouldRender(false)); 
    }
  }, [visible]);

  if (!shouldRender) return null;

  const menuItems = [
    {
    email: 'lol',
  },
    {
      id: 'home',
      title: 'Home',
      icon: 'x',
      route: '/dashboard',
      description: 'Your learning dashboard',
    },
    {
      id: 'challenges',
      title: 'Challenges',
      icon: 'x',
      route: '/challenges',
      description: 'Browse all challenges',
    },
    {
      id: 'progress',
      title: 'Progress',
      icon: 'x',
      route: '/progress',
      description: 'Track your skills',
    },
    {
      id: 'profile',
      title: 'Profile',
      icon: 'x',
      route: '/profile',
      description: 'View your profile',
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: 'x',
      route: '/settings',
      description: 'App preferences',
    },
  ];

  const handleNavigate = (route: './ChallengesScreen') => {
    onClose();
    setTimeout(() => {
      router.push(route);
    }, 300);
  };

  const handleLogout = () => {
    onClose();
    setTimeout(() => {
      router.replace('/');
    }, 300);
  };

  return (
    <View style={styles.overlay}>

      <Animated.View
        style={[
          styles.backdrop,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <Pressable style={styles.backdropPress} onPress={onClose} />
      </Animated.View>






      <Animated.View
        style={[
          styles.menuPanel,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <LinearGradient
          colors={[COLORS.background.primary, COLORS.background.secondary]}
          style={styles.menuGradient}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.menuContent}
          >




            <View style={styles.menuHeader}>
              <View style={styles.headerTop}>
                <View style={styles.logoContainer}>
                  <LinearGradient
                    colors={[COLORS.border, COLORS.success]}
                    style={styles.miniLogo}
                  >
                    <Text style={styles.miniLogoText}>69</Text>
                  </LinearGradient>
                  <View>
                    <Text style={styles.appName}>Cerebra Path</Text>
                    {menuItems.map((item, index) => (

                      <Text style={styles.userEmail} key={item.id}>{item.email}</Text>
                    ))}

                    </View>
                </View>
                <Pressable
                  onPress={onClose}
                  style={({ pressed }) => [
                    styles.closeButton,
                    pressed && { opacity: 0.6 },
                  ]}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </Pressable>
              </View>
            </View>




            <View style={styles.menuSection}>
              <Text style={styles.sectionTitle}></Text>
              {menuItems.map((item, index) => (
                <Pressable
                  key={item.id}
                  onPress={() => handleNavigate('./ChallengesScreen')}
                  style={({ pressed }) => [
                    styles.menuItem,
                    pressed && styles.menuItemPressed,
                  ]}
                >
                  <View style={styles.menuItemIcon}>
                    <Text style={styles.menuItemEmoji}>{item.icon}</Text>
                  </View>
                  <View style={styles.menuItemContent}>
                    <Text style={styles.menuItemTitle}>{item.title}</Text>
                    <Text style={styles.menuItemDescription}>
                      {item.description}
                    </Text>
                  </View>
                  <Text style={styles.menuItemArrow}>→</Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.menuSection}>
              <Text style={styles.sectionTitle}>Account</Text>
              
              <Pressable
                onPress={() => handleNavigate('./ChallengesScreen')}
                style={({ pressed }) => [
                  styles.menuItem,
                  pressed && styles.menuItemPressed,
                ]}
              >
                <View style={styles.menuItemIcon}>
                  <Text style={styles.menuItemEmoji}>✏️</Text>
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemTitle}>Edit Profile</Text>
                  <Text style={styles.menuItemDescription}>
                    Update your information
                  </Text>
                </View>
                <Text style={styles.menuItemArrow}>→</Text>
              </Pressable>

              <Pressable
                onPress={handleLogout}
                style={({ pressed }) => [
                  styles.menuItem,
                  styles.logoutItem,
                  pressed && styles.menuItemPressed,
                ]}
              >
                <View style={styles.menuItemIcon}>
                  <Text style={styles.menuItemEmoji}>69</Text>
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={[styles.menuItemTitle, styles.logoutText]}>
                    Log Out
                  </Text>
                  <Text style={styles.menuItemDescription}>
                    Sign out of your account
                  </Text>
                </View>
              </Pressable>
            </View>

            <View style={styles.appInfo}>
              <Text style={styles.appInfoText}>Cerebra Path v1.0.0</Text>
              <Text style={styles.appInfoText}>© 2026 Cerebra Path</Text>
            </View>
          </ScrollView>
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

export function MenuButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.menuButton,
        pressed && { opacity: 0.6 },
      ]}
    >
      <View style={styles.hamburger}>
        <View style={styles.hamburgerLine} />
        <View style={styles.hamburgerLine} />
        <View style={styles.hamburgerLine} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
    backdropPress: {
    flex: 1,
  },
  menuPanel: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: width * 0.85,
    maxWidth: 400,
  },
  menuGradient: {
    flex: 1,
  },
  menuContent: {
    paddingVertical: SPACING.xl,
  },

  // 
  menuHeader: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.success,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.brand.tealLight,
  },
  miniLogoText: {
    fontSize: 20,
    fontWeight: '800',
    color: 'white',
  },
  appName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    color: COLORS.text.tertiary,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor:'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 26,
    color: COLORS.text.disabled,
    fontWeight: '800',
  },

  menuSection: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.md,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  menuItemPressed: {
    backgroundColor: COLORS.background.secondary,
    transform: [{ scale: 0.98 }],
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  menuItemEmoji: {
    fontSize: 20,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  menuItemDescription: {
    fontSize: 12,
    color: COLORS.text.tertiary,
  },
  menuItemArrow: {
    fontSize: 18,
    color: COLORS.text.tertiary,
  },
  logoutItem: {
    borderColor: COLORS.error + '60',
    backgroundColor: COLORS.error + '10',
  },
  logoutText: {
    color: COLORS.error,
  },

  appInfo: {
    paddingHorizontal: SPACING.xs,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.xs,
    alignItems: 'center',
  },
  appInfoText: {
    fontSize: 11,
    color: COLORS.text.disabled,
    marginBottom: 4,
  },

  menuButton: {
    width: 40,
    height: 40,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
     
    fontSize: 28,
    
  },
  hamburger: {
    width: 36,
    height: 26,
    justifyContent: 'space-between',
  },
  hamburgerLine: {
    width: '100%',
    height: 3,
    backgroundColor: COLORS.text.primary,
    borderRadius: 1,
  },
});