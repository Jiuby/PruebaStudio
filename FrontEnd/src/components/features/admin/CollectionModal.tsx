
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { Collection } from '../../../types';
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

  useEffect(() => {
    if (collectionToEdit) {
      setFormData(collectionToEdit);
    } else {
      setFormData({ title: '', subtitle: '', image: '', size: 'medium' });
    }
  }, [collectionToEdit, isOpen]);

  const handleSaveCollection = (e: React.FormEvent) => {
    e.preventDefault();
    const collectionData = {
      ...formData,
      image: formData.image || 'https://picsum.photos/800/600',
    } as Collection;

    if (collectionToEdit) {
      updateCollection(collectionData);
    } else {
      addCollection({
        ...collectionData,
        id: Math.random().toString(36).substr(2, 9),
      });
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-brand-black border border-brand-dark p-8 w-full max-w-xl shadow-2xl max-h-[90vh] overflow-y-auto"
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
                onImageChange={(base64) => setFormData({ ...formData, image: base64 })}
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
