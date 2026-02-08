import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Image,
    Alert,
    Linking,
    ActivityIndicator
} from 'react-native';
import { X, Minus, Plus, Trash2 } from 'lucide-react-native';
import { useCart } from '../contexts/CartContext';
import { colors } from '../theme/colors';
import { supabase } from '../lib/supabase'; // Importe seu cliente supabase

export function CartModal() {
    const { isCartOpen, closeCart, items, addToCart, removeFromCart, total } = useCart();
    const [loading, setLoading] = useState(false);

    // Função que faz a mágica do WhatsApp
    async function handleCheckout() {
        if (items.length === 0) return;

        setLoading(true);

        try {
            // 1. Precisamos do telefone do produtor.
            // Vamos pegar o ID do primeiro item do carrinho para descobrir quem vende.
            // (Nota: Num app real, você verificaria se todos os itens são do mesmo produtor)
            const firstItemId = items[0].id;

            // Query complexa: Estoque -> Produtor -> Usuario (onde está o telefone)
            const { data, error } = await supabase
                .from('estoque')
                .select(`
                    produtores (
                        nome_produtor,
                        usuarios (
                            telefone
                        )
                    )
                `)
                .eq('id', firstItemId)
                .single();

            if (error || !data) {
                throw new Error("Não foi possível encontrar o contato do vendedor.");
            }

            // Acessando os dados aninhados com segurança
            // @ts-ignore (Typescript pode reclamar da profundidade do objeto)
            const phone = data.produtores?.usuarios?.telefone;
            // @ts-ignore
            const producerName = data.produtores?.nome_produtor;

            if (!phone) {
                Alert.alert("Erro", "Este produtor não cadastrou um telefone.");
                return;
            }

            // 2. Montar a mensagem
            let message = `Olá ${producerName}! Gostaria de fazer um pedido pelo GreenMarket:\n\n`;

            items.forEach(item => {
                message += `▪️ ${item.quantity}x ${item.name}\n`;
            });

            message += `\n💰 *Total Estimado: R$ ${total.toFixed(2)}*`;
            message += `\n\nComo podemos combinar a entrega?`;

            // 3. Abrir WhatsApp
            // Remove caracteres não numéricos do telefone para evitar erros
            const cleanPhone = phone.replace(/\D/g, '');
            // Adiciona o código do Brasil (55) se não tiver
            const finalPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;

            const url = `whatsapp://send?phone=${finalPhone}&text=${encodeURIComponent(message)}`;

            const supported = await Linking.canOpenURL(url);

            if (supported) {
                await Linking.openURL(url);
                // Opcional: Limpar carrinho após enviar
                // clearCart();
                closeCart();
            } else {
                Alert.alert("Erro", "WhatsApp não está instalado.");
            }

        } catch (error: any) {
            console.error(error);
            Alert.alert("Erro", "Falha ao processar pedido. Tente novamente.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal
            visible={isCartOpen}
            transparent={true}
            animationType="slide"
            onRequestClose={closeCart}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>

                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Meu Carrinho ({items.length})</Text>
                        <TouchableOpacity onPress={closeCart}>
                            <X color="#333" size={24} />
                        </TouchableOpacity>
                    </View>

                    {items.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Seu carrinho está vazio.</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={items}
                            keyExtractor={(item) => item.id}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <View style={styles.itemCard}>
                                    <Image source={{ uri: item.image }} style={styles.itemImage} />
                                    <View style={styles.itemInfo}>
                                        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                                        <Text style={styles.itemPrice}>R$ {item.price.toFixed(2)}</Text>
                                    </View>
                                    <View style={styles.quantityControls}>
                                        <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.controlButton}>
                                            {item.quantity === 1 ? <Trash2 size={16} color="red" /> : <Minus size={16} color="#333" />}
                                        </TouchableOpacity>
                                        <Text style={styles.quantityText}>{item.quantity}</Text>
                                        <TouchableOpacity onPress={() => addToCart(item)} style={styles.controlButton}>
                                            <Plus size={16} color="#333" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        />
                    )}

                    <View style={styles.footer}>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Total</Text>
                            <Text style={styles.totalValue}>R$ {total.toFixed(2)}</Text>
                        </View>

                        <TouchableOpacity
                            style={[styles.checkoutButton, items.length === 0 && { backgroundColor: '#ccc' }]}
                            onPress={handleCheckout}
                            disabled={items.length === 0 || loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={styles.checkoutText}>
                                    {items.length === 0 ? 'Carrinho Vazio' : 'Enviar Pedido no WhatsApp'}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: 'white',
        height: '85%', // Aumentei um pouco para caber melhor
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.25,
        elevation: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { color: '#999', fontSize: 16 },
    itemCard: {
        flexDirection: 'row',
        marginBottom: 16,
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
    },
    itemImage: { width: 50, height: 50, borderRadius: 8, marginRight: 12, backgroundColor: '#eee' },
    itemInfo: { flex: 1 },
    itemName: { fontWeight: 'bold', fontSize: 14, color: '#333' },
    itemPrice: { color: colors.primary, fontWeight: 'bold', marginTop: 4 },
    quantityControls: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    controlButton: {
        width: 28, height: 28, borderRadius: 14, backgroundColor: 'white',
        justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#ddd'
    },
    quantityText: { fontWeight: 'bold', fontSize: 14 },
    footer: { marginTop: 20, borderTopWidth: 1, borderColor: '#eee', paddingTop: 20 },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
    totalLabel: { fontSize: 18, color: '#666' },
    totalValue: { fontSize: 24, fontWeight: 'bold', color: colors.primary },
    checkoutButton: {
        backgroundColor: '#25D366', // Cor do WhatsApp
        padding: 16, borderRadius: 12, alignItems: 'center',
        flexDirection: 'row', justifyContent: 'center'
    },
    checkoutText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});