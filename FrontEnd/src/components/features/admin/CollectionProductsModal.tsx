
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Search, Package } from 'lucide-react';
import { Collection, Product } from '../../../types';
import { useShop } from '../../../context/ShopContext';

interface CollectionProductsModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection: Collection | null;
}

export const CollectionProductsModal: React.FC<CollectionProductsModalProps> = ({ isOpen, onClose, collection }) => {
  const { products, updateProduct } = useShop();
  const [searchQuery, setSearchQuery] = useState('');

  if (!collection) return null;

  // Filter products
  const collectionProducts = products.filter(p => p.collectionId === collection.id);
  const availableProducts = products.filter(p =>
    p.collectionId !== collection.id &&
    (p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.includes(searchQuery))
  );

  const handleAddToCollection = (product: Product) => {
    updateProduct({ ...product, collectionId: collection.id });
  };

  const handleRemoveFromCollection = (product: Product) => {
    // We set collectionId to undefined to remove it from the collection
    updateProduct({ ...product, collectionId: undefined });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-brand-black border border-brand-dark p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col"
          >
            <div className="flex justify-between items-center mb-6 border-b border-brand-dark pb-4">
              <div>
                <h2 className="text-2xl font-black uppercase italic text-white mb-1">Gestionar Productos</h2>
                <p className="text-neutral-500 text-xs uppercase tracking-widest">
                  Colección: <span className="text-brand-bone">{collection.title}</span>
                </p>
              </div>
              <button onClick={onClose} className="text-neutral-500 hover:text-white"><X size={24} /></button>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-hidden min-h-[400px]">

              {/* Left: In Collection */}
              <div className="flex flex-col h-full">
                <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                  <Package size={14} className="text-brand-bone" /> En Colección ({collectionProducts.length})
                </h3>
                <div className="bg-brand-dark/20 border border-brand-dark flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                  {collectionProducts.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-neutral-600 text-xs uppercase italic">
                      No hay productos en esta colección
                    </div>
                  ) : (
                    collectionProducts.map(p => (
                      <div key={p.id} className="bg-brand-black border border-brand-dark p-2 flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-brand-dark flex-shrink-0">
                          <img src={p.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-xs font-bold uppercase truncate">{p.name}</p>
                          <p className="text-[10px] text-neutral-500 uppercase">{p.category}</p>
                        </div>
                        <button
                          onClick={() => handleRemoveFromCollection(p)}
                          className="text-neutral-500 hover:text-red-500 p-2 transition-colors"
                          title="Eliminar de la Colección"
                        >
                          <Minus size={14} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Right: Available */}
              <div className="flex flex-col h-full">
                <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-4">Agregar Productos</h3>
                <div className="relative mb-2">
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-brand-dark/30 border border-brand-dark p-2 pl-8 text-white text-xs focus:outline-none focus:border-brand-bone"
                  />
                  <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                </div>
                <div className="bg-brand-dark/20 border border-brand-dark flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                  {availableProducts.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-neutral-600 text-xs uppercase italic">
                      No se encontraron productos
                    </div>
                  ) : (
                    availableProducts.map(p => (
                      <div key={p.id} className="bg-brand-black border border-brand-dark p-2 flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-brand-dark flex-shrink-0">
                          <img src={p.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-xs font-bold uppercase truncate">{p.name}</p>
                          <div className="flex items-center gap-2">
                            <p className="text-[10px] text-neutral-500 uppercase">{p.category}</p>
                            {p.collectionId && (
                              <span className="text-[9px] bg-brand-dark px-1 text-neutral-400 rounded">
                                en otra col.
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleAddToCollection(p)}
                          className="text-neutral-500 hover:text-green-500 p-2 transition-colors"
                          title="Agregar a la Colección"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

            <div className="mt-6 flex justify-end">
              <button onClick={onClose} className="bg-white text-black px-6 py-3 font-bold uppercase tracking-widest text-xs hover:bg-brand-bone transition-colors">
                Listo
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
