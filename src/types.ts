export interface Product {
  id: string;
  emoji: string;
  name: string;
  price: number;
  unit: string;
  initialStock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Sale {
  id: string;
  timestamp: number;
  items: CartItem[];
  total: number;
}

export type AppMode = 'sell' | 'count' | 'audit';