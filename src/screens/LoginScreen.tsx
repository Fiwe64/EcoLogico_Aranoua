import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importante para salvar a sessão
import { RootStackParamList } from '../navigation/AppNavigation';
import { colors } from '../theme/colors';
import { supabase } from '../lib/supabase'; // Importe seu cliente

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export function LoginScreen() {
    const navigation = useNavigation<NavigationProp>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Erro", "Preencha email e senha.");
            return;
        }

        setLoading(true);

        try {
            // 1. Busca o usuário que tenha ESSE email e ESSA senha
            // ATENÇÃO: Mudamos o nome da tabela para 'usuarios'
            const { data, error } = await supabase
                .from('usuarios') // <--- CORREÇÃO AQUI
                .select('*')
                .eq('email', email.trim())
                .eq('senha', password) // Comparação direta
                .single(); // Esperamos apenas 1 resultado

            if (error || !data) {
                Alert.alert("Acesso Negado", "E-mail ou senha incorretos.");
                setLoading(false);
                return;
            }

            // 2. SUCESSO! Salva os dados do usuário no celular
            // Convertendo o objeto para string para salvar no AsyncStorage
            await AsyncStorage.setItem('@user_data', JSON.stringify(data));

            // 3. Redirecionamento
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }], // Vai para a Home
            });

        } catch (err) {
            Alert.alert("Erro", "Falha na conexão com o banco.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.iconCircle}>
                    <Feather name="user" size={32} color="white" />
                </View>
                <Text style={styles.headerTitle}>GreenMarket</Text>
                <Text style={styles.headerSubtitle}>Conectando produtores e consumidores</Text>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.formContainer}
            >
                <Text style={styles.formTitle}>Entrar</Text>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="seu@email.com"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Senha</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="••••••••"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>

                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <>
                            <Feather name="log-in" size={20} color="white" style={{ marginRight: 8 }} />
                            <Text style={styles.loginButtonText}>Entrar</Text>
                        </>
                    )}
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Não tem conta? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                        <Text style={styles.link}>Cadastre-se</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.primaryLight },
    header: {
        backgroundColor: colors.primary,
        paddingTop: 60,
        paddingBottom: 40,
        paddingHorizontal: 24,
        alignItems: 'center',
    },
    backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    iconCircle: {
        width: 64, height: 64,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 32,
        justifyContent: 'center', alignItems: 'center',
        marginBottom: 12,
    },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: 'white' },
    headerSubtitle: { color: 'rgba(255,255,255,0.9)', marginTop: 4 },
    formContainer: {
        flex: 1,
        backgroundColor: 'white',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        marginTop: -20,
        padding: 24,
    },
    formTitle: { fontSize: 20, fontWeight: 'bold', color: colors.textPrimary, marginBottom: 24 },
    inputGroup: { marginBottom: 16 },
    label: { color: colors.textSecondary, marginBottom: 8, fontSize: 14 },
    input: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    loginButton: {
        backgroundColor: colors.primary,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        borderRadius: 8,
        marginTop: 8,
    },
    loginButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
    footerText: { color: colors.textSecondary },
    link: { color: colors.primary, fontWeight: 'bold' },
});