import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Edit2, Check } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
import { ImageUpload } from './ImageUpload';

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose }) => {
    const { categories, addCategory, editCategory, deleteCategory } = useShop();
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingCategory, setEditingCategory] = useState<string | null>(null);
    const [editName, setEditName] = useState('');

    const handleAddCategory = () => {
        if (newCategoryName.trim()) {
            addCategory(newCategoryName.trim());
            setNewCategoryName('');
        }
    };

    const handleStartEdit = (category: string) => {
        setEditingCategory(category);
        setEditName(category);
    };

    const handleSaveEdit = () => {
        if (editingCategory && editName.trim()) {
            editCategory(editingCategory, editName.trim());
            setEditingCategory(null);
            setEditName('');
        }
    };

    const handleDelete = (category: string) => {
        if (window.confirm(`Delete category "${category}"?`)) {
            deleteCategory(category);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 bg-black/80 backdrop-blur-sm overflow-y-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-brand-black border border-brand-dark p-8 w-full max-w-lg shadow-2xl mb-20"
                    >
                        <div className="flex justify-between items-center mb-8 border-b border-brand-dark pb-4">
                            <h2 className="text-2xl font-black uppercase italic text-white">Manage Categories</h2>
                            <button onClick={onClose} className="text-neutral-500 hover:text-white"><X size={24} /></button>
                        </div>

                        <div className="space-y-6">
                            {/* Add New Category */}
                            <div className="bg-brand-dark/20 p-4 border border-brand-dark">
                                <label className="block text-xs uppercase font-bold text-neutral-500 mb-2">Add New Category</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                        placeholder="e.g. HOODIES"
                                        className="flex-1 bg-brand-dark/30 border border-brand-dark p-3 text-white focus:outline-none focus:border-brand-bone"
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                                    />
                                    <button
                                        onClick={handleAddCategory}
                                        disabled={!newCategoryName.trim()}
                                        className="bg-brand-bone text-brand-black px-4 font-bold uppercase disabled:opacity-50 hover:bg-white transition-colors"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* List Categories */}
                            <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                                {categories.filter(c => c !== 'All').map((category) => (
                                    <div key={category} className="bg-brand-dark/10 border border-brand-dark p-3 flex items-center justify-between group hover:bg-brand-dark/20 transition-colors">
                                        {editingCategory === category ? (
                                            <div className="flex-1 flex gap-2 mr-2">
                                                <input
                                                    type="text"
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                    className="flex-1 bg-brand-black border border-brand-dark p-2 text-white text-sm focus:outline-none focus:border-brand-bone"
                                                    autoFocus
                                                    onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                                                />
                                                <button onClick={handleSaveEdit} className="text-green-500 hover:text-green-400 p-2"><Check size={16} /></button>
                                                <button onClick={() => setEditingCategory(null)} className="text-red-500 hover:text-red-400 p-2"><X size={16} /></button>
                                            </div>
                                        ) : (
                                            <>
                                                <span className="text-white font-bold uppercase text-sm">{category}</span>
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleStartEdit(category)}
                                                        className="text-neutral-500 hover:text-brand-bone p-2"
                                                        title="Edit"
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(category)}
                                                        className="text-neutral-500 hover:text-red-500 p-2"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                                {categories.length <= 1 && (
                                    <p className="text-neutral-500 text-center text-xs italic py-4">No categories found.</p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
