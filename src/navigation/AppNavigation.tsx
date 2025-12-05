// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importar suas telas (que vamos criar)
import { LocationPermissionScreen } from '../screens/LocationPermissionScreen'
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { ProductDetailScreen } from '../screens/ProductDetailScreen';
import {ProfileScreen} from "../screens/ProfileScreen";
// ... outras importações

// Definir os tipos de parâmetros para cada tela (TypeScript puro!)
export type RootStackParamList = {
  Location: undefined;
  Login: undefined;
  Register: undefined;
  Home: undefined;
  ProductDetail: { productId: string }; // Passamos o ID, não o objeto todo
  Chat: { productId: string };
  Cart: undefined;
  Profile: undefined;
  ProfileScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Location" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Location" component={LocationPermissionScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        {/* ... outras telas */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}