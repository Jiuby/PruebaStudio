
import React, { useState, useEffect } from 'react';
import { X, ArrowRight, AlertCircle, Check } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register, error: authError } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirm: ''
  });

  // Password validation state
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    twoNumbers: false
  });

  // Reset form when switching views
  useEffect(() => {
    setFormData({
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      passwordConfirm: ''
    });
    setError(null);
  }, [view]);

  // Update password validation as user types
  useEffect(() => {
    const password = formData.password;
    setPasswordValidation({
      minLength: password.length >= 5,
      twoNumbers: (password.match(/\d/g) || []).length >= 2
    });
  }, [formData.password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (view === 'login') {
        await login(formData.email, formData.password);
        onClose();
      } else {
        // Client-side validation for registration
        if (formData.password !== formData.passwordConfirm) {
          setError('Las contraseñas no coinciden');
          setLoading(false);
          return;
        }

        if (!passwordValidation.minLength || !passwordValidation.twoNumbers) {
          setError('La contraseña no cumple con los requisitos');
          setLoading(false);
          return;
        }

        await register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          password_confirm: formData.passwordConfirm,
          first_name: formData.firstName,
          last_name: formData.lastName
        });
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error');
    } finally {
      setLoading(false);
    }
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
            className="relative w-full max-w-md bg-brand-black border border-brand-dark p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
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

            {/* Error Display */}
            {(error || authError) && (
              <div className="mb-6 bg-red-900/20 border border-red-900/50 p-3 flex items-start gap-2">
                <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-400 text-xs">{error || authError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {view === 'register' && (
                <>
                  <div>
                    <label className="block text-xs uppercase font-bold text-neutral-500 mb-2">Username</label>
                    <input
                      type="text"
                      required
                      value={formData.username}
                      onChange={e => setFormData({ ...formData, username: e.target.value })}
                      className="w-full bg-brand-dark/30 border border-brand-dark p-3 text-white focus:outline-none focus:border-brand-bone transition-colors"
                      placeholder="ENTER USERNAME"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase font-bold text-neutral-500 mb-2">First Name</label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full bg-brand-dark/30 border border-brand-dark p-3 text-white focus:outline-none focus:border-brand-bone transition-colors"
                        placeholder="FIRST"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase font-bold text-neutral-500 mb-2">Last Name</label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full bg-brand-dark/30 border border-brand-dark p-3 text-white focus:outline-none focus:border-brand-bone transition-colors"
                        placeholder="LAST"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs uppercase font-bold text-neutral-500 mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
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
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-brand-dark/30 border border-brand-dark p-3 text-white focus:outline-none focus:border-brand-bone transition-colors"
                  placeholder="••••••••"
                />

                {/* Password Requirements - Only show during registration */}
                {view === 'register' && formData.password && (
                  <div className="mt-2 space-y-1">
                    <div className={`flex items - center gap - 2 text - xs ${passwordValidation.minLength ? 'text-green-400' : 'text-neutral-500'} `}>
                      <Check size={14} />
                      <span>Mínimo 5 caracteres</span>
                    </div>
                    <div className={`flex items - center gap - 2 text - xs ${passwordValidation.twoNumbers ? 'text-green-400' : 'text-neutral-500'} `}>
                      <Check size={14} />
                      <span>Al menos 2 números</span>
                    </div>
                  </div>
                )}
              </div>

              {view === 'register' && (
                <div>
                  <label className="block text-xs uppercase font-bold text-neutral-500 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    required
                    value={formData.passwordConfirm}
                    onChange={e => setFormData({ ...formData, passwordConfirm: e.target.value })}
                    className="w-full bg-brand-dark/30 border border-brand-dark p-3 text-white focus:outline-none focus:border-brand-bone transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-bone text-brand-black font-black uppercase py-4 tracking-widest hover:bg-white transition-colors flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : (view === 'login' ? 'Sign In' : 'Create Account')}
                {!loading && <ArrowRight size={16} />}
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
