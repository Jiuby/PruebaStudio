
import React from 'react';
import { useShop } from '../../../context/ShopContext';
import { BarChart3, PieChart, Activity } from 'lucide-react';

export const AnalyticsTab: React.FC = () => {
   const { products } = useShop();

   const formatPrice = (price: number) => {
      return new Intl.NumberFormat('es-CO', {
         style: 'currency',
         currency: 'COP',
         minimumFractionDigits: 0
      }).format(price);
   };

   return (
      <div className="space-y-8 animate-fade-in">
         <h2 className="text-3xl font-black uppercase italic text-white">Analytics</h2>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sales Chart Mockup */}
            <div className="bg-brand-dark/20 border border-brand-dark p-8">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-white font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                     <BarChart3 size={18} /> Revenue Over Time
                  </h3>
                  <select className="bg-brand-dark border border-brand-dark text-xs text-white p-2">
                     <option>Last 30 Days</option>
                     <option>Last 90 Days</option>
                     <option>This Year</option>
                  </select>
               </div>
               <div className="h-64 flex items-end justify-between gap-2 px-2 pb-2 border-b border-brand-dark/50">
                  {[45, 60, 35, 80, 55, 90, 70].map((h, i) => (
                     <div key={i} className="w-full bg-brand-bone/20 hover:bg-brand-bone transition-colors relative group rounded-t-sm" style={{ height: `${h}%` }}>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-brand-black text-white text-[10px] p-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-brand-dark">
                           ${h * 1500}
                        </div>
                     </div>
                  ))}
               </div>
               <div className="flex justify-between mt-4 text-[10px] text-neutral-500 uppercase tracking-widest">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
               </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-brand-dark/20 border border-brand-dark p-8">
               <h3 className="text-white font-bold uppercase tracking-widest text-sm flex items-center gap-2 mb-8">
                  <PieChart size={18} /> Sales by Category
               </h3>
               <div className="space-y-6">
                  {[
                     { label: 'Hoodies', percent: 45, color: 'bg-brand-bone' },
                     { label: 'Tees', percent: 30, color: 'bg-neutral-400' },
                     { label: 'Bottoms', percent: 15, color: 'bg-neutral-600' },
                     { label: 'Accessories', percent: 10, color: 'bg-neutral-800' }
                  ].map((cat, idx) => (
                     <div key={idx}>
                        <div className="flex justify-between text-xs text-white uppercase font-bold mb-2">
                           <span>{cat.label}</span>
                           <span>{cat.percent}%</span>
                        </div>
                        <div className="h-2 w-full bg-brand-dark rounded-full overflow-hidden">
                           <div className={`h-full ${cat.color}`} style={{ width: `${cat.percent}%` }}></div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Top Products */}
         <div className="bg-brand-dark/10 border border-brand-dark p-8">
            <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
               <Activity size={18} /> Top Selling Products
            </h3>
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                     <tr className="border-b border-brand-dark text-neutral-500 text-xs font-bold uppercase tracking-widest">
                        <th className="pb-4">Product Name</th>
                        <th className="pb-4">Category</th>
                        <th className="pb-4 text-right">Units Sold</th>
                        <th className="pb-4 text-right">Revenue</th>
                     </tr>
                  </thead>
                  <tbody className="text-sm">
                     {products.slice(0, 5).map((p, i) => (
                        <tr key={p.id} className="border-b border-brand-dark/50">
                           <td className="py-4 text-white font-bold">{p.name}</td>
                           <td className="py-4 text-neutral-400 uppercase text-xs">{p.category}</td>
                           <td className="py-4 text-right text-brand-bone">{120 - (i * 15)}</td>
                           <td className="py-4 text-right text-white">{formatPrice(p.price * (120 - (i * 15)))}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   );
};
