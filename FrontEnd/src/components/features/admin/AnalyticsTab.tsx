import React, { useState, useMemo } from 'react';
import { useShop } from '../../../context/ShopContext';
import { TrendingUp, TrendingDown, Users, Package, DollarSign, Calendar, Filter, ShoppingBag, Tag, BarChart3 } from 'lucide-react';

export const AnalyticsTab: React.FC = () => {
   const { orders, products } = useShop();

   // State for Date Filtering (Lower Section)
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

   // --- TOP CARDS CALCULATIONS (Monthly vs Previous Month) ---
   const now = new Date();
   const currentMonth = now.getMonth();
   const currentYear = now.getFullYear();

   const lastMonthDate = new Date(now);
   lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
   const lastMonth = lastMonthDate.getMonth();
   const lastMonthYear = lastMonthDate.getFullYear();

   const thisMonthOrders = orders.filter(o => {
      const d = new Date(o.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear && o.status !== 'Cancelled';
   });

   const lastMonthOrders = orders.filter(o => {
      const d = new Date(o.date);
      return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear && o.status !== 'Cancelled';
   });

   // 1. Revenue
   const thisMonthRevenue = thisMonthOrders.reduce((acc, o) => acc + Number(o.total), 0);
   const lastMonthRevenue = lastMonthOrders.reduce((acc, o) => acc + Number(o.total), 0);
   const revenueDiff = thisMonthRevenue - lastMonthRevenue;
   const revenueGrowth = lastMonthRevenue === 0 ? (thisMonthRevenue > 0 ? 100 : 0) : ((revenueDiff) / lastMonthRevenue) * 100;

   // 2. Orders
   const thisMonthCount = thisMonthOrders.length;
   const lastMonthCount = lastMonthOrders.length;
   const ordersDiff = thisMonthCount - lastMonthCount;
   const ordersGrowth = lastMonthCount === 0 ? (thisMonthCount > 0 ? 100 : 0) : ((ordersDiff) / lastMonthCount) * 100;

   // 3. Units Sold (Current Month)
   const unitsSoldThisMonth = thisMonthOrders.reduce((acc, o) => acc + o.items.reduce((sum, i) => sum + i.quantity, 0), 0);

   // 4. Best Selling Category (Current Month)
   const categoryRevenue: Record<string, number> = {};
   thisMonthOrders.forEach(o => {
      o.items.forEach(item => {
         const product = products.find(p => String(p.id) === String(item.productId));
         const cat = product ? product.category : 'Unknown';
         categoryRevenue[cat] = (categoryRevenue[cat] || 0) + (Number(item.price) * item.quantity);
      });
   });

   let bestCategory = 'N/A';
   let maxCatRevenue = 0;
   Object.entries(categoryRevenue).forEach(([cat, rev]) => {
      if (rev > maxCatRevenue) {
         maxCatRevenue = rev;
         bestCategory = cat;
      }
   });


   // --- FILTERED DATA LOGIC (Lower Section) ---
   const filteredOrders = useMemo(() => {
      const today = new Date();
      // Reset time to end of day for accurate comparison
      today.setHours(23, 59, 59, 999);

      return orders.filter(order => {
         // Always exclude cancelled orders first
         if (order.status === 'Cancelled') return false;

         const orderDate = new Date(order.date);

         if (filterType === 'all') return true;

         if (filterType === 'weekly') {
            const past7Days = new Date();
            past7Days.setDate(today.getDate() - 7);
            past7Days.setHours(0, 0, 0, 0);
            return orderDate >= past7Days && orderDate <= today;
         }

         if (filterType === 'monthly') {
            const past30Days = new Date();
            past30Days.setDate(today.getDate() - 30);
            past30Days.setHours(0, 0, 0, 0);
            return orderDate >= past30Days && orderDate <= today;
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
   const periodRevenue = filteredOrders.reduce((acc, o) => acc + Number(o.total), 0);
   const periodOrdersCount = filteredOrders.length;

   // --- Top Products (Based on Filtered Data) ---
   const productSales: { [id: string]: { name: string, qty: number, revenue: number, category: string } } = {};

   filteredOrders.forEach(o => {
      o.items.forEach(item => {
         if (!productSales[item.productId]) {
            const product = products.find(p => String(p.id) === String(item.productId));
            productSales[item.productId] = {
               name: item.name,
               qty: 0,
               revenue: 0,
               category: product ? product.category : 'Archived'
            };
         }
         productSales[item.productId].qty += item.quantity;
         productSales[item.productId].revenue += Number(item.price) * item.quantity;
      });
   });

   const topProducts = Object.values(productSales).sort((a, b) => b.qty - a.qty).slice(0, 5);

   // --- Monthly Earnings Chart Data (Last 6 Months) ---
   const earningsChartData = useMemo(() => {
      const chartData = [];
      const today = new Date();

      for (let i = 5; i >= 0; i--) {
         const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
         const monthIdx = d.getMonth();
         const year = d.getFullYear();
         const monthName = d.toLocaleString('en-US', { month: 'short' });

         const monthlyRevenue = orders.reduce((acc, order) => {
            const orderDate = new Date(order.date);
            // Simple check assuming order.date is parseable
            if (orderDate.getMonth() === monthIdx && orderDate.getFullYear() === year && order.status !== 'Cancelled') {
               return acc + Number(order.total);
            }
            return acc;
         }, 0);

         chartData.push({ label: monthName, value: monthlyRevenue });
      }
      return chartData;
   }, [orders]);

   const maxChartValue = Math.max(...earningsChartData.map(d => d.value), 100000); // Prevent divide by zero

   return (
      <div className="space-y-8 animate-fade-in pb-12">
         <h2 className="text-3xl font-black uppercase italic text-white">Analytics Dashboard</h2>

         {/* 1. Global High Level Metrics (Cards) */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Best Selling Category */}
            <div className="bg-brand-dark/20 border border-brand-dark p-6">
               <div className="flex justify-between items-start mb-4">
                  <h3 className="text-neutral-500 font-bold uppercase text-xs tracking-widest">Best-Selling Category</h3>
                  <Tag size={20} className="text-purple-500" />
               </div>
               <p className="text-2xl font-black text-white uppercase truncate" title={bestCategory}>{bestCategory}</p>
               <p className="text-[10px] text-neutral-500 mt-1 uppercase">Top performer this month</p>
            </div>

            {/* Total Sales x Month */}
            <div className="bg-brand-dark/20 border border-brand-dark p-6">
               <div className="flex justify-between items-start mb-4">
                  <h3 className="text-neutral-500 font-bold uppercase text-xs tracking-widest">Monthly Sales</h3>
                  <DollarSign size={20} className="text-brand-bone" />
               </div>
               <p className="text-2xl font-black text-white">{formatPrice(thisMonthRevenue)}</p>
               <div className={`mt-2 text-[10px] font-bold uppercase flex items-center gap-1 ${revenueGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {revenueGrowth >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {Math.abs(revenueGrowth).toFixed(1)}% vs last month
               </div>
            </div>

            {/* Total Orders x Month */}
            <div className="bg-brand-dark/20 border border-brand-dark p-6">
               <div className="flex justify-between items-start mb-4">
                  <h3 className="text-neutral-500 font-bold uppercase text-xs tracking-widest">Monthly Orders</h3>
                  <ShoppingBag size={20} className="text-blue-500" />
               </div>
               <p className="text-2xl font-black text-white">{thisMonthCount}</p>
               <div className={`mt-2 text-[10px] font-bold uppercase flex items-center gap-1 ${ordersGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {ordersGrowth >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {Math.abs(ordersGrowth).toFixed(1)}% vs last month
               </div>
            </div>

            {/* Units Sold This Month */}
            <div className="bg-brand-dark/20 border border-brand-dark p-6">
               <div className="flex justify-between items-start mb-4">
                  <h3 className="text-neutral-500 font-bold uppercase text-xs tracking-widest">Units Sold</h3>
                  <Package size={20} className="text-green-500" />
               </div>
               <p className="text-2xl font-black text-white">{unitsSoldThisMonth}</p>
               <p className="text-[10px] text-neutral-500 mt-1 uppercase">Items shipped this month</p>
            </div>
         </div>

         {/* 2. SALES PERIOD ANALYSIS */}
         <div className="bg-brand-dark/10 border border-brand-dark p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
               <h3 className="text-white font-bold uppercase tracking-widest text-lg flex items-center gap-2">
                  <DollarSign size={20} className="text-brand-bone" /> Detailed Sales Analysis
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

         {/* 4. Monthly Earnings Bar Chart */}
         <div className="bg-brand-dark/20 border border-brand-dark p-8">
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-white font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                  <BarChart3 size={18} className="text-brand-bone" /> Monthly Earnings (Last 6 Months)
               </h3>
            </div>

            <div className="h-64 flex items-end justify-between gap-4">
               {earningsChartData.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                     <div className="w-full bg-brand-dark/30 rounded-t-sm relative flex items-end h-full">
                        <div
                           className="w-full bg-brand-bone transition-all duration-1000 ease-out group-hover:bg-white relative border-t border-x border-brand-bone"
                           style={{ height: `${Math.max((data.value / maxChartValue) * 100, 1)}%` }}
                        >
                           {/* Tooltip */}
                           <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-neutral-700 z-10 pointer-events-none">
                              {formatPrice(data.value)}
                           </div>
                        </div>
                     </div>
                     <span className="text-[10px] text-neutral-500 uppercase font-bold">{data.label}</span>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
};
