import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { supabase } from '../lib/supabase';

export function RegisterScreen() {
    const navigation = useNavigation<any>();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState<'consumidor' | 'produtor'>('consumidor');
    const [loading, setLoading] = useState(false);

    async function handleRegister() {
        if (!email.trim() || !password.trim() || !fullName.trim()) {
            return Alert.alert("Atenção", "Preencha todos os campos!");
        }

        setLoading(true);

        try {
            // 1. Inserir na tabela padronizada 'usuarios'
            const { data: userCreated, error: userError } = await supabase
                .from('usuarios')
                .insert({
                    nome: fullName,
                    email: email.trim(),
                    senha: password,
                    tipo_usuario: userType
                })
                .select()
                .single();

            if (userError) throw userError;
            if (!userCreated) throw new Error("Erro ao criar usuário.");

            // 2. Se for produtor, cria o vínculo na tabela 'produtores'
            if (userType === 'produtor') {
                const { error: producerError } = await supabase
                    .from('produtores')
                    .insert({
                        usuario_id: userCreated.id, // ID vindo da tabela usuarios
                        nome_produtor: fullName
                        // Outros campos como cnpj/endereço ficam null por enquanto
                    });

                if (producerError) throw producerError;
                console.error("Erro ao criar produtor:", producerError);
                throw producerError;
            }

            Alert.alert("Sucesso", "Conta criada com sucesso!", [
                { text: "Fazer Login", onPress: () => navigation.navigate('Login') }
            ]);

        } catch (error: any) {
            console.error(error);
            // Tratamento específico para e-mail duplicado no Postgres
            if (error.code === '23505') {
                Alert.alert("Erro", "Este e-mail já está cadastrado.");
            } else {
                Alert.alert("Erro", error.message || "Ocorreu um erro ao cadastrar.");
            }
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

                {/* SELETOR DE TIPO DE USUÁRIO */}
                <Text style={styles.label}>Eu quero:</Text>
                <View style={styles.typeSelector}>
                    <TouchableOpacity
                        style={[styles.typeButton, userType === 'consumidor' && styles.typeButtonActive]}
                        onPress={() => setUserType('consumidor')}
                    >
                        <Feather name="shopping-bag" size={20} color={userType === 'consumidor' ? 'white' : colors.textSecondary} />
                        <Text style={[styles.typeText, userType === 'consumidor' && styles.typeTextActive]}>
                            Comprar
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.typeButton, userType === 'produtor' && styles.typeButtonActive]}
                        onPress={() => setUserType('produtor')}
                    >
                        <Feather name="truck" size={20} color={userType === 'produtor' ? 'white' : colors.textSecondary} />
                        <Text style={[styles.typeText, userType === 'produtor' && styles.typeTextActive]}>
                            Vender
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* INPUTS NORMAIS */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Nome {userType === 'produtor' ? '(ou da Fazenda)' : 'Completo'}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder={userType === 'produtor' ? "Ex: Fazenda Santa Luzia" : "Ex: João Silva"}
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
                    style={styles.button}
                    onPress={handleRegister}
                    disabled={loading}
                >
                    {loading ? <ActivityIndicator color="white"/> : <Text style={styles.buttonText}>Cadastrar</Text>}
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

    typeSelector: {
        flexDirection: 'row',
        marginBottom: 20,
        gap: 12,
    },
    typeButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
    },
    typeButtonActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    typeText: {
        marginLeft: 8,
        color: '#666',
        fontWeight: '600',
    },
    typeTextActive: {
        color: 'white',
    }
});