import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { supabase } from '../lib/supabase';

export function EditProfileScreen() {
    const navigation = useNavigation<any>();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    // Estados para os dados
    const [userId, setUserId] = useState<number | null>(null);
    const [userType, setUserType] = useState<'consumidor' | 'produtor'>('consumidor');

    // Campos da tabela 'usuarios'
    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [endereco, setEndereco] = useState('');

    // Campos da tabela 'produtores'
    const [nomeProdutor, setNomeProdutor] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [enderecoRetirada, setEnderecoRetirada] = useState('');

    // 1. Carregar dados atuais ao abrir a tela
    useEffect(() => {
        loadCurrentData();
    }, []);

    async function loadCurrentData() {
        try {
            const jsonValue = await AsyncStorage.getItem('@user_data');
            if (!jsonValue) return navigation.goBack();

            const localUser = JSON.parse(jsonValue);
            setUserId(localUser.id);
            setUserType(localUser.tipo_usuario);

            // Busca dados frescos do usuário
            const { data: userData, error: userError } = await supabase
                .from('usuarios')
                .select('*')
                .eq('id', localUser.id)
                .single();

            if (userError) throw userError;

            // Preenche estados do usuário
            setNome(userData.nome || '');
            setTelefone(userData.telefone || '');
            setEndereco(userData.endereco_padrao || '');

            // Se for produtor, busca dados extras
            if (localUser.tipo_usuario === 'produtor') {
                const { data: producerData } = await supabase
                    .from('produtores')
                    .select('*')
                    .eq('usuario_id', localUser.id)
                    .single();

                if (producerData) {
                    setNomeProdutor(producerData.nome_produtor || '');
                    setCnpj(producerData.cnpj || '');
                    setEnderecoRetirada(producerData.endereco_retirada || '');
                }
            }

        } catch (error) {
            console.error(error);
            Alert.alert("Erro", "Não foi possível carregar seus dados.");
            navigation.goBack();
        } finally {
            setInitialLoading(false);
        }
    }

    // 2. Função de Salvar
    async function handleSave() {
        if (!nome.trim()) return Alert.alert("Erro", "O nome é obrigatório.");
        if (!userId) return;

        setLoading(true);
        try {
            // Atualiza tabela USUARIOS
            const { error: userError } = await supabase
                .from('usuarios')
                .update({
                    nome: nome,
                    telefone: telefone,
                    endereco_padrao: endereco
                })
                .eq('id', userId);

            if (userError) throw userError;

            // Aqui atualiza tabela PRODUTORES
            if (userType === 'produtor') {
                const { error: producerError } = await supabase
                    .from('produtores')
                    .update({
                        nome_produtor: nomeProdutor,
                        cnpj: cnpj,
                        endereco_retirada: enderecoRetirada
                    })
                    .eq('usuario_id', userId); // Chave é usuario_id

                if (producerError) throw producerError;
            }

            Alert.alert("Sucesso", "Perfil atualizado!", [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);

        } catch (error: any) {
            Alert.alert("Erro ao salvar", error.message);
        } finally {
            setLoading(false);
        }
    }

    if (initialLoading) {
        return <View style={styles.center}><ActivityIndicator color={colors.primary} /></View>;
    }

    return (
        <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Editar Perfil</Text>
                <View style={{ width: 24 }} />
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.content}>

                    <Text style={styles.sectionTitle}>Dados Pessoais</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nome Completo</Text>
                        <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Seu nome" />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Telefone / WhatsApp</Text>
                        <TextInput style={styles.input} value={telefone} onChangeText={setTelefone} placeholder="(XX) 9XXXX-XXXX" keyboardType="phone-pad" />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Endereço Padrão (Entrega)</Text>
                        <TextInput style={styles.input} value={endereco} onChangeText={setEndereco} placeholder="Rua, Número, Bairro" />
                    </View>

                    {/* CAMPOS EXTRAS APENAS PARA PRODUTOR */}
                    {userType === 'produtor' && (
                        <View style={styles.producerSection}>
                            <View style={styles.divider} />
                            <Text style={styles.sectionTitle}>Dados da Produção</Text>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Nome da Fazenda/Sítio</Text>
                                <TextInput style={styles.input} value={nomeProdutor} onChangeText={setNomeProdutor} placeholder="Nome do seu negócio" />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>CNPJ ou CPF do Produtor</Text>
                                <TextInput style={styles.input} value={cnpj} onChangeText={setCnpj} placeholder="00.000.000/0000-00" keyboardType="numeric" />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Endereço de Retirada (Sua Fazenda)</Text>
                                <TextInput style={styles.input} value={enderecoRetirada} onChangeText={setEnderecoRetirada} placeholder="Onde buscar os produtos?" />
                            </View>
                        </View>
                    )}

                    <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
                        {loading ? <ActivityIndicator color="white" /> : <Text style={styles.saveButtonText}>Salvar Alterações</Text>}
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FA' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: 50, paddingBottom: 15, paddingHorizontal: 20, backgroundColor: 'white',
        borderBottomWidth: 1, borderBottomColor: '#EEE'
    },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    backButton: { padding: 5 },
    content: { padding: 20 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: colors.primary, marginBottom: 15 },
    inputGroup: { marginBottom: 15 },
    label: { fontSize: 14, color: '#666', marginBottom: 5, fontWeight: '500' },
    input: {
        backgroundColor: 'white', borderWidth: 1, borderColor: '#DDD', borderRadius: 8,
        padding: 12, fontSize: 16, color: '#333'
    },
    divider: { height: 1, backgroundColor: '#DDD', marginVertical: 20 },
    producerSection: { marginTop: 10 },
    saveButton: {
        backgroundColor: colors.primary, padding: 16, borderRadius: 10,
        alignItems: 'center', marginTop: 30, marginBottom: 40,
        shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3
    },
    saveButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});