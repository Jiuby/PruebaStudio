
import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MOCK_ORDERS, MOCK_USER } from '../constants';
import { ArrowLeft, MapPin, Package, CheckCircle, Clock, Truck, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const order = MOCK_ORDERS.find(o => o.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!order) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-4xl font-black uppercase mb-4">Order Not Found</h2>
          <Link to="/account" className="text-brand-bone underline uppercase tracking-widest text-sm">Return to Dashboard</Link>
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

  // Helper to calculate mock dates relative to order creation
  const getStepDate = (baseDateStr: string, daysToAdd: number) => {
    const date = new Date(baseDateStr);
    date.setDate(date.getDate() + daysToAdd);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Timeline Logic
  // Depending on status, we determine which steps are "completed" (active)
  const steps = [
    { 
      label: 'Order Placed', 
      icon: Clock, 
      completed: true, // Always true if order exists
      date: order.date,
      info: 'Order received and confirmed.'
    },
    { 
      label: 'Processing', 
      icon: Package, 
      completed: true, // Assuming all displayed orders are at least processing
      date: getStepDate(order.date, 1),
      info: 'Your items are being packed.'
    },
    { 
      label: 'Shipped', 
      icon: Truck, 
      completed: ['Shipped', 'Delivered'].includes(order.status),
      date: getStepDate(order.date, 3),
      info: 'Handed over to logistics partner.'
    },
    { 
      label: 'Delivered', 
      icon: CheckCircle, 
      completed: order.status === 'Delivered',
      date: getStepDate(order.date, 6),
      info: 'Package delivered successfully.'
    },
  ];

  return (
    <div className="min-h-screen bg-brand-black pt-24 pb-20 px-4 md:px-8">
      
      {/* Breadcrumb / Back */}
      <div className="container mx-auto mb-8">
        <button onClick={() => navigate('/account')} className="flex items-center text-neutral-500 hover:text-white transition-colors text-xs uppercase tracking-widest gap-2 mb-6">
          <ArrowLeft size={16} /> Back to Orders
        </button>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-brand-dark pb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none mb-2">
              Order #{order.id}
            </h1>
            <p className="text-neutral-500 uppercase tracking-widest text-xs">
              Current Status: <span className="text-brand-bone font-bold">{order.status}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
             <button className="border border-brand-bone text-brand-bone px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-brand-bone hover:text-black transition-colors flex items-center gap-2">
               <FileText size={14} /> Download Invoice
             </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left Column: Timeline & Items */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Status Timeline */}
          <section className="bg-brand-dark/20 border border-brand-dark p-8">
            <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-8">Order Timeline</h3>
            <div className="relative">
              {/* Timeline Items */}
              <div className="flex flex-col md:flex-row justify-between relative gap-8 md:gap-0">
                
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-5 left-0 w-full h-0.5 bg-brand-dark -z-10"></div>
                
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={index} className="flex md:flex-col items-start md:items-center gap-4 md:gap-4 flex-1">
                      
                      {/* Icon Circle */}
                      <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                        step.completed 
                          ? 'bg-brand-black border-brand-bone text-brand-bone shadow-[0_0_15px_rgba(216,212,197,0.3)]' 
                          : 'bg-brand-black border-neutral-800 text-neutral-800'
                      }`}>
                        <Icon size={18} />
                      </div>

                      {/* Info Text */}
                      <div className={`md:text-center transition-all duration-500 ${step.completed ? 'opacity-100' : 'opacity-40'}`}>
                        <h4 className={`text-xs font-bold uppercase tracking-widest mb-1 ${step.completed ? 'text-white' : 'text-neutral-600'}`}>
                          {step.label}
                        </h4>
                        
                        {/* Show Info ONLY if step is completed */}
                        {step.completed && (
                          <motion.div 
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col"
                          >
                            <span className="text-[10px] text-brand-bone font-bold uppercase">{step.date}</span>
                            <span className="text-[10px] text-neutral-500 mt-1 max-w-[120px] mx-auto hidden md:block">{step.info}</span>
                            <span className="text-[10px] text-neutral-500 mt-1 md:hidden">{step.info}</span>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Items List */}
          <section>
            <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-6 pb-2 border-b border-brand-dark">
              Items Ordered ({order.items.length})
            </h3>
            <div className="space-y-6">
              {order.items.map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex gap-6 items-start"
                >
                  <Link to={`/product/${item.productId}`} className="w-24 h-32 bg-brand-dark flex-shrink-0 overflow-hidden group">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  </Link>
                  <div className="flex-1 flex flex-col md:flex-row justify-between">
                    <div>
                      <h4 className="text-white text-lg font-black uppercase italic tracking-tighter mb-2">
                        <Link to={`/product/${item.productId}`} className="hover:text-brand-bone transition-colors">
                          {item.name}
                        </Link>
                      </h4>
                      <div className="space-y-1 text-xs text-neutral-400 uppercase tracking-wide">
                        <p>Size: <span className="text-white">{item.size}</span></p>
                        <p>Qty: <span className="text-white">{item.quantity}</span></p>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 text-right">
                      <p className="text-white font-bold text-lg">{formatPrice(item.price)}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Summary */}
        <div className="lg:col-span-1">
          <div className="bg-brand-dark/20 border border-brand-dark p-6 sticky top-32 space-y-8">
            
            {/* Shipping Info */}
            <div>
              <h3 className="flex items-center gap-2 text-brand-bone font-bold uppercase tracking-widest text-xs mb-4">
                <MapPin size={14} /> Shipping Address
              </h3>
              <div className="text-sm text-neutral-400 leading-relaxed">
                <p className="text-white font-bold uppercase">{MOCK_USER.name}</p>
                <p>{MOCK_USER.address}</p>
                <p>{MOCK_USER.city}</p>
                <p>{MOCK_USER.zip}</p>
                <p className="mt-2">{MOCK_USER.phone}</p>
              </div>
            </div>

            <div className="h-px bg-brand-dark"></div>

            {/* Cost Breakdown */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-neutral-400">
                <span>Subtotal</span>
                <span>{formatPrice(order.total)}</span>
              </div>
              <div className="flex justify-between text-sm text-neutral-400">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-sm text-neutral-400">
                <span>Taxes</span>
                <span>Calculated</span>
              </div>
              <div className="border-t border-brand-dark pt-3 mt-3 flex justify-between items-center">
                <span className="text-white font-black uppercase italic text-lg">Total</span>
                <span className="text-brand-bone font-bold text-xl">{formatPrice(order.total)}</span>
              </div>
            </div>

            <button className="w-full bg-white text-black py-4 font-bold uppercase tracking-widest hover:bg-brand-bone transition-colors">
              Buy Again
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};
