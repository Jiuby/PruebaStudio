import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Plus, Minus, Search, Package } from 'lucide-react';
import { Collection, Product } from '../../../types';
import { useShop } from '../../../context/ShopContext';
import { ImageUpload } from './ImageUpload';

interface CollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  collectionToEdit: Collection | null;
}

export const CollectionModal: React.FC<CollectionModalProps> = ({ isOpen, onClose, collectionToEdit }) => {
  const { addCollection, updateCollection } = useShop();

  const [formData, setFormData] = useState<Partial<Collection>>({
    title: '',
    subtitle: '',
    image: '',
    size: 'medium'
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (collectionToEdit) {
      setFormData(collectionToEdit);
      setImageFile(null);
    } else {
      setFormData({ title: '', subtitle: '', image: '', size: 'medium' });
      setImageFile(null);
    }
  }, [collectionToEdit, isOpen]);

  const handleSaveCollection = (e: React.FormEvent) => {
    e.preventDefault();

    if (imageFile) {
      // Use FormData for file upload
      const data = new FormData();
      data.append('title', formData.title || '');
      data.append('subtitle', formData.subtitle || '');
      data.append('size', formData.size || 'medium');
      if (formData.category) data.append('category', formData.category);
      data.append('image', imageFile);

      if (collectionToEdit) {
        updateCollection(collectionToEdit.id, data);
      } else {
        addCollection(data as any);
      }
    } else {
      // JSON fallback (only if no new image)
      const collectionData: any = {
        title: formData.title,
        subtitle: formData.subtitle,
        size: formData.size,
      };

      // Only include category if it exists
      if (formData.category) {
        collectionData.category = formData.category;
      }

      // For new collections, image is required
      if (!collectionToEdit) {
        collectionData.image = formData.image || '';
      }
      // For updates, don't send image field if not changed (backend will keep existing)

      if (collectionToEdit) {
        updateCollection(collectionToEdit.id, collectionData);
      } else {
        addCollection(collectionData);
      }
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-12 md:pt-24 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-brand-black border border-brand-dark p-8 w-full max-w-xl shadow-2xl max-h-[85vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-8 border-b border-brand-dark pb-4">
              <h2 className="text-2xl font-black uppercase italic text-white">{collectionToEdit ? 'Edit Collection' : 'New Collection'}</h2>
              <button onClick={onClose} className="text-neutral-500 hover:text-white"><X size={24} /></button>
            </div>

            <form onSubmit={handleSaveCollection} className="space-y-6">
              <div>
                <label className="block text-xs uppercase font-bold text-neutral-500 mb-2">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-brand-dark/30 border border-brand-dark p-3 text-white focus:outline-none focus:border-brand-bone"
                  placeholder="e.g. THE DENIM EDIT"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-neutral-500 mb-2">Subtitle</label>
                <input
                  type="text"
                  required
                  value={formData.subtitle}
                  onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full bg-brand-dark/30 border border-brand-dark p-3 text-white focus:outline-none focus:border-brand-bone"
                  placeholder="e.g. HEAVYWEIGHT. DISTRESSED."
                />
              </div>

              {/* Image Upload */}
              <ImageUpload
                image={formData.image}
                onImageChange={(base64, file) => {
                  setFormData({ ...formData, image: base64 });
                  if (file) setImageFile(file);
                }}
                label="Collection Image"
              />

              <div>
                <label className="block text-xs uppercase font-bold text-neutral-500 mb-2">Display Size</label>
                <select
                  value={formData.size}
                  onChange={e => setFormData({ ...formData, size: e.target.value as any })}
                  className="w-full bg-brand-dark/30 border border-brand-dark p-3 text-white focus:outline-none focus:border-brand-bone"
                >
                  <option value="small">Small (1/2 width)</option>
                  <option value="medium">Medium (Square)</option>
                  <option value="large">Large (Full Width)</option>
                </select>
              </div>

              {/* Visual Preview */}
              <div className="space-y-2">
                <label className="block text-xs uppercase font-bold text-neutral-500">Live Preview</label>
                <div className="bg-brand-black border border-brand-dark p-6 flex justify-center items-center">
                  <div
                    className={`relative overflow-hidden bg-brand-dark shadow-xl transition-all duration-300 ${formData.size === 'large' ? 'w-full aspect-[21/9]' :
                      formData.size === 'small' ? 'w-full aspect-[21/9]' :
                        'w-2/3 aspect-[4/5]'
                      }`}
                  >
                    <img
                      src={formData.image || 'https://via.placeholder.com/800'}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6 w-full">
                      <p className="text-brand-bone text-[10px] font-bold uppercase tracking-widest mb-1">
                        {formData.subtitle || 'SUBTITLE'}
                      </p>
                      <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">
                        {formData.title || 'COLLECTION TITLE'}
                      </h2>
                      <div className="flex items-center gap-2 text-white font-bold uppercase text-[10px] tracking-widest opacity-80">
                        Explore <ArrowRight size={12} />
                      </div>
                    </div>

                    {/* Size Label for Admin Context */}
                    <div className="absolute top-2 right-2 bg-brand-bone text-brand-black text-[10px] font-bold px-2 py-1 uppercase">
                      {formData.size} Display
                    </div>
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full bg-brand-bone text-brand-black py-4 font-black uppercase tracking-widest hover:bg-white transition-colors">
                {collectionToEdit ? 'Update Collection' : 'Create Collection'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

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
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-12 md:pt-24 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-brand-black border border-brand-dark p-8 w-full max-w-4xl max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col"
          >
            <div className="flex justify-between items-center mb-6 border-b border-brand-dark pb-4">
              <div>
                <h2 className="text-2xl font-black uppercase italic text-white mb-1">Manage Products</h2>
                <p className="text-neutral-500 text-xs uppercase tracking-widest">
                  Collection: <span className="text-brand-bone">{collection.title}</span>
                </p>
              </div>
              <button onClick={onClose} className="text-neutral-500 hover:text-white"><X size={24} /></button>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-hidden min-h-[400px]">

              {/* Left: In Collection */}
              <div className="flex flex-col h-full">
                <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                  <Package size={14} className="text-brand-bone" /> In Collection ({collectionProducts.length})
                </h3>
                <div className="bg-brand-dark/20 border border-brand-dark flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                  {collectionProducts.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-neutral-600 text-xs uppercase italic">
                      No products in this collection
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
                          title="Remove from Collection"
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
                <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-4">Add Products</h3>
                <div className="relative mb-2">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-brand-dark/30 border border-brand-dark p-2 pl-8 text-white text-xs focus:outline-none focus:border-brand-bone"
                  />
                  <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                </div>
                <div className="bg-brand-dark/20 border border-brand-dark flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                  {availableProducts.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-neutral-600 text-xs uppercase italic">
                      No products found
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
                                in other col.
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleAddToCollection(p)}
                          className="text-neutral-500 hover:text-green-500 p-2 transition-colors"
                          title="Add to Collection"
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
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
