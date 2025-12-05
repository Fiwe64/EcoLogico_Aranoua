import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '../types';

// Define o tipo do item no carrinho (Produto + quantidade)
export interface CartItem extends Product {
    quantity: number;
}

// Define o que o nosso Contexto vai expor para o app
interface CartContextData {
    items: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    total: number;
    isCartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
}

// Cria o contexto
const CartContext = createContext<CartContextData>({} as CartContextData);

// O Provider que vai envolver o App
export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Lógica para adicionar item
    const addToCart = (product: Product) => {
        setItems(currentItems => {
            // Verifica se o item já existe no carrinho
            const itemExists = currentItems.find(item => item.id === product.id);

            if (itemExists) {
                // Se existe, aumenta a quantidade
                return currentItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            // Se não existe, adiciona com quantidade 1
            return [...currentItems, { ...product, quantity: 1 }];
        });
        // Opcional: Abrir o carrinho automaticamente ao adicionar
        // setIsCartOpen(true);
    };

    // Lógica para remover item (decrementa ou remove se for 0)
    const removeFromCart = (productId: string) => {
        setItems(currentItems => {
            const existingItem = currentItems.find(item => item.id === productId);

            if (existingItem && existingItem.quantity > 1) {
                return currentItems.map(item =>
                    item.id === productId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                );
            }
            // Se quantidade for 1, remove do array
            return currentItems.filter(item => item.id !== productId);
        });
    };

    // Calcula o total
    const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{
            items,
            addToCart,
            removeFromCart,
            total,
            isCartOpen,
            openCart: () => setIsCartOpen(true),
            closeCart: () => setIsCartOpen(false)
        }}>
            {children}
        </CartContext.Provider>
    );
}

// Hook personalizado para facilitar o uso
export function useCart() {
    return useContext(CartContext);
}