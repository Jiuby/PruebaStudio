
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import coverPC from '../../../static/IMG/DESKTOP_2.jpg';
import coverCel from '../../../static/IMG/ss_2.jpg';

export const Hero: React.FC = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-brand-black">
      {/* Background Image */}
      <div className="absolute inset-0">
        <picture>
          <source media="(min-width: 768px)" srcSet={coverPC} />
          <img
            src={coverCel}
            alt="Streetwear Background"
            className="w-full h-full object-cover"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent"></div>
      </div>

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-brand-bone uppercase tracking-[0.3em] text-xs md:text-sm font-bold mb-4"
        >
          Est. 2025 • Colombia
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-8xl lg:text-9xl font-black text-white uppercase italic tracking-tighter mb-6 leading-none"
        >
          Drop<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-bone to-white">Dead</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link
            to="/shop"
            className="group relative px-8 py-4 bg-transparent border border-white text-white font-bold uppercase tracking-widest overflow-hidden hover:text-brand-black transition-colors duration-300 inline-block"
          >
            <span className="relative z-10">Ver Colección</span>
            <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out"></div>
          </Link>
        </motion.div>
      </div>

      <div className="absolute bottom-8 right-8 hidden md:block">
        <p className="text-neutral-500 text-xs uppercase tracking-widest text-right">
          Desliza para Explorar<br />
          ▼
        </p>
      </div>
    </div>
  );
};
