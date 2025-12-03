
import React, { useState } from 'react';
import { useShop } from '../../../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import { OrderModal } from './OrderModal';
import { Order } from '../../../types';
import {
  DollarSign,
  ShoppingBag,
  Package,
  TrendingUp,
  Clock,
  Truck,
  CheckCircle,
  Plus,
  ArrowRight,
  Eye,
  TrendingDown
} from 'lucide-react';

interface DashboardOverviewProps {
  onQuickAdd: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onQuickAdd }) => {
  const { products, orders, customers } = useShop();
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Metrics Calculations
  const totalRevenue = orders.reduce((acc, order) => acc + Number(order.total), 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Calculate Revenue Change vs Last Month
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const previousMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const previousMonth = previousMonthDate.getMonth();
  const previousYear = previousMonthDate.getFullYear();

  const currentMonthRevenue = orders
    .filter(o => {
      const orderDate = new Date(o.date);
      return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
    })
    .reduce((acc, o) => acc + Number(o.total), 0);

  const previousMonthRevenue = orders
    .filter(o => {
      const orderDate = new Date(o.date);
      return orderDate.getMonth() === previousMonth && orderDate.getFullYear() === previousYear;
    })
    .reduce((acc, o) => acc + Number(o.total), 0);

  let revenueChangePercentage = 0;
  if (previousMonthRevenue > 0) {
    revenueChangePercentage = ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100;
  } else if (currentMonthRevenue > 0) {
    revenueChangePercentage = 100; // If previous was 0 and current is > 0, treat as 100% increase (or could be infinite)
  }

  const isPositiveChange = revenueChangePercentage >= 0;

  // Order Pipeline Status
  const processingOrders = orders.filter(o => o.status === 'Processing');
  const shippedOrders = orders.filter(o => o.status === 'Shipped');
  const deliveredOrders = orders.filter(o => o.status === 'Delivered');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black uppercase italic text-white">Command Center</h2>
          <p className="text-neutral-500 text-xs uppercase tracking-widest">Store Performance Overview</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={onQuickAdd}
            className="bg-brand-dark/30 border border-brand-dark text-white px-4 py-3 text-xs font-bold uppercase tracking-widest hover:bg-brand-dark transition-colors flex items-center gap-2"
          >
            <Plus size={16} /> Quick Product
          </button>
        </div>
      </div>

      {/* 1. Key Performance Indicators (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue */}
        <div className="bg-brand-dark/20 border border-brand-dark p-6 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h3 className="text-neutral-500 font-bold uppercase text-xs tracking-widest">Monthly Revenue</h3>
            <div className="bg-brand-bone/10 p-2 rounded-full text-brand-bone"><DollarSign size={20} /></div>
          </div>
          <p className="text-3xl font-black text-white relative z-10">{formatPrice(currentMonthRevenue)}</p>
          <div className="flex items-center gap-2 mt-2 relative z-10">
            <span className={`text-[10px] font-bold uppercase flex items-center gap-1 px-2 py-0.5 rounded-full ${isPositiveChange ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'}`}>
              {isPositiveChange ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {revenueChangePercentage > 0 ? '+' : ''}{revenueChangePercentage.toFixed(1)}%
            </span>
            <span className="text-neutral-600 text-[10px] uppercase">vs last month</span>
          </div>
          <div className="absolute -right-6 -bottom-6 text-brand-bone/5 transform rotate-12 group-hover:scale-110 transition-transform duration-500">
            <DollarSign size={120} />
          </div>
        </div>

        {/* Pending Actions (Urgent) */}
        <div className="bg-brand-dark/20 border border-brand-dark p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-neutral-500 font-bold uppercase text-xs tracking-widest">Orders To Fulfill</h3>
            <div className={`p-2 rounded-full ${processingOrders.length > 0 ? 'bg-yellow-500/10 text-yellow-500' : 'bg-green-500/10 text-green-500'}`}>
              <Clock size={20} />
            </div>
          </div>
          <p className="text-3xl font-black text-white">{processingOrders.length}</p>
          <p className="text-neutral-500 text-[10px] uppercase mt-2">
            Requires immediate attention
          </p>
        </div>

        {/* Average Order Value */}
        <div className="bg-brand-dark/20 border border-brand-dark p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-neutral-500 font-bold uppercase text-xs tracking-widest">Avg. Order Value</h3>
            <div className="bg-blue-500/10 p-2 rounded-full text-blue-500"><ShoppingBag size={20} /></div>
          </div>
          <p className="text-3xl font-black text-white">{formatPrice(avgOrderValue)}</p>
          <p className="text-neutral-500 text-[10px] uppercase mt-2">Based on {totalOrders} orders</p>
        </div>

        {/* Customers */}
        <div className="bg-brand-dark/20 border border-brand-dark p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-neutral-500 font-bold uppercase text-xs tracking-widest">Total Customers</h3>
            <div className="bg-purple-500/10 p-2 rounded-full text-purple-500"><Package size={20} /></div>
          </div>
          <p className="text-3xl font-black text-white">{customers.length}</p>
          <p className="text-neutral-500 text-[10px] uppercase mt-2">+2 New this week</p>
        </div>
      </div>

      {/* 2. Order Fulfillment Pipeline (Full Width) */}
      <div className="bg-brand-dark/10 border border-brand-dark p-8">
        <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-8 flex items-center gap-2">
          <Truck size={18} /> Order Fulfillment Pipeline
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Processing */}
          <div className="bg-brand-black/50 border border-brand-dark p-4 relative group hover:border-yellow-500/50 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <span className="text-yellow-500 bg-yellow-500/10 p-2 rounded-full"><Clock size={20} /></span>
              <span className="text-3xl font-black text-white">{processingOrders.length}</span>
            </div>
            <h4 className="text-neutral-400 font-bold uppercase text-xs tracking-wider">Processing</h4>
            <div className="w-full bg-brand-dark h-1 mt-4">
              <div className="bg-yellow-500 h-1" style={{ width: `${(processingOrders.length / totalOrders) * 100}%` }}></div>
            </div>
          </div>

          {/* Shipped */}
          <div className="bg-brand-black/50 border border-brand-dark p-4 relative group hover:border-blue-500/50 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <span className="text-blue-500 bg-blue-500/10 p-2 rounded-full"><Truck size={20} /></span>
              <span className="text-3xl font-black text-white">{shippedOrders.length}</span>
            </div>
            <h4 className="text-neutral-400 font-bold uppercase text-xs tracking-wider">In Transit</h4>
            <div className="w-full bg-brand-dark h-1 mt-4">
              <div className="bg-blue-500 h-1" style={{ width: `${(shippedOrders.length / totalOrders) * 100}%` }}></div>
            </div>
          </div>

          {/* Delivered */}
          <div className="bg-brand-black/50 border border-brand-dark p-4 relative group hover:border-green-500/50 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <span className="text-green-500 bg-green-500/10 p-2 rounded-full"><CheckCircle size={20} /></span>
              <span className="text-3xl font-black text-white">{deliveredOrders.length}</span>
            </div>
            <h4 className="text-neutral-400 font-bold uppercase text-xs tracking-wider">Completed</h4>
            <div className="w-full bg-brand-dark h-1 mt-4">
              <div className="bg-green-500 h-1" style={{ width: `${(deliveredOrders.length / totalOrders) * 100}%` }}></div>
            </div>
          </div>
        </div>

        {/* Quick Recent Orders */}
        <div className="mt-12 pt-8 border-t border-brand-dark">
          <h4 className="text-neutral-500 font-bold uppercase text-xs tracking-widest mb-6">Latest Orders</h4>
          <div className="space-y-3">
            {orders.slice(0, 5).map(order => (
              <button
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className="w-full flex items-center justify-between p-4 bg-brand-dark/20 border border-brand-dark/50 hover:bg-brand-dark/40 hover:border-brand-bone/30 transition-all group text-left"
              >
                <div className="flex items-center gap-6">
                  <span className="text-brand-bone font-bold text-sm group-hover:scale-110 transition-transform">#{order.id}</span>
                  <div className="flex flex-col">
                    <span className="text-white text-xs font-bold uppercase">{order.items.length} Items</span>
                    <span className="text-[10px] text-neutral-500">{order.customerEmail || 'Guest User'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-white font-bold text-xs">{formatPrice(order.total)}</span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold uppercase border min-w-[80px] text-center ${order.status === 'Delivered' ? 'border-green-500 text-green-500' :
                    order.status === 'Shipped' ? 'border-blue-500 text-blue-500' :
                      order.status === 'Cancelled' ? 'border-red-500 text-red-500' :
                        'border-yellow-500 text-yellow-500'
                    }`}>
                    {order.status}
                  </span>
                  <span className="text-neutral-500 group-hover:text-white transition-colors">
                    <ArrowRight size={16} />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <OrderModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
};
