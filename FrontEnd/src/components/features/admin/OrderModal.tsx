
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, User, Package, Calendar, Mail, Phone, Truck, CheckCircle } from 'lucide-react';
import { Order } from '../../../types';
import { useShop } from '../../../context/ShopContext';

interface OrderModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({ order: initialOrder, onClose }) => {
  const { customers, updateOrderStatus, orders } = useShop();

  // Get the live version of the order from context to ensure updates (like status changes) are reflected immediately
  const order = orders.find(o => o.id === initialOrder?.id) || initialOrder;

  if (!order) return null;

  // Find customer details based on email attached to order (to check if they are registered)
  const registeredCustomer = customers.find(c => c.email === order.customerEmail);

  // Use shipping details from the order if available, otherwise fallback to customer profile or empty
  const shipping = order.shippingDetails;

  // Derived display values
  const displayName = shipping
    ? `${shipping.firstName} ${shipping.lastName}`
    : (registeredCustomer?.name || order.customerName || 'Guest');

  const displayPhone = shipping?.phone || registeredCustomer?.phone || 'N/A';
  const displayAddress = shipping?.address || registeredCustomer?.address || 'N/A';
  const displayCity = shipping?.city || registeredCustomer?.city || '';
  const displayZip = shipping?.zip || registeredCustomer?.zip || '';

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateOrderStatus(order.id, e.target.value as Order['status']);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-brand-black border border-brand-dark w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-8 border-b border-brand-dark bg-brand-dark/10">
            <div>
              <h2 className="text-2xl font-black uppercase italic text-white mb-1">Order Details</h2>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-brand-bone font-bold uppercase tracking-widest">#{order.id}</span>
                <span className="text-neutral-500 uppercase flex items-center gap-1"><Calendar size={12} /> {order.date}</span>
              </div>
            </div>
            <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left Column: Items */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
                  <Package size={16} className="text-brand-bone" /> Items Ordered ({order.items.length})
                </h3>
                <div className="space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 bg-brand-dark/20 p-4 border border-brand-dark">
                      <div className="w-16 h-20 bg-brand-dark flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex justify-between items-start">
                        <div>
                          <h4 className="text-white text-sm font-bold uppercase leading-tight mb-1">{item.name}</h4>
                          <p className="text-[10px] text-neutral-400 uppercase">Size: {item.size}</p>
                          <p className="text-[10px] text-neutral-400 uppercase">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-white font-bold text-sm">{formatPrice(item.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Totals */}
              <div className="bg-brand-dark/10 border border-brand-dark p-6">
                <div className="flex justify-between text-sm text-neutral-400 mb-2">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
                <div className="flex justify-between text-sm text-neutral-400 mb-4">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-white font-bold text-lg pt-4 border-t border-brand-dark">
                  <span className="uppercase italic">Total</span>
                  <span className="text-brand-bone">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Customer & Actions */}
            <div className="space-y-8">

              {/* Status Control */}
              <div className="bg-brand-bone text-brand-black p-6">
                <h3 className="font-black uppercase italic text-lg mb-4 flex items-center gap-2">
                  <Truck size={20} /> Update Status
                </h3>
                <p className="text-xs font-bold uppercase tracking-widest mb-2 opacity-70">Current Status</p>
                <div className="relative">
                  <select
                    value={order.status}
                    onChange={handleStatusChange}
                    className="w-full bg-black text-white p-3 font-bold uppercase text-sm border-none outline-none appearance-none cursor-pointer hover:bg-neutral-900 transition-colors focus:ring-2 focus:ring-white/20"
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white">
                    ▼
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-brand-dark/20 border border-brand-dark p-6 space-y-6">
                <div className="flex justify-between items-start border-b border-brand-dark pb-2">
                  <h3 className="text-white font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                    <User size={16} className="text-brand-bone" /> Customer Details
                  </h3>
                  {registeredCustomer ? (
                    <span className="bg-brand-bone text-brand-black text-[10px] font-bold px-1 uppercase flex items-center gap-1">
                      <CheckCircle size={10} /> Member
                    </span>
                  ) : (
                    <span className="bg-neutral-700 text-neutral-300 text-[10px] font-bold px-1 uppercase">Guest</span>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] text-neutral-500 uppercase font-bold">Name</p>
                    <p className="text-white text-sm font-bold uppercase">{displayName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-500 uppercase font-bold">Contact</p>
                    <div className="flex items-center gap-2 text-neutral-300 text-xs mt-1">
                      <Mail size={12} /> <span className="truncate">{order.customerEmail}</span>
                    </div>
                    {displayPhone && (
                      <div className="flex items-center gap-2 text-neutral-300 text-xs mt-1">
                        <Phone size={12} /> {displayPhone}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-brand-dark">
                  <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                    <MapPin size={14} className="text-brand-bone" /> Shipping Address
                  </h4>
                  <div className="text-xs text-neutral-400 leading-relaxed uppercase">
                    {displayAddress !== 'N/A' ? (
                      <>
                        <p>{displayAddress}</p>
                        <p>{displayCity}</p>
                        <p>{displayZip}</p>
                      </>
                    ) : (
                      <p className="text-neutral-600 italic">No shipping address provided.</p>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="p-4 border-t border-brand-dark bg-brand-black flex justify-end">
            <button
              onClick={onClose}
              className="bg-white text-black px-8 py-3 font-bold uppercase tracking-widest hover:bg-brand-bone transition-colors text-xs"
            >
              Close Details
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
