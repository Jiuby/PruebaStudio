
import React from 'react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const CartSidebar: React.FC = () => {
  const { cart, isCartOpen, toggleCart, removeFromCart, cartTotal } = useShop();
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleCheckout = () => {
    toggleCart();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-brand-black border-l border-brand-dark z-50 flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-brand-dark">
              <h2 className="text-xl font-bold uppercase tracking-wider text-brand-light">Your Bag ({cart.length})</h2>
              <button onClick={toggleCart} className="text-brand-bone hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-neutral-500 space-y-4">
                  <ShoppingBag size={48} strokeWidth={1} />
                  <p className="uppercase tracking-widest text-sm">Your bag is empty</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-4">
                    <div className="w-24 h-32 bg-brand-dark overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <h3 className="font-bold text-sm uppercase text-brand-light leading-tight">{item.name}</h3>
                        <p className="text-xs text-brand-bone mt-1 uppercase">Size: {item.size}</p>
                        <p className="text-sm font-medium mt-2 text-white">{formatPrice(item.price)}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id, item.size)}
                        className="text-xs text-neutral-500 hover:text-red-500 uppercase tracking-wider text-left transition-colors w-fit"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-brand-dark p-6 bg-brand-black space-y-4">
                <div className="flex justify-between items-center text-brand-light">
                  <span className="uppercase text-sm tracking-widest text-neutral-400">Subtotal</span>
                  <span className="font-bold text-xl">{formatPrice(cartTotal)}</span>
                </div>
                <p className="text-xs text-neutral-500 text-center">Shipping calculated at checkout.</p>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-brand-bone text-brand-black py-4 font-bold uppercase tracking-widest hover:bg-white transition-colors"
                >
                  Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
