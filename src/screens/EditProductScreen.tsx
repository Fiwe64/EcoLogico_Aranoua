import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, Switch } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { supabase } from '../lib/supabase';

export function EditProductScreen() {
    const navigation = useNavigation();
    const route = useRoute();

    // Recebe o produto vindo da Home
    const { product } = route.params as { product: any };

    const [loading, setLoading] = useState(false);
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    // Se o campo 'disponivel' não existir no objeto, assume true
    const [available, setAvailable] = useState(true);

    // Carrega os dados nos inputs assim que a tela abre
    useEffect(() => {
        if (product) {
            setPrice(String(product.preco_unitario));
            setQuantity(String(product.quantidade));
            setAvailable(product.disponivel !== false); // Garante booleano
        }
    }, [product]);

    async function handleSave() {
        setLoading(true);
        try {
            const { error } = await supabase
                .from('estoque')
                .update({
                    preco_unitario: parseFloat(price.replace(',', '.')),
                    quantidade: parseFloat(quantity.replace(',', '.')),
                    disponivel: available
                })
                .eq('id', product.id); // Atualiza ONDE o ID for igual ao do produto

            if (error) throw error;

            Alert.alert("Sucesso", "Produto atualizado!", [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);
        } catch (error: any) {
            Alert.alert("Erro", error.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete() {
        Alert.alert("Excluir", "Tem certeza que deseja remover este item do seu estoque?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Excluir",
                style: "destructive",
                onPress: async () => {
                    try {
                        const { error } = await supabase
                            .from('estoque')
                            .delete()
                            .eq('id', product.id);

                        if (error) throw error;
                        navigation.goBack();
                    } catch (e: any) {
                        Alert.alert("Erro", e.message);
                    }
                }
            }
        ]);
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Editar Produto</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.content}>
                <Text style={styles.productName}>{product?.itens?.nome}</Text>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Preço Unitário (R$)</Text>
                    <TextInput
                        style={styles.input}
                        value={price}
                        onChangeText={setPrice}
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Quantidade Disponível</Text>
                    <TextInput
                        style={styles.input}
                        value={quantity}
                        onChangeText={setQuantity}
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.switchContainer}>
                    <Text style={styles.label}>Produto Disponível?</Text>
                    <Switch
                        value={available}
                        onValueChange={setAvailable}
                        trackColor={{ false: "#767577", true: colors.primary }}
                    />
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
                    {loading ? <ActivityIndicator color="white" /> : <Text style={styles.saveButtonText}>Salvar Alterações</Text>}
                </TouchableOpacity>

                <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                    <Feather name="trash-2" size={20} color="#D32F2F" />
                    <Text style={styles.deleteButtonText}>Excluir do Estoque</Text>
                </TouchableOpacity>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9F9F9' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, paddingTop: 50, backgroundColor: 'white' },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    content: { padding: 20 },
    productName: { fontSize: 22, fontWeight: 'bold', color: colors.primary, marginBottom: 20, textAlign: 'center' },
    inputGroup: { marginBottom: 20 },
    label: { fontSize: 14, color: '#666', marginBottom: 5 },
    input: { backgroundColor: 'white', padding: 15, borderRadius: 8, borderWidth: 1, borderColor: '#DDD', fontSize: 16 },
    switchContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30, backgroundColor: 'white', padding: 15, borderRadius: 8 },
    saveButton: { backgroundColor: colors.primary, padding: 18, borderRadius: 10, alignItems: 'center', marginBottom: 15 },
    saveButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
    deleteButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 15 },
    deleteButtonText: { color: '#D32F2F', fontWeight: 'bold', marginLeft: 10 }
});