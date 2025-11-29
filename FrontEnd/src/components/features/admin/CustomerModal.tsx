
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { UserProfile } from '../../../types';
import { useShop } from '../../../context/ShopContext';

interface CustomerModalProps {
  customer: UserProfile | null;
  onClose: () => void;
}

export const CustomerModal: React.FC<CustomerModalProps> = ({ customer, onClose }) => {
  const { orders } = useShop();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <AnimatePresence>
      {customer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-brand-black border border-brand-dark p-8 w-full max-w-3xl max-h-[80vh] overflow-y-auto shadow-2xl"
          >
            <div className="flex justify-between items-center mb-8 border-b border-brand-dark pb-4">
              <div>
                <h2 className="text-2xl font-black uppercase italic text-white mb-1">Customer History</h2>
                <p className="text-neutral-500 text-xs uppercase tracking-widest">
                  Orders for <span className="text-brand-bone">{customer.name}</span>
                </p>
              </div>
              <button onClick={onClose} className="text-neutral-500 hover:text-white"><X size={24} /></button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-brand-dark text-neutral-500 text-xs font-bold uppercase tracking-widest">
                    <th className="pb-4">Order ID</th>
                    <th className="pb-4">Date</th>
                    <th className="pb-4">Items</th>
                    <th className="pb-4">Total</th>
                    <th className="pb-4">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {orders.filter(o => o.customerEmail === customer.email).length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-neutral-500 uppercase">No orders found for this customer.</td>
                    </tr>
                  ) : (
                    orders
                      .filter(o => o.customerEmail === customer.email)
                      .map(order => (
                        <tr key={order.id} className="border-b border-brand-dark/50 hover:bg-brand-dark/20 transition-colors">
                          <td className="py-4 text-brand-bone font-bold">#{order.id}</td>
                          <td className="py-4 text-neutral-400 uppercase text-xs">{order.date}</td>
                          <td className="py-4 text-white">
                            {order.items.length} Items
                            <div className="text-[10px] text-neutral-500 mt-1">
                              {order.items.slice(0, 2).map(i => i.name).join(', ')}
                              {order.items.length > 2 && '...'}
                            </div>
                          </td>
                          <td className="py-4 text-white font-bold">{formatPrice(order.total)}</td>
                          <td className="py-4">
                            <span className={`px-2 py-1 text-[10px] font-bold uppercase border ${order.status === 'Delivered' ? 'border-green-500 text-green-500' :
                                order.status === 'Shipped' ? 'border-blue-500 text-blue-500' :
                                  'border-yellow-500 text-yellow-500'
                              }`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
