import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Product, Order } from '../../types';
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Users,
    Settings,
    Plus,
    Search,
    Edit2,
    Trash2,
    X,
    Check,
    DollarSign,
    TrendingUp,
    Box,
    LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type AdminTab = 'dashboard' | 'products' | 'orders' | 'customers';

export const AdminDashboard: React.FC = () => {
    const { products, orders, addProduct, updateProduct, deleteProduct, updateOrderStatus } = useShop();
    const { logout } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

    // Product Form State
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState<Partial<Product>>({
        name: '',
        price: 0,
        category: 'Tees',
        description: '',
        image: '',
        inStock: true,
        isNew: false
    });

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(price);
    };

    // Calculations for Dashboard
    const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const lowStockProducts = products.filter(p => p.inStock === false || (p.availableSizes && p.availableSizes.length < 2)).length;

    // --- Handlers ---

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setFormData(product);
        setIsProductModalOpen(true);
    };

    const handleDeleteProduct = (id: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            deleteProduct(id);
        }
    };

    const handleSaveProduct = (e: React.FormEvent) => {
        e.preventDefault();
        const productData = {
            ...formData,
            // Ensure defaults
            colors: formData.colors || ['Black'],
            sizes: formData.sizes || ['S', 'M', 'L', 'XL'],
            availableSizes: formData.availableSizes || ['S', 'M', 'L', 'XL'],
            images: formData.images || [formData.image || ''],
        } as Product;

        if (editingProduct) {
            updateProduct(productData);
        } else {
            addProduct({
                ...productData,
                id: Math.random().toString(36).substr(2, 9),
            });
        }
        setIsProductModalOpen(false);
        setEditingProduct(null);
        setFormData({ name: '', price: 0, category: 'Tees', description: '', image: '', inStock: true, isNew: false });
    };

    // --- Render Functions ---

    const renderDashboard = () => (
        <div className="space-y-8 animate-fade-in">
            <h2 className="text-3xl font-black uppercase italic text-white">Overview</h2>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-brand-dark/20 border border-brand-dark p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-neutral-500 font-bold uppercase text-xs tracking-widest">Total Revenue</h3>
                        <div className="bg-brand-bone/10 p-2 rounded-full text-brand-bone"><DollarSign size={20} /></div>
                    </div>
                    <p className="text-3xl font-black text-white">{formatPrice(totalRevenue)}</p>
                    <span className="text-green-500 text-xs font-bold flex items-center mt-2"><TrendingUp size={12} className="mr-1" /> +12.5% from last month</span>
                </div>

                <div className="bg-brand-dark/20 border border-brand-dark p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-neutral-500 font-bold uppercase text-xs tracking-widest">Total Orders</h3>
                        <div className="bg-brand-bone/10 p-2 rounded-full text-brand-bone"><ShoppingBag size={20} /></div>
                    </div>
                    <p className="text-3xl font-black text-white">{totalOrders}</p>
                    <span className="text-neutral-400 text-xs font-bold mt-2 block">{orders.filter(o => o.status === 'Processing').length} Processing</span>
                </div>

                <div className="bg-brand-dark/20 border border-brand-dark p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-neutral-500 font-bold uppercase text-xs tracking-widest">Products</h3>
                        <div className="bg-brand-bone/10 p-2 rounded-full text-brand-bone"><Package size={20} /></div>
                    </div>
                    <p className="text-3xl font-black text-white">{totalProducts}</p>
                    <span className="text-neutral-400 text-xs font-bold mt-2 block">{products.filter(p => p.isNew).length} New Drops</span>
                </div>

                <div className="bg-brand-dark/20 border border-brand-dark p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-neutral-500 font-bold uppercase text-xs tracking-widest">Inventory Alert</h3>
                        <div className="bg-red-500/10 p-2 rounded-full text-red-500"><Box size={20} /></div>
                    </div>
                    <p className="text-3xl font-black text-white">{lowStockProducts}</p>
                    <span className="text-red-500 text-xs font-bold mt-2 block">Items Low/Out of Stock</span>
                </div>
            </div>

            {/* Recent Orders Preview */}
            <div className="bg-brand-dark/10 border border-brand-dark p-8">
                <h3 className="text-white font-bold uppercase tracking-widest text-lg mb-6">Recent Activity</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-brand-dark text-neutral-500 text-xs font-bold uppercase tracking-widest">
                                <th className="pb-4">Order ID</th>
                                <th className="pb-4">Customer</th>
                                <th className="pb-4">Status</th>
                                <th className="pb-4">Total</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {orders.slice(0, 5).map(order => (
                                <tr key={order.id} className="border-b border-brand-dark/50 hover:bg-brand-dark/20 transition-colors">
                                    <td className="py-4 text-brand-bone font-bold">#{order.id}</td>
                                    <td className="py-4 text-white">Guest User</td>
                                    <td className="py-4">
                                        <span className={`px-2 py-1 text-[10px] font-bold uppercase border ${order.status === 'Delivered' ? 'border-green-500 text-green-500' :
                                                order.status === 'Shipped' ? 'border-blue-500 text-blue-500' :
                                                    'border-yellow-500 text-yellow-500'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="py-4 text-white">{formatPrice(order.total)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderProducts = () => (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black uppercase italic text-white">Product Management</h2>
                <button
                    onClick={() => { setEditingProduct(null); setFormData({}); setIsProductModalOpen(true); }}
                    className="bg-brand-bone text-brand-black px-6 py-3 font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors flex items-center gap-2"
                >
                    <Plus size={16} /> Add Product
                </button>
            </div>

            <div className="bg-brand-dark/10 border border-brand-dark p-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-brand-dark text-neutral-500 text-xs font-bold uppercase tracking-widest">
                                <th className="pb-4 pl-4">Product</th>
                                <th className="pb-4">Category</th>
                                <th className="pb-4">Price</th>
                                <th className="pb-4">Stock</th>
                                <th className="pb-4 pr-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.id} className="border-b border-brand-dark/50 hover:bg-brand-dark/20 transition-colors">
                                    <td className="py-4 pl-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-16 bg-brand-dark flex-shrink-0">
                                                <img src={product.image} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="text-white font-bold text-sm uppercase">{product.name}</p>
                                                <p className="text-[10px] text-neutral-500 uppercase">ID: {product.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 text-neutral-400 text-sm uppercase">{product.category}</td>
                                    <td className="py-4 text-white text-sm font-bold">{formatPrice(product.price)}</td>
                                    <td className="py-4">
                                        {product.inStock ? (
                                            <span className="text-green-500 text-[10px] font-bold uppercase flex items-center gap-1"><Check size={12} /> In Stock</span>
                                        ) : (
                                            <span className="text-red-500 text-[10px] font-bold uppercase flex items-center gap-1"><X size={12} /> Sold Out</span>
                                        )}
                                    </td>
                                    <td className="py-4 pr-4 text-right">
                                        <button
                                            onClick={() => handleEditProduct(product)}
                                            className="p-2 text-neutral-400 hover:text-brand-bone transition-colors"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteProduct(product.id)}
                                            className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderOrders = () => (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-3xl font-black uppercase italic text-white">Order Management</h2>

            <div className="bg-brand-dark/10 border border-brand-dark p-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-brand-dark text-neutral-500 text-xs font-bold uppercase tracking-widest">
                                <th className="pb-4 pl-4">Order ID</th>
                                <th className="pb-4">Date</th>
                                <th className="pb-4">Customer</th>
                                <th className="pb-4">Total</th>
                                <th className="pb-4">Status</th>
                                <th className="pb-4 pr-4 text-right">Update</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id} className="border-b border-brand-dark/50 hover:bg-brand-dark/20 transition-colors">
                                    <td className="py-4 pl-4 text-brand-bone font-bold">#{order.id}</td>
                                    <td className="py-4 text-neutral-400 text-sm uppercase">{order.date}</td>
                                    <td className="py-4 text-white text-sm">Guest User</td>
                                    <td className="py-4 text-white font-bold text-sm">{formatPrice(order.total)}</td>
                                    <td className="py-4">
                                        <span className={`px-2 py-1 text-[10px] font-bold uppercase border ${order.status === 'Delivered' ? 'border-green-500 text-green-500' :
                                                order.status === 'Shipped' ? 'border-blue-500 text-blue-500' :
                                                    'border-yellow-500 text-yellow-500'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="py-4 pr-4 text-right">
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                                            className="bg-brand-black border border-brand-dark text-white text-xs p-2 uppercase font-bold focus:border-brand-bone outline-none"
                                        >
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-brand-black flex flex-col md:flex-row pt-0">
            {/* Sidebar */}
            <div className="w-full md:w-64 bg-brand-dark/10 border-r border-brand-dark p-6 flex-shrink-0 flex flex-col">
                <div className="mb-8 p-4 bg-brand-bone text-brand-black">
                    <h1 className="text-xl font-black uppercase italic tracking-tighter">Goustty</h1>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Admin Panel</p>
                </div>

                <div className="space-y-2 flex-1">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'dashboard' ? 'bg-brand-bone text-brand-black' : 'text-neutral-500 hover:text-white hover:bg-brand-dark/50'
                            }`}
                    >
                        <LayoutDashboard size={18} /> Dashboard
                    </button>
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'products' ? 'bg-brand-bone text-brand-black' : 'text-neutral-500 hover:text-white hover:bg-brand-dark/50'
                            }`}
                    >
                        <Package size={18} /> Products
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'orders' ? 'bg-brand-bone text-brand-black' : 'text-neutral-500 hover:text-white hover:bg-brand-dark/50'
                            }`}
                    >
                        <ShoppingBag size={18} /> Orders
                    </button>
                    <button
                        onClick={() => setActiveTab('customers')}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'customers' ? 'bg-brand-bone text-brand-black' : 'text-neutral-500 hover:text-white hover:bg-brand-dark/50'
                            }`}
                    >
                        <Users size={18} /> Customers
                    </button>
                    <button
                        className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-white hover:bg-brand-dark/50 cursor-not-allowed opacity-50"
                    >
                        <Settings size={18} /> Settings
                    </button>
                </div>

                <div className="mt-auto pt-6 border-t border-brand-dark">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 md:p-12 overflow-y-auto">
                {activeTab === 'dashboard' && renderDashboard()}
                {activeTab === 'products' && renderProducts()}
                {activeTab === 'orders' && renderOrders()}
                {activeTab === 'customers' && (
                    <div className="flex items-center justify-center h-64 border border-dashed border-brand-dark">
                        <p className="text-neutral-500 uppercase tracking-widest">Customer Management coming soon</p>
                    </div>
                )}
            </div>

            {/* Product Modal */}
            <AnimatePresence>
                {isProductModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-brand-black border border-brand-dark p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-8 border-b border-brand-dark pb-4">
                                <h2 className="text-2xl font-black uppercase italic text-white">{editingProduct ? 'Edit Product' : 'New Product'}</h2>
                                <button onClick={() => setIsProductModalOpen(false)} className="text-neutral-500 hover:text-white"><X size={24} /></button>
                            </div>

                            <form onSubmit={handleSaveProduct} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs uppercase font-bold text-neutral-500 mb-2">Product Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-brand-dark/30 border border-brand-dark p-3 text-white focus:outline-none focus:border-brand-bone"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase font-bold text-neutral-500 mb-2">Price (COP)</label>
                                        <input
                                            type="number"
                                            required
                                            value={formData.price}
                                            onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                                            className="w-full bg-brand-dark/30 border border-brand-dark p-3 text-white focus:outline-none focus:border-brand-bone"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs uppercase font-bold text-neutral-500 mb-2">Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                                            className="w-full bg-brand-dark/30 border border-brand-dark p-3 text-white focus:outline-none focus:border-brand-bone"
                                        >
                                            <option value="Tees">Tees</option>
                                            <option value="Hoodies">Hoodies</option>
                                            <option value="Bottoms">Bottoms</option>
                                            <option value="Accessories">Accessories</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase font-bold text-neutral-500 mb-2">Image URL</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.image}
                                            onChange={e => setFormData({ ...formData, image: e.target.value })}
                                            className="w-full bg-brand-dark/30 border border-brand-dark p-3 text-white focus:outline-none focus:border-brand-bone"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs uppercase font-bold text-neutral-500 mb-2">Description</label>
                                    <textarea
                                        rows={3}
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-brand-dark/30 border border-brand-dark p-3 text-white focus:outline-none focus:border-brand-bone"
                                    ></textarea>
                                </div>

                                <div className="flex gap-6">
                                    <label className="flex items-center gap-2 text-white text-sm font-bold uppercase cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.inStock}
                                            onChange={e => setFormData({ ...formData, inStock: e.target.checked })}
                                            className="w-4 h-4 accent-brand-bone"
                                        />
                                        In Stock
                                    </label>
                                    <label className="flex items-center gap-2 text-white text-sm font-bold uppercase cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.isNew}
                                            onChange={e => setFormData({ ...formData, isNew: e.target.checked })}
                                            className="w-4 h-4 accent-brand-bone"
                                        />
                                        Mark as New
                                    </label>
                                </div>

                                <button type="submit" className="w-full bg-brand-bone text-brand-black py-4 font-black uppercase tracking-widest hover:bg-white transition-colors">
                                    {editingProduct ? 'Update Product' : 'Create Product'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
