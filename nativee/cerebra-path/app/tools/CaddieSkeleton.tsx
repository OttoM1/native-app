import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { C, SPACING, BORDER_RADIUS } from '../constants/theme';
import { useUser } from '../context/UserContext';
import { LinearGradient } from 'expo-linear-gradient';

import { useRouter } from 'expo-router';
import { canGoBack } from 'expo-router/build/global-state/routing';
import DashboardScreen from '../screens/DashboardScreen';



type ClubDistances = {
  [key: string]: number;
};

type WindType = 'headw' | 'tailw' | 'leftw' | 'rightw' | '';
type LieType = 'fairway' | 'rough' | 'sand' | 'tee' | '';
type PinType = 'front' | 'middle' | 'back' | '';
type MissType = 'none' | 'left' | 'right' | 'short' | 'long';
type HillType = 'hill10' | 'hill' | 'hill5' | 'nohill' | 'hill5' | 'hillneg10' | '';
type TempType = '10c' | '15c' | '20c' | '25c' | '30c' | '';

class Miss {
  type: MissType;

  constructor(type: MissType) {
    this.type = type;
  }

  penalty(): number {
    if (this.type === 'long') return +5;
    if (this.type === 'short') return -5;
    return 0;
  }
}

class PinPosition {
  position: PinType;

  constructor(position: PinType) {
    this.position = position;
  }

  adjustment(): number {
    if (this.position === 'front') return -1;
    if (this.position === 'back') return +1;
    return 0;
  }
}

class HillPosition {
  position: HillType;

  constructor(position: HillType) {
    this.position = position;
  }

  hill(): number {
    switch (this.position) {
      case 'hill10':
        return 6;
      case 'hill':
        return 3;
      case 'nohill':
        return 0;
      case 'hill5':
        return -3;
      case 'hillneg10':
        return -6;
      default:
        return 0;
    }
  }
}

class AirPosition {
  position: TempType;

  constructor(position: TempType) {
    this.position = position;
  }

  temp(): number {
    switch (this.position) {
      case '10c':
        return +4;
      case '15c':
        return +2;
      case '20c':
        return 0;
      case '25c':
        return -2;
      case '30c':
        return -4;
      default:
        return 0;
    }
  }
}

const metersToYards = (m: number): number => m * 1.09361;
const yardsToMeters = (y: number): number => y / 1.09361;
const celsiusToFahrenheit = (c: number): number => Math.round(c * 9 / 5 + 32);


const clubNameMap: { [key: string]: string } = {
  'Driver': 'driver',
  '3-Wood': '3-wood',
  '5-Wood': '5-wood',
  'Hybrid': 'hybrid',
  '3-iron': '3-iron',
  '4-iron': '4-iron',
  '5-iron': '5-iron',
  '6-iron': '6-iron',
  '7-iron': '7-iron',
  '8-iron': '8-iron',
  '9-iron': '9-iron',
  'P-Wedge': 'P-Wedge',
  'S-Wedge': 'S-Wedge',
  '60°-Wedge': '60-wedge',
};

const CaddieSkeleton: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [canDismiss, setCanDismiss] = useState(false);
  const textFadeAnim = useRef(new Animated.Value(0)).current;
  const introPulseAnim = useRef(new Animated.Value(1)).current;
  const contentFadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  const TEXT_SNIPPETS = [
    { main: "GoBirdie Caddy", sub: "version 1.0" },
    { main: "Every Variable", sub: "wind, elevation, temperature & lie" },
    { main: "Let's Begin", sub: "your personalized caddy experience" },
  ];
  
  const TEXT_DURATION = 2500;

  const [currentStep, setCurrentStep] = useState(0);
  const [isImperial, setIsImperial] = useState(true); 
  const { name, clubYardages } = useUser();

  const getInitialClubDistances = (): ClubDistances => {
    const distances: ClubDistances = {};
    
    Object.entries(clubNameMap).forEach(([userContextName, caddyName]) => {
      const yardage = clubYardages[userContextName];
      distances[caddyName] = yardage ? parseInt(yardage, 10) : 0;
    });
    
    return distances;
  };

  const [clubDistances, setClubDistances] = useState<ClubDistances>(getInitialClubDistances());

  const [distance, setDistance] = useState('');
  const [hill, setHill] = useState<HillType>('');
  const [pin, setPin] = useState<PinType>('');
  const [windSpeed, setWindSpeed] = useState('');
  const [windDir, setWindDir] = useState<WindType>('');
  const [temp, setTemp] = useState<TempType>('');
  const [lie, setLie] = useState<LieType>('');
  const [miss, setMiss] = useState<MissType>('none');

  const [recommendation, setRecommendation] = useState('');
  const [adjustedDistance, setAdjustedDistance] = useState(0);

  const clubs = [
    'driver',
    '3-wood',
    '5-wood',
    'hybrid',
    '3-iron',
    '4-iron',
    '5-iron',
    '6-iron',
    '7-iron',
    '8-iron',
    '9-iron',
    'P-Wedge',
    'S-Wedge',
    '60-wedge',
  ];


  useEffect(() => {
    setClubDistances(getInitialClubDistances());
  }, [clubYardages]);

  useEffect(() => {
    Animated.sequence([
      Animated.delay(300),
      Animated.timing(textFadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(introPulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(introPulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    if (!showIntro) return;

    const timer = setTimeout(() => {
      if (currentTextIndex < TEXT_SNIPPETS.length - 1) {
        Animated.timing(textFadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start(() => {
          setCurrentTextIndex(prev => prev + 1);
          Animated.timing(textFadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }).start();
        });
      } else {
        setCanDismiss(true);
      }
    }, TEXT_DURATION);

    return () => clearTimeout(timer);
  }, [currentTextIndex, showIntro]);

  const handleIntroTap = () => {
    if (!canDismiss) return;

    Animated.parallel([
      Animated.timing(textFadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(contentFadeAnim, {
        toValue: 1,
        duration: 800,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowIntro(false);
    });
  };

  const toggleUnits = () => {
    const newIsImperial = !isImperial;
    setIsImperial(newIsImperial);

    const convertedDistances: ClubDistances = {};
    clubs.forEach((club) => {
      const val = clubDistances[club];
      if (val && val > 0) {
        convertedDistances[club] = Math.round(
          newIsImperial ? metersToYards(val) : yardsToMeters(val)
        );
      } else {
        convertedDistances[club] = val;
      }
    });
    setClubDistances(convertedDistances);

    const distVal = parseFloat(distance);
    if (!isNaN(distVal)) {
      setDistance(
        Math.round(
          newIsImperial ? metersToYards(distVal) : yardsToMeters(distVal)
        ).toString()
      );
    }

    const windVal = parseFloat(windSpeed);
    if (!isNaN(windVal)) {
      setWindSpeed(
        (newIsImperial ? windVal * 2.237 : windVal / 2.237).toFixed(1)
      );
    }
  };

  const getClubRecommendation = () => {
    let dist = parseFloat(distance);
    const wSpeed = parseFloat(windSpeed);

    if (isNaN(dist) || isNaN(wSpeed)) {
      return {
        recommendation: 'Invalid input',
        adjustedDistance: 0,
      };
    }
    if (isImperial) {
      dist = yardsToMeters(dist);
    }

    let adjustedDist = dist;
    let windMultiplier = 1;
    const windSpeedMs = isImperial ? wSpeed / 2.237 : wSpeed;

    if (windSpeedMs < 5) windMultiplier = 1.048;
    else if (windSpeedMs < 10) windMultiplier = 1.132;
    else windMultiplier = 1.21;

    switch (windDir) {
      case 'headw':
        adjustedDist *= windMultiplier;
        break;
      case 'tailw':
        adjustedDist /= windMultiplier;
        break;
      case 'leftw':
      case 'rightw':
        adjustedDist *= 1 + (windMultiplier - 1) / 2;
        break;
    }

    if (lie === 'rough') adjustedDist -= 6;
    else if (lie === 'sand') adjustedDist += 5;
    else if (lie === 'tee') adjustedDist -= 3;

    adjustedDist += new PinPosition(pin).adjustment();
    adjustedDist += new Miss(miss).penalty();
    adjustedDist += new HillPosition(hill).hill();
    adjustedDist += new AirPosition(temp).temp();

    let clubDistancesMeters = { ...clubDistances };
    if (isImperial) {
      clubDistancesMeters = {};
      clubs.forEach((club) => {
        clubDistancesMeters[club] = yardsToMeters(clubDistances[club]);
      });
    }

    let bestClub = null;
    let bestClubDistance = 0;
    let minDiff = Infinity;

    for (const [club, clubDist] of Object.entries(clubDistancesMeters)) {
      if (clubDist === 0) continue;

      const diff = Math.abs(clubDist - adjustedDist);
      if (diff < minDiff) {
        minDiff = diff;
        bestClub = club;
        bestClubDistance = clubDist;
      }
    }

    let recommendationText = bestClub || 'No club found';
    if (bestClub) {
      const differenceFromBestClub = adjustedDist - bestClubDistance;
      const threshold = 2;

      if (differenceFromBestClub > threshold) {
        recommendationText = `100% ${bestClub}`;
      } else if (differenceFromBestClub < -threshold) {
        recommendationText = `85% ${bestClub}`;
      }
    }

    const finalAdjustedDistance = isImperial
      ? Math.round(metersToYards(adjustedDist))
      : Math.round(adjustedDist);

    return {
      recommendation: recommendationText,
      adjustedDistance: finalAdjustedDistance,
    };
  };

  const handleGetRecommendation = () => {
    const result = getClubRecommendation();
    setRecommendation(result.recommendation);
    setAdjustedDistance(result.adjustedDistance);
    nextStep();
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getHillOptions = () => {
    const hillData = [
      { value: 'hill10' as HillType, meters: 10 },
      { value: 'hill' as HillType, meters: 5 },
      { value: 'nohill' as HillType, meters: 0 },
      { value: 'hill5' as HillType, meters: -5 },
      { value: 'hillneg10' as HillType, meters: -10 },
    ];

    return hillData.map((h) => {
      const label = isImperial
        ? `${Math.round(h.meters * 1.0936)} yd`
        : `${h.meters} m`;
      return { value: h.value, label };
    });
  };

  const getTempOptions = () => {
    const temps = ['10c', '15c', '20c', '25c', '30c'] as TempType[];
    return temps.map((t) => {
      const celsius = parseInt(t);
      const label = isImperial
        ? `${celsiusToFahrenheit(celsius)}°F`
        : `${celsius}°C`;
      return { value: t, label };
    });
  };

  if (showIntro) {
    const currentSnippet = TEXT_SNIPPETS[currentTextIndex];
    
    return (
      <Pressable 
        onPress={handleIntroTap} 
        style={styles.introContainer}
        disabled={!canDismiss}
      >
        <LinearGradient
          colors={["#000000", "#000000"]}
          style={styles.introGradient}
        >
          <Animated.View
            style={[
              styles.introContent,
              {
                opacity: textFadeAnim,
              },
            ]}
          >
            <Text style={styles.introHello}>{currentSnippet.main}</Text>
            <Text style={styles.introSubtext}>{currentSnippet.sub}</Text>
          </Animated.View>

          {canDismiss && (
            <Animated.View 
              style={[
                styles.tapIndicator,
                { opacity: textFadeAnim }
              ]}
            >
              <Animated.Text style={[styles.tapIndicatorText, {
                transform: [{ scale: introPulseAnim }
                ]
              },
              ]}>tap anywhere to continue</Animated.Text>
            </Animated.View>
          )}
        </LinearGradient>
        
       </Pressable>
    );
  }

  const renderStep0 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>Distance Metrics</Text>
      <Text style={styles.subtitle}>Tell us about your shot</Text>

      <TextInput
        style={styles.inputField}
        keyboardType="numeric"
        placeholder={`Distance to pin (${isImperial ? 'yd' : 'm'})`}
        value={distance}
        onChangeText={setDistance}
        placeholderTextColor="rgba(224, 247, 255, 0.4)"
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={hill}
          onValueChange={(value) => setHill(value)}
          style={styles.picker}
        >
          <Picker.Item
            label={`Hill Elevation (${isImperial ? 'yd' : 'm'})`}
            value=""
          />
          {getHillOptions().map((opt) => (
            <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
          ))}
        </Picker>
      </View>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={pin}
          onValueChange={(value) => setPin(value)}
          style={styles.picker}
        >
          <Picker.Item label="Pin Position" value="" />
          <Picker.Item label="Front" value="front" />
          <Picker.Item label="Middle" value="middle" />
          <Picker.Item label="Back" value="back" />
        </Picker>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={nextStep}>
          <Text style={styles.buttonText}>Next →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>Weather Variables</Text>
      <Text style={styles.subtitle}>Current conditions</Text>

      <TextInput
        style={styles.inputField}
        keyboardType="numeric"
        placeholder={`Wind Speed (${isImperial ? 'mph' : 'm/s'})`}
        value={windSpeed}
        onChangeText={setWindSpeed}
        placeholderTextColor="rgba(222, 247, 255, 0.4)"
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={windDir}
          onValueChange={(value) => setWindDir(value)}
          style={styles.picker}
        >
          <Picker.Item label="Wind Direction" value="" />
          <Picker.Item label="⬅️ Left" value="leftw" />
          <Picker.Item label="➡️ Right" value="rightw" />
          <Picker.Item label="⬆️ Head" value="headw" />
          <Picker.Item label="⬇️ Tail" value="tailw" />
        </Picker>
      </View>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={temp}
          onValueChange={(value) => setTemp(value)}
          style={styles.picker}
        >
          <Picker.Item
            label={`Air Temperature ${isImperial ? '°F' : '°C'}`}
            value=""
          />
          {getTempOptions().map((opt) => (
            <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
          ))}
        </Picker>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.buttonSecondary} onPress={prevStep}>
          <Text style={styles.buttonText}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={nextStep}>
          <Text style={styles.buttonText}>Next →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>Shot Specifics</Text>
      <Text style={styles.subtitle}>Final details</Text>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={lie}
          onValueChange={(value) => setLie(value)}
          style={styles.picker}
        >
          <Picker.Item label="Your Lie" value="" />
          <Picker.Item label="Fairway" value="fairway" />
          <Picker.Item label="Rough" value="rough" />
          <Picker.Item label="Sand" value="sand" />
          <Picker.Item label="Tee Box" value="tee" />
        </Picker>
      </View>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={miss}
          onValueChange={(value) => setMiss(value)}
          style={styles.picker}
        >
          <Picker.Item label="Preferred Miss" value="none" />
          <Picker.Item label="⬅️ Left" value="left" />
          <Picker.Item label="➡️ Right" value="right" />
          <Picker.Item label="⬇️ Short" value="short" />
          <Picker.Item label="⬆️ Long" value="long" />
        </Picker>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.buttonSecondary} onPress={prevStep}>
          <Text style={styles.buttonText}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={nextStep}>
          <Text style={styles.buttonText}>Next →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>Ready to Calculate</Text>
      <Text style={styles.subtitle}>Get your recommendation</Text>

      <TouchableOpacity
        style={styles.buttonLarge}
        onPress={handleGetRecommendation}
      >
        <Text style={styles.buttonText}>⚡ Calculate Shot</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonSecondary} onPress={prevStep}>
        <Text style={styles.buttonText}>← Back</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>Your Recommendation</Text>
      <Text style={styles.subtitle}>Calculated for precision</Text>

      <View style={styles.resultContainer}>
        <Text style={styles.resultLabel}>Club Selection</Text>
        <Text style={styles.resultText}>{recommendation}</Text>
        
        <View style={styles.resultDivider} />
        
        <Text style={styles.resultLabel}>Adjusted Distance</Text>
        <Text style={styles.resultText}>
          {adjustedDistance} {isImperial ? 'yd' : 'm'}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setCurrentStep(0)}
      >
        <Text style={styles.buttonText}>🔄 New Calculation</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        style={styles.gradient}
        colors={["#101010", "#101010", "#050505", "#000", "#000"]}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
      >

        <Pressable
       onPress={() => router.push('../screens/DashboardScreen')}
        >
        
          <Text style={[styles.buttonText, { color: C.h.r, }]}>← Return Home</Text>

        </Pressable>

        {currentStep === 0 && renderStep0()}
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  introContainer: {
    flex: 1,
  },
  introGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  introContent: {
    alignItems: 'center',
  },
  introHello: {
    fontSize: 42,
    fontWeight: '700',
    color: C.h.graphite,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    fontFamily: 'System',
    letterSpacing: -1,
  },
  introSubtext: {
    fontSize: 16,
    color: C.h.r,
    textAlign: 'center',
    opacity: 0.7,
    letterSpacing: 1,
  },
  tapIndicator: {
    position: 'absolute',
    bottom: 60,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
  },
  tapIndicatorText: {
    fontSize: 13,
    color: C.h.graphite,
    opacity: 0.6,
    letterSpacing: 1,
  },
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  stepContainer: {
    width: '100%',
    maxWidth: 500,
    padding: SPACING.xl,
  },
  scrollContent: {
    paddingBottom: SPACING.xxl,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: C.h.bluemint,
    textAlign: 'center',
    marginBottom: SPACING.md,
    fontFamily: 'System',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 15,
    color: C.h.graphite,
    textAlign: 'center',
    marginBottom: SPACING.xxl,
    opacity: 0.7,
  },
  card: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: 'rgba(113, 250, 204, 0.15)',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: 16,
    color: C.h.graphite,
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    color: C.h.bluemint,
    fontSize: 16,
    fontWeight: '700',
    minWidth: 80,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: C.h.bluemint + '40',
  },
  inputField: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    color: C.h.bluemint,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(113, 250, 204, 0.2)',
  },
  pickerContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(113, 250, 204, 0.2)',
    overflow: 'hidden',
  },
  picker: {
    color: C.h.bluemint,
    backgroundColor: 'transparent',
  },
  toggleButton: {
    backgroundColor: C.h.bluemint + '20',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.h.bluemint + '40',
  },
  toggleButtonText: {
    color: C.h.bluemint,
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: C.h.bluemint,
  },
  buttonSecondary: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(113, 250, 204, 0.3)',
  },
  buttonLarge: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.xl,
    borderWidth: 2,
    borderColor: C.h.mint,
  },
  buttonText: {
    color: C.h.bluemint,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  resultContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xxl,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: 'rgba(113, 250, 204, 0.3)',
  },
  resultLabel: {
    fontSize: 14,
    color: C.h.graphite,
    textAlign: 'center',
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
    opacity: 0.7,
  },
  resultText: {
    fontSize: 32,
    fontWeight: '700',
    color: C.h.mint,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  resultDivider: {
    height: 1,
    backgroundColor: 'rgba(113, 250, 204, 0.2)',
    marginVertical: SPACING.lg,
  },
});

export default CaddieSkeleton;



//introvideo before results