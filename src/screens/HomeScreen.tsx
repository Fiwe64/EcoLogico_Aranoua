import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Header } from '../components/Header';
import { SearchBar } from '../components/SearchBar';
import { CategoryFilter } from '../components/CategoryFilter';
import { ProductCard } from '../components/ProductCard';
import { colors } from '../theme/colors';
import { mockProducts } from '../data/mockProducts';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/AppNavigation';


type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export function HomeScreen() {

  const navigation = useNavigation<NavigationProp>();
  const [category, setCategory] = useState<any>('todos');
  const [search, setSearch] = useState('');
  

  const filteredProducts = mockProducts.filter(p => {
    const matchesCategory = category === 'todos' || p.category === category;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleLogout = () => {
    // Reseta a pilha e volta para o Login
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>

      <Header 
        userName="Maria Silva" 
        cartItemsCount={2} 
        onCartClick={() => {}} 
        onProfileClick={() => {}} 
        onLogout={handleLogout}
      />

      <SearchBar value={search} onChange={setSearch} />
      
      <CategoryFilter selectedCategory={category} onSelectCategory={setCategory} />

      {/* Lista de Produtos */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard 
            product={item} 
            quantity={0} 
            onAddToCart={() => {}}
            onRemoveFromCart={() => {}}
            onProductClick={() => {}}
          />
        )}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: 16,
  }
});