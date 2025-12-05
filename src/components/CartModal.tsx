import React from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Image
} from 'react-native';
import { X, Minus, Plus, Trash2 } from 'lucide-react-native'; // Ícones
import { useCart } from '../contexts/CartContext'; // Importa nosso hook
import { colors } from '../theme/colors';

export function CartModal() {
    // Pega os dados e funções do contexto
    const { isCartOpen, closeCart, items, addToCart, removeFromCart, total } = useCart();

    return (
        <Modal
            visible={isCartOpen}
            transparent={true} // Permite ver o fundo escurecido
            animationType="slide" // Animação de subida
            onRequestClose={closeCart} // Fecha ao apertar botão voltar (Android)
        >
            {/* Fundo escuro transparente */}
            <View style={styles.overlay}>

                {/* Conteúdo do Carrinho (Ocupa parte de baixo ou lateral) */}
                <View style={styles.modalContainer}>

                    {/* Header do Carrinho */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Meu Carrinho ({items.length})</Text>
                        <TouchableOpacity onPress={closeCart}>
                            <X color="#333" size={24} />
                        </TouchableOpacity>
                    </View>

                    {/* Lista de Itens */}
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

                                    {/* Controles de Quantidade */}
                                    <View style={styles.quantityControls}>
                                        <TouchableOpacity
                                            onPress={() => removeFromCart(item.id)}
                                            style={styles.controlButton}
                                        >
                                            {item.quantity === 1 ? (
                                                <Trash2 size={16} color="red" />
                                            ) : (
                                                <Minus size={16} color="#333" />
                                            )}
                                        </TouchableOpacity>

                                        <Text style={styles.quantityText}>{item.quantity}</Text>

                                        <TouchableOpacity
                                            onPress={() => addToCart(item)}
                                            style={styles.controlButton}
                                        >
                                            <Plus size={16} color="#333" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        />
                    )}

                    {/* Footer com Total e Botão Finalizar */}
                    <View style={styles.footer}>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Total</Text>
                            <Text style={styles.totalValue}>R$ {total.toFixed(2)}</Text>
                        </View>

                        <TouchableOpacity
                            style={styles.checkoutButton}
                            onPress={() => alert("Ir para Pagamento")}
                        >
                            <Text style={styles.checkoutText}>Finalizar Compra</Text>
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
        backgroundColor: 'rgba(0,0,0,0.5)', // Fundo preto com 50% transparência
        justifyContent: 'flex-end', // Alinha o modal na parte de baixo
    },
    modalContainer: {
        backgroundColor: 'white',
        height: '80%', // Ocupa 80% da tela
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
    itemImage: { width: 50, height: 50, borderRadius: 8, marginRight: 12 },
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
        backgroundColor: colors.primary,
        padding: 16, borderRadius: 12, alignItems: 'center'
    },
    checkoutText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});