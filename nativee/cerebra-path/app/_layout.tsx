import { Stack } from 'expo-router';
import { UserProvider } from './context/UserContext';

import { StatusBar } from 'expo-status-bar';
import { ProgressProvider } from './context/ProgressContext';



import '../jaska.css';

export default function RootLayout() {
  return (
    <UserProvider>

    <ProgressProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: '#101010' },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="challenges" />
        <Stack.Screen name="challenge/[id]" />
        <Stack.Screen name="progress" />
        </Stack>
      </ProgressProvider>
      </UserProvider>

  );
}
