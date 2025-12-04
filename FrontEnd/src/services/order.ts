const API_URL = import.meta.env.VITE_API_URL;

export interface OrderItemData {
    productId?: number;
    name: string;
    image: string;
    price: number;
    quantity: number;
    size: string;
}

export interface ShippingDetails {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    zip: string;
    phone: string;
}

export interface CreateOrderData {
    customerName: string;
    customerEmail: string;
    total: number;
    items: OrderItemData[];
    shippingDetails: ShippingDetails;
}

export interface OrderResponse {
    id: string;
    date: string;
    status: string;
    total: number;
    items: OrderItemData[];
    customerName: string;
    customerEmail: string;
    shippingDetails: ShippingDetails;
}

export const orderService = {
    async createOrder(orderData: CreateOrderData, token?: string): Promise<OrderResponse> {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Token ${token}`;
        }

        const response = await fetch(`${API_URL}/orders/`, {
            method: 'POST',
            headers,
            body: JSON.stringify(orderData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(Object.values(error).flat().join(' '));
        }

        return response.json();
    },
};
