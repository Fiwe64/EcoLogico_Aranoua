// src/components/ProductCard.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Product } from '../types';
import { colors } from '../theme/colors';

interface ProductCardProps {
  product: Product;
  quantity: number;
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (productId: string) => void;
  onProductClick: (product: Product) => void;
}

export function ProductCard({ product, quantity, onAddToCart, onRemoveFromCart, onProductClick }: ProductCardProps) {
  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => onProductClick(product)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{product.category}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
        <Text style={styles.producer}>{product.producer}</Text>
        <Text style={styles.description} numberOfLines={2}>{product.description}</Text>

        <View style={styles.footer}>
          <View>
            <Text style={styles.price}>R$ {product.price.toFixed(2)}</Text>
            <Text style={styles.unit}>{product.unit}</Text>
          </View>

          {quantity === 0 ? (
            <TouchableOpacity 
              style={styles.addButton} 
              onPress={(e) => { e.stopPropagation(); onAddToCart(product); }}
            >
              <Feather name="plus" size={24} color="white" />
            </TouchableOpacity>
          ) : (
            <View style={styles.quantityControl}>
              <TouchableOpacity 
                style={styles.controlButton} 
                onPress={(e) => { e.stopPropagation(); onRemoveFromCart(product.id); }}
              >
                <Feather name="minus" size={16} color={colors.textPrimary} />
              </TouchableOpacity>
              
              <Text style={styles.quantityText}>{quantity}</Text>
              
              <TouchableOpacity 
                style={styles.controlButtonPrimary} 
                onPress={(e) => { e.stopPropagation(); onAddToCart(product); }}
              >
                <Feather name="plus" size={16} color="white" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    elevation: 2, // Sombra Android
    shadowColor: '#000', // Sombra iOS
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  imageContainer: {
    height: 160,
    backgroundColor: '#f0f0f0',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  categoryBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  producer: {
    fontSize: 12,
    color: colors.textTertiary,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  unit: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  addButton: {
    backgroundColor: colors.primary,
    padding: 8,
    borderRadius: 8,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  controlButton: {
    backgroundColor: colors.border,
    padding: 6,
    borderRadius: 8,
  },
  controlButtonPrimary: {
    backgroundColor: colors.primary,
    padding: 6,
    borderRadius: 8,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
    minWidth: 20,
    textAlign: 'center',
  },
});