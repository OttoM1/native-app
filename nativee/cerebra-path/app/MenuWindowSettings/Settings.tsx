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
      colors={['white', 'white', 'white', C.h.bluemint]}
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

                      
<Text style={styles.title}>General Settings</Text>



          </Animated.View>
          
          <View style={styles.infobox}>
            <Text style={styles.text} >Userame:  {name} </Text>
              <Text style={styles.text}>Email:  {email} </Text>
            <Text style={styles.text}>Password:  {password} </Text>

</View>


        
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
        fontSize: 42,
        textAlign: 'left',
        fontWeight: '500',
        fontFamily: 'System',
        letterSpacing: -1,
        color: C.h.baby,
    },
   
  infobox: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: SPACING.xxl,
  },

  text: {
    color: C.h.graphite,
    fontSize: 20,
    marginBottom: SPACING.lg,
    fontWeight: 600,
  },
});