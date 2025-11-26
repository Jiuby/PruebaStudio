
export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'Hoodies' | 'Bottoms' | 'Accessories' | 'Tees';
  image: string;
  images?: string[];
  isNew?: boolean;
  description: string;
  colors?: string[];
  sizes?: string[];
  inStock?: boolean;
  availableSizes?: string[];
}

export interface CartItem extends Product {
  quantity: number;
  size: string;
}

export type SortOption = 'featured' | 'price-asc' | 'price-desc';

export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  zip?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered';
  total: number;
  items: OrderItem[];
}