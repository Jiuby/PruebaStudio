import React, { useState, useMemo, useEffect } from 'react';
import { ProductCard } from '../../components/ui/ProductCard';
import { PRODUCTS, CATEGORIES } from '../../constants';
import { SortOption } from '../../types';
import { Filter, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sync state if URL param changes (e.g. back button navigation)
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory('All');
    }
  }, [searchParams]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    // Update URL without reloading page
    if (category === 'All') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category });
    }
    setShowMobileFilters(false);
  };

  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }
    return result;
  }, [selectedCategory, sortBy]);

  return (
    <div className="bg-brand-black min-h-screen pt-24 pb-20 px-4 md:px-8">
      <div className="container mx-auto">

        {/* Header */}
        <div className="mb-12 border-b border-brand-dark pb-8">
          <h1 className="text-5xl md:text-7xl font-black uppercase text-white italic tracking-tighter mb-4">
            Shop All
          </h1>
          <p className="text-neutral-500 uppercase tracking-widest text-xs">
            {filteredProducts.length} Products Available
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* Sidebar Filters (Desktop) */}
          <div className="hidden lg:block w-64 flex-shrink-0 sticky top-32 h-fit">
            <div className="mb-8">
              <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-6 border-b border-brand-dark pb-2">Categories</h3>
              <div className="space-y-3">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`block text-sm uppercase font-bold tracking-wide transition-colors ${selectedCategory === cat
                        ? 'text-brand-bone translate-x-2'
                        : 'text-neutral-500 hover:text-white'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-6 border-b border-brand-dark pb-2">Sort By</h3>
              <div className="space-y-3">
                {[
                  { label: 'Featured', value: 'featured' },
                  { label: 'Price: Low to High', value: 'price-asc' },
                  { label: 'Price: High to Low', value: 'price-desc' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setSortBy(opt.value as SortOption)}
                    className={`block text-sm uppercase font-bold tracking-wide transition-colors text-left ${sortBy === opt.value
                        ? 'text-brand-bone'
                        : 'text-neutral-500 hover:text-white'
                      }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Filters Bar */}
          <div className="lg:hidden flex justify-between items-center mb-6">
            <button
              onClick={() => setShowMobileFilters(true)}
              className="flex items-center gap-2 text-white font-bold uppercase text-xs tracking-widest border border-brand-dark px-4 py-3"
            >
              <Filter size={14} /> Filter & Sort
            </button>
            <span className="text-brand-bone font-bold uppercase text-xs">{selectedCategory}</span>
          </div>

          {/* Mobile Filter Drawer */}
          {showMobileFilters && (
            <div className="fixed inset-0 z-50 bg-brand-black flex flex-col p-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black uppercase italic text-white">Filters</h2>
                <button onClick={() => setShowMobileFilters(false)} className="text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-8 flex-1 overflow-y-auto">
                <div>
                  <h3 className="text-brand-bone font-bold uppercase tracking-widest text-xs mb-4">Category</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => handleCategoryChange(cat)}
                        className={`p-3 text-xs font-bold uppercase border ${selectedCategory === cat
                            ? 'bg-brand-bone text-brand-black border-brand-bone'
                            : 'text-neutral-400 border-brand-dark'
                          }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-brand-bone font-bold uppercase tracking-widest text-xs mb-4">Sort</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Featured', value: 'featured' },
                      { label: 'Price: Low to High', value: 'price-asc' },
                      { label: 'Price: High to Low', value: 'price-desc' },
                    ].map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => { setSortBy(opt.value as SortOption); setShowMobileFilters(false); }}
                        className={`block w-full text-left p-2 text-sm uppercase font-bold ${sortBy === opt.value ? 'text-white' : 'text-neutral-500'
                          }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full bg-white text-black py-4 font-bold uppercase tracking-widest mt-4"
              >
                View Results
              </button>
            </div>
          )}

          {/* Product Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-12">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-20 border border-dashed border-brand-dark">
                <p className="text-neutral-500 uppercase tracking-widest">No products found.</p>
                <button
                  onClick={() => handleCategoryChange('All')}
                  className="mt-4 text-brand-bone underline uppercase text-xs font-bold"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};