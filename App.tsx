// App.tsx
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigation';

export default function App() {
  return (
    
    <SafeAreaProvider> 
      <StatusBar style="light" backgroundColor="#2D7A3E" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}