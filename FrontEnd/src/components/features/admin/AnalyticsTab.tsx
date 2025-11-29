import React, { useState, useMemo } from 'react';
import { useShop } from '../../../context/ShopContext';
import { TrendingUp, Users, Package, DollarSign, Calendar, Filter } from 'lucide-react';

export const AnalyticsTab: React.FC = () => {
   const { orders, products } = useShop();

   // State for Date Filtering
   const [filterType, setFilterType] = useState<'weekly' | 'monthly' | 'all' | 'custom'>('monthly');
   const [customStartDate, setCustomStartDate] = useState('');
   const [customEndDate, setCustomEndDate] = useState('');

   // Helper: Format Currency
   const formatPrice = (price: number) => {
      return new Intl.NumberFormat('es-CO', {
         style: 'currency',
         currency: 'COP',
         minimumFractionDigits: 0
      }).format(price);
   };

   // --- Global KPI Calculations (All Time) ---
   const globalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
   const globalOrders = orders.length;
   const globalAOV = globalOrders > 0 ? globalRevenue / globalOrders : 0;

   const uniqueCustomerEmails = new Set(orders.map(o => o.customerEmail).filter(e => !!e));
   const totalUniqueCustomers = uniqueCustomerEmails.size;
   const customerLTV = totalUniqueCustomers > 0 ? globalRevenue / totalUniqueCustomers : 0;

   // --- Filtered Data Logic ---
   const filteredOrders = useMemo(() => {
      const now = new Date();
      // Reset time to end of day for accurate comparison
      now.setHours(23, 59, 59, 999);

      return orders.filter(order => {
         const orderDate = new Date(order.date);

         if (filterType === 'all') return true;

         if (filterType === 'weekly') {
            const past7Days = new Date();
            past7Days.setDate(now.getDate() - 7);
            past7Days.setHours(0, 0, 0, 0);
            return orderDate >= past7Days && orderDate <= now;
         }

         if (filterType === 'monthly') {
            const past30Days = new Date();
            past30Days.setDate(now.getDate() - 30);
            past30Days.setHours(0, 0, 0, 0);
            return orderDate >= past30Days && orderDate <= now;
         }

         if (filterType === 'custom') {
            if (!customStartDate || !customEndDate) return true;
            const start = new Date(customStartDate);
            const end = new Date(customEndDate);
            end.setHours(23, 59, 59, 999); // Include the full end day
            return orderDate >= start && orderDate <= end;
         }

         return true;
      });
   }, [orders, filterType, customStartDate, customEndDate]);

   // --- Filtered Metrics ---
   const periodRevenue = filteredOrders.reduce((acc, o) => acc + o.total, 0);
   const periodOrdersCount = filteredOrders.length;

   // --- Top Products (Based on Filtered Data) ---
   // Only show top products that were sold IN the selected period
   const productSales: { [id: string]: { name: string, qty: number, revenue: number, category: string } } = {};

   filteredOrders.forEach(o => {
      o.items.forEach(item => {
         if (!productSales[item.productId]) {
            const product = products.find(p => p.id === item.productId);
            productSales[item.productId] = {
               name: item.name,
               qty: 0,
               revenue: 0,
               category: product ? product.category : 'Archived'
            };
         }
         productSales[item.productId].qty += item.quantity;
         productSales[item.productId].revenue += item.price * item.quantity;
      });
   });

   const topProducts = Object.values(productSales).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

   return (
      <div className="space-y-8 animate-fade-in">
         <h2 className="text-3xl font-black uppercase italic text-white">Analytics Dashboard</h2>

         {/* 1. Global High Level Metrics (Cards) */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* LTV */}
            <div className="bg-brand-dark/20 border border-brand-dark p-6">
               <div className="flex justify-between items-start mb-4">
                  <h3 className="text-neutral-500 font-bold uppercase text-xs tracking-widest">Customer LTV</h3>
                  <Users size={20} className="text-purple-500" />
               </div>
               <p className="text-2xl font-black text-white">{formatPrice(customerLTV)}</p>
               <p className="text-[10px] text-neutral-500 mt-1 uppercase">Lifetime Value</p>
            </div>

            {/* AOV */}
            <div className="bg-brand-dark/20 border border-brand-dark p-6">
               <div className="flex justify-between items-start mb-4">
                  <h3 className="text-neutral-500 font-bold uppercase text-xs tracking-widest">Avg. Order Value</h3>
                  <Package size={20} className="text-blue-500" />
               </div>
               <p className="text-2xl font-black text-white">{formatPrice(globalAOV)}</p>
               <p className="text-[10px] text-neutral-500 mt-1 uppercase">Across all orders</p>
            </div>

            {/* Total Customers */}
            <div className="bg-brand-dark/20 border border-brand-dark p-6">
               <div className="flex justify-between items-start mb-4">
                  <h3 className="text-neutral-500 font-bold uppercase text-xs tracking-widest">Unique Customers</h3>
                  <Users size={20} className="text-brand-bone" />
               </div>
               <p className="text-2xl font-black text-white">{totalUniqueCustomers}</p>
            </div>

            {/* Retention */}
            <div className="bg-brand-dark/20 border border-brand-dark p-6">
               <div className="flex justify-between items-start mb-4">
                  <h3 className="text-neutral-500 font-bold uppercase text-xs tracking-widest">Total Orders</h3>
                  <TrendingUp size={20} className="text-green-500" />
               </div>
               <p className="text-2xl font-black text-white">{globalOrders}</p>
               <p className="text-[10px] text-neutral-500 mt-1 uppercase">All time</p>
            </div>
         </div>

         {/* 2. SALES PERIOD ANALYSIS (New Section) */}
         <div className="bg-brand-dark/10 border border-brand-dark p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
               <h3 className="text-white font-bold uppercase tracking-widest text-lg flex items-center gap-2">
                  <DollarSign size={20} className="text-brand-bone" /> Sales Performance
               </h3>

               {/* Filters */}
               <div className="flex flex-wrap gap-2">
                  <button
                     onClick={() => setFilterType('weekly')}
                     className={`px-4 py-2 text-xs font-bold uppercase border transition-colors ${filterType === 'weekly'
                           ? 'bg-brand-bone text-brand-black border-brand-bone'
                           : 'text-neutral-400 border-brand-dark hover:border-white'
                        }`}
                  >
                     Last 7 Days
                  </button>
                  <button
                     onClick={() => setFilterType('monthly')}
                     className={`px-4 py-2 text-xs font-bold uppercase border transition-colors ${filterType === 'monthly'
                           ? 'bg-brand-bone text-brand-black border-brand-bone'
                           : 'text-neutral-400 border-brand-dark hover:border-white'
                        }`}
                  >
                     Last 30 Days
                  </button>
                  <button
                     onClick={() => setFilterType('all')}
                     className={`px-4 py-2 text-xs font-bold uppercase border transition-colors ${filterType === 'all'
                           ? 'bg-brand-bone text-brand-black border-brand-bone'
                           : 'text-neutral-400 border-brand-dark hover:border-white'
                        }`}
                  >
                     All Time
                  </button>
                  <button
                     onClick={() => setFilterType('custom')}
                     className={`px-4 py-2 text-xs font-bold uppercase border transition-colors flex items-center gap-2 ${filterType === 'custom'
                           ? 'bg-brand-bone text-brand-black border-brand-bone'
                           : 'text-neutral-400 border-brand-dark hover:border-white'
                        }`}
                  >
                     <Calendar size={14} /> Custom
                  </button>
               </div>
            </div>

            {/* Custom Date Inputs */}
            {filterType === 'custom' && (
               <div className="flex items-center gap-4 mb-8 bg-brand-dark/20 p-4 w-fit border border-brand-dark">
                  <div>
                     <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Start Date</label>
                     <input
                        type="date"
                        value={customStartDate}
                        onChange={(e) => setCustomStartDate(e.target.value)}
                        className="bg-brand-black border border-brand-dark text-white text-xs p-2 uppercase"
                     />
                  </div>
                  <span className="text-neutral-500 mt-4">-</span>
                  <div>
                     <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">End Date</label>
                     <input
                        type="date"
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                        className="bg-brand-black border border-brand-dark text-white text-xs p-2 uppercase"
                     />
                  </div>
               </div>
            )}

            {/* Filtered Stats Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-brand-black border border-brand-dark p-8 flex flex-col justify-center items-center text-center">
                  <span className="text-neutral-500 font-bold uppercase text-xs tracking-widest mb-2">Total Sales ({filterType === 'custom' ? 'Range' : filterType})</span>
                  <span className="text-5xl md:text-6xl font-black text-white tracking-tighter">
                     {formatPrice(periodRevenue)}
                  </span>
               </div>
               <div className="bg-brand-black border border-brand-dark p-8 flex flex-col justify-center items-center text-center">
                  <span className="text-neutral-500 font-bold uppercase text-xs tracking-widest mb-2">Orders Placed ({filterType === 'custom' ? 'Range' : filterType})</span>
                  <span className="text-5xl md:text-6xl font-black text-brand-bone tracking-tighter">
                     {periodOrdersCount}
                  </span>
               </div>
            </div>
         </div>

         {/* 3. Top Selling Products (Filtered by Period) */}
         <div className="bg-brand-dark/10 border border-brand-dark p-8">
            <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
               Top Products <span className="text-neutral-500">({filterType === 'custom' ? 'Selected Range' : filterType})</span>
            </h3>
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                     <tr className="border-b border-brand-dark text-neutral-500 text-xs font-bold uppercase tracking-widest">
                        <th className="pb-4">Product</th>
                        <th className="pb-4">Category</th>
                        <th className="pb-4 text-right">Units Sold</th>
                        <th className="pb-4 text-right">Revenue</th>
                     </tr>
                  </thead>
                  <tbody className="text-sm">
                     {topProducts.length === 0 ? (
                        <tr><td colSpan={4} className="py-8 text-center text-neutral-500 uppercase">No sales data for this period.</td></tr>
                     ) : (
                        topProducts.map((p, i) => (
                           <tr key={i} className="border-b border-brand-dark/50 hover:bg-brand-dark/10 transition-colors">
                              <td className="py-4 text-white font-bold">{p.name}</td>
                              <td className="py-4 text-neutral-400 uppercase text-xs">{p.category}</td>
                              <td className="py-4 text-right text-brand-bone">{p.qty}</td>
                              <td className="py-4 text-right text-white">{formatPrice(p.revenue)}</td>
                           </tr>
                        ))
                     )}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   );
};
