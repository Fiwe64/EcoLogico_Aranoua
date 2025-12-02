export interface User {
  id: string;
  name: string;
  email: string;
  type: 'cliente' | 'vendedor';
  photo?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  bio?: string;
  storeName?: string; // Para vendedores
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: 'alimentos' | 'bebidas' | 'panificados' | 'laticínios' | 'outros';
  description: string;
  producer: string;
  unit: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}