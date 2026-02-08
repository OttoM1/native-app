import React, { createContext, useState, useContext, ReactNode } from 'react';

interface UserContextType {
  email: string;
    setEmail: (email: string) => void;

    name: string;
    setName: (name: string) => void;

      password: string;
    setPassword: (password: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [email, setEmail] = useState('');
        const [name, setName] = useState('');
        const [password, setPassword] = useState('');


  return (
    <UserContext.Provider value={{ email, setEmail, name, setName, password, setPassword  }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};

