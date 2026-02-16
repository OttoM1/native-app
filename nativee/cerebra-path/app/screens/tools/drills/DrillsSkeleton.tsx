import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  Pressable,
} from 'react-native';
import { C, SPACING, BORDER_RADIUS } from '../../../constants/theme';
import { useUser } from '../../../context/UserContext';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useRouter } from 'expo-router';


export default function DrillsSkeleton() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
  const router = useRouter();
  const { name } = useUser();

  useEffect(() => {
    Animated.sequence([
      Animated.delay(0),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();


        
    Animated.sequence([
      Animated.delay(200),
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]); 

  return (

    <LinearGradient
      colors={["#000", "#000", "#000000"]}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.container}
    >



      <SafeAreaView style={styles.safeArea}>
        <Animated.ScrollView style={[styles.wrapper, { opacity: fadeAnim }]}>
          
          <Pressable onPress={() => router.replace('/screens/DashboardScreen')}>
            <Text style={styles.backText}>← Back</Text>
          </Pressable>

          

          <View style={styles.header}>
            <View style={styles.headerRow}>
              <Text style={styles.title}>Practice Drills</Text>
            </View>
          </View>



          <View style={styles.align}>
                    
          <Pressable 
            onPress={() => router.push('./tailoredDrills')}
            style={styles.tailoredDrills}
          >
            <Text style={styles.tailoredTitle}>Drills Tailored for {name}</Text>
          </Pressable>
                
            



          <Pressable 
            style={styles.generalDrills}
            onPress={() => router.push('./generalDrills')}
          >
            <Text style={styles.generalTitle}>General Drills</Text>
            </Pressable>
            

            </View>

        </Animated.ScrollView>            
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
  wrapper: {
    paddingHorizontal: SPACING.sd,
    paddingVertical: SPACING.lg,
    
  },

  align: {
   alignItems: 'center',
    alignContent: 'center',
    display: 'flex',
    marginTop: SPACING.xxl,
  },
  header: {
    marginBottom: SPACING.xxl,
  },


  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: SPACING.sd,
  },
  title: {
    marginBottom: SPACING.xs,
    fontSize: 54,
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: -1,
    color: C.h.bluemint,
  },
  backText: {
    fontSize: 22,
    color: C.h.r,
    padding: SPACING.sd,
  },
  tailoredDrills: {
    width: 400,
    maxWidth: '80%',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderColor: C.h.mint,
    borderWidth: 1,
    backgroundColor: 'rgba(0, 10, 8, 0.25)',
    textAlign: 'center',
    marginVertical: SPACING.xl,
  },


  generalDrills: {
    width: 400,
    maxWidth: '80%',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderColor: C.h.mint,
    borderWidth: 1,
    backgroundColor: 'rgba(0, 10, 8, 0.25)',
    textAlign: 'center',
    marginVertical: SPACING.xl,
  },
  tailoredTitle: {
    fontSize: 24,
    color: C.h.baby,
    textAlign: 'center',
  },
  generalTitle: {
        textAlign: 'center',

    fontSize: 24,
    color: C.h.baby,
  },
});