
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
import { Order } from '../../../types';
import { OrderModal } from './OrderModal';

export const OrdersTab: React.FC = () => {
  const { orders, updateOrderStatus } = useShop();

  const [orderCurrentPage, setOrderCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const ORDERS_PER_PAGE = 10;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const totalOrderPages = Math.ceil(orders.length / ORDERS_PER_PAGE);
  const startIndex = (orderCurrentPage - 1) * ORDERS_PER_PAGE;
  const paginatedOrders = orders.slice(startIndex, startIndex + ORDERS_PER_PAGE);

  const handleOrderPageChange = (p: number) => {
    if (p >= 1 && p <= totalOrderPages) {
      setOrderCurrentPage(p);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-3xl font-black uppercase italic text-white">Gestión de Pedidos</h2>

      <div className="bg-brand-dark/10 border border-brand-dark p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-brand-dark text-neutral-500 text-xs font-bold uppercase tracking-widest">
                <th className="pb-4 pl-4">ID de Pedido</th>
                <th className="pb-4">Fecha</th>
                <th className="pb-4">Cliente</th>
                <th className="pb-4">Total</th>
                <th className="pb-4">Estado</th>
                <th className="pb-4 pr-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map(order => (
                <tr key={order.id} className="border-b border-brand-dark/50 hover:bg-brand-dark/20 transition-colors">
                  <td className="py-4 pl-4 text-brand-bone font-bold">#{order.id}</td>
                  <td className="py-4 text-neutral-400 text-sm uppercase">{order.date}</td>
                  <td className="py-4 text-white text-sm">
                    {order.customerEmail ? (
                      <span title={order.customerEmail}>{order.customerEmail}</span>
                    ) : 'Usuario Invitado'}
                  </td>
                  <td className="py-4 text-white font-bold text-sm">{formatPrice(order.total)}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase border ${order.status === 'Delivered' ? 'border-green-500 text-green-500' :
                      order.status === 'Shipped' ? 'border-blue-500 text-blue-500' :
                        order.status === 'Cancelled' ? 'border-red-500 text-red-500' :
                          'border-yellow-500 text-yellow-500'
                      }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 pr-4 text-right">
                    <div className="flex justify-end gap-3 items-center">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                        className="bg-brand-black border border-brand-dark text-white text-[10px] p-2 uppercase font-bold focus:border-brand-bone outline-none hidden md:block"
                      >
                        <option value="Processing">Procesando</option>
                        <option value="Shipped">Enviado</option>
                        <option value="Delivered">Entregado</option>
                        <option value="Cancelled">Cancelado</option>
                      </select>

                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 bg-brand-bone text-brand-black hover:bg-white transition-colors rounded-sm"
                        title="Ver Detalles"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalOrderPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6 border-t border-brand-dark pt-6">
            <button
              onClick={() => handleOrderPageChange(orderCurrentPage - 1)}
              disabled={orderCurrentPage === 1}
              className="w-10 h-10 flex items-center justify-center border border-brand-dark text-white hover:border-brand-bone disabled:opacity-30 disabled:hover:border-brand-dark transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-bold text-neutral-500 uppercase">
              Página {orderCurrentPage} de {totalOrderPages}
            </span>
            <button
              onClick={() => handleOrderPageChange(orderCurrentPage + 1)}
              disabled={orderCurrentPage === totalOrderPages}
              className="w-10 h-10 flex items-center justify-center border border-brand-dark text-white hover:border-brand-bone disabled:opacity-30 disabled:hover:border-brand-dark transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      <OrderModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
};
