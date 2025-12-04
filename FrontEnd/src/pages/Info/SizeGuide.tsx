
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Ruler } from 'lucide-react';
import VisualGuideImg from '../../static/IMG/VisualGuide.png';

type Category = 'Camisetas' | 'Hoodies' | 'Pantalones';

export const SizeGuide: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [activeCategory, setActiveCategory] = useState<Category>('Camisetas');

  const categories: Category[] = ['Camisetas', 'Hoodies', 'Pantalones'];

  const sizeData = {
    Camisetas: {
      headers: ['Talla', 'Pecho (cm)', 'Largo (cm)', 'Hombro (cm)'],
      rows: [
        ['S', '110', '72', '52'],
        ['M', '116', '74', '54'],
        ['L', '122', '76', '56'],
        ['XL', '128', '78', '58']
      ],
      note: 'Nuestras camisetas tienen un diseño oversize y cuadrado. Elige una talla menos para un ajuste más estándar.'
    },
    Hoodies: {
      headers: ['Talla', 'Pecho (cm)', 'Largo (cm)', 'Manga (cm)'],
      rows: [
        ['S', '120', '68', '62'],
        ['M', '126', '70', '63'],
        ['L', '132', '72', '64'],
        ['XL', '138', '74', '65']
      ],
      note: 'Los hoodies tienen hombros caídos y cuerpo ancho. El largo es ligeramente corto para ajustarse a la cintura.'
    },
    Pantalones: {
      headers: ['Talla', 'Cintura (cm)', 'Largo (cm)', 'Muslo (cm)'],
      rows: [
        ['S (30)', '76', '104', '64'],
        ['M (32)', '81', '106', '66'],
        ['L (34)', '86', '108', '68'],
        ['XL (36)', '91', '110', '70']
      ],
      note: 'Los pantalones son de corte holgado. La cintura es fiel a la talla pero las piernas son sueltas.'
    }
  };

  return (
    <div className="bg-brand-black min-h-screen pt-24 pb-20 px-4 md:px-8">

      {/* Header */}
      <div className="container mx-auto mb-16 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-brand-bone uppercase tracking-[0.3em] text-xs font-bold mb-4"
        >
          Medidas
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter"
        >
          Encuentra tu Talla
        </motion.h1>
      </div>

      <div className="container mx-auto max-w-4xl">

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-3 text-sm font-bold uppercase tracking-widest border transition-all ${activeCategory === cat
                ? 'bg-brand-bone text-brand-black border-brand-bone'
                : 'text-neutral-500 border-brand-dark hover:border-white hover:text-white'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Chart Container */}
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-brand-dark/20 border border-brand-dark p-6 md:p-10 mb-16"
        >
          <div className="flex items-center gap-3 mb-8">
            <Ruler className="text-brand-bone" size={24} />
            <h2 className="text-2xl font-black text-white uppercase italic">{activeCategory} Guía de Tallas</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  {sizeData[activeCategory].headers.map((header, idx) => (
                    <th key={idx} className="border-b border-brand-dark pb-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sizeData[activeCategory].rows.map((row, rowIdx) => (
                  <tr key={rowIdx} className="group hover:bg-brand-dark/30 transition-colors">
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx} className={`py-4 text-sm font-medium ${cellIdx === 0 ? 'text-brand-bone font-bold' : 'text-white'}`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-8 text-sm text-neutral-400 italic bg-brand-black/50 p-4 border-l-2 border-brand-bone">
            <span className="font-bold text-white not-italic uppercase tracking-wide mr-2">Nota:</span>
            {sizeData[activeCategory].note}
          </p>
        </motion.div>

        {/* Measuring Guide */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-brand-dark pt-12">
          <div>
            <h3 className="text-white font-bold uppercase tracking-widest text-lg mb-6">Cómo Medir</h3>
            <ul className="space-y-6">
              <li>
                <h4 className="text-brand-bone font-bold uppercase text-xs mb-1">Pecho</h4>
                <p className="text-sm text-neutral-400">Mide alrededor de la parte más ancha de tu pecho, manteniendo la cinta métrica horizontal.</p>
              </li>
              <li>
                <h4 className="text-brand-bone font-bold uppercase text-xs mb-1">Cintura</h4>
                <p className="text-sm text-neutral-400">Mide alrededor de la parte más estrecha de tu cintura (típicamente la parte baja de la espalda y donde tu cuerpo se dobla de lado a lado).</p>
              </li>
              <li>
                <h4 className="text-brand-bone font-bold uppercase text-xs mb-1">Caderas</h4>
                <p className="text-sm text-neutral-400">Mide alrededor de la parte más ancha de tus caderas.</p>
              </li>
            </ul>
          </div>
          <div className="bg-brand-dark/30 border border-brand-dark flex items-center justify-center p-8">
            <div className="text-center w-full">
              <p className="text-neutral-500 text-xs uppercase tracking-widest mb-4">Guía Visual</p>
              <img src={VisualGuideImg} alt="Visual Measurement Guide" className="w-full h-auto object-contain max-h-[400px]" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
