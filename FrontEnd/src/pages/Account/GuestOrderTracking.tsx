
import React, { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { ArrowLeft, Package, CheckCircle, Clock, Truck } from 'lucide-react';
import { motion } from 'framer-motion';

export const GuestOrderTracking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get('email');
  const { orders } = useShop();

  const [error, setError] = useState<string | null>(null);

  // Find order
  const order = orders.find(o => o.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Basic security check: The email in the link must match the order's email
    if (order && order.customerEmail !== emailParam) {
      setError("You are not authorized to view this order.");
    }
  }, [id, order, emailParam]);

  if (!order || error) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center text-white pt-24">
        <div className="text-center">
          <h2 className="text-4xl font-black uppercase mb-4">Order Not Found</h2>
          <p className="text-neutral-500 mb-8">{error || "Check your link or Order ID."}</p>
          <Link to="/" className="text-brand-bone underline uppercase tracking-widest text-sm">Return Home</Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getStepDate = (baseDateStr: string, daysToAdd: number) => {
    const date = new Date(baseDateStr);
    date.setDate(date.getDate() + daysToAdd);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const steps = [
    { label: 'Order Placed', icon: Clock, completed: true, date: order.date },
    { label: 'Processing', icon: Package, completed: true, date: getStepDate(order.date, 1) },
    { label: 'Shipped', icon: Truck, completed: ['Shipped', 'Delivered'].includes(order.status), date: getStepDate(order.date, 3) },
    { label: 'Delivered', icon: CheckCircle, completed: order.status === 'Delivered', date: getStepDate(order.date, 6) },
  ];

  return (
    <div className="min-h-screen bg-brand-black pt-24 pb-20 px-4 md:px-8">
      <div className="container mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-12 text-center">
          <Link to="/" className="inline-flex items-center text-neutral-500 hover:text-white transition-colors text-xs uppercase tracking-widest gap-2 mb-8">
            <ArrowLeft size={16} /> Return to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none mb-4">
            Order Status
          </h1>
          <p className="text-neutral-500 uppercase tracking-widest text-sm">
            Tracking #{order.id}
          </p>
        </div>

        {/* Timeline */}
        <div className="bg-brand-dark/20 border border-brand-dark p-8 mb-12">
          <div className="relative flex flex-col md:flex-row justify-between gap-8 md:gap-0">
            <div className="hidden md:block absolute top-5 left-0 w-full h-0.5 bg-brand-dark -z-10"></div>
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="flex md:flex-col items-start md:items-center gap-4 flex-1">
                  <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 ${step.completed
                    ? 'bg-brand-black border-brand-bone text-brand-bone'
                    : 'bg-brand-black border-neutral-800 text-neutral-800'
                    }`}>
                    <Icon size={18} />
                  </div>
                  <div className="md:text-center">
                    <h4 className={`text-xs font-bold uppercase tracking-widest mb-1 ${step.completed ? 'text-white' : 'text-neutral-600'}`}>
                      {step.label}
                    </h4>
                    {step.completed && <span className="text-[10px] text-brand-bone block">{step.date}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Items */}
          <div className="space-y-6">
            <h3 className="text-white font-bold uppercase tracking-widest text-sm border-b border-brand-dark pb-4">Items Ordered</h3>
            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex gap-4 items-start bg-brand-dark/10 p-4 border border-brand-dark"
                >
                  <div className="w-16 h-20 bg-brand-dark flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white text-xs font-bold uppercase mb-1">{item.name}</h4>
                    <p className="text-[10px] text-neutral-500 uppercase">Size: {item.size} • Color: {item.color} • Qty: {item.quantity}</p>
                    <p className="text-brand-bone font-bold text-sm mt-2">{formatPrice(item.price)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-6">
            <h3 className="text-white font-bold uppercase tracking-widest text-sm border-b border-brand-dark pb-4">Shipping & Total</h3>
            <div className="bg-brand-dark/20 p-6 border border-brand-dark">
              <div className="mb-6">
                <p className="text-[10px] text-neutral-500 uppercase font-bold mb-1">Shipping To</p>
                <p className="text-white text-sm font-bold uppercase">{order.customerName}</p>
                <p className="text-neutral-400 text-xs uppercase">
                  {order.shippingDetails?.address}<br />
                  {order.shippingDetails?.city}, {order.shippingDetails?.zip}
                </p>
              </div>
              <div className="space-y-2 border-t border-brand-dark pt-4">
                <div className="flex justify-between text-sm text-neutral-400">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
                <div className="flex justify-between text-sm text-neutral-400">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-white font-bold text-lg pt-2 mt-2 border-t border-brand-dark/50">
                  <span className="uppercase">Total</span>
                  <span className="text-brand-bone">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
