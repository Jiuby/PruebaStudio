
import React, { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  const [view, setView] = useState<'login' | 'register'>('login');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (view === 'login') {
      login(formData.email);
    } else {
      register({ name: formData.name, email: formData.email });
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-black/90 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-brand-black border border-brand-dark p-8 shadow-2xl"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <div className="mb-8 text-center">
              <h2 className="text-3xl font-black uppercase italic text-white mb-2">
                {view === 'login' ? 'Welcome Back' : 'Join The Cult'}
              </h2>
              <p className="text-neutral-500 text-xs uppercase tracking-widest">
                {view === 'login' ? 'Access your orders & data' : 'Create an account'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {view === 'register' && (
                <div>
                  <label className="block text-xs uppercase font-bold text-neutral-500 mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-brand-dark/30 border border-brand-dark p-3 text-white focus:outline-none focus:border-brand-bone transition-colors"
                    placeholder="ENTER NAME"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-xs uppercase font-bold text-neutral-500 mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-brand-dark/30 border border-brand-dark p-3 text-white focus:outline-none focus:border-brand-bone transition-colors"
                  placeholder="ENTER EMAIL"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-neutral-500 mb-2">Password</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-brand-dark/30 border border-brand-dark p-3 text-white focus:outline-none focus:border-brand-bone transition-colors"
                  placeholder="••••••••"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-brand-bone text-brand-black font-black uppercase py-4 tracking-widest hover:bg-white transition-colors flex justify-center items-center gap-2"
              >
                {view === 'login' ? 'Sign In' : 'Create Account'} <ArrowRight size={16} />
              </button>
            </form>

            <div className="mt-6 text-center">
              <button 
                onClick={() => setView(view === 'login' ? 'register' : 'login')}
                className="text-xs uppercase tracking-widest text-neutral-500 hover:text-brand-bone transition-colors border-b border-transparent hover:border-brand-bone pb-1"
              >
                {view === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
