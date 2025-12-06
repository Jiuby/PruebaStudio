

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const Collections: React.FC = () => {
  const { collections } = useShop();

  return (
    <div className="min-h-screen bg-brand-black pt-24 pb-20 px-4 md:px-8">
      {/* Header */}
      <div className="container mx-auto mb-16 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-brand-bone uppercase tracking-[0.3em] text-xs font-bold mb-4"
        >
          Season 01 / 2025
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter"
        >
          Colecciones
        </motion.h1>
      </div>

      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {collections.map((collection, index) => (
          <motion.div
            key={collection.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.2 }}
            className={`relative group overflow-hidden bg-brand-dark ${collection.size === 'large' ? 'md:col-span-2 aspect-[21/9]' :
              collection.size === 'small' ? 'md:col-span-2 aspect-[21/9]' : 'aspect-[4/5] md:aspect-square'
              }`}
          >
            <Link to={`/shop?collection=${collection.id}`} className="block w-full h-full">
              {/* Image */}
              <img
                src={collection.image}
                alt={collection.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0 opacity-80 group-hover:opacity-100"
              />

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                  <p className="text-brand-bone text-xs font-bold uppercase tracking-widest mb-2">
                    {collection.subtitle}
                  </p>
                  <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter mb-4">
                    {collection.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2 text-white font-bold uppercase text-xs tracking-widest opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                  Explore Collection <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};