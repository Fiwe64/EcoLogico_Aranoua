// src/data/mockProducts.ts
import { Product } from '../types';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Cesta de Vegetais Orgânicos',
    price: 45.90,
    image: 'https://images.unsplash.com/photo-1554223745-ad862492c213?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwdmVnZXRhYmxlcyUyMGZhcm1lcnMlMjBtYXJrZXR8ZW58MXx8fHwxNzYzNTY0MTE3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'alimentos',
    description: 'Cesta variada com vegetais frescos e orgânicos da estação',
    producer: 'Fazenda Verde Vida',
    unit: 'cesta'
  },
  {
    id: '2',
    name: 'Pão Artesanal Integral',
    price: 12.50,
    image: 'https://images.unsplash.com/photo-1555932450-31a8aec2adf1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGJyZWFkJTIwYmFrZXJ5fGVufDF8fHx8MTc2MzQ4NTQ0OHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'panificados',
    description: 'Pão integral feito com farinha orgânica e fermentação natural',
    producer: 'Padaria do Bairro',
    unit: 'unidade'
  },
  {
    id: '3',
    name: 'Mel Orgânico Silvestre',
    price: 28.00,
    image: 'https://images.unsplash.com/photo-1692797178143-659c48c34135?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob25leSUyMGphciUyMG5hdHVyYWx8ZW58MXx8fHwxNzYzNDg4NzQ5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'outros',
    description: 'Mel puro extraído de flores silvestres',
    producer: 'Apiário São José',
    unit: '500g'
  },
  {
    id: '4',
    name: 'Queijo Artesanal',
    price: 38.90,
    image: 'https://images.unsplash.com/photo-1752401984776-edc407a13e1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc2FuJTIwY2hlZXNlJTIwbG9jYWx8ZW58MXx8fHwxNzYzNTY0MTE3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'laticínios',
    description: 'Queijo artesanal curado produzido com leite de vacas criadas a pasto',
    producer: 'Laticínio Montanha',
    unit: '400g'
  },
  {
    id: '5',
    name: 'Ovos Caipiras',
    price: 18.00,
    image: 'https://images.unsplash.com/photo-1669669420238-7a4be2e3eac6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwZWdncyUyMGZhcm18ZW58MXx8fHwxNzYzNTY0MTE4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'alimentos',
    description: 'Ovos de galinhas criadas soltas e alimentadas naturalmente',
    producer: 'Granja Feliz',
    unit: 'dúzia'
  },
  {
    id: '6',
    name: 'Café Especial Torrado',
    price: 32.00,
    image: 'https://images.unsplash.com/photo-1599766676337-49a81ed46552?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmFmdCUyMGNvZmZlZSUyMGJlYW5zfGVufDF8fHx8MTc2MzU2NDExOHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'bebidas',
    description: 'Café especial cultivado e torrado artesanalmente',
    producer: 'Cafeteria da Serra',
    unit: '250g'
  }
];