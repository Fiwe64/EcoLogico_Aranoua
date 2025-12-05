// App.tsx
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigation';
import {CartModal} from "./src/components/CartModal";
import {CartProvider} from "./src/contexts/CartContext";

export default function App() {
  return (
    
    <SafeAreaProvider>
        <CartProvider>
      <StatusBar style="light" backgroundColor="#2D7A3E" />
      <AppNavigator />
            <CartModal />
        </CartProvider>
    </SafeAreaProvider>
  );
}