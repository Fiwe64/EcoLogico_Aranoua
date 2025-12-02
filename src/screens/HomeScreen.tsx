// src/screens/HomeScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Header } from '../components/Header';
import { SearchBar } from '../components/SearchBar';
import { CategoryFilter } from '../components/CategoryFilter';
import { ProductCard } from '../components/ProductCard';
import { colors } from '../theme/colors';
import { mockProducts } from '../data/mockProducts';

export function HomeScreen() {
  const [category, setCategory] = useState<any>('todos');
  const [search, setSearch] = useState('');
  
  // Lógica de filtro simples (igual à aula 7)
  const filteredProducts = mockProducts.filter(p => {
    const matchesCategory = category === 'todos' || p.category === category;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <View style={styles.container}>
      {/* Header Fixo */}
      <Header 
        userName="Maria Silva" 
        cartItemsCount={2} 
        onCartClick={() => {}} 
        onProfileClick={() => {}} 
        onLogout={() => {}}
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
    </View>
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