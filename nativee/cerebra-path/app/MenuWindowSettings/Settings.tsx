import React, { useEffect, useRef, useState } from 'react';
import { useUser } from '../context/UserContext';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C, SPACING, BORDER_RADIUS } from '../constants/theme';
import { useRouter } from 'expo-router';
const { width } = Dimensions.get('window');

export default function Settings() {
          const router = useRouter();
       const { email, name, password } = useUser();
     

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

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
    ]).start();
  }, []);
    
    
    
    
    
    
  return (
    <LinearGradient
      colors={['white', 'white', '#ffff']}
      start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
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

                      
  <Pressable style={styles.backButton}
onPress={() => router.push('../screens/DashboardScreen')}
            >
              <Text style={styles.backText}>
                ← Back
                </Text>
            </Pressable>


<Text style={styles.title}>General Settings</Text>





<View style={styles.infobox}>
            
              <Text style={styles.text} >Userame:  <Text style={styles.span}>{name}</Text> </Text>
              <View style={styles.divider}>
                <View style={styles.dividerLine}></View>
                </View>
            <Text style={styles.text}>Email:  <Text style={styles.span}>{email}</Text> </Text>
 <View style={styles.divider}>
                <View style={styles.dividerLine}></View>
                </View>
            <Text style={styles.text}>Password: <Text style={styles.span}> {password}</Text> </Text>
 <View style={styles.divider}>
                <View style={styles.dividerLine}></View>
                </View>

</View>

            



          </Animated.View>

        
        </ScrollView>
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
    scrollContent: {
        padding: SPACING.lg,
        paddingBottom: SPACING.xxl,
    },
    header: {
        marginBottom: SPACING.xl,
    },
    greeting: {
        fontSize: 16,
        color: C.h.graphite,
        marginBottom: SPACING.xl,
        paddingLeft: SPACING.sm,
    },

    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    title: {
      marginBottom: SPACING.xxl,
      marginTop: SPACING.lg,
        fontSize: 40,
        textAlign: 'left',
        fontWeight: '500',
        fontFamily: 'System',
        letterSpacing: -1,
        color: C.h.baby,
  },
    
  backButton: {
    marginBottom: SPACING.lg,
  },
  backText: {
    fontSize: 16,
    color: C.h.graphite,
    fontWeight: '600',
  },
   
  infobox: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginVertical: SPACING.xxl,
  },

  text: {
    color: C.h.graphite,
    fontSize: 22,
    marginBottom: SPACING.lg,
    fontWeight: 600,
  },

  span: {
    color: C.h.link,
    fontSize: 20,
    fontWeight: 200,
  },

  divider: {
    flexDirection: 'row',
    alignItems: 'center',
 marginBottom: SPACING.xl,

  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: C.h.graphite,

  },
});