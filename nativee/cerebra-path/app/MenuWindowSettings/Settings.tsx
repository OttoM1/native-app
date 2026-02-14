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
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C, SPACING, BORDER_RADIUS } from '../constants/theme';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const GOLF_CLUBS = [
  { id: 'Driver', icon: '🏌️', category: 'Woods' },
  { id: '3-Wood', icon: '🏌️', category: 'Woods' },
  { id: '5-Wood', icon: '🏌️', category: 'Woods' },
  { id: 'Hybrid', icon: '🏌️', category: 'Hybrids' },
  { id: '3-iron', icon: '🏌️', category: 'Irons' },
  { id: '4-iron', icon: '🏌️', category: 'Irons' },
  { id: '5-iron', icon: '🏌️', category: 'Irons' },
  { id: '6-iron', icon: '🏌️', category: 'Irons' },
  { id: '7-iron', icon: '🏌️', category: 'Irons' },
  { id: '8-iron', icon: '🏌️', category: 'Irons' },
  { id: '9-iron', icon: '🏌️', category: 'Irons' },
  { id: 'P-Wedge', icon: '⛳', category: 'Wedges' },
  { id: 'S-Wedge', icon: '⛳', category: 'Wedges' },
  { id: '60°-Wedge', icon: '⛳', category: 'Wedges' },
];

export default function Settings() {
  const router = useRouter();
  const { email, name, password } = useUser();
  const { clubYardages, setClubYardage } = useUser();
  const [editMode, setEditMode] = useState(false);

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

  const handleYardageChange = (clubId: string, value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setClubYardage(clubId, numericValue);
  };

  const groupedClubs = GOLF_CLUBS.reduce((acc, club) => {
    if (!acc[club.category]) {
      acc[club.category] = [];
    }
    acc[club.category].push(club);
    return acc;
  }, {} as Record<string, typeof GOLF_CLUBS>);

  return (
    <LinearGradient
      colors={["#101010", "#050505", "#050505", "#000", "#000"]}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
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
            <Pressable 
              style={styles.backButton}
              onPress={() => router.push('../screens/DashboardScreen')}
            >
              <Text style={styles.backText}>← Back</Text>
            </Pressable>

            <Text style={styles.title}>General Settings</Text>





            <View style={styles.infobox}>
              <Text style={styles.text}>
                Username: <Text style={styles.span}>{name}</Text>
              </Text>
              <View style={styles.divider}>
                <View style={styles.dividerLine}></View>
              </View>

              <Text style={styles.text}>
                Email: <Text style={styles.span}>{email}</Text>
              </Text>
              <View style={styles.divider}>
                <View style={styles.dividerLine}></View>
              </View>

              <Text style={styles.text}>
                Password: <Text style={styles.span}>{password}</Text>
              </Text>
               <View style={styles.divider}>
                <View style={styles.dividerLine}></View>
              </View>

            </View>


            <View style={styles.clubSection}>
              <View style={styles.clubHeader}>
                <Text style={styles.clubSectionTitle}>Club Yardages</Text>
                <Pressable 
                  onPress={() => setEditMode(!editMode)}
                  style={styles.editButton}
                >
                  <Text style={styles.editButtonText}>
                    {editMode ? 'Done' : 'Edit'}
                  </Text>
                </Pressable>
              </View>

              {Object.entries(groupedClubs).map(([category, clubs]) => (
                <View key={category} style={styles.clubCategory}>
                  <Text style={styles.categoryTitle}>{category}</Text>
                  
                  {clubs.map((club) => (
                    <View key={club.id} style={styles.clubRow}>
                      <View style={styles.clubInfo}>
                        <Text style={styles.clubIcon}>{club.icon}</Text>
                        <Text style={styles.clubName}>{club.id}</Text>
                      </View>

                      {editMode ? (
                        <View style={styles.inputWrapper}>
                          <TextInput
                            style={styles.yardageInput}
                            placeholder="0"
                            placeholderTextColor={C.h.graphite + '40'}
                            value={clubYardages[club.id]}
                            onChangeText={(value) => handleYardageChange(club.id, value)}
                            keyboardType="number-pad"
                            maxLength={3}
                          />
                          <Text style={styles.yardageUnit}>yds</Text>
                        </View>
                      ) : (
                        <View style={styles.yardageDisplay}>
                          <Text style={styles.yardageValue}>
                            {clubYardages[club.id] || '—'}
                          </Text>
                          <Text style={styles.yardageUnit}>yds</Text>
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              ))}
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
      color: C.h.bluemint,
            filter: 'brightness(1.4)',

  },
    
  backButton: {
    marginBottom: SPACING.lg,
  },
  backText: {
    fontSize: 16,
    color: C.h.r,
    fontWeight: '600',
  },
   
  infobox: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginVertical: SPACING.xxl,
  },

  text: {
    color: '#444',
    fontSize: 22,
    marginBottom: SPACING.lg,
    fontWeight: 600,
  },

  span: {
    color: C.h.r,
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

  clubSection: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: 'rgba(113, 250, 204, 0.15)',
  },
  clubHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  clubSectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: C.h.graphite,
    fontFamily: 'System',
    letterSpacing: -0.5,
  },
  editButton: {
    backgroundColor:'rgba(20, 0, 0, 0.3)',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: C.h.r,
  },
  editButtonText: {
    color: C.h.graphite,
    fontSize: 14,
    fontWeight: '600',
  },
  clubCategory: {
    marginBottom: SPACING.xl,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: C.h.r,
    marginBottom: SPACING.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
    opacity: 0.8,
  },
  clubRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(113, 250, 204, 0.05)',
  },
  clubInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  clubIcon: {
    fontSize: 20,
  },
  clubName: {
    fontSize: 16,
    fontWeight: '600',
    color: C.h.graphite,
  },
  yardageDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  yardageValue: {
    fontSize: 18,
    fontWeight: '700',
    color: C.h.bluemint,
    minWidth: 40,
    textAlign: 'right',
  },
  yardageUnit: {
    fontSize: 14,
    color: C.h.graphite,
    opacity: 0.6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: C.h.bluemint + '40',
  },
  yardageInput: {
    fontSize: 18,
    fontWeight: '700',
    color: C.h.bluemint,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    textAlign: 'right',
    minWidth: 50,
  },
});







//light mode toggle
//change other information from onboarding inputs/selection