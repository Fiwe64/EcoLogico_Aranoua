import React from 'react';
// Importamos os componentes nativos essenciais do React Native
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
// Importamos os ícones da versão correta (native)
import { ArrowLeft, Edit, MapPin, Phone, Mail, Store, User as UserIcon } from 'lucide-react-native';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Importa suas definições de tipo
import { User } from '../types';
import { RootStackParamList } from "../navigation/AppNavigation";
// NOTA: Se o seu ImageWithFallback usar <img> (HTML), ele vai quebrar.
// Por segurança, usarei o componente Image padrão do React Native neste exemplo.

// Definimos uma paleta de cores local para substituir as variáveis CSS (var(--color...))
const COLORS = {
    primary: '#0066CC', // Exemplo de cor primária
    primaryLight: '#E6F0FF',
    background: '#F5F5F5',
    textPrimary: '#333333',
    textSecondary: '#666666',
    textTertiary: '#999999',
    white: '#FFFFFF',
};

const MOCK_USER: User = {
    id: '1',
    name: 'Maria Silva',
    email: 'maria@silva.com',
    type: 'cliente',
    photo: 'https://imgs.search.brave.com/GV0xST9gNWgtSC-bSBhMoUBWz-0VX-g1WCekYN6z6aA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wbTEu/YW1pbm9hcHBzLmNv/bS82NzgzL2Q5ZWU1/ZDJkN2NmYmU4MjY4/MDg0NTQxNzk1YmZk/OTA4MjYyMTBlMjh2/Ml9ocS5qcGc',
    bio: 'Apaixonada por tecnologia e boas compras.',
    phone: '(11) 99999-9999',
    city: 'São Paulo',
    state: 'SP'
};

export function ProfileScreen() {
    // Hook de navegação tipado
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const handleBack = () => {
        navigation.goBack();
    };

    const handleEditProfile = () => {
        console.log("Navegar para edição");
        // navigation.navigate('EditProfile');
    };

    const user = MOCK_USER;

    return (
        // ScrollView substitui a div principal para permitir rolagem na tela
        <ScrollView style={styles.container}>

            {/* Header (Topo com botões) */}
            {/* View substitui div. style substitui className */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    {/* TouchableOpacity substitui button para áreas clicáveis */}
                    <TouchableOpacity
                        onPress={handleBack}
                        style={styles.iconButton}
                        activeOpacity={0.7}
                    >
                        {/* Lucide Icons: usa size (número) e color (string) */}
                        <ArrowLeft size={24} color={COLORS.white} />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>Meu Perfil</Text>

                    <TouchableOpacity
                        onPress={handleEditProfile}
                        style={styles.iconButton}
                        activeOpacity={0.7}
                    >
                        <Edit size={24} color={COLORS.white} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Profile Header (Foto e Nome) */}
            <View style={styles.profileHeader}>
                <View style={styles.profileInfoContainer}>
                    {/* Container da foto */}
                    <View style={styles.photoContainer}>
                        {user.photo ? (
                            <Image
                                source={{ uri: user.photo }}
                                style={styles.photo}
                                resizeMode="cover"
                            />
                        ) : (
                            <View style={styles.photoPlaceholder}>
                                <UserIcon size={48} color={COLORS.white} />
                            </View>
                        )}
                    </View>

                    {/* Text substitui h1 */}
                    <Text style={styles.userName}>{user.name}</Text>

                    {/* Badge de tipo de usuário */}
                    <View style={styles.userTypeBadge}>
                        <Text style={styles.userTypeText}>
                            {user.type === 'cliente' ? 'Cliente' : 'Vendedor'}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Profile Information (Conteúdo) */}
            <View style={styles.contentSection}>

                {/* Bio */}
                {user.bio && (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Sobre</Text>
                        <Text style={styles.cardText}>{user.bio}</Text>
                    </View>
                )}

                {/* Loja (Vendedor) */}
                {user.type === 'vendedor' && user.storeName && (
                    <View style={styles.card}>
                        <View style={styles.row}>
                            <View style={styles.iconCircle}>
                                <Store size={24} color={COLORS.primary} />
                            </View>
                            <View>
                                <Text style={styles.label}>Nome da Loja</Text>
                                <Text style={styles.value}>{user.storeName}</Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* Contato */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Informações de Contato</Text>

                    <View style={styles.infoGap}>
                        {/* E-mail */}
                        <View style={styles.row}>
                            <View style={styles.iconCircle}>
                                <Mail size={20} color={COLORS.primary} />
                            </View>
                            <View>
                                <Text style={styles.label}>E-mail</Text>
                                <Text style={styles.value}>{user.email}</Text>
                            </View>
                        </View>

                        {/* Telefone */}
                        {user.phone && (
                            <View style={styles.row}>
                                <View style={styles.iconCircle}>
                                    <Phone size={20} color={COLORS.primary} />
                                </View>
                                <View>
                                    <Text style={styles.label}>Telefone</Text>
                                    <Text style={styles.value}>{user.phone}</Text>
                                </View>
                            </View>
                        )}

                        {/* Endereço */}
                        {(user.address || user.city || user.state) && (
                            <View style={styles.row}>
                                <View style={styles.iconCircle}>
                                    <MapPin size={20} color={COLORS.primary} />
                                </View>
                                <View>
                                    <Text style={styles.label}>Endereço</Text>
                                    <Text style={styles.value}>
                                        {user.address}
                                        {user.address && (user.city || user.state) ? '\n' : ''}
                                        {user.city ? user.city : ''}
                                        {user.city && user.state ? ', ' : ''}
                                        {user.state ? user.state : ''}
                                    </Text>
                                </View>
                            </View>
                        )}
                    </View>
                </View>

                {/* Estatísticas (Vendedor) */}
                {user.type === 'vendedor' && (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Estatísticas</Text>
                        <View style={styles.statsGrid}>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>12</Text>
                                <Text style={styles.statLabel}>Produtos</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>48</Text>
                                <Text style={styles.statLabel}>Vendas</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>4.8</Text>
                                <Text style={styles.statLabel}>Avaliação</Text>
                            </View>
                        </View>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

// Estilos usando StyleSheet (Padrão do React Native)
// Isso substitui o uso de className do Tailwind/CSS
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerTitle: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    iconButton: {
        padding: 8,
        borderRadius: 8,
    },
    profileHeader: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 16,
        paddingBottom: 32,
        paddingTop: 16,
        alignItems: 'center',
    },
    profileInfoContainer: {
        alignItems: 'center',
    },
    photoContainer: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderWidth: 4,
        borderColor: 'rgba(255,255,255,0.3)',
        overflow: 'hidden',
        marginBottom: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    photo: {
        width: '100%',
        height: '100%',
    },
    photoPlaceholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    userName: {
        color: COLORS.white,
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    userTypeBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
    },
    userTypeText: {
        color: COLORS.white,
        fontSize: 12,
    },
    contentSection: {
        padding: 16,
        gap: 16, // Espaçamento entre os cards
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000', // Sombra (iOS)
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2, // Sombra (Android)
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: 12,
    },
    cardText: {
        color: COLORS.textSecondary,
        lineHeight: 20,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    infoGap: {
        gap: 16,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    label: {
        color: COLORS.textTertiary,
        fontSize: 12,
    },
    value: {
        color: COLORS.textPrimary,
        fontSize: 14,
        fontWeight: '500',
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statNumber: {
        color: COLORS.primary,
        fontSize: 18,
        fontWeight: 'bold',
    },
    statLabel: {
        color: COLORS.textTertiary,
        fontSize: 12,
    },
});