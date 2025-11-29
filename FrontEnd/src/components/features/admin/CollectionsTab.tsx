
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Package } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
import { Collection } from '../../../types';
import { CollectionModal } from './CollectionModal';
import { CollectionProductsModal } from './CollectionProductsModal';

export const CollectionsTab: React.FC = () => {
  const { collections, deleteCollection } = useShop();

  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [isProductManagerOpen, setIsProductManagerOpen] = useState(false);

  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [selectedCollectionForProducts, setSelectedCollectionForProducts] = useState<Collection | null>(null);

  const handleEditCollection = (collection: Collection) => {
    setEditingCollection(collection);
    setIsCollectionModalOpen(true);
  };

  const handleManageProducts = (collection: Collection) => {
    setSelectedCollectionForProducts(collection);
    setIsProductManagerOpen(true);
  };

  const handleDeleteCollection = (id: string) => {
    if (window.confirm('Are you sure you want to delete this collection?')) {
      deleteCollection(id);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black uppercase italic text-white">Collections</h2>
        <button
          onClick={() => { setEditingCollection(null); setIsCollectionModalOpen(true); }}
          className="bg-brand-bone text-brand-black px-6 py-3 font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors flex items-center gap-2"
        >
          <Plus size={16} /> Add Collection
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {collections.map((collection) => (
          <div key={collection.id} className="bg-brand-dark/20 border border-brand-dark overflow-hidden group">
            <div className="relative aspect-video">
              <img src={collection.image} alt={collection.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button
                  onClick={() => handleManageProducts(collection)}
                  className="bg-brand-bone text-brand-black p-3 rounded-full hover:bg-white transition-colors"
                  title="Manage Products"
                >
                  <Package size={20} />
                </button>
                <button
                  onClick={() => handleEditCollection(collection)}
                  className="bg-white text-black p-3 rounded-full hover:bg-gray-200 transition-colors"
                  title="Edit Details"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => handleDeleteCollection(collection.id)}
                  className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              <div className="absolute bottom-4 left-4">
                <span className="bg-brand-black/80 text-brand-bone text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                  {collection.category ? collection.category : 'Mixed Collection'}
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-black uppercase italic text-white">{collection.title}</h3>
                <span className="text-[10px] uppercase text-neutral-500 border border-brand-dark px-2 py-1 rounded">
                  {collection.size}
                </span>
              </div>
              <p className="text-neutral-500 text-sm uppercase tracking-wide">{collection.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      <CollectionModal
        isOpen={isCollectionModalOpen}
        onClose={() => setIsCollectionModalOpen(false)}
        collectionToEdit={editingCollection}
      />

      <CollectionProductsModal
        isOpen={isProductManagerOpen}
        onClose={() => setIsProductManagerOpen(false)}
        collection={selectedCollectionForProducts}
      />
    </div>
  );
};
