import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Animated, Text } from "react-native";
import { Video, ResizeMode, AVPlaybackStatus } from "expo-av";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function IntroVideo() {
  const router = useRouter();
  const videoRef = useRef<Video>(null);
  const [showOverlay, setShowOverlay] = useState(true);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const curtainAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loadVideo = async () => {
      if (videoRef.current) {
        try {
          await videoRef.current.setStatusAsync({
            shouldPlay: false,
            isMuted: true,
          });
        } catch (error) {
          console.error("Error loading components:", error);
        }
      }
    };
    
    loadVideo();



    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();


    
  }, [fadeAnim]);

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded && status.didJustFinish) {
      router.replace("./AuthScreen");
    }
  };

  const handleTapToContinue = async () => {
    if (videoRef.current) {
      try {
        await videoRef.current.setStatusAsync({
          shouldPlay: true,
          isMuted: false,
        });
        
        setShowOverlay(false);



        Animated.timing(curtainAnim, {
          toValue: 1,
          duration: 1400, 
          useNativeDriver: true,
        }).start();

      } catch (error) {
        console.error("Error loading components:", error);
      }
    }
  };

  return (
    <LinearGradient
      colors={["#000", "#000", "#000"]}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.container}
    >



      <Animated.View style={[styles.videoWrapper, { opacity: curtainAnim }]}>
        <Video
          ref={videoRef}
          source={require("./GoBirdie.mp4")}
          style={styles.video}
          resizeMode={ResizeMode.COVER}
          shouldPlay={false}
          isLooping={false}
          isMuted={true}
          useNativeControls={false}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        />
      </Animated.View>
      
      {showOverlay && (
        <LinearGradient
          colors={["#000", "#000", "#000"]}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={styles.overlay}
        >
          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
            <TouchableOpacity 
              style={styles.continueButton}
              onPress={handleTapToContinue}
              activeOpacity={0.7}
            >
              <View style={styles.buttonBorder}>
                <Text style={styles.continueText}>Tap to Begin →</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </LinearGradient>
      )}
    </LinearGradient>
  );
}






const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#000',
  },
  videoWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  video: { 
    width: 208,
    height: 208,
    borderRadius: 104,
    overflow: 'hidden',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  
  content: {
    alignItems: 'center',
    gap: 60,
  },
  title: {
    fontSize: 72,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -1,
  },
  continueButton: {
    width: 280,
  },
  buttonBorder: {
    shadowColor: '#401016',
    shadowRadius: 28,
    shadowOpacity: 0.8,
    elevation: 22,
    borderRadius: 16,
    paddingVertical: 18,
    backgroundColor: 'rgba(2, 14, 10, 0.6)',
    alignItems: 'center',
    borderColor: '#730000',
    borderWidth: 1,
  },
  continueText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#6f605a',
    letterSpacing: 2,
  }
});