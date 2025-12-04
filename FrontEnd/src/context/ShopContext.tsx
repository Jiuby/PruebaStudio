import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { CartItem, Product, Order, Collection, UserProfile, StoreSettings } from '../types';
import { CATEGORIES } from '../constants';
import * as api from '../services/api';
import { authService, RegisterData, LoginData, User } from '../services/auth';

interface ShopContextType {
  products: Product[];
  orders: Order[];
  cart: CartItem[];
  categories: string[];
  collections: Collection[];
  customers: UserProfile[];
  storeSettings: StoreSettings;
  isCartOpen: boolean;
  isLoading: boolean;
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  authToken: string | null;
  register: (data: RegisterData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => void;
  // Cart
  addToCart: (product: Product, size: string, color: string) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  cartTotal: number;
  cartCount: number;
  // Order Actions
  createOrder: (order: Order) => void;
  reloadOrders: () => Promise<void>;
  // Admin Actions
  addProduct: (product: Product | FormData) => void;
  updateProduct: (idOrProduct: string | Product, data?: any) => void;
  patchProduct: (id: string, data: any) => void;
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
  const [customers, setCustomers] = useState<UserProfile[]>([]);

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
  const [isLoading, setIsLoading] = useState(true);

  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(() => {
    return localStorage.getItem('authToken');
  });
  const isAuthenticated = !!authToken && !!user;

  const [categoryObjects, setCategoryObjects] = useState<any[]>([]);

  // Load Data from API
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // 1. Load Public Data (Products, Collections, Settings, Categories)
        const [productsData, collectionsData, settingsData, categoriesData] = await Promise.all([
          api.fetchProducts(),
          api.fetchCollections(),
          api.fetchSettings(),
          api.fetchCategories()
        ]);

        setProducts(productsData);
        setCollections(collectionsData);
        if (settingsData) {
          setStoreSettings(prev => ({ ...prev, ...settingsData }));
        }

        setCategoryObjects(categoriesData);
        const categoryNames = categoriesData.map((c: any) => c.name);
        const productCategories = new Set(productsData.map((p: Product) => p.category));
        const allCategories = Array.from(new Set([...categoryNames, ...productCategories]));
        setCategories(allCategories);

        // 2. Load Protected Data (Orders) - Fail silently if unauthorized
        try {
          const ordersData = await api.fetchOrders();
          setOrders(ordersData);
        } catch (e: any) {
          console.log('Orders not accessible (guest or non-admin)');
          if (e.response && e.response.status === 401) {
            console.log("Session expired during load, logging out...");
            logout();
          }
          setOrders([]);
        }

        // 3. Load Protected Data (Users) - Fail silently if unauthorized
        try {
          const usersData = await api.fetchUsers();
          const userProfiles: UserProfile[] = usersData.map((u: any) => {
            let joinDate = 'N/A';
            if (u.date_joined) {
              try {
                const date = new Date(u.date_joined);
                if (!isNaN(date.getTime())) {
                  joinDate = date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  });
                }
              } catch (e) {
                console.error('Error parsing date for user:', u.id, e);
              }
            }

            return {
              id: String(u.id),
              name: `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.username,
              email: u.email,
              phone: u.profile?.phone || '',
              address: u.profile?.address || '',
              city: u.profile?.city || '',
              zip: u.profile?.postal_code || '',
              joinDate
            };
          });
          setCustomers(userProfiles);
        } catch (e) {
          console.log('Users list not accessible (guest or non-admin)');
          setCustomers([]); // Fallback to empty instead of mock
        }

      } catch (error) {
        console.error("Failed to fetch public data from API:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Load user profile if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (authToken) {
        try {
          const userData = await authService.getProfile(authToken);
          setUser(userData);
        } catch (error) {
          console.error('Failed to load user profile:', error);
          // Token might be invalid, clear it
          localStorage.removeItem('authToken');
          setAuthToken(null);
          setUser(null);
        }
      }
    };
    loadUser();
  }, [authToken]);

  // Auth functions
  const register = async (data: RegisterData) => {
    try {
      const response = await authService.register(data);
      localStorage.setItem('authToken', response.token);
      setAuthToken(response.token);
      setUser(response.user);
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  };

  const login = async (data: LoginData) => {
    try {
      const response = await authService.login(data);
      localStorage.setItem('authToken', response.token);
      setAuthToken(response.token);
      setUser(response.user);
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setAuthToken(null);
    setUser(null);
    setCart([]);
  };

  const addToCart = (product: Product, size: string, color: string = 'Black') => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id && item.size === size && item.color === color);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.size === size && item.color === color
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1, size, color }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, size: string) => {
    setCart((prev) => prev.filter((item) => !(item.id === productId && item.size === size)));
  };

  const updateQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId && item.size === size
          ? { ...item, quantity: Number(quantity) }
          : item
      )
    );
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

  const reloadOrders = async () => {
    try {
      const ordersData = await api.fetchOrders();
      setOrders(ordersData);
    } catch (error: any) {
      console.error("Failed to reload orders:", error);
      if (error.response && error.response.status === 401) {
        console.log("Session expired or invalid, logging out...");
        logout();
      }
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

  const patchProduct = async (id: string, data: any) => {
    try {
      const result = await api.patchProduct(id, data);
      setProducts((prev) => prev.map(p => p.id === id ? { ...p, ...result } : p));
    } catch (error: any) {
      console.error("Failed to patch product:", error);
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
      await api.updateOrderStatus(id, status);
      await reloadOrders();
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
    } catch (error: any) {
      console.error("Failed to update collection:", error);
      console.error("Error response:", error.response?.data);
      alert(`Failed to update collection: ${JSON.stringify(error.response?.data, null, 2)}`);
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

  const cartTotal = cart.reduce((total, item) => total + Number(item.price) * Number(item.quantity), 0);
  const cartCount = cart.reduce((count, item) => count + Number(item.quantity), 0);

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
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleCart,
        cartTotal,
        cartCount,
        createOrder,
        reloadOrders,
        addProduct,
        updateProduct,
        patchProduct,
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
