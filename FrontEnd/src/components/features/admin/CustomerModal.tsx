

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { UserProfile } from '../../../types';
import { useShop } from '../../../context/ShopContext';

interface CustomerModalProps {
  customer: UserProfile | null;
  onClose: () => void;
}

export const CustomerModal: React.FC<CustomerModalProps> = ({ customer, onClose }) => {
  const { orders } = useShop();
  const [currentPage, setCurrentPage] = useState(1);
  const ORDERS_PER_PAGE = 10;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (!customer) return null;

  const customerOrders = orders.filter(o => o.customerEmail === customer.email);
  const totalPages = Math.ceil(customerOrders.length / ORDERS_PER_PAGE);
  const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
  const paginatedOrders = customerOrders.slice(startIndex, startIndex + ORDERS_PER_PAGE);

  return (
    <AnimatePresence>
      {customer && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 md:pt-12 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-brand-black border border-brand-dark p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl my-4"
          >
            <div className="flex justify-between items-center mb-4 border-b border-brand-dark pb-2">
              <div>
                <h2 className="text-2xl font-black uppercase italic text-white mb-1">Historial del Cliente</h2>
                <p className="text-neutral-500 text-xs uppercase tracking-widest">
                  Pedidos de <span className="text-brand-bone">{customer.name}</span>
                </p>
              </div>
              <button onClick={onClose} className="text-neutral-500 hover:text-white"><X size={24} /></button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-brand-dark text-neutral-500 text-xs font-bold uppercase tracking-widest">
                    <th className="pb-2 pr-4">ID Pedido</th>
                    <th className="pb-2 pr-4">Fecha</th>
                    <th className="pb-2 pr-4">Artículos</th>
                    <th className="pb-2 pr-4">Total</th>
                    <th className="pb-2">Estado</th>
                  </tr>
                </thead>
                <tbody className="text-base">
                  {paginatedOrders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-neutral-500 uppercase">No se encontraron pedidos para este cliente.</td>
                    </tr>
                  ) : (
                    paginatedOrders.map(order => (
                      <tr key={order.id} className="border-b border-brand-dark/50 hover:bg-brand-dark/20 transition-colors">
                        <td className="py-3 pr-4 text-brand-bone font-bold">#{order.id}</td>
                        <td className="py-3 pr-4 text-neutral-400 uppercase text-sm">{order.date}</td>
                        <td className="py-3 pr-4 text-white">
                          {order.items.length} {order.items.length === 1 ? 'Artículo' : 'Artículos'}
                        </td>
                        <td className="py-3 pr-4 text-white font-bold">{formatPrice(Number(order.total))}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 text-xs font-bold uppercase border ${order.status === 'Delivered' ? 'border-green-500 text-green-500' :
                            order.status === 'Shipped' ? 'border-blue-500 text-blue-500' :
                              order.status === 'Cancelled' ? 'border-red-500 text-red-500' :
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-brand-dark">
                <p className="text-neutral-500 text-sm">
                  Mostrando {startIndex + 1}-{Math.min(startIndex + ORDERS_PER_PAGE, customerOrders.length)} de {customerOrders.length} pedidos
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-brand-dark text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand-dark transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-white text-sm font-bold">
                    Página {currentPage} de {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 border border-brand-dark text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand-dark transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
