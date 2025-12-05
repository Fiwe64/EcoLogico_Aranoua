import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigation'; 
import { colors } from '../theme/colors';
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Location'>;

export function LocationPermissionScreen() {
  const navigation = useNavigation<NavigationProp>();

  const handleAllowLocation = () => {
    // Lógica real de permissão viria aqui
    navigation.replace('Home'); // .replace impede de voltar para essa tela
  };

  const handleSkipLocation = () => {
    navigation.replace('Home');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Feather name="map-pin" size={64} color="white" />
        </View>

        <Text style={styles.title}>Bem-vindo ao EcoLogico!</Text>
        
        <Text style={styles.description}>
          Permita o acesso à sua localização para encontrar produtores locais próximos a você.
        </Text>

        {/* Card Informativo */}
        <View style={styles.infoCard}>
          <View style={styles.miniIcon}>
            <Feather name="map-pin" size={16} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.infoTitle}>Produtos nas Proximidades</Text>
            <Text style={styles.infoDesc}>Veja produtos frescos perto de você</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.buttonPrimary} onPress={handleAllowLocation}>
          <Text style={styles.buttonText}>Permitir Localização</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonSecondary} onPress={handleSkipLocation}>
          <Text style={styles.buttonTextSecondary}>Pular por Enquanto</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryLight,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  iconContainer: {
    width: 128,
    height: 128,
    backgroundColor: colors.primary,
    borderRadius: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    maxWidth: 300,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    width: '100%',
    marginBottom: 24,
    alignItems: 'center',
    gap: 12,
  },
  miniIcon: {
    width: 32,
    height: 32,
    backgroundColor: colors.primaryLight,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  infoDesc: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  buttonPrimary: {
    width: '100%',
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonSecondary: {
    width: '100%',
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonTextSecondary: {
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 16,
  },
});