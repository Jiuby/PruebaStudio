// Mock data for demo admin panel
export const demoProducts = [
    {
        id: "demo-1",
        name: "Hoodie Oversize Black",
        price: 180000,
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400",
        category: "Hoodies",
        stock: 15,
        sizes: ["S", "M", "L", "XL"],
        description: "Hoodie oversize con diseño minimalista",
        isOneOfOne: false
    },
    {
        id: "demo-2",
        name: "Cargo Pants Tactical",
        price: 220000,
        image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400",
        category: "Pantalones",
        stock: 8,
        sizes: ["28", "30", "32", "34"],
        description: "Pantalones cargo con múltiples bolsillos",
        isOneOfOne: false
    },
    {
        id: "demo-3",
        name: "T-Shirt Graphic Limited",
        price: 95000,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
        category: "Camisetas",
        stock: 3,
        sizes: ["M", "L"],
        description: "Camiseta con gráfico exclusivo",
        isOneOfOne: true
    }
];

export const demoOrders = [
    {
        id: "ORD-001",
        customerName: "Juan Pérez",
        customerEmail: "juan@example.com",
        total: 180000,
        status: "Processing",
        paymentVerified: true,
        stage: "PROCESANDO",
        date: "2025-01-10",
        items: [
            {
                productId: "demo-1",
                name: "Hoodie Oversize Black",
                image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400",
                price: 180000,
                quantity: 1,
                size: "L",
                color: "Negro"
            }
        ],
        shippingDetails: {
            firstName: "Juan",
            lastName: "Pérez",
            address: "Calle 10 #45-67",
            city: "Medellín",
            zip: "050001",
            phone: "+57 300 123 4567"
        },
        internalNotes: [
            {
                id: "note-1",
                text: "Cliente solicita envío express",
                author: "Admin Demo",
                date: "2025-01-10 14:30"
            }
        ]
    },
    {
        id: "ORD-002",
        customerName: "María González",
        customerEmail: "maria@example.com",
        total: 315000,
        status: "Shipped",
        paymentVerified: true,
        stage: "EN TRÁNSITO",
        date: "2025-01-09",
        items: [
            {
                productId: "demo-2",
                name: "Cargo Pants Tactical",
                image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400",
                price: 220000,
                quantity: 1,
                size: "30",
                color: "Verde Militar"
            },
            {
                productId: "demo-3",
                name: "T-Shirt Graphic Limited",
                image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
                price: 95000,
                quantity: 1,
                size: "M",
                color: "Blanco"
            }
        ],
        shippingDetails: {
            firstName: "María",
            lastName: "González",
            address: "Carrera 70 #32-15",
            city: "Bogotá",
            zip: "110111",
            phone: "+57 310 987 6543"
        },
        internalNotes: []
    },
    {
        id: "ORD-003",
        customerName: "Carlos Ramírez",
        customerEmail: "carlos@example.com",
        total: 95000,
        status: "Processing",
        paymentVerified: false,
        stage: "PEDIDOS SIN PAGAR",
        date: "2025-01-11",
        items: [
            {
                productId: "demo-3",
                name: "T-Shirt Graphic Limited",
                image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
                price: 95000,
                quantity: 1,
                size: "L",
                color: "Negro"
            }
        ],
        shippingDetails: {
            firstName: "Carlos",
            lastName: "Ramírez",
            address: "Avenida 15 #88-22",
            city: "Cali",
            zip: "760001",
            phone: "+57 320 555 1234"
        },
        internalNotes: []
    }
];

export const demoCustomers = [
    {
        id: "cust-1",
        name: "Juan Pérez",
        email: "juan@example.com",
        phone: "+57 300 123 4567",
        address: "Calle 10 #45-67",
        city: "Medellín",
        zip: "050001",
        totalOrders: 3,
        totalSpent: 540000
    },
    {
        id: "cust-2",
        name: "María González",
        email: "maria@example.com",
        phone: "+57 310 987 6543",
        address: "Carrera 70 #32-15",
        city: "Bogotá",
        zip: "110111",
        totalOrders: 1,
        totalSpent: 315000
    }
];

export const demoCollections = [
    {
        id: "col-1",
        name: "Winter 2025",
        description: "Colección de invierno con piezas oversized",
        image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400"
    },
    {
        id: "col-2",
        name: "Street Essentials",
        description: "Lo esencial para el streetwear urbano",
        image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400"
    }
];

export const demoCategories = ["Hoodies", "Pantalones", "Camisetas", "Accesorios"];

export const demoSettings = {
    storeName: "Caramel Dye Demo",
    supportEmail: "demo@carameldye.com",
    shippingFlatRate: 15000,
    freeShippingThreshold: 200000,
    instagramUrl: "https://instagram.com/carameldye",
    tiktokUrl: "https://tiktok.com/@carameldye"
};
