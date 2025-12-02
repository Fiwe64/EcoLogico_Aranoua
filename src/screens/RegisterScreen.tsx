import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';

export function RegisterScreen() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="white" />
          <Text style={{color: 'white', marginLeft: 8}}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Criar Conta</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome Completo</Text>
          <TextInput style={styles.input} placeholder="Seu nome" />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} placeholder="email@exemplo.com" />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Senha</Text>
          <TextInput style={styles.input} secureTextEntry placeholder="******" />
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary },
  header: { padding: 24, paddingTop: 60 },
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: 'white' },
  formContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  inputGroup: { marginBottom: 16 },
  label: { marginBottom: 8, color: colors.textSecondary },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12 },
  button: { backgroundColor: colors.primary, padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 16 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});