
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, ArrowRight, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

export const OrderSuccess: React.FC = () => {
  const { state } = useLocation();
  const { isAuthenticated, token } = useAuth();
  const [hasValidSession, setHasValidSession] = useState(false);

  // Extract order ID and email passed from checkout
  const orderId = state?.orderId || 'ORD-0000';
  const email = state?.email || '';

  useEffect(() => {
    window.scrollTo(0, 0);

    // Check if user has a valid session by verifying token exists
    setHasValidSession(isAuthenticated && !!token);
  }, [isAuthenticated, token]);

  const trackingLink = `/track-order?id=${orderId}&email=${encodeURIComponent(email)}`;

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
          Order #{orderId}
        </p>

        <p className="text-neutral-400 max-w-md mx-auto mb-8">
          Thank you for your purchase. We have received your order and will begin processing it shortly. You will receive an email confirmation at <span className="text-white font-bold">{email}</span>.
        </p>

        <div className="bg-brand-dark/20 border border-brand-dark p-6 mb-12 max-w-lg mx-auto">
          <p className="text-sm text-white font-bold uppercase mb-2">Instrucciones de Pago</p>
          <p className="text-xs text-neutral-400 uppercase leading-relaxed">
            Tiene que hacer un pago al nequi al numero de <span className="text-brand-bone font-bold">3053111031</span> y que tiene que enviar el comprobante al whatsapp con el mismo numero, y que si en 24 horas no se encuentra el comprobante se le cancela manualmente la orden.
          </p>
        </div>

        {/* Dynamic Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">

          {hasValidSession ? (
            <Link
              to={`/account/order/${orderId}`}
              className="px-8 py-4 border border-brand-dark text-white font-bold uppercase tracking-widest hover:bg-brand-dark transition-colors flex items-center gap-2"
            >
              <Package size={16} /> View In Dashboard
            </Link>
          ) : (
            <div className="flex flex-col gap-3">
              <Link
                to={trackingLink}
                className="px-8 py-4 bg-brand-dark/30 border border-brand-dark text-brand-bone font-bold uppercase tracking-widest hover:bg-brand-dark transition-colors flex items-center gap-2"
              >
                <Package size={16} /> Track My Order
              </Link>
              <p className="text-[10px] text-neutral-600 uppercase max-w-xs mx-auto">
                Save this link to track your order without an account.
              </p>
            </div>
          )}

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
