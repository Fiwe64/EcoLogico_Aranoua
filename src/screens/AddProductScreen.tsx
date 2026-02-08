import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Alert, ActivityIndicator, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme/colors'; // Certifique-se de ter suas cores
import { supabase } from '../lib/supabase';

export function AddProductScreen() {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);

    // Dados do formulário
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');

    // Lista de itens do catálogo (Alface, Tomate, etc)
    const [catalogItems, setCatalogItems] = useState<any[]>([]);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        fetchCatalog();
    }, []);

    async function fetchCatalog() {
        // Busca itens e o nome da unidade de medida (tipo_item)
        const { data, error } = await supabase
            .from('itens')
            .select('*, tipos_item(nome)')
            .order('nome');

        if (!error && data) setCatalogItems(data);
    }

    async function handlePublish() {
        if (!selectedItem || !price || !quantity) {
            return Alert.alert("Ops", "Preencha todas as informações.");
        }

        setLoading(true);
        try {
            // 1. Pegar usuário logado
            const jsonUser = await AsyncStorage.getItem('@user_data');
            const user = JSON.parse(jsonUser || '{}');

            // 2. Pegar ID do produtor vinculado a esse usuário
            const { data: producerData, error: producerError } = await supabase
                .from('produtores')
                .select('id')
                .eq('usuario_id', user.id)
                .single();

            if (producerError || !producerData) throw new Error("Produtor não encontrado.");

            // 3. Salvar no Estoque
            const { error: stockError } = await supabase
                .from('estoque')
                .insert({
                    produtor_id: producerData.id,
                    item_id: selectedItem.id,
                    preco_unitario: parseFloat(price.replace(',', '.')),
                    quantidade: parseFloat(quantity.replace(',', '.')),
                    disponivel: true
                });

            if (stockError) throw stockError;

            Alert.alert("Sucesso", "Produto publicado no seu catálogo!", [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);

        } catch (error: any) {
            Alert.alert("Erro", error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Novo Anúncio</Text>
                <View style={{width: 24}}/>
            </View>

            <View style={styles.content}>

                {/* SELETOR DE PRODUTO */}
                <Text style={styles.label}>O que você vai vender?</Text>
                <TouchableOpacity style={styles.selector} onPress={() => setModalVisible(true)}>
                    <Text style={selectedItem ? styles.selectorTextActive : styles.selectorTextPlaceholder}>
                        {selectedItem ? selectedItem.nome : "Selecione um item (ex: Alface)"}
                    </Text>
                    <Feather name="chevron-down" size={20} color="#666" />
                </TouchableOpacity>
                {selectedItem && (
                    <Text style={styles.unitHint}>Vendido por: {selectedItem.tipos_item?.nome}</Text>
                )}

                {/* PREÇO E QUANTIDADE */}
                <View style={styles.row}>
                    <View style={{flex: 1, marginRight: 10}}>
                        <Text style={styles.label}>Preço (R$)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="0,00"
                            keyboardType="numeric"
                            value={price}
                            onChangeText={setPrice}
                        />
                    </View>
                    <View style={{flex: 1}}>
                        <Text style={styles.label}>Quantidade Disponível</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="0"
                            keyboardType="numeric"
                            value={quantity}
                            onChangeText={setQuantity}
                        />
                    </View>
                </View>

                <TouchableOpacity style={styles.publishButton} onPress={handlePublish} disabled={loading}>
                    {loading ? <ActivityIndicator color="white"/> : <Text style={styles.publishBtnText}>Publicar Produto</Text>}
                </TouchableOpacity>

            </View>

            {/* MODAL DE SELEÇÃO */}
            <Modal visible={modalVisible} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Catálogo de Itens</Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Feather name="x" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={catalogItems}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({item}) => (
                            <TouchableOpacity style={styles.modalItem} onPress={() => {
                                setSelectedItem(item);
                                setModalVisible(false);
                            }}>
                                <Text style={styles.modalItemText}>{item.nome}</Text>
                                <Text style={styles.modalItemSub}>{item.tipos_item?.nome}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9F9F9' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, paddingTop: 50, backgroundColor: 'white' },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    content: { padding: 20 },
    label: { fontSize: 14, fontWeight: '600', color: '#666', marginBottom: 8, marginTop: 16 },
    unitHint: { fontSize: 12, color: colors.primary, marginTop: 4 },

    selector: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        backgroundColor: 'white', padding: 16, borderRadius: 8, borderWidth: 1, borderColor: '#DDD'
    },
    selectorTextPlaceholder: { color: '#999' },
    selectorTextActive: { color: '#333', fontWeight: 'bold' },

    row: { flexDirection: 'row', marginTop: 10 },
    input: {
        backgroundColor: 'white', padding: 14, borderRadius: 8, borderWidth: 1, borderColor: '#DDD', fontSize: 16
    },

    publishButton: {
        backgroundColor: colors.primary, padding: 18, borderRadius: 10, alignItems: 'center', marginTop: 40,
        shadowColor: "#000", shadowOffset: {width:0, height:2}, shadowOpacity: 0.1, elevation: 4
    },
    publishBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

    // Modal
    modalContainer: { flex: 1, backgroundColor: '#F5F5F5' },
    modalHeader: { padding: 20, paddingTop: 50, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'white' },
    modalTitle: { fontSize: 18, fontWeight: 'bold' },
    modalItem: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#EEE', backgroundColor: 'white' },
    modalItemText: { fontSize: 16, color: '#333' },
    modalItemSub: { fontSize: 12, color: '#888' }
});