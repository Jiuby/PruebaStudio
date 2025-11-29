
import React, { useState } from 'react';
import { Save, X, Edit2, Trash2 } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';

export const CategoriesTab: React.FC = () => {
  const { categories, addCategory, editCategory, deleteCategory } = useShop();

  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [tempCategoryName, setTempCategoryName] = useState('');

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.trim()) {
      addCategory(newCategory.trim());
      setNewCategory('');
    }
  };

  const handleStartEditCategory = (cat: string) => {
    setEditingCategory(cat);
    setTempCategoryName(cat);
  };

  const handleSaveCategoryEdit = () => {
    if (editingCategory && tempCategoryName.trim() && tempCategoryName !== editingCategory) {
      editCategory(editingCategory, tempCategoryName.trim());
    }
    setEditingCategory(null);
    setTempCategoryName('');
  };

  const handleDeleteCategory = (cat: string) => {
    if (cat === 'All') return;
    if (window.confirm(`Are you sure you want to delete category "${cat}"? Products in this category may need to be updated.`)) {
      deleteCategory(cat);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-3xl font-black uppercase italic text-white">Category Management</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Add Category Form */}
        <div className="bg-brand-dark/20 border border-brand-dark p-6 h-fit">
          <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-6">Add New Category</h3>
          <form onSubmit={handleAddCategory} className="flex gap-4">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="CATEGORY NAME"
              className="flex-1 bg-brand-dark/30 border border-brand-dark p-3 text-white focus:outline-none focus:border-brand-bone uppercase"
            />
            <button
              type="submit"
              disabled={!newCategory.trim()}
              className="bg-brand-bone text-brand-black px-6 font-bold uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50"
            >
              Add
            </button>
          </form>
        </div>

        {/* Category List */}
        <div className="bg-brand-dark/10 border border-brand-dark p-6">
          <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-6">Existing Categories</h3>
          <div className="space-y-2">
            {categories.map((cat) => (
              <div key={cat} className="flex justify-between items-center border-b border-brand-dark/50 py-3">
                {editingCategory === cat ? (
                  <div className="flex-1 flex gap-2 mr-4">
                    <input
                      type="text"
                      value={tempCategoryName}
                      onChange={(e) => setTempCategoryName(e.target.value)}
                      className="flex-1 bg-brand-dark/50 border border-brand-dark p-1 text-white text-sm uppercase focus:outline-none focus:border-brand-bone"
                      autoFocus
                    />
                    <button onClick={handleSaveCategoryEdit} className="text-green-500 hover:text-green-400 p-1"><Save size={16} /></button>
                    <button onClick={() => setEditingCategory(null)} className="text-red-500 hover:text-red-400 p-1"><X size={16} /></button>
                  </div>
                ) : (
                  <span className="text-white font-bold uppercase text-sm">{cat}</span>
                )}

                {cat !== 'All' && !editingCategory && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStartEditCategory(cat)}
                      className="text-neutral-500 hover:text-brand-bone transition-colors"
                      title="Edit Name"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat)}
                      className="text-neutral-500 hover:text-red-500 transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
