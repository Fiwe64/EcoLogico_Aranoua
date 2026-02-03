import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { supabase } from '../lib/supabase';

// Tipagens para ajudar no desenvolvimento
type UserProfile = {
    id: number;
    nome: string;
    email: string;
    tipo_usuario: 'consumidor' | 'produtor';
    telefone?: string;
    endereco_padrao?: string;
};

type ProducerProfile = {
    id: number;
    nome_fantasia: string;
    cnpj?: string;
    endereco_retirada?: string;
};

export function ProfileScreen() {
    const navigation = useNavigation<any>();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [producer, setProducer] = useState<ProducerProfile | null>(null);
    const [loading, setLoading] = useState(true);

    // useFocusEffect garante que os dados recarreguem toda vez que você entrar na tela
    useFocusEffect(
        React.useCallback(() => {
            loadProfileData();
        }, [])
    );

    async function loadProfileData() {
        try {
            setLoading(true);
            // 1. Pega o ID salvo no login
            const jsonValue = await AsyncStorage.getItem('@user_data');
            if (!jsonValue) {
                return navigation.reset({ routes: [{ name: 'Login' }] });
            }

            const localUser = JSON.parse(jsonValue);

            // 2. Busca dados frescos na tabela USUARIOS
            const { data: userData, error: userError } = await supabase
                .from('usuarios')
                .select('*')
                .eq('id', localUser.id)
                .single();

            if (userError) throw userError;
            setUser(userData);

            // 3. Se for PRODUTOR, busca dados na tabela PRODUTORES
            if (userData.tipo_usuario === 'produtor') {
                const { data: producerData, error: producerError } = await supabase
                    .from('produtores')
                    .select('*')
                    .eq('usuario_id', userData.id)
                    .single();

                // Se não achar (pode acontecer se o cadastro falhou na parte 2), não trava, só avisa
                if (!producerError) {
                    setProducer(producerData);
                }
            }

        } catch (error) {
            console.error(error);
            Alert.alert("Erro", "Não foi possível carregar o perfil.");
        } finally {
            setLoading(false);
        }
    }

    async function handleLogout() {
        Alert.alert("Sair", "Deseja realmente sair da conta?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Sair",
                onPress: async () => {
                    await AsyncStorage.removeItem('@user_data');
                    navigation.reset({ routes: [{ name: 'Login' }] });
                }
            }
        ]);
    }

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* CABEÇALHO */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Meu Perfil</Text>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <Feather name="log-out" size={20} color="#FF5252" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* CARD PRINCIPAL (FOTO E NOME) */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <Feather name="user" size={40} color={colors.primary} />
                    </View>
                    <Text style={styles.userName}>{user?.nome}</Text>
                    <Text style={styles.userEmail}>{user?.email}</Text>
                    <View style={[styles.badge, user?.tipo_usuario === 'produtor' ? styles.badgeProducer : styles.badgeConsumer]}>
                        <Text style={styles.badgeText}>
                            {user?.tipo_usuario === 'produtor' ? 'Vendedor / Produtor' : 'Consumidor'}
                        </Text>
                    </View>
                </View>

                {/* SEÇÃO 1: DADOS PESSOAIS (Para todos) */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Dados Pessoais</Text>

                    <View style={styles.infoRow}>
                        <Feather name="phone" size={18} color="#666" />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Telefone</Text>
                            <Text style={styles.infoValue}>{user?.telefone || "Não informado"}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.infoRow}>
                        <Feather name="map-pin" size={18} color="#666" />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Endereço Padrão</Text>
                            <Text style={styles.infoValue}>{user?.endereco_padrao || "Não informado"}</Text>
                        </View>
                    </View>
                </View>

                {/* SEÇÃO 2: DADOS DA FAZENDA (Só aparece se for Produtor) */}
                {user?.tipo_usuario === 'produtor' && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Minha Produção</Text>

                        <View style={styles.infoRow}>
                            <Feather name="briefcase" size={18} color="#666" />
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Nome Fantasia</Text>
                                <Text style={styles.infoValue}>{producer?.nome_fantasia || "Não informado"}</Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.infoRow}>
                            <Feather name="file-text" size={18} color="#666" />
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>CNPJ / CPF Produtor</Text>
                                <Text style={styles.infoValue}>{producer?.cnpj || "Não informado"}</Text>
                            </View>
                        </View>
                    </View>
                )}

                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => navigation.navigate('EditProfile')} // <--- CONECTADO!
                >
                    <Text style={styles.editButtonText}>Editar Informações</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FA' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: {
        backgroundColor: 'white',
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
    logoutButton: { padding: 8, backgroundColor: '#FFEBEE', borderRadius: 8 },

    content: { padding: 20 },

    profileCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    userName: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 4 },
    userEmail: { fontSize: 14, color: '#666', marginBottom: 12 },
    badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    badgeProducer: { backgroundColor: '#E8F5E9' },
    badgeConsumer: { backgroundColor: '#E3F2FD' },
    badgeText: { fontSize: 12, fontWeight: 'bold', color: '#333' },

    section: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
    },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 16 },
    infoRow: { flexDirection: 'row', alignItems: 'center' },
    infoContent: { marginLeft: 16, flex: 1 },
    infoLabel: { fontSize: 12, color: '#999', marginBottom: 2 },
    infoValue: { fontSize: 15, color: '#333' },
    divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 12, marginLeft: 34 },

    editButton: {
        backgroundColor: colors.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 30,
    },
    editButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});