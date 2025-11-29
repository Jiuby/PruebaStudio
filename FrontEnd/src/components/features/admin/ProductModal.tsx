
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, Percent, List, Palette, Ruler } from 'lucide-react';
import { Product } from '../../../types';
import { useShop } from '../../../context/ShopContext';
import { ImageUpload } from './ImageUpload';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit: Product | null;
}

export const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, productToEdit }) => {
  const { addProduct, updateProduct, categories, collections } = useShop();

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    originalPrice: undefined,
    category: 'Tees',
    collectionId: '',
    description: '',
    image: '',
    inStock: true,
    isNew: false,
    details: [],
    colors: [],
    availableSizes: []
  });

  const [newDetail, setNewDetail] = useState('');
  const [newColor, setNewColor] = useState('');
  const [newSize, setNewSize] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState<string>('');

  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        ...productToEdit,
        originalPrice: productToEdit.originalPrice || undefined,
        details: productToEdit.details || [],
        colors: productToEdit.colors || [],
        availableSizes: productToEdit.availableSizes || []
      });
      setImageFile(null);
      if (productToEdit.originalPrice && productToEdit.originalPrice > productToEdit.price) {
        const discount = Math.round(((productToEdit.originalPrice - productToEdit.price) / productToEdit.originalPrice) * 100);
        setDiscountPercentage(discount.toString());
      } else {
        setDiscountPercentage('');
      }
    } else {
      setFormData({
        name: '',
        price: 0,
        originalPrice: undefined,
        category: 'Tees',
        collectionId: '',
        description: '',
        image: '',
        inStock: true,
        isNew: false,
        details: [],
        colors: [],
        availableSizes: ['S', 'M', 'L', 'XL'] // Default for new products
      });
      setImageFile(null);
      setDiscountPercentage('');
    }
  }, [productToEdit, isOpen]);



  const handleOriginalPriceChange = (val: string) => {
    const newOriginal = Number(val);
    if (!val || newOriginal === 0) {
      setFormData(prev => ({ ...prev, originalPrice: undefined }));
      setDiscountPercentage('');
      return;
    }

    if (discountPercentage && Number(discountPercentage) > 0) {
      const discount = Number(discountPercentage);
      const newPrice = Math.round(newOriginal * (1 - discount / 100));
      setFormData(prev => ({ ...prev, originalPrice: newOriginal, price: newPrice }));
    } else {
      setFormData(prev => ({ ...prev, originalPrice: newOriginal }));
      if (formData.price && formData.price < newOriginal) {
        const discount = Math.round(((newOriginal - formData.price) / newOriginal) * 100);
        setDiscountPercentage(discount.toString());
      } else {
        setDiscountPercentage('');
      }
    }
  };

  const handleDiscountChange = (val: string) => {
    setDiscountPercentage(val);
    const discount = Number(val);
    const original = formData.originalPrice;

    if (original && original > 0) {
      if (!val) {
        setFormData(prev => ({ ...prev, price: original }));
      } else {
        const newPrice = Math.round(original * (1 - discount / 100));
        setFormData(prev => ({ ...prev, price: newPrice }));
      }
    }
  };

  const handleFinalPriceChange = (val: string) => {
    const newPrice = Number(val);
    setFormData(prev => ({ ...prev, price: newPrice }));
    const original = formData.originalPrice;
    if (original && original > newPrice && original > 0) {
      const discount = Math.round(((original - newPrice) / original) * 100);
      setDiscountPercentage(discount.toString());
    } else {
      setDiscountPercentage('');
    }
  };

  const handleAddDetail = () => {
    if (newDetail.trim()) {
      setFormData(prev => ({
        ...prev,
        details: [...(prev.details || []), newDetail.trim()]
      }));
      setNewDetail('');
    }
  };

  const handleRemoveDetail = (index: number) => {
    setFormData(prev => ({
      ...prev,
      details: prev.details?.filter((_, i) => i !== index)
    }));
  };

  const handleAddColor = () => {
    if (newColor.trim()) {
      setFormData(prev => ({
        ...prev,
        colors: [...(prev.colors || []), newColor.trim()]
      }));
      setNewColor('');
    }
  };

  const handleRemoveColor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors?.filter((_, i) => i !== index)
    }));
  };

  const handleAddSize = () => {
    if (newSize.trim()) {
      const sizeToAdd = newSize.trim();
      if (!formData.availableSizes?.includes(sizeToAdd)) {
        setFormData(prev => ({
          ...prev,
          availableSizes: [...(prev.availableSizes || []), sizeToAdd]
        }));
      }
      setNewSize('');
    }
  };

  const handleRemoveSize = (index: number) => {
    setFormData(prev => ({
      ...prev,
      availableSizes: prev.availableSizes?.filter((_, i) => i !== index)
    }));
  };

  const addPresetSizes = (type: 'tops' | 'bottoms' | 'onesize') => {
    let presets: string[] = [];
    if (type === 'tops') presets = ['S', 'M', 'L', 'XL'];
    if (type === 'bottoms') presets = ['30', '32', '34', '36'];
    if (type === 'onesize') presets = ['One Size'];

    setFormData(prev => ({
      ...prev,
      availableSizes: Array.from(new Set([...(prev.availableSizes || []), ...presets]))
    }));
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (imageFile) {
      // Use FormData
      const data = new FormData();
      data.append('name', formData.name || '');
      data.append('price', String(formData.price || 0));
      if (formData.originalPrice) data.append('originalPrice', String(formData.originalPrice));
      data.append('category', formData.category || '');
      if (formData.collectionId) data.append('collectionId', formData.collectionId);
      data.append('description', formData.description || '');
      data.append('inStock', String(formData.inStock));
      data.append('isNew', String(formData.isNew));

      // Append JSON fields as strings
      data.append('details', JSON.stringify(formData.details || []));
      data.append('colors', JSON.stringify(formData.colors || []));
      data.append('availableSizes', JSON.stringify(formData.availableSizes || []));

      data.append('image', imageFile);

      if (productToEdit) {
        updateProduct(productToEdit.id, data); // Need to update context signature
      } else {
        addProduct(data as any);
      }
    } else {
      // JSON Fallback
      const productData: any = {
        ...formData,
        colors: formData.colors && formData.colors.length > 0 ? formData.colors : ['Black'],
        sizes: formData.availableSizes && formData.availableSizes.length > 0 ? formData.availableSizes : ['S', 'M', 'L', 'XL'],
        availableSizes: formData.availableSizes && formData.availableSizes.length > 0 ? formData.availableSizes : ['S', 'M', 'L', 'XL'],
        originalPrice: formData.originalPrice && formData.originalPrice > 0 ? formData.originalPrice : undefined,
      };

      // Remove image field if updating (don't send existing URL)
      if (productToEdit) {
        delete productData.image;
        delete productData.images;
        updateProduct(productData);
      } else {
        // For new products, we need image
        productData.images = formData.images || [formData.image || ''];
        addProduct(productData);
      }
    }
    onClose();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-12 md:pt-20 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-brand-black border border-brand-dark p-8 w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl"
          >
            <div className="flex justify-between items-center mb-8 border-b border-brand-dark pb-4">
              <h2 className="text-2xl font-black uppercase italic text-white">{productToEdit ? 'Edit Product' : 'New Product'}</h2>
              <button onClick={onClose} className="text-neutral-500 hover:text-white"><X size={24} /></button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-6">
              {/* Top Row: Name and Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase font-bold text-neutral-500 mb-2">Product Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-brand-dark/30 border border-brand-dark p-3 text-white focus:outline-none focus:border-brand-bone"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold text-neutral-500 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-brand-dark/30 border border-brand-dark p-3 text-white focus:outline-none focus:border-brand-bone"
                  >
                    {categories.filter(c => c !== 'All').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Collection */}
              <div>
                <label className="block text-xs uppercase font-bold text-neutral-500 mb-2">Collection</label>
                <select
                  value={formData.collectionId || ''}
                  onChange={e => setFormData({ ...formData, collectionId: e.target.value })}
                  className="w-full bg-brand-dark/30 border border-brand-dark p-3 text-white focus:outline-none focus:border-brand-bone"
                >
                  <option value="">Select Collection (Optional)</option>
                  {collections.map(col => (
                    <option key={col.id} value={col.id}>{col.title}</option>
                  ))}
                </select>
              </div>

              {/* Pricing Section - Redesigned */}
              <div className="bg-brand-dark/10 p-6 border border-brand-dark">
                <h3 className="text-white font-bold uppercase text-xs tracking-widest border-b border-brand-dark pb-2 mb-4 flex items-center gap-2">
                  <DollarSign size={14} /> Pricing & Discounts
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                  <div>
                    <label className="block text-xs uppercase font-bold text-neutral-500 mb-2">Original Price</label>
                    <input
                      type="number"
                      value={formData.originalPrice || ''}
                      onChange={e => handleOriginalPriceChange(e.target.value)}
                      className="w-full bg-brand-dark/30 border border-brand-dark p-3 text-white focus:outline-none focus:border-brand-bone"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-bold text-neutral-500 mb-2">Discount %</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={discountPercentage}
                        onChange={e => handleDiscountChange(e.target.value)}
                        className="w-full bg-brand-dark/30 border border-brand-dark p-3 text-white focus:outline-none focus:border-brand-bone pr-8"
                        placeholder="0"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"><Percent size={14} /></span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-bold text-neutral-500 mb-2">Sale Price (Final)</label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={e => handleFinalPriceChange(e.target.value)}
                      className="w-full bg-brand-dark/30 border border-brand-dark p-3 text-white font-bold focus:outline-none focus:border-brand-bone"
                    />
                  </div>
                </div>

                {/* Live Preview Summary */}
                {formData.originalPrice && formData.price! < formData.originalPrice && (
                  <div className="bg-brand-black border border-brand-dark p-4 flex items-center justify-between">
                    <div className="text-xs text-neutral-400">
                      <span className="line-through mr-2 opacity-60">{formatPrice(formData.originalPrice)}</span>
                      <span className="text-red-500 font-bold bg-red-500/10 px-2 py-1 border border-red-500/20">-{discountPercentage}% OFF</span>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase text-neutral-500 mb-1">Customer Pays</p>
                      <p className="text-xl font-black text-white">{formatPrice(formData.price!)}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Image Upload */}
              <ImageUpload
                image={formData.image}
                onImageChange={(base64, file) => {
                  setFormData({ ...formData, image: base64 });
                  if (file) setImageFile(file);
                }}
                label="Product Image"
              />

              <div>
                <label className="block text-xs uppercase font-bold text-neutral-500 mb-2">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-brand-dark/30 border border-brand-dark p-3 text-white focus:outline-none focus:border-brand-bone"
                ></textarea>
              </div>

              {/* Colors Management */}
              <div className="bg-brand-dark/10 p-4 border border-brand-dark">
                <label className="block text-xs uppercase font-bold text-neutral-500 mb-3 flex items-center gap-2">
                  <Palette size={14} /> Product Colors
                </label>

                <div className="flex flex-wrap gap-2 mb-4">
                  {(formData.colors || []).map((color, index) => (
                    <span key={index} className="bg-brand-dark border border-brand-dark px-3 py-1 text-xs text-white flex items-center gap-2 uppercase">
                      {color}
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(index)}
                        className="text-neutral-500 hover:text-red-500"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  {(!formData.colors || formData.colors.length === 0) && (
                    <p className="text-neutral-600 text-[10px] italic">No colors added.</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    placeholder="Add color (e.g. 'Black', 'Neon Green')"
                    className="flex-1 bg-brand-dark/30 border border-brand-dark p-2 text-white text-xs focus:outline-none focus:border-brand-bone"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddColor();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddColor}
                    disabled={!newColor.trim()}
                    className="bg-brand-bone text-brand-black px-4 text-xs font-bold uppercase disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Available Sizes Management */}
              <div className="bg-brand-dark/10 p-4 border border-brand-dark">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-xs uppercase font-bold text-neutral-500 flex items-center gap-2">
                    <Ruler size={14} /> Available Sizes
                  </label>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => addPresetSizes('tops')} className="text-[10px] uppercase font-bold text-brand-bone hover:text-white border border-brand-bone px-2 py-0.5">S-XL</button>
                    <button type="button" onClick={() => addPresetSizes('bottoms')} className="text-[10px] uppercase font-bold text-brand-bone hover:text-white border border-brand-bone px-2 py-0.5">30-36</button>
                    <button type="button" onClick={() => addPresetSizes('onesize')} className="text-[10px] uppercase font-bold text-brand-bone hover:text-white border border-brand-bone px-2 py-0.5">One Size</button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {(formData.availableSizes || []).map((size, index) => (
                    <span key={index} className="bg-brand-dark border border-brand-dark px-3 py-1 text-xs text-white flex items-center gap-2 uppercase font-bold">
                      {size}
                      <button
                        type="button"
                        onClick={() => handleRemoveSize(index)}
                        className="text-neutral-500 hover:text-red-500"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  {(!formData.availableSizes || formData.availableSizes.length === 0) && (
                    <p className="text-neutral-600 text-[10px] italic">No sizes added. (Product will show as Sold Out if empty)</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    placeholder="Add size (e.g. 'M', '32', 'One Size')"
                    className="flex-1 bg-brand-dark/30 border border-brand-dark p-2 text-white text-xs focus:outline-none focus:border-brand-bone"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSize();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddSize}
                    disabled={!newSize.trim()}
                    className="bg-brand-bone text-brand-black px-4 text-xs font-bold uppercase disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Details Management */}
              <div className="bg-brand-dark/10 p-4 border border-brand-dark">
                <label className="block text-xs uppercase font-bold text-neutral-500 mb-3 flex items-center gap-2">
                  <List size={14} /> Product Details (Bullet Points)
                </label>

                <div className="space-y-2 mb-4">
                  {(formData.details || []).map((detail, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={detail}
                        readOnly
                        className="flex-1 bg-brand-dark/30 border border-brand-dark p-2 text-white text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveDetail(index)}
                        className="bg-red-500/20 text-red-500 p-2 hover:bg-red-500 hover:text-white transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {(!formData.details || formData.details.length === 0) && (
                    <p className="text-neutral-600 text-[10px] italic">No details added yet.</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newDetail}
                    onChange={(e) => setNewDetail(e.target.value)}
                    placeholder="Add a new bullet point (e.g. '100% Cotton')"
                    className="flex-1 bg-brand-dark/30 border border-brand-dark p-2 text-white text-xs focus:outline-none focus:border-brand-bone"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddDetail();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddDetail}
                    disabled={!newDetail.trim()}
                    className="bg-brand-bone text-brand-black px-4 text-xs font-bold uppercase disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-white text-sm font-bold uppercase cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={e => setFormData({ ...formData, inStock: e.target.checked })}
                    className="w-4 h-4 accent-brand-bone"
                  />
                  In Stock
                </label>
                <label className="flex items-center gap-2 text-white text-sm font-bold uppercase cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isNew}
                    onChange={e => setFormData({ ...formData, isNew: e.target.checked })}
                    className="w-4 h-4 accent-brand-bone"
                  />
                  Mark as New
                </label>
              </div>

              <button type="submit" className="w-full bg-brand-bone text-brand-black py-4 font-black uppercase tracking-widest hover:bg-white transition-colors">
                {productToEdit ? 'Update Product' : 'Create Product'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
