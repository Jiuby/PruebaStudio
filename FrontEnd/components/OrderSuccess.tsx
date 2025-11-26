
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const OrderSuccess: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-brand-black flex flex-col items-center justify-center px-4 text-center pt-20">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-20 h-20 rounded-full bg-brand-bone flex items-center justify-center mx-auto mb-8 text-brand-black">
          <CheckCircle size={40} />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black uppercase text-white italic tracking-tighter mb-4">
          Order Confirmed
        </h1>
        
        <p className="text-neutral-500 uppercase tracking-widest text-sm mb-2">
          Order #ORD-{Math.floor(1000 + Math.random() * 9000)}
        </p>
        
        <p className="text-neutral-400 max-w-md mx-auto mb-12">
          Thank you for your purchase. We have received your order and will begin processing it shortly. You will receive an email confirmation soon.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/account" 
            className="px-8 py-4 border border-brand-dark text-white font-bold uppercase tracking-widest hover:bg-brand-dark transition-colors"
          >
            View Order
          </Link>
          <Link 
            to="/" 
            className="px-8 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-brand-bone transition-colors flex items-center justify-center gap-2"
          >
            Continue Shopping <ArrowRight size={16} />
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
