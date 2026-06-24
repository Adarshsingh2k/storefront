export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export type StockStatus = 'in_stock' | 'low_stock' | 'sold_out';

export interface Color {
  name: string;
  hex: string;
}

export interface SizeVariant {
  size: string;
  status: StockStatus;
  stock: number;
}

export interface ProductVariants {
  colors: Color[];
  sizes: SizeVariant[];
  originalPrice?: number; 
  brand: string;
}

export interface CartItem {
  id: string; 
  productId: number;
  title: string;
  image: string;
  price: number;
  color: Color;
  size: string;
  quantity: number;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
