import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ClubYardages {
  [key: string]: string;
}

interface UserContextType {
  email: string;
  setEmail: (email: string) => void;
  name: string;
  setName: (name: string) => void;
  password: string;
  setPassword: (password: string) => void;
  clubYardages: ClubYardages;
  setClubYardage: (club: string, yardage: string) => void;
  playPreferences: {
    intensity: string;
    focus: string;
    time: string;
  };

  experienceLevels: {
    HCP: string;
    experience: string;
  };

  setExperienceLevel:  (category: 'HCP' | 'experience', value: string) => void;
  setPlayPreference: (category: 'intensity' | 'focus' | 'time', value: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [clubYardages, setClubYardages] = useState<ClubYardages>({
    'Driver': '',
    '3-Wood': '',
    '5-Wood': '',
    'Hybrid': '',
    '3-iron': '',
    '4-iron': '',
    '5-iron': '',
    '6-iron': '',
    '7-iron': '',
    '8-iron': '',
    '9-iron': '',
    'P-Wedge': '',
    'S-Wedge': '',
    '60°-Wedge': '',
  });
  const [playPreferences, setPlayPreferencesState] = useState({
    intensity: '',
    focus: '',
    time: '',
  });


  const [experienceLevels, setExperienceLevelState] = useState({
    HCP: '',
    experience: '',
   
  });

  const setClubYardage = (club: string, yardage: string) => {
    setClubYardages(prev => ({
      ...prev,
      [club]: yardage,
    }));
  };

  const setPlayPreference = (category: 'intensity' | 'focus' | 'time', value: string) => {
    setPlayPreferencesState(prev => ({
      ...prev,
      [category]: value,
    }));
  };

  const setExperienceLevel = (category: 'HCP' | 'experience', value: string) => {
    setExperienceLevelState(prev => ({
      ...prev,
      [category]: value,
    }));
  };


  {/** 

  if (name == null) {
    const name2 = 'User';   
    return name2;

  }
  
  */}

  return (
    <UserContext.Provider 
      value={{ 
        email, 
        setEmail, 
        name, 
        setName, 
        password, 
        setPassword,
        clubYardages,
        setClubYardage,
        playPreferences,
        setPlayPreference,
        experienceLevels,
        setExperienceLevel,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};