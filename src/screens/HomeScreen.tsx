import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';

// Componentes do projeto
import { Header } from '../components/Header';
import { SearchBar } from '../components/SearchBar';
import { CategoryFilter } from '../components/CategoryFilter';
import { ProductCard } from '../components/ProductCard';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../navigation/AppNavigation';
import { useCart } from "../contexts/CartContext";
import { supabase } from '../lib/supabase';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export function HomeScreen() {
    const navigation = useNavigation<NavigationProp>();
    const { openCart, items, addToCart, removeFromCart } = useCart();

    // Estados de Controle
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Estados do Consumidor
    const [marketProducts, setMarketProducts] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState<any>('todos');

    // Estados do Produtor
    const [myStock, setMyStock] = useState<any[]>([]);

    // Carrega os dados sempre que a tela ganha foco
    useFocusEffect(
        useCallback(() => {
            loadInitialData();
        }, [])
    );

    async function loadInitialData() {
        try {
            const jsonUser = await AsyncStorage.getItem('@user_data');
            if (!jsonUser) {
                return navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
            }

            const userData = JSON.parse(jsonUser);
            setUser(userData);

            if (userData.tipo_usuario === 'produtor') {
                await fetchProducerStock(userData.id);
            } else {
                await fetchMarketProducts();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    // Busca o estoque específico do produtor logado
    async function fetchProducerStock(userId: number) {
        try {
            const { data: producer } = await supabase
                .from('produtores')
                .select('id')
                .eq('usuario_id', userId)
                .single();

            if (!producer) return;

            const { data, error } = await supabase
                .from('estoque')
                .select('*, itens(nome, foto_url, tipos_item(nome))')
                .eq('produtor_id', producer.id);

            if (!error && data) setMyStock(data);
        } catch (err) {
            console.error(err);
        }
    }

    // Busca todos os produtos disponíveis para o consumidor
    async function fetchMarketProducts() {
        try {
            const { data, error } = await supabase
                .from('estoque')
                .select(`
          id, preco_unitario, quantidade, produtor_id,
          produtores (nome_produtor),
          itens (id, nome, foto_url, tipos_item (nome))
        `)
                .eq('disponivel', true)
                .gt('quantidade', 0);

            if (error) throw error;

            const formatted = data.map((item: any) => ({
                id: item.id.toString(),
                name: item.itens?.nome,
                price: item.preco_unitario,
                image: item.itens?.foto_url || 'https://via.placeholder.com/150',
                category: 'todos',
                unit: item.itens?.tipos_item?.nome,
                producerName: item.produtores?.nome_produtor,
                quantityAvailable: item.quantidade
            }));

            setMarketProducts(formatted);
        } catch (err) {
            console.error(err);
        }
    }

    const handleLogout = async () => {
        await AsyncStorage.removeItem('@user_data');
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    };

    const filteredProducts = marketProducts.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;
    }

    // --- RENDERIZAÇÃO PARA PRODUTOR ---
    if (user?.tipo_usuario === 'produtor') {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <Header
                    userName={user.nome}
                    cartItemsCount={0}
                    onCartClick={() => Alert.alert("Aviso", "Produtores gerenciam vendas.")}
                    onProfileClick={() => navigation.navigate('ProfileScreen')} // Nome da rota corrigido
                    onLogout={handleLogout}
                />

                <View style={styles.producerContainer}>
                    <View style={styles.producerHeader}>
                        <View>
                            <Text style={styles.sectionTitle}>Meu Estoque</Text>
                            <Text style={styles.subtitle}>Acompanhe suas postagens</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => navigation.navigate('AddProduct')}
                        >
                            <Feather name="plus" size={20} color="white" />
                            <Text style={styles.addButtonText}>Anunciar</Text>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={myStock}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.stockCard}>
                                <Image source={{ uri: item.itens?.foto_url }} style={styles.stockImage} />
                                <View style={styles.stockInfo}>
                                    <Text style={styles.stockName}>{item.itens?.nome}</Text>
                                    <Text style={styles.stockPrice}>R$ {item.preco_unitario.toFixed(2)} / {item.itens?.tipos_item?.nome}</Text>
                                    <Text style={item.quantidade > 0 ? styles.qtyGreen : styles.qtyRed}>
                                        {item.quantidade > 0 ? `${item.quantidade} em estoque` : 'Esgotado'}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('EditProduct', { product: item })} // Passa o item clicado
                                    style={{ padding: 8 }} // Aumenta um pouco a área de toque
                                >
                                    <Feather name="edit-2" size={20} color={colors.primary} />
                                </TouchableOpacity>
                            </View>
                        )}
                        ListEmptyComponent={() => (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyText}>Nenhum produto anunciado.</Text>
                            </View>
                        )}
                    />
                </View>
            </SafeAreaView>
        );
    }

    // --- RENDERIZAÇÃO PARA CONSUMIDOR ---
    const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Header
                userName={user?.nome || "Visitante"}
                cartItemsCount={cartItemsCount}
                onCartClick={openCart}
                onProfileClick={() => navigation.navigate('ProfileScreen')} // Nome da rota corrigido
                onLogout={handleLogout}
            />

            <SearchBar value={search} onChange={setSearch} />
            <CategoryFilter selectedCategory={category} onSelectCategory={setCategory} />

            <FlatList
                data={filteredProducts}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <ProductCard
                        product={item}
                        quantity={items.find(i => i.id === item.id)?.quantity || 0}
                        onAddToCart={() => addToCart(item)}
                        onRemoveFromCart={() => removeFromCart(item.id)}
                        onProductClick={() => {}}
                    />
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    listContent: { padding: 16 },
    producerContainer: { flex: 1, padding: 20 },
    producerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
    subtitle: { fontSize: 14, color: '#888' },
    addButton: { backgroundColor: colors.primary, flexDirection: 'row', padding: 10, borderRadius: 8, alignItems: 'center' },
    addButtonText: { color: 'white', fontWeight: 'bold', marginLeft: 5 },
    stockCard: { backgroundColor: 'white', flexDirection: 'row', padding: 15, borderRadius: 12, marginBottom: 10, alignItems: 'center', elevation: 2 },
    stockImage: { width: 40, height: 40, borderRadius: 20, marginRight: 15 },
    stockInfo: { flex: 1 },
    stockName: { fontWeight: 'bold', fontSize: 16 },
    stockPrice: { color: colors.primary, fontSize: 14 },
    qtyGreen: { color: 'green', fontSize: 12 },
    qtyRed: { color: 'red', fontSize: 12 },
    emptyState: { marginTop: 50, alignItems: 'center' },
    emptyText: { color: '#999' }
});