import axios from 'axios';

const API_URL = 'https://jiuby.pythonanywhere.com/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach the token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken'); // Changed from 'token' to 'authToken'
    if (token) {
        config.headers.Authorization = `Token ${token}`;
        console.log('[API] Sending request with token:', token.substring(0, 10) + '...');
    } else {
        console.log('[API] No token found in localStorage');
    }
    return config;
});

export const fetchProducts = async () => {
    const response = await api.get('/products/');
    return response.data;
};

export const fetchCollections = async () => {
    const response = await api.get('/collections/');
    return response.data;
};

export const fetchOrders = async () => {
    const response = await api.get('/orders/');
    return response.data;
};

export const fetchSettings = async (): Promise<any> => {
    const response = await api.get('/settings/');
    return response.data[0]; // settings is a list with one item
};

export const fetchCategories = async () => {
    const response = await api.get('/categories/');
    return response.data;
};

// Fetch users (for admin panel)
export const fetchUsers = async (): Promise<any[]> => {
    const response = await api.get('/auth/users/');
    return response.data;
};

// --- Create / Update / Delete ---

export const createProduct = async (productData: any) => {
    // For file uploads (images), we need multipart/form-data
    // But if we are sending JSON, we use standard.
    // If productData contains a File object, we need to convert to FormData.
    if (productData instanceof FormData) {
        return (await api.post('/products/', productData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })).data;
    }
    const response = await api.post('/products/', productData);
    return response.data;
};

export const updateProduct = async (id: string, productData: any) => {
    if (productData instanceof FormData) {
        return (await api.put(`/products/${id}/`, productData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })).data;
    }
    const response = await api.put(`/products/${id}/`, productData);
    return response.data;
};

export const deleteProduct = async (id: string) => {
    await api.delete(`/products/${id}/`);
};

export const createOrder = async (orderData: any) => {
    const response = await api.post('/orders/', orderData);
    return response.data;
};

export const updateOrderStatus = async (id: string, status: string) => {
    const response = await api.patch(`/orders/${id}/`, { status });
    return response.data;
};

export const createCollection = async (collectionData: any) => {
    if (collectionData instanceof FormData) {
        return (await api.post('/collections/', collectionData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })).data;
    }
    const response = await api.post('/collections/', collectionData);
    return response.data;
};

export const updateCollection = async (id: string, collectionData: any) => {
    if (collectionData instanceof FormData) {
        return (await api.put(`/collections/${id}/`, collectionData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })).data;
    }
    const response = await api.put(`/collections/${id}/`, collectionData);
    return response.data;
};

export const deleteCollection = async (id: string) => {
    await api.delete(`/collections/${id}/`);
};

export const createCategory = async (categoryData: any) => {
    if (categoryData instanceof FormData) {
        return (await api.post('/categories/', categoryData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })).data;
    }
    const response = await api.post('/categories/', categoryData);
    return response.data;
};

export const updateCategory = async (id: string, categoryData: any) => {
    if (categoryData instanceof FormData) {
        return (await api.put(`/categories/${id}/`, categoryData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })).data;
    }
    const response = await api.put(`/categories/${id}/`, categoryData);
    return response.data;
};

export const deleteCategory = async (id: string) => {
    await api.delete(`/categories/${id}/`);
};

export const updateSettings = async (settingsData: any) => {
    // Since settings is a singleton viewset, we might need a specific endpoint or just post to /settings/
    // Our backend implementation for create/update on settings was a bit stubbed.
    // Let's assume we can POST to /settings/ to update.
    const response = await api.post('/settings/', settingsData);
    return response.data;
};

export const trackOrder = async (id: string, email: string) => {
    const response = await api.post('/orders/track/', { id, email });
    return response.data;
};

export default api;
