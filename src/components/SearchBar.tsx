// src/components/SearchBar.tsx
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = 'Pesquisar produtos...' }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <Feather name="search" size={20} color={colors.textTertiary} style={styles.icon} />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChange} // No RN é onChangeText, não onChange
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5', // Cinza claro
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    height: 48,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    height: '100%',
  },
});