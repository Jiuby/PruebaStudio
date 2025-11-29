
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, ShieldAlert } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate network delay for realism
    setTimeout(() => {
      const success = loginAdmin(email, password);
      if (success) {
        navigate('/admin');
      } else {
        setError('Invalid credentials. Access denied.');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_#d8d4c5_0%,_transparent_25%)]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-brand-dark/20 border border-brand-dark p-8 md:p-12 relative z-10 backdrop-blur-md"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-brand-dark border border-brand-dark rounded-full flex items-center justify-center mx-auto mb-6 text-brand-bone">
            <Lock size={24} />
          </div>
          <h1 className="text-3xl font-black uppercase italic text-white tracking-tighter mb-2">
            Goustty<br />
            <span className="text-brand-bone">Command</span>
          </h1>
          <p className="text-neutral-500 text-xs uppercase tracking-[0.2em]">Authorized Personnel Only</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-red-500/10 border border-red-500/50 p-4 flex items-center gap-3 text-red-500 text-xs font-bold uppercase tracking-wide"
            >
              <ShieldAlert size={16} />
              {error}
            </motion.div>
          )}

          <div>
            <label className="block text-xs uppercase font-bold text-neutral-500 mb-2">Admin ID</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-brand-black border border-brand-dark p-4 text-white font-medium focus:outline-none focus:border-brand-bone focus:ring-1 focus:ring-brand-bone transition-all"
              placeholder="admin@goustty.com"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-bold text-neutral-500 mb-2">Passcode</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-brand-black border border-brand-dark p-4 text-white font-medium focus:outline-none focus:border-brand-bone focus:ring-1 focus:ring-brand-bone transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-bone text-brand-black py-4 font-black uppercase tracking-[0.2em] hover:bg-white transition-all flex items-center justify-center gap-2 mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Authenticating...' : 'Access System'} {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button onClick={() => navigate('/')} className="text-neutral-600 hover:text-neutral-400 text-xs uppercase tracking-widest transition-colors">
            ← Return to Store
          </button>
        </div>
      </motion.div>
    </div>
  );
};
