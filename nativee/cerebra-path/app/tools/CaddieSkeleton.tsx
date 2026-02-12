import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
    ScrollView,
  Animated,
    StyleSheet,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { C, SPACING, BORDER_RADIUS } from '../constants/theme';
import { useUser } from '../context/UserContext';


import { LinearGradient } from 'expo-linear-gradient';
type ClubDistances = {
  [key: string]: number;
};

type WindType = 'headw' | 'tailw' | 'leftw' | 'rightw' | '';
type LieType = 'fairway' | 'rough' | 'sand' | 'tee' | '';
type PinType = 'front' | 'middle' | 'back' | '';
type MissType = 'none' | 'left' | 'right' | 'short' | 'long';
type HillType = 'hill10' | 'hill' | 'nohill' | 'hill5' | 'hillneg10' | '';
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

// metri/yardi
const metersToYards = (m: number): number => m * 1.09361;
const yardsToMeters = (y: number): number => y / 1.09361;
const celsiusToFahrenheit = (c: number): number => Math.round(c * 9 / 5 + 32);

// skeletoni
const CaddieSkeleton: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isImperial, setIsImperial] = useState(false);


    const [clubDistances, setClubDistances] = useState<ClubDistances>({
    driver: 250,
    '3-wood': 230,
    '5-wood': 215,
    '3-iron': 210,
    '4-iron': 195,
    '5-iron': 180,
    '6-iron': 165,
    '7-iron': 155,
    '8-iron': 145,
    '9-iron': 135,
    'P-Wedge': 120,
    'S-Wedge': 105,
  });

  // live data
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
    '3-iron',
    '4-iron',
    '5-iron',
    '6-iron',
    '7-iron',
    '8-iron',
    '9-iron',
    'P-Wedge',
    'S-Wedge',
  ];

  const updateClubDistance = (club: string, value: string) => {
    const numValue = parseFloat(value);
    setClubDistances((prev) => ({
      ...prev,
      [club]: isNaN(numValue) ? 0 : numValue,
    }));
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
    if (currentStep < 5) {
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








    const renderStep0 = () => (
        <ScrollView
            style={styles.stepContainer} showsVerticalScrollIndicator={false}>
            
            <LinearGradient
                
      colors={["#101010", "#050505", "#050505", "#000", "#000"]}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
            
            
            >

      <Text style={styles.title}>Set your club carry distances</Text>
      <Text style={styles.subtitle}>({isImperial ? 'yd' : 'm'})</Text>

      <TouchableOpacity style={styles.toggleButton} onPress={toggleUnits}>
        <Text style={styles.toggleButtonText}>
          {isImperial ? 'Imperial' : 'Metric'}
        </Text>
      </TouchableOpacity>

      <View style={styles.card}>
        {clubs.map((club) => (
          <View key={club} style={styles.inputRow}>
            <Text style={styles.label}>
              {club.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
              :
            </Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={clubDistances[club]?.toString() || ''}
              onChangeText={(val) => updateClubDistance(club, val)}
            />
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={nextStep}>
        <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
                </LinearGradient>
    </ScrollView>
  );

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>Distance Metrics</Text>

      <TextInput
        style={styles.inputField}
        keyboardType="numeric"
        placeholder={`Distance to the pin (${isImperial ? 'yd' : 'm'})`}
        value={distance}
        onChangeText={setDistance}
        placeholderTextColor="#999"
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
          <Picker.Item label="Select the pin position" value="" />
          <Picker.Item label="Front" value="front" />
          <Picker.Item label="Middle" value="middle" />
          <Picker.Item label="Back" value="back" />
        </Picker>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.buttonSecondary} onPress={prevStep}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={nextStep}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>Weather Variables</Text>

      <TextInput
        style={styles.inputField}
        keyboardType="numeric"
        placeholder={`Wind Speed (${isImperial ? 'mph' : 'm/s'})`}
        value={windSpeed}
        onChangeText={setWindSpeed}
        placeholderTextColor="#999"
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={windDir}
          onValueChange={(value) => setWindDir(value)}
          style={styles.picker}
        >
          <Picker.Item label="Wind Direction" value="" />
          <Picker.Item label="Left" value="leftw" />
          <Picker.Item label="Right" value="rightw" />
          <Picker.Item label="Head" value="headw" />
          <Picker.Item label="Tail" value="tailw" />
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
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={nextStep}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>Specifics</Text>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={lie}
          onValueChange={(value) => setLie(value)}
          style={styles.picker}
        >
          <Picker.Item label="Choose Your Lie" value="" />
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
          <Picker.Item label="Where would you rather miss" value="none" />
          <Picker.Item label="Left" value="left" />
          <Picker.Item label="Right" value="right" />
          <Picker.Item label="Short" value="short" />
          <Picker.Item label="Long" value="long" />
        </Picker>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.buttonSecondary} onPress={prevStep}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={nextStep}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <TouchableOpacity
        style={styles.buttonLarge}
        onPress={handleGetRecommendation}
      >
        <Text style={styles.buttonText}>Get Recommendation</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonSecondary} onPress={prevStep}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep5 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>Recommended Club & Adjusted Distance</Text>

      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>{recommendation}</Text>
        <Text style={styles.resultText}>
          {adjustedDistance}
          {isImperial ? 'yd' : 'm'}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setCurrentStep(0)}
      >
        <Text style={styles.buttonText}>Start Over</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {currentStep === 0 && renderStep0()}
      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}
      {currentStep === 4 && renderStep4()}
      {currentStep === 5 && renderStep5()}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: SPACING.xl,
  },
  stepContainer: {
    flex: 1,
  },
  title: {
    fontSize: 42,
    fontWeight: '700',
    color: C.h.bluemint,
    marginBottom: SPACING.md,
    textAlign: 'center',
    fontFamily: 'System',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: '#444',
    marginBottom: SPACING.xxl,
    textAlign: 'center',
    opacity: 0.8,
    letterSpacing: 0.5,
  },
  toggleButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    marginBottom: SPACING.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(113, 216, 250, 0.3)',
  },
  toggleButtonText: {
    color: C.h.bluemint,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: 'rgba(113, 216, 250, 0.3)',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  label: {
    color: C.h.graphite,
    fontSize: 15,
    flex: 1,
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    color: C.h.graphite,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    width: 80,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'rgba(113, 216, 250, 0.3)',
    fontSize: 16,
    fontWeight: '600',
  },
  inputField: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    color: C.h.graphite,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    marginBottom: SPACING.lg,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(113, 216, 250, 0.3)',
  },
  pickerContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: BORDER_RADIUS.xl,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(113, 216, 250, 0.3)',
    overflow: 'hidden',
  },
  picker: {
    color: C.h.graphite,
  },
  button: {
    backgroundColor: '#000',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    alignItems: 'center',
    marginTop: SPACING.md,
    borderWidth: 2,
    borderTopColor: '#00ffd1',
    borderBottomColor: '#00ffd1',
    borderLeftColor: '#baff00',
    borderRightColor: '#baff00',
    shadowColor: C.h.mint,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonSecondary: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    alignItems: 'center',
    marginTop: SPACING.md,
    flex: 1,
    marginRight: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(113, 216, 250, 0.3)',
  },
  buttonLarge: {
    backgroundColor: '#000',
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.xl,
    alignItems: 'center',
    marginBottom: SPACING.xl,
    borderWidth: 2,
    borderTopColor: '#00ffd1',
    borderBottomColor: '#00ffd1',
    borderLeftColor: '#baff00',
    borderRightColor: '#baff00',
    shadowColor: C.h.mint,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  buttonText: {
    color: C.h.graphite,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resultContainer: {
    backgroundColor: 'rgba(113, 250, 204, 0.08)',
    padding: SPACING.xxl * 1.5,
    borderRadius: BORDER_RADIUS.xl,
    marginVertical: SPACING.xl,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: C.h.mint,
    shadowColor: C.h.mint,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  resultText: {
    color: C.h.mint,
    fontSize: 32,
    fontWeight: '700',
    marginVertical: SPACING.sm,
    letterSpacing: -0.5,
    textShadowColor: C.h.mint,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
});

export default CaddieSkeleton;