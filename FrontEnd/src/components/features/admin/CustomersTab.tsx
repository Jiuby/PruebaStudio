
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ShoppingBag, Trash2, MapPin, Calendar } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
import { UserProfile } from '../../../types';
import { CustomerModal } from './CustomerModal';

export const CustomersTab: React.FC = () => {
   const { customers, orders, deleteCustomer } = useShop();

   const [customerCurrentPage, setCustomerCurrentPage] = useState(1);
   const [viewingCustomer, setViewingCustomer] = useState<UserProfile | null>(null);
   const CUSTOMERS_PER_PAGE = 10;

   const formatPrice = (price: number) => {
      return new Intl.NumberFormat('es-CO', {
         style: 'currency',
         currency: 'COP',
         minimumFractionDigits: 0
      }).format(price);
   };

   const handleDeleteCustomer = (id: string) => {
      if (window.confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
         deleteCustomer(id);
      }
   };

   const totalCustomerPages = Math.ceil(customers.length / CUSTOMERS_PER_PAGE);
   const startIndex = (customerCurrentPage - 1) * CUSTOMERS_PER_PAGE;
   const paginatedCustomers = customers.slice(startIndex, startIndex + CUSTOMERS_PER_PAGE);

   const handleCustomerPageChange = (p: number) => {
      if (p >= 1 && p <= totalCustomerPages) setCustomerCurrentPage(p);
   };

   return (
      <div className="space-y-6 animate-fade-in">
         <h2 className="text-3xl font-black uppercase italic text-white">Customers</h2>

         <div className="bg-brand-dark/10 border border-brand-dark p-6">
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                     <tr className="border-b border-brand-dark text-neutral-500 text-xs font-bold uppercase tracking-widest">
                        <th className="pb-4 pl-4">Customer</th>
                        <th className="pb-4">Location</th>
                        <th className="pb-4">Stats</th>
                        <th className="pb-4">Joined</th>
                        <th className="pb-4 pr-4 text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody>
                     {paginatedCustomers.map((customer) => {
                        const customerOrders = orders.filter(o => o.customerEmail === customer.email);
                        const totalSpent = customerOrders.reduce((sum, o) => sum + o.total, 0);

                        return (
                           <tr key={customer.id} className="border-b border-brand-dark/50 hover:bg-brand-dark/20 transition-colors">
                              <td className="py-4 pl-4">
                                 <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-brand-dark flex items-center justify-center text-brand-bone font-bold text-lg">
                                       {customer.name.charAt(0)}
                                    </div>
                                    <div>
                                       <p className="text-white font-bold text-sm uppercase">{customer.name}</p>
                                       <p className="text-[10px] text-neutral-500">{customer.email}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="py-4">
                                 {customer.city ? (
                                    <span className="flex items-center gap-1 text-xs text-neutral-400">
                                       <MapPin size={12} /> {customer.city}
                                    </span>
                                 ) : <span className="text-xs text-neutral-600">N/A</span>}
                              </td>
                              <td className="py-4">
                                 <div className="flex flex-col">
                                    <span className="text-white font-bold text-sm">{formatPrice(totalSpent)}</span>
                                    <span className="text-[10px] text-neutral-500 uppercase">{customerOrders.length} Orders</span>
                                 </div>
                              </td>
                              <td className="py-4">
                                 <span className="flex items-center gap-1 text-xs text-neutral-400">
                                    <Calendar size={12} /> {customer.joinDate || 'N/A'}
                                 </span>
                              </td>
                              <td className="py-4 pr-4 text-right">
                                 <div className="flex justify-end gap-2">
                                    <button
                                       onClick={() => setViewingCustomer(customer)}
                                       className="p-2 text-neutral-400 hover:text-brand-bone transition-colors"
                                       title="View Orders"
                                    >
                                       <ShoppingBag size={16} />
                                    </button>
                                    <button
                                       onClick={() => handleDeleteCustomer(customer.id)}
                                       className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
                                       title="Delete Customer"
                                    >
                                       <Trash2 size={16} />
                                    </button>
                                 </div>
                              </td>
                           </tr>
                        );
                     })}
                  </tbody>
               </table>
            </div>

            {/* Pagination Controls */}
            {totalCustomerPages > 1 && (
               <div className="flex justify-center items-center gap-4 mt-6 border-t border-brand-dark pt-6">
                  <button
                     onClick={() => handleCustomerPageChange(customerCurrentPage - 1)}
                     disabled={customerCurrentPage === 1}
                     className="w-10 h-10 flex items-center justify-center border border-brand-dark text-white hover:border-brand-bone disabled:opacity-30 disabled:hover:border-brand-dark transition-colors"
                  >
                     <ChevronLeft size={16} />
                  </button>
                  <span className="text-xs font-bold text-neutral-500 uppercase">
                     Page {customerCurrentPage} of {totalCustomerPages}
                  </span>
                  <button
                     onClick={() => handleCustomerPageChange(customerCurrentPage + 1)}
                     disabled={customerCurrentPage === totalCustomerPages}
                     className="w-10 h-10 flex items-center justify-center border border-brand-dark text-white hover:border-brand-bone disabled:opacity-30 disabled:hover:border-brand-dark transition-colors"
                  >
                     <ChevronRight size={16} />
                  </button>
               </div>
            )}
         </div>

         <CustomerModal
            customer={viewingCustomer}
            onClose={() => setViewingCustomer(null)}
         />
      </div>
   );
};
