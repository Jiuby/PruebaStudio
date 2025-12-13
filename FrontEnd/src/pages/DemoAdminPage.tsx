import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminDashboard } from '../pages/Admin/Dashboard';
import { demoProducts, demoOrders, demoCustomers, demoCollections, demoCategories, demoSettings } from '../data/demoData';
import { AlertCircle, Eye } from 'lucide-react';
import { ShopContext } from '../context/ShopContext';

export const DemoAdminPage: React.FC = () => {
    const navigate = useNavigate();
    const [showWarning, setShowWarning] = useState(true);

    // Create a demo context with mock data
    const demoShopContext: any = {
        products: demoProducts,
        orders: demoOrders,
        customers: demoCustomers,
        collections: demoCollections,
        categories: demoCategories,
        categoryObjects: demoCategories.map((name, index) => ({ id: `cat-${index}`, name, image: '' })),
        storeSettings: demoSettings,
        kanbanColumns: ['PEDIDOS SIN PAGAR', 'PROCESANDO', 'EN TRÁNSITO', 'COMPLETADO'],
        user: { username: 'Demo Admin', email: 'demo@admin.com', isStaff: true },
        isLoading: false,
        cart: [],
        isCartOpen: false,
        authToken: 'demo-token',

        // Mock functions that show alerts
        addProduct: async () => { alert('Demo Mode: Los cambios no se guardarán'); },
        updateProduct: async () => { alert('Demo Mode: Los cambios no se guardarán'); },
        deleteProduct: async () => { alert('Demo Mode: Los cambios no se guardarán'); },
        addCollection: async () => { alert('Demo Mode: Los cambios no se guardarán'); },
        updateCollection: async () => { alert('Demo Mode: Los cambios no se guardarán'); },
        deleteCollection: async () => { alert('Demo Mode: Los cambios no se guardarán'); },
        addCategory: async () => { alert('Demo Mode: Los cambios no se guardarán'); },
        deleteCategory: async () => { alert('Demo Mode: Los cambios no se guardarán'); },
        updateOrderStatus: async () => { alert('Demo Mode: Los cambios no se guardarán'); },
        updateSettings: async () => { alert('Demo Mode: Los cambios no se guardarán'); },
        addKanbanColumn: async () => { alert('Demo Mode: Los cambios no se guardarán'); },
        deleteKanbanColumn: async () => { alert('Demo Mode: Los cambios no se guardarán'); },
        reorderKanbanColumns: async () => { },
        moveOrderToStage: async () => { },
        addOrderNote: async () => { alert('Demo Mode: Los cambios no se guardarán'); },
        reloadOrders: async () => { },
        addToCart: () => { },
        removeFromCart: () => { },
        updateCartItemQuantity: () => { },
        clearCart: () => { },
        toggleCart: () => { },
        login: async () => ({ success: false, message: 'Demo mode' }),
        logout: () => { },
        register: async () => ({ success: false, message: 'Demo mode' }),
    };

    return (
        <div className="min-h-screen bg-brand-black">
            {/* Warning Banner */}
            {showWarning && (
                <div className="bg-brand-bone text-brand-black p-4 relative">
                    <div className="container mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Eye size={20} />
                            <div>
                                <p className="font-bold text-sm uppercase">Modo Demo - Panel de Administración</p>
                                <p className="text-xs">
                                    Estás viendo una demostración del panel admin. Los cambios no se guardarán.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowWarning(false)}
                            className="text-brand-black hover:text-black font-bold"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            {/* Demo Admin Dashboard */}
            <div className="container mx-auto py-8 px-4">
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-black uppercase italic text-white mb-2">
                            Panel de Administración - Demo
                        </h1>
                        <p className="text-neutral-500 text-sm">
                            Explora todas las funcionalidades del panel de administración
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-brand-bone text-brand-black px-6 py-2 font-bold uppercase text-sm hover:bg-white transition-colors"
                    >
                        Volver a la Tienda
                    </button>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-brand-dark/20 border border-brand-dark p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <AlertCircle size={20} className="text-brand-bone" />
                            <h3 className="text-white font-bold uppercase text-sm">Datos de Demostración</h3>
                        </div>
                        <p className="text-neutral-400 text-xs">
                            Todos los datos que ves son ficticios y se resetean al recargar la página.
                        </p>
                    </div>

                    <div className="bg-brand-dark/20 border border-brand-dark p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <Eye size={20} className="text-brand-bone" />
                            <h3 className="text-white font-bold uppercase text-sm">Funcionalidad Completa</h3>
                        </div>
                        <p className="text-neutral-400 text-xs">
                            Puedes interactuar con todas las funciones: productos, pedidos, tablero ágil, etc.
                        </p>
                    </div>

                    <div className="bg-brand-dark/20 border border-brand-dark p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <AlertCircle size={20} className="text-brand-bone" />
                            <h3 className="text-white font-bold uppercase text-sm">Sin Conexión Backend</h3>
                        </div>
                        <p className="text-neutral-400 text-xs">
                            Esta demo no se conecta a ningún servidor. Es 100% local en tu navegador.
                        </p>
                    </div>
                </div>

                {/* Wrap AdminDashboard with demo context */}
                <ShopContext.Provider value={demoShopContext}>
                    <div className="bg-brand-dark/10 border border-brand-dark p-1">
                        <AdminDashboard />
                    </div>
                </ShopContext.Provider>
            </div>
        </div>
    );
};
