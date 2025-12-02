// src/components/CategoryFilter.tsx
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';

type Category = 'todos' | 'alimentos' | 'bebidas' | 'panificados' | 'laticínios' | 'outros';

interface CategoryFilterProps {
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
}

// Mapeamento de ícones (Nome no Feather)
const iconMap: Record<string, keyof typeof Feather.glyphMap> = {
  todos: 'grid',
  alimentos: 'package', // Apple não tem no Feather, usei package
  bebidas: 'coffee',
  panificados: 'layers', // Croissant não tem
  laticínios: 'droplet', // Milk não tem
  outros: 'more-horizontal'
};

const categories = [
  { id: 'todos', label: 'Todos' },
  { id: 'alimentos', label: 'Alimentos' },
  { id: 'bebidas', label: 'Bebidas' },
  { id: 'panificados', label: 'Pães' },
  { id: 'laticínios', label: 'Laticínios' },
];

export function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const iconName = iconMap[cat.id] || 'circle';

          return (
            <TouchableOpacity
              key={cat.id}
              style={[styles.button, isSelected && styles.buttonSelected]}
              onPress={() => onSelectCategory(cat.id as Category)}
            >
              <Feather 
                name={iconName} 
                size={16} 
                color={isSelected ? 'white' : colors.textSecondary} 
              />
              <Text style={[styles.text, isSelected && styles.textSelected]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  buttonSelected: {
    backgroundColor: colors.primary,
  },
  text: {
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 14,
  },
  textSelected: {
    color: 'white',
  }
});