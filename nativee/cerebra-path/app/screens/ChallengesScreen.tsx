import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  FlatList,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProgress } from '../context/ProgressContext';
import { CATEGORIES, CHALLENGES, Challenge } from '../data/challenges';
import { C, SPACING, BORDER_RADIUS } from '../constants/theme';
import { useRouter } from 'expo-router';

export default function ChallengesScreen() {

const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);
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
            friction: 5,
            useNativeDriver: true,
          }),
        ]).start();
      }, []);

    const router = useRouter();
  const { progress } = useProgress();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);


  const filteredChallenges = selectedCategory
    ? CHALLENGES.filter(c => c.category === selectedCategory)
    : CHALLENGES;

  const renderChallenge = ({ item: challenge }: { item: Challenge }) => {
    const category = CATEGORIES.find(c => c.id === challenge.category);
    const isCompleted = progress.completedChallenges.includes(challenge.id);


  
    
    
    return (
      <Pressable
        onPress={() => router.push('./screens/ChallengesDetailScreen')}
        // , { challengeId: challenge.id }

       
       
            
        style={({ pressed }) => [
          styles.challengeCard,
          isCompleted && styles.challengeCardCompleted,
          pressed && { opacity: 0.8 },
        ]}
      >
        <View style={styles.challengeHeader}>
          <View
            style={[
              styles.categoryIcon,
              { backgroundColor: category?.color + '20' },
            ]}
          >
            <Text style={styles.categoryEmoji}>{category?.icon}</Text>
          </View>
          {isCompleted && (
            <View style={styles.completedBadge}>
              <Text style={styles.completedText}>✓ Completed</Text>
            </View>
          )}
        </View>

        <Text style={styles.challengeTitle}>{challenge.title}</Text>
        <Text style={styles.challengeDescription} numberOfLines={2}>
          {challenge.description}
        </Text>

        <View style={styles.challengeFooter}>
          <View style={styles.tags}>
            <View
              style={[
                styles.difficultyBadge,
                challenge.difficulty === 'beginner' && styles.difficultyBeginner,
                challenge.difficulty === 'intermediate' && styles.difficultyIntermediate,
                challenge.difficulty === 'advanced' && styles.difficultyAdvanced,
              ]}
            >
              <Text style={styles.difficultyText}>{challenge.difficulty}</Text>
            </View>
            <Text style={styles.duration}>⏱ {challenge.duration}</Text>
          </View>

          <View style={styles.skillTags}>
            {challenge.skills.slice(0, 2).map((skill, index) => (
              <View key={index} style={styles.skillTag}>
                <Text style={styles.skillTagText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>
      </Pressable>
    );
  };



  return (
    <LinearGradient
      colors={['white', 'white']}
      style={styles.container}
    >
      <AnimatedSafeAreaView style={[styles.safeArea, {opacity: fadeAnim,  transform: [{ translateY: slideAnim }] }]}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.push('./DashboardScreen')}
            style={styles.backButton}
          >
            <Text style={styles.backText}>← Back</Text>
          </Pressable>
          <Text style={styles.title}>All Challenges</Text>
          <Text style={styles.subtitle}>
            {filteredChallenges.length} challenges available
          </Text>
        </View>

       
        {/* Challenges list */}
        <FlatList
          data={filteredChallenges}
          renderItem={renderChallenge}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </AnimatedSafeAreaView>
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
  header: {
    padding: SPACING.lg,
  },
  backButton: {
    marginBottom: SPACING.sm,
  },
  backText: {
    fontSize: 16,
    color: C.h.graphite,
    fontWeight: '600',
  },
  title: {
    fontSize: 46,
    fontWeight: '500',
    fontFamily: 'System',
    color: C.h.baby,
    marginBottom: SPACING.xs,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 14,
    color: C.h.graphite,
  },
  filterContainer: {
    height: 160,
    zIndex: 9999,
    marginBottom: SPACING.sm,
    marginTop: SPACING.lg,
        paddingBottom: SPACING.sm,

  },
  filterContent: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: C.h.mint,
    borderWidth: 1,
    borderColor:C.h.mint,
    marginRight: SPACING.sm,
  },
  filterChipActive: {
    backgroundColor: C.h.link + '30',
    borderColor: C.h.link,
  },
  filterEmoji: {
    fontSize: 16,
    marginRight: SPACING.xs,
  },
  filterText: {
    fontSize: 14,
    color: C.h.graphite,
    fontWeight: '600',
  },
  filterTextActive: {
    color: C.h.graphite,
  },
  listContent: {
    padding: SPACING.lg,
  },
  challengeCard: {
    backgroundColor: 'white',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: C.h.mint,
  },
  challengeCardCompleted: {
    borderColor: C.h.mint,
    backgroundColor: C.h.mint + '10',
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryEmoji: {
    fontSize: 20,
  },
  completedBadge: {
    backgroundColor: C.h.mint,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  completedText: {
    fontSize: 12,
    fontWeight: '600',
    color: C.h.graphite,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: C.h.graphite,
    marginBottom: SPACING.sm,
  },
  challengeDescription: {
    fontSize: 14,
    color: C.h.graphite,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  challengeFooter: {
    flexDirection: 'column',
  },
  tags: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  difficultyBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
    marginRight: SPACING.sm,
  },
  difficultyBeginner: {
    backgroundColor: C.h.mint + '30',
  },
  difficultyIntermediate: {
    backgroundColor: C.h.bluemint + '30',
  },
  difficultyAdvanced: {
    backgroundColor: C.h.error + '30',
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '600',
    color:C.h.graphite,
    textTransform: 'capitalize',
  },
  duration: {
    fontSize: 12,
    color: C.h.graphite,
  },
  skillTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillTag: {
    backgroundColor: C.h.bluemint,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  skillTagText: {
    fontSize: 11,
    color: C.h.graphite,
  },
});



/*

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          <Pressable
            onPress={() => setSelectedCategory(null)}
            style={({ pressed }) => [
              styles.filterChip,
              selectedCategory === null && styles.filterChipActive,
              pressed && { opacity: 0.7 },
            ]}
          >
            <Text
              style={[
                styles.filterText,
                selectedCategory === null && styles.filterTextActive,
              ]}
            >
              All
            </Text>
          </Pressable>

          {CATEGORIES.map(category => (
            <Pressable
              key={category.id}
              onPress={() => setSelectedCategory(category.id)}
              style={({ pressed }) => [
                styles.filterChip,
                selectedCategory === category.id && styles.filterChipActive,
                selectedCategory === category.id && {
                  backgroundColor: category.color + '30',
                  borderColor: category.color,
                },
                pressed && { opacity: 0.7 },
              ]}
            >
              <Text style={styles.filterEmoji}>{category.icon}</Text>
              <Text
                style={[
                  styles.filterText,
                  selectedCategory === category.id && styles.filterTextActive,
                ]}
              >
                {category.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>


*/