import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { CartItem, Product, Order, Collection, UserProfile, StoreSettings } from '../types';
import { MOCK_CUSTOMERS, CATEGORIES } from '../constants'; // Keep MOCK_CUSTOMERS for now as we didn't do auth backend fully yet
import * as api from '../services/api';

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
  addProduct: (product: Product | FormData) => void;
  updateProduct: (idOrProduct: string | Product, data?: any) => void;
  deleteProduct: (id: string) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  addCategory: (category: string) => void;
  editCategory: (oldName: string, newName: string) => void;
  deleteCategory: (category: string) => void;
  addCollection: (collection: Collection | FormData) => void;
  updateCollection: (idOrCollection: string | Collection, data?: any) => void;
  deleteCollection: (id: string) => void;
  deleteCustomer: (id: string) => void;
  updateStoreSettings: (settings: StoreSettings) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<string[]>(CATEGORIES);
  const [collections, setCollections] = useState<Collection[]>([]);
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

  const [categoryObjects, setCategoryObjects] = useState<any[]>([]);

  // Load Data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, collectionsData, ordersData, settingsData, categoriesData] = await Promise.all([
          api.fetchProducts(),
          api.fetchCollections(),
          api.fetchOrders(),
          api.fetchSettings(),
          api.fetchCategories()
        ]);

        setProducts(productsData);
        setCollections(collectionsData);
        setOrders(ordersData);
        if (settingsData) {
          setStoreSettings(prev => ({ ...prev, ...settingsData }));
        }

        setCategoryObjects(categoriesData);
        // Map category objects to strings for compatibility, plus 'All'
        const categoryNames = categoriesData.map((c: any) => c.name);
        // Also include any categories from products that might not be in the category list (legacy)
        const productCategories = new Set(productsData.map((p: Product) => p.category));
        const allCategories = Array.from(new Set([...categoryNames, ...productCategories]));

        // Ensure 'All' is there if needed, or just rely on the UI to add it. 
        // The original constant had 'All', 'T-Shirts', etc.
        // We'll just set the state to the fetched names.
        setCategories(allCategories);

      } catch (error) {
        console.error("Failed to fetch data from API:", error);
      }
    };

    loadData();
  }, []);

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

  const createOrder = async (newOrder: Order) => {
    try {
      const createdOrder = await api.createOrder(newOrder);
      setOrders((prev) => [createdOrder, ...prev]);
      clearCart();
    } catch (error) {
      console.error("Failed to create order:", error);
    }
  };

  // --- Admin Functions ---

  const addProduct = async (product: Product | FormData) => {
    try {
      const newProduct = await api.createProduct(product);
      setProducts((prev) => [newProduct, ...prev]);
    } catch (error: any) {
      console.error("Failed to add product:", error);
      console.error("Error response:", error.response?.data);
      alert(`Failed to add product: ${JSON.stringify(error.response?.data, null, 2)}`);
    }
  };

  const updateProduct = async (idOrProduct: string | Product, data?: any) => {
    try {
      let id: string;
      let payload: any;

      if (typeof idOrProduct === 'string') {
        id = idOrProduct;
        payload = data;
      } else {
        id = idOrProduct.id;
        payload = idOrProduct;
      }

      const result = await api.updateProduct(id, payload);
      setProducts((prev) => prev.map(p => p.id === id ? result : p));
    } catch (error: any) {
      console.error("Failed to update product:", error);
      console.error("Error response:", error.response?.data);
      alert(`Failed to update product: ${JSON.stringify(error.response?.data, null, 2)}`);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await api.deleteProduct(id);
      setProducts((prev) => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    try {
      const updatedOrder = await api.updateOrderStatus(id, status);
      setOrders((prev) => prev.map(o => o.id === id ? updatedOrder : o));
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const addCategory = async (category: string) => {
    if (!categories.includes(category)) {
      try {
        const newCat = await api.createCategory({ name: category });
        setCategoryObjects(prev => [...prev, newCat]);
        setCategories((prev) => [...prev, category]);
      } catch (error) {
        console.error("Failed to add category:", error);
      }
    }
  };

  const editCategory = async (oldName: string, newName: string) => {
    if (oldName === 'All' || newName === 'All') return;
    if (!newName.trim()) return;
    if (categories.includes(newName)) return;

    const catObj = categoryObjects.find(c => c.name === oldName);
    if (catObj) {
      try {
        const updatedCat = await api.updateCategory(catObj.id, { name: newName });
        setCategoryObjects(prev => prev.map(c => c.id === catObj.id ? updatedCat : c));
        setCategories((prev) => prev.map(c => c === oldName ? newName : c));

        // Update products locally
        setProducts((prev) => prev.map(p =>
          p.category === oldName ? { ...p, category: newName } : p
        ));
      } catch (error) {
        console.error("Failed to update category:", error);
      }
    } else {
      // Fallback for legacy/product-derived categories that don't have an ID
      // We can't update them in the backend category table if they don't exist there.
      // But we can update the local state.
      setCategories((prev) => prev.map(c => c === oldName ? newName : c));
    }
  };

  const deleteCategory = async (category: string) => {
    if (category === 'All') return;

    const catObj = categoryObjects.find(c => c.name === category);
    if (catObj) {
      try {
        await api.deleteCategory(catObj.id);
        setCategoryObjects(prev => prev.filter(c => c.id !== catObj.id));
        setCategories((prev) => prev.filter(c => c !== category));
      } catch (error) {
        console.error("Failed to delete category:", error);
      }
    } else {
      setCategories((prev) => prev.filter(c => c !== category));
    }
  };

  const addCollection = async (collection: Collection | FormData) => {
    try {
      await api.createCollection(collection);
      // Re-fetch to ensure we have the correct data (IDs, URLs, etc.)
      const data = await api.fetchCollections();
      setCollections(data);
    } catch (error) {
      console.error("Failed to add collection:", error);
    }
  };

  const updateCollection = async (idOrCollection: string | Collection, data?: any) => {
    try {
      let id: string;
      let payload: any;

      if (typeof idOrCollection === 'string') {
        id = idOrCollection;
        payload = data;
      } else {
        id = idOrCollection.id;
        payload = idOrCollection;
      }

      await api.updateCollection(id, payload);
      const result = await api.fetchCollections();
      setCollections(result);
    } catch (error) {
      console.error("Failed to update collection:", error);
    }
  };

  const deleteCollection = async (id: string) => {
    try {
      await api.deleteCollection(id);
      const result = await api.fetchCollections();
      setCollections(result);
    } catch (error) {
      console.error("Failed to delete collection:", error);
    }
  };

  const deleteCustomer = (id: string) => {
    setCustomers((prev) => prev.filter(c => c.id !== id));
  };

  const updateStoreSettings = async (settings: StoreSettings) => {
    try {
      const updatedSettings = await api.updateSettings(settings);
      setStoreSettings(updatedSettings);
    } catch (error) {
      console.error("Failed to update settings:", error);
    }
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

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
