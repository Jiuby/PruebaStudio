
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  collectionId?: string;
  image: string;
  images?: string[];
  isNew?: boolean;
  description: string;
  details?: string[]; // Dynamic bullet points for product specifics
  colors?: string[];
  sizes?: string[];
  inStock?: boolean;
  availableSizes?: string[];
}

export interface Collection {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  category?: string; // Optional now, as collections can be mixed
  size: 'large' | 'medium' | 'small';
}

export interface StoreSettings {
  storeName: string;
  supportEmail: string;
  currency: string;
  shippingFlatRate: number;
  freeShippingThreshold: number;
  maintenanceMode: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  size: string;
}

export type SortOption = 'featured' | 'price-asc' | 'price-desc';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  zip?: string;
  role?: 'user' | 'admin';
  joinDate?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size: string;
}

export interface OrderShippingDetails {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  zip: string;
  phone: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered';
  total: number;
  items: OrderItem[];
  customerName?: string;
  customerEmail?: string;
  shippingDetails?: OrderShippingDetails;
}
