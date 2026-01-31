import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { supabase } from '../lib/supabase'; // Importe da sua pasta nova

export function RegisterScreen() {
    const navigation = useNavigation<any>();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleRegister() {
        if (!email || !password || !fullName) {
            Alert.alert("Atenção", "Preencha todos os campos!");
            return;
        }

        setLoading(true);

        try {
            // Cria usuário na Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
            });

            if (authError) throw authError;

            // Verificação de segurança: se o usuário não foi criado (ex: confirmação de email pendente), paramos aqui
            if (!authData.user) {
                throw new Error("Não foi possível criar o usuário");
            }

            // Cria o registro na tabela Usuarios
            // Usa o MESMO ID gerado pelo Auth para manter a ligação
            const { error: profileError } = await supabase
                .from('Usuarios')
                .insert({
                    id: authData.user.id, // O pulo do gato: ID do Auth = ID do Profile
                    full_name: fullName,
                    email: email,
                });

            if (profileError) throw profileError;

            Alert.alert(
                "Sucesso!",
                "Conta criada e perfil salvo!",
                [{ text: "OK", onPress: () => navigation.goBack() }]
            );

        } catch (error: any) {
            Alert.alert("Erro", error.message || "Ocorreu um erro inesperado.");
        } finally {
            setLoading(false);
        }
    }

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
                    <TextInput
                        style={styles.input}
                        placeholder="Seu nome"
                        value={fullName}
                        onChangeText={setFullName}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="email@exemplo.com"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Senha</Text>
                    <TextInput
                        style={styles.input}
                        secureTextEntry
                        placeholder="******"
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.button, loading && { opacity: 0.7 }]}
                    onPress={handleRegister}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.buttonText}>Cadastrar</Text>
                    )}
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