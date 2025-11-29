
import React from 'react';
import { motion } from 'framer-motion';
import { Construction, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MaintenancePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <img 
            src="https://picsum.photos/id/400/1920/1080" 
            className="w-full h-full object-cover grayscale blur-sm"
            alt="Maintenance"
        />
        <div className="absolute inset-0 bg-black/80"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-lg border border-brand-dark bg-brand-black/90 p-12 backdrop-blur-md"
      >
        <div className="w-16 h-16 bg-brand-bone rounded-full flex items-center justify-center mx-auto mb-8 text-brand-black">
          <Construction size={32} />
        </div>
        
        <h1 className="text-5xl font-black uppercase italic text-white tracking-tighter mb-4">
          Goustty
        </h1>
        
        <h2 className="text-brand-bone uppercase tracking-[0.3em] text-sm font-bold mb-8">
          Under Maintenance
        </h2>
        
        <p className="text-neutral-400 leading-relaxed mb-8">
          We are currently updating our store to bring you a better experience and fresh drops. 
          Check back soon.
        </p>

        <div className="flex flex-col gap-4">
            <div className="text-xs uppercase text-neutral-600 font-bold tracking-widest">
                Est. 2024 • Colombia
            </div>
            
            <Link 
                to="/admin/login" 
                className="inline-flex items-center justify-center gap-2 text-neutral-700 hover:text-white transition-colors text-[10px] uppercase font-bold mt-8"
            >
                <Lock size={10} /> Staff Access
            </Link>
        </div>
      </motion.div>
    </div>
  );
};
