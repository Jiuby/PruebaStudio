
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { CartItem, Product, Order, Collection, UserProfile, StoreSettings } from '../types';
import { PRODUCTS, MOCK_ORDERS, CATEGORIES, COLLECTIONS, MOCK_CUSTOMERS } from '../constants';

interface ShopContextType {
  products: Product[];
  orders: Order[];
  cart: CartItem[];
  categories: string[];
  collections: Collection[];
  customers: UserProfile[];
  storeSettings: StoreSettings;
  isCartOpen: boolean;
  addToCart: (product: Product, size: string) => void;
  removeFromCart: (productId: string, size: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  cartTotal: number;
  cartCount: number;
  // Order Actions
  createOrder: (order: Order) => void;
  // Admin Actions
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  addCategory: (category: string) => void;
  editCategory: (oldName: string, newName: string) => void;
  deleteCategory: (category: string) => void;
  addCollection: (collection: Collection) => void;
  updateCollection: (collection: Collection) => void;
  deleteCollection: (id: string) => void;
  deleteCustomer: (id: string) => void;
  updateStoreSettings: (settings: StoreSettings) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state with constants, but allow modification
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [categories, setCategories] = useState<string[]>(CATEGORIES);
  const [collections, setCollections] = useState<Collection[]>(COLLECTIONS);
  const [customers, setCustomers] = useState<UserProfile[]>(MOCK_CUSTOMERS);
  
  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    storeName: 'GOUSTTY',
    supportEmail: 'support@goustty.com',
    currency: 'COP',
    shippingFlatRate: 12000,
    freeShippingThreshold: 200000,
    maintenanceMode: false
  });
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product: Product, size: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id && item.size === size);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1, size }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, size: string) => {
    setCart((prev) => prev.filter((item) => !(item.id === productId && item.size === size)));
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleCart = () => setIsCartOpen((prev) => !prev);

  // --- Order Functions ---

  const createOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  // --- Admin Functions ---

  const addProduct = (product: Product) => {
    setProducts((prev) => [product, ...prev]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts((prev) => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter(p => p.id !== id));
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders((prev) => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const addCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories((prev) => [...prev, category]);
    }
  };

  const editCategory = (oldName: string, newName: string) => {
    if (oldName === 'All' || newName === 'All') return; // Prevent modifying 'All'
    if (!newName.trim()) return; 
    if (categories.includes(newName)) return; // Prevent duplicates

    // 1. Update the category list
    setCategories((prev) => prev.map(c => c === oldName ? newName : c));

    // 2. Update all products that belong to this category
    setProducts((prev) => prev.map(p => 
      p.category === oldName ? { ...p, category: newName } : p
    ));
  };

  const deleteCategory = (category: string) => {
    // Prevent deleting 'All'
    if (category === 'All') return;
    setCategories((prev) => prev.filter(c => c !== category));
  };

  const addCollection = (collection: Collection) => {
    setCollections((prev) => [...prev, collection]);
  };

  const updateCollection = (updatedCollection: Collection) => {
    setCollections((prev) => prev.map(c => c.id === updatedCollection.id ? updatedCollection : c));
  };

  const deleteCollection = (id: string) => {
    setCollections((prev) => prev.filter(c => c.id !== id));
  };

  const deleteCustomer = (id: string) => {
    setCustomers((prev) => prev.filter(c => c.id !== id));
  };

  const updateStoreSettings = (settings: StoreSettings) => {
    setStoreSettings(settings);
  };

  // -----------------------

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Prevent scrolling when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  return (
    <ShopContext.Provider
      value={{
        products,
        orders,
        cart,
        categories,
        collections,
        customers,
        storeSettings,
        isCartOpen,
        addToCart,
        removeFromCart,
        clearCart,
        toggleCart,
        cartTotal,
        cartCount,
        createOrder,
        addProduct,
        updateProduct,
        deleteProduct,
        updateOrderStatus,
        addCategory,
        editCategory,
        deleteCategory,
        addCollection,
        updateCollection,
        deleteCollection,
        deleteCustomer,
        updateStoreSettings
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
