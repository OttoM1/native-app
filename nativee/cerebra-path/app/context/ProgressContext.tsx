import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserProgress {
  selectedInterests: string[];
  completedChallenges: string[];
  skillLevels: {
    [key: string]: number; 
  };
  totalPoints: number;
  streak: number;
}

interface ProgressContextType {
  progress: UserProgress;
  updateInterests: (interests: string[]) => void;
  completeChallenge: (challengeId: string, skillGains: { [key: string]: number }) => void;
  resetProgress: () => void;
  isLoading: boolean;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

const INITIAL_PROGRESS: UserProgress = {
  selectedInterests: [],
  completedChallenges: [],
  skillLevels: {},
  totalPoints: 0,
  streak: 0,
};

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<UserProgress>(INITIAL_PROGRESS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      saveProgress();
    }
  }, [progress]);

  const loadProgress = async () => {
    try {
      const stored = await AsyncStorage.getItem('cerebra_progress');
      if (stored) {
        setProgress(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveProgress = async () => {
    try {
      await AsyncStorage.setItem('cerebra_progress', JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const updateInterests = (interests: string[]) => {
    setProgress(prev => ({
      ...prev,
      selectedInterests: interests,
    }));
  };

  const completeChallenge = (challengeId: string, skillGains: { [key: string]: number }) => {
    setProgress(prev => {
      if (prev.completedChallenges.includes(challengeId)) {
        return prev;
      }

      const newSkillLevels = { ...prev.skillLevels };
      let pointsGained = 0;

      Object.entries(skillGains).forEach(([skill, points]) => {
        newSkillLevels[skill] = Math.min(100, (newSkillLevels[skill] || 0) + points);
        pointsGained += points;
      });

      return {
        ...prev,
        completedChallenges: [...prev.completedChallenges, challengeId],
        skillLevels: newSkillLevels,
        totalPoints: prev.totalPoints + pointsGained,
        streak: prev.streak + 1,
      };
    });
  };

  const resetProgress = async () => {
    try {
      await AsyncStorage.removeItem('cerebra_progress');
      setProgress(INITIAL_PROGRESS);
    } catch (error) {
      console.error('Error resetting progress:', error);
    }
  };

  return (
    <ProgressContext.Provider
      value={{
        progress,
        updateInterests,
        completeChallenge,
        resetProgress,
        isLoading,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within ProgressProvider');
  }
  return context;
};
