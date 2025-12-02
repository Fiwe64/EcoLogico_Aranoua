// src/components/Header.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';

interface HeaderProps {
  cartItemsCount: number;
  userName: string;
  userPhoto?: string;
  onCartClick: () => void;
  onProfileClick: () => void;
  onLogout: () => void;
}

export function Header({ cartItemsCount, userName, userPhoto, onCartClick, onProfileClick, onLogout }: HeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.userSection}>
        <View style={styles.avatarContainer}>
          {userPhoto ? (
            <Image source={{ uri: userPhoto }} style={styles.avatar} />
          ) : (
            <Feather name="user" size={20} color="white" />
          )}
        </View>
        <View>
          <Text style={styles.greeting}>Olá,</Text>
          <Text style={styles.username}>{userName}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={onCartClick} style={styles.iconButton}>
          <Feather name="shopping-cart" size={24} color="white" />
          {cartItemsCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartItemsCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={onProfileClick} style={styles.iconButton}>
          <Feather name="user" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={onLogout} style={styles.iconButton}>
          <Feather name="log-out" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    paddingTop: 50, // Espaço para StatusBar
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  greeting: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
  },
  username: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
  },
  iconButton: {
    padding: 4,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.secondary,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});