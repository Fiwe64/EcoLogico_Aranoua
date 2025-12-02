// App.tsx
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigation';

export default function App() {
  return (
    // SafeAreaProvider é necessário para o react-native-safe-area-context funcionar
    <SafeAreaProvider>
      {/* Configura a barra de status do celular (bateria, hora) */}
      <StatusBar style="light" backgroundColor="#2D7A3E" />
      
      {/* Chama o nosso gerenciador de rotas */}
      <AppNavigator />
    </SafeAreaProvider>
  );
}