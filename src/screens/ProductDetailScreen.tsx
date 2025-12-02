import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { Product } from '../types';

export function ProductDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Pegamos o produto passado via navegação. Se não tiver (teste), usamos undefined
  const { product } = (route.params as { product: Product }) || {};

  if (!product) return null; // Ou um loading

  return (
    <View style={styles.container}>
      {/* Header Fixo */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes</Text>
        <View style={{width: 24}} /> 
      </View>

      <ScrollView>
        <Image source={{ uri: product.image }} style={styles.image} />
        
        <View style={styles.content}>
          <View style={styles.row}>
            <View style={{flex: 1}}>
              <Text style={styles.name}>{product.name}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{product.category}</Text>
              </View>
            </View>
            <View style={{alignItems: 'flex-end'}}>
              <Text style={styles.price}>R$ {product.price.toFixed(2)}</Text>
              <Text style={styles.unit}>{product.unit}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descrição</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          <View style={styles.producerCard}>
            <Feather name="map-pin" size={24} color={colors.primary} />
            <View style={{marginLeft: 12}}>
              <Text style={styles.producerName}>{product.producer}</Text>
              <Text style={styles.producerLabel}>Produtor Local</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Botão de Ação Fixo */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.chatButton}>
          <Feather name="message-circle" size={20} color={colors.textPrimary} />
          <Text style={{marginLeft: 8, fontWeight: 'bold'}}>Conversar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.cartButton}>
          <Feather name="shopping-cart" size={20} color="white" />
          <Text style={{color: 'white', marginLeft: 8, fontWeight: 'bold'}}>Adicionar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 16, paddingTop: 60, borderBottomWidth: 1, borderColor: '#eee',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  image: { width: '100%', height: 300 },
  content: { padding: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  name: { fontSize: 24, fontWeight: 'bold', color: colors.textPrimary, marginBottom: 8 },
  badge: { backgroundColor: colors.primaryLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, alignSelf: 'flex-start' },
  badgeText: { color: colors.primary, fontSize: 12, fontWeight: 'bold' },
  price: { fontSize: 24, fontWeight: 'bold', color: colors.primary },
  unit: { color: colors.textTertiary, textAlign: 'right' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  description: { color: colors.textSecondary, lineHeight: 22 },
  producerCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9f9f9',
    padding: 16, borderRadius: 12,
  },
  producerName: { fontWeight: 'bold', fontSize: 16 },
  producerLabel: { color: colors.textTertiary, fontSize: 12 },
  footer: {
    flexDirection: 'row', padding: 16, borderTopWidth: 1, borderColor: '#eee', gap: 12,
  },
  chatButton: {
    flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    padding: 16, borderRadius: 12, backgroundColor: '#f0f0f0',
  },
  cartButton: {
    flex: 2, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    padding: 16, borderRadius: 12, backgroundColor: colors.primary,
  },
});