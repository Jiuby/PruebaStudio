
import React, { useState, useEffect } from 'react';
import { Filter, Plus, ChevronLeft, ChevronRight, Edit2, Trash2, Check, X, Layers } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
import { Product } from '../../../types';
import { ProductModal } from './ProductModal';
import { CategoryModal } from './CategoryModal';

interface ProductsTabProps {
  autoOpenModal?: boolean;
  onAutoOpenConsumed?: () => void;
}

export const ProductsTab: React.FC<ProductsTabProps> = ({ autoOpenModal, onAutoOpenConsumed }) => {
  const { products, deleteProduct, categories, patchProduct } = useShop();

  const [productFilterCategory, setProductFilterCategory] = useState('All');
  const [productCurrentPage, setProductCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (autoOpenModal) {
      setEditingProduct(null);
      setIsProductModalOpen(true);
      if (onAutoOpenConsumed) {
        onAutoOpenConsumed();
      }
    }
  }, [autoOpenModal, onAutoOpenConsumed]);

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      deleteProduct(id);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Filter & Pagination
  const filteredProducts = products.filter(p =>
    productFilterCategory === 'All' ? true : p.category === productFilterCategory
  );
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (productCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (p: number) => {
    if (p >= 1 && p <= totalPages) {
      setProductCurrentPage(p);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black uppercase italic text-white mb-2">Gestión de Productos</h2>
          <p className="text-neutral-500 text-xs uppercase tracking-widest">{filteredProducts.length} Productos Encontrados</p>
        </div>

        <div className="flex gap-4">
          {/* Category Filter */}
          <div className="relative">
            <select
              value={productFilterCategory}
              onChange={(e) => { setProductFilterCategory(e.target.value); setProductCurrentPage(1); }}
              className="bg-brand-dark/30 border border-brand-dark text-white text-xs font-bold uppercase p-3 pr-8 focus:outline-none focus:border-brand-bone appearance-none cursor-pointer min-w-[150px] h-full"
            >
              <option value="All">Todas las Categorías</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">
              <Filter size={14} />
            </div>
          </div>

          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="bg-brand-dark border border-brand-dark text-white px-4 py-3 font-bold uppercase tracking-widest text-xs hover:bg-brand-dark/50 transition-colors flex items-center gap-2"
          >
            <Layers size={16} /> Categorías
          </button>

          <button
            onClick={() => {
              setEditingProduct(null);
              setIsProductModalOpen(true);
            }}
            className="bg-brand-bone text-brand-black px-6 py-3 font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors flex items-center gap-2"
          >
            <Plus size={16} /> Agregar Producto
          </button>
        </div>
      </div>

      <div className="bg-brand-dark/10 border border-brand-dark p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-dark text-neutral-500 text-xs font-bold uppercase tracking-widest">
                <th className="pb-4 pl-4">Producto</th>
                <th className="pb-4">Categoría</th>
                <th className="pb-4">Estado</th>
                <th className="pb-4">Precio</th>
                <th className="pb-4">Stock</th>
                <th className="pb-4 pr-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neutral-500 uppercase tracking-widest text-sm">
                    No se encontraron productos en esta categoría
                  </td>
                </tr>
              ) : (
                paginatedProducts.map(product => (
                  <tr key={product.id} className="border-b border-brand-dark/50 hover:bg-brand-dark/20 transition-colors">
                    <td className="py-4 pl-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-16 bg-brand-dark flex-shrink-0">
                          <img src={product.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm uppercase">{product.name}</p>
                          <p className="text-[10px] text-neutral-500 uppercase">ID: {product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-neutral-400 text-sm uppercase">{product.category}</td>
                    <td className="py-4">
                      <div className="flex flex-col gap-2 items-start">
                        <button
                          onClick={() => patchProduct(product.id, { isNew: !product.isNew })}
                          className={`text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider border transition-colors ${product.isNew
                            ? 'bg-brand-bone text-brand-black border-brand-bone hover:bg-transparent hover:text-brand-bone'
                            : 'bg-transparent text-neutral-500 border-neutral-700 hover:border-brand-bone hover:text-brand-bone'
                            }`}
                        >
                          Nuevo
                        </button>
                        <button
                          onClick={() => patchProduct(product.id, { isOneOfOne: !product.isOneOfOne })}
                          className={`text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider border transition-colors ${product.isOneOfOne
                            ? 'bg-purple-600 text-white border-purple-600 hover:bg-transparent hover:text-purple-500'
                            : 'bg-transparent text-neutral-500 border-neutral-700 hover:border-purple-500 hover:text-purple-500'
                            }`}
                        >
                          1/1
                        </button>
                      </div>
                    </td>
                    <td className="py-4 text-white text-sm font-bold">
                      {product.originalPrice && product.originalPrice > product.price ? (
                        <div className="flex flex-col">
                          <span className="text-red-500">{formatPrice(product.price)}</span>
                          <span className="text-[10px] text-neutral-500 line-through">{formatPrice(product.originalPrice)}</span>
                        </div>
                      ) : (
                        formatPrice(product.price)
                      )}
                    </td>
                    <td className="py-4">
                      {product.inStock ? (
                        <span className="text-green-500 text-[10px] font-bold uppercase flex items-center gap-1"><Check size={12} /> En Stock</span>
                      ) : (
                        <span className="text-red-500 text-[10px] font-bold uppercase flex items-center gap-1"><X size={12} /> Agotado</span>
                      )}
                    </td>
                    <td className="py-4 pr-4 text-right">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="p-2 text-neutral-400 hover:text-brand-bone transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6 border-t border-brand-dark pt-6">
            <button
              onClick={() => handlePageChange(productCurrentPage - 1)}
              disabled={productCurrentPage === 1}
              className="w-10 h-10 flex items-center justify-center border border-brand-dark text-white hover:border-brand-bone disabled:opacity-30 disabled:hover:border-brand-dark transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-bold text-neutral-500 uppercase">
              Página {productCurrentPage} de {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(productCurrentPage + 1)}
              disabled={productCurrentPage === totalPages}
              className="w-10 h-10 flex items-center justify-center border border-brand-dark text-white hover:border-brand-bone disabled:opacity-30 disabled:hover:border-brand-dark transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        productToEdit={editingProduct}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />
    </div>
  );
};
