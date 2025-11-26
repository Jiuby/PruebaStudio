import React, { useState, useMemo, useEffect } from 'react';
import { ProductCard } from '../../components/ui/ProductCard';
import { PRODUCTS, CATEGORIES } from '../../constants';
import { SortOption } from '../../types';
import { Filter, X, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const PRICE_RANGES = [
  { label: 'All Prices', value: 'all' },
  { label: 'Under $50,000', value: 'under-50' },
  { label: '$50,000 - $100,000', value: '50-100' },
  { label: 'Over $100,000', value: 'over-100' }
];

const COLORS = [
  { label: 'Black', value: 'Black', hex: '#000000' },
  { label: 'White', value: 'White', hex: '#ffffff' },
  { label: 'Grey', value: 'Grey', hex: '#6b7280' },
  { label: 'Blue', value: 'Blue', hex: '#1e3a8a' },
  { label: 'Green', value: 'Green', hex: '#14532d' },
  { label: 'Silver', value: 'Silver', hex: '#d1d5db' }
];

const SIZES = ['S', 'M', 'L', 'XL', 'One Size'];

const ITEMS_PER_PAGE = 9;

export const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedPrice, setSelectedPrice] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Sync state if URL param changes (e.g. back button navigation)
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory('All');
    }
  }, [searchParams]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedPrice, selectedColor, selectedSize, sortBy]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    // Update URL without reloading page
    if (category === 'All') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category });
    }
  };

  const clearFilters = () => {
    handleCategoryChange('All');
    setSelectedPrice('all');
    setSelectedColor('all');
    setSelectedSize('all');
    setSortBy('featured');
    setShowMobileFilters(false);
  };

  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    // Category Filter
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Price Filter
    if (selectedPrice !== 'all') {
      result = result.filter(p => {
        if (selectedPrice === 'under-50') return p.price < 50000;
        if (selectedPrice === '50-100') return p.price >= 50000 && p.price <= 100000;
        if (selectedPrice === 'over-100') return p.price > 100000;
        return true;
      });
    }

    // Color Filter
    if (selectedColor !== 'all') {
      result = result.filter(p => p.colors?.includes(selectedColor));
    }

    // Size Filter
    if (selectedSize !== 'all') {
      result = result.filter(p => p.sizes?.includes(selectedSize));
    }

    // Sort
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
  }, [selectedCategory, selectedPrice, selectedColor, selectedSize, sortBy]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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
          <div className="hidden lg:block w-64 flex-shrink-0 sticky top-32 h-fit space-y-10">
            {/* Category */}
            <div>
              <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-6 border-b border-brand-dark pb-2">Categories</h3>
              <div className="space-y-3">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`block text-sm uppercase font-bold tracking-wide transition-all duration-300 ${selectedCategory === cat
                        ? 'text-brand-bone translate-x-2'
                        : 'text-neutral-500 hover:text-white'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-6 border-b border-brand-dark pb-2">Price</h3>
              <div className="space-y-3">
                {PRICE_RANGES.map(range => (
                  <button
                    key={range.value}
                    onClick={() => setSelectedPrice(range.value)}
                    className={`flex items-center gap-3 text-sm uppercase font-bold tracking-wide transition-colors ${selectedPrice === range.value ? 'text-brand-bone' : 'text-neutral-500 hover:text-white'
                      }`}
                  >
                    <div className={`w-3 h-3 rounded-full border ${selectedPrice === range.value ? 'border-brand-bone bg-brand-bone' : 'border-neutral-600'}`}></div>
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div>
              <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-6 border-b border-brand-dark pb-2">Size</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedSize('all')}
                  className={`px-3 py-2 text-xs font-bold uppercase border transition-colors ${selectedSize === 'all'
                      ? 'bg-brand-bone text-brand-black border-brand-bone'
                      : 'text-neutral-500 border-neutral-800 hover:border-white'
                    }`}
                >
                  All
                </button>
                {SIZES.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-2 text-xs font-bold uppercase border transition-colors ${selectedSize === size
                        ? 'bg-brand-bone text-brand-black border-brand-bone'
                        : 'text-neutral-500 border-neutral-800 hover:border-white'
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div>
              <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-6 border-b border-brand-dark pb-2">Color</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setSelectedColor('all')}
                  className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${selectedColor === 'all' ? 'border-brand-bone text-brand-bone' : 'border-neutral-700 text-neutral-500'
                    }`}
                  title="All Colors"
                >
                  <span className="text-[10px] font-bold">ALL</span>
                </button>
                {COLORS.map(color => (
                  <button
                    key={color.value}
                    onClick={() => setSelectedColor(color.value)}
                    className={`w-8 h-8 rounded-full border relative flex items-center justify-center transition-transform hover:scale-110 ${selectedColor === color.value ? 'border-brand-bone scale-110 ring-1 ring-brand-bone ring-offset-2 ring-offset-black' : 'border-transparent'
                      }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.label}
                  >
                    {selectedColor === color.value && color.value === 'White' && <Check size={14} className="text-black" />}
                    {selectedColor === color.value && color.value !== 'White' && <Check size={14} className="text-white" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
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

            {/* Clear Filters */}
            <button
              onClick={clearFilters}
              className="text-xs text-neutral-500 hover:text-red-500 uppercase tracking-widest underline decoration-dashed underline-offset-4"
            >
              Clear All Filters
            </button>
          </div>

          {/* Mobile Filters Bar */}
          <div className="lg:hidden flex justify-between items-center mb-6">
            <button
              onClick={() => setShowMobileFilters(true)}
              className="flex items-center gap-2 text-white font-bold uppercase text-xs tracking-widest border border-brand-dark px-4 py-3"
            >
              <Filter size={14} /> Filter & Sort
            </button>
            <span className="text-brand-bone font-bold uppercase text-xs">
              {filteredProducts.length} Results
            </span>
          </div>

          {/* Mobile Filter Drawer */}
          {showMobileFilters && (
            <div className="fixed inset-0 z-50 bg-brand-black flex flex-col p-6 animate-fade-in">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black uppercase italic text-white">Filters</h2>
                <button onClick={() => setShowMobileFilters(false)} className="text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-8 flex-1 overflow-y-auto pr-2">
                {/* Category */}
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

                {/* Price */}
                <div>
                  <h3 className="text-brand-bone font-bold uppercase tracking-widest text-xs mb-4">Price</h3>
                  <div className="space-y-3">
                    {PRICE_RANGES.map(range => (
                      <button
                        key={range.value}
                        onClick={() => setSelectedPrice(range.value)}
                        className={`block w-full text-left p-3 text-xs font-bold uppercase border ${selectedPrice === range.value
                            ? 'bg-brand-bone text-brand-black border-brand-bone'
                            : 'text-neutral-400 border-brand-dark'
                          }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size */}
                <div>
                  <h3 className="text-brand-bone font-bold uppercase tracking-widest text-xs mb-4">Size</h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedSize('all')}
                      className={`px-4 py-3 text-xs font-bold uppercase border ${selectedSize === 'all'
                          ? 'bg-brand-bone text-brand-black border-brand-bone'
                          : 'text-neutral-400 border-brand-dark'
                        }`}
                    >
                      All
                    </button>
                    {SIZES.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-3 text-xs font-bold uppercase border ${selectedSize === size
                            ? 'bg-brand-bone text-brand-black border-brand-bone'
                            : 'text-neutral-400 border-brand-dark'
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color */}
                <div>
                  <h3 className="text-brand-bone font-bold uppercase tracking-widest text-xs mb-4">Color</h3>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setSelectedColor('all')}
                      className={`w-10 h-10 rounded-full border flex items-center justify-center ${selectedColor === 'all' ? 'border-brand-bone text-brand-bone' : 'border-neutral-700 text-neutral-500'
                        }`}
                    >
                      <span className="text-[10px] font-bold">ALL</span>
                    </button>
                    {COLORS.map(color => (
                      <button
                        key={color.value}
                        onClick={() => setSelectedColor(color.value)}
                        className={`w-10 h-10 rounded-full border flex items-center justify-center ${selectedColor === color.value ? 'border-brand-bone ring-1 ring-brand-bone ring-offset-2 ring-offset-black' : 'border-transparent'
                          }`}
                        style={{ backgroundColor: color.hex }}
                      >
                        {selectedColor === color.value && color.value === 'White' && <Check size={16} className="text-black" />}
                        {selectedColor === color.value && color.value !== 'White' && <Check size={16} className="text-white" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort */}
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
                        onClick={() => setSortBy(opt.value as SortOption)}
                        className={`block w-full text-left p-3 text-xs font-bold uppercase border ${sortBy === opt.value
                            ? 'bg-brand-bone text-brand-black border-brand-bone'
                            : 'text-neutral-400 border-brand-dark'
                          }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-4">
                <button
                  onClick={clearFilters}
                  className="flex-1 py-4 border border-brand-dark text-white font-bold uppercase tracking-widest hover:bg-brand-dark transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="flex-[2] bg-white text-black py-4 font-bold uppercase tracking-widest"
                >
                  View {filteredProducts.length} Results
                </button>
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-12">
              {paginatedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-20 border border-dashed border-brand-dark bg-brand-dark/10">
                <p className="text-neutral-500 uppercase tracking-widest mb-4">No products found matching your filters.</p>
                <button
                  onClick={clearFilters}
                  className="text-brand-bone underline uppercase text-xs font-bold hover:text-white transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Pagination Controls */}
            {filteredProducts.length > 0 && totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-16 border-t border-brand-dark pt-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-10 h-10 flex items-center justify-center border border-brand-dark text-white hover:border-brand-bone disabled:opacity-30 disabled:hover:border-brand-dark transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 flex items-center justify-center text-sm font-bold border transition-colors ${currentPage === page
                        ? 'bg-brand-bone text-brand-black border-brand-bone'
                        : 'text-neutral-500 border-brand-dark hover:text-white hover:border-white'
                      }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 flex items-center justify-center border border-brand-dark text-white hover:border-brand-bone disabled:opacity-30 disabled:hover:border-brand-dark transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};