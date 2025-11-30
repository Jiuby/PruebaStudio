
import React, { useState } from 'react';
import { Product } from '../../../types';
import { useShop } from '../../../context/ShopContext';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useShop();
  // If product.availableSizes is set, pick the first one as default, otherwise default to 'M'
  const defaultSize = product.availableSizes && product.availableSizes.length > 0
    ? product.availableSizes[0]
    : 'M';

  const defaultColor = product.colors && product.colors.length > 0
    ? product.colors[0]
    : 'Black';

  const [selectedSize, setSelectedSize] = useState<string>(defaultSize);
  const [selectedColor] = useState<string>(defaultColor);
  const sizes = product.availableSizes && product.availableSizes.length > 0 ? product.availableSizes : ['S', 'M', 'L', 'XL'];
  const inStock = product.inStock !== false; // Default to true if undefined
  const isSale = product.originalPrice && product.originalPrice > product.price;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedSize, selectedColor);
  };

  const isSizeAvailable = (size: string) => {
    if (!product.availableSizes) return true; // If not specified, all valid
    return product.availableSizes.includes(size);
  };

  return (
    <Link to={`/product/${product.id}`} className="group relative flex flex-col block cursor-pointer">
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-brand-dark">
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0 ${!inStock ? 'opacity-50' : ''}`}
        />

        {/* New Badge */}
        {product.isNew && inStock && (
          <div className="absolute top-2 left-2 bg-brand-bone text-brand-black text-[10px] font-bold px-2 py-1 uppercase tracking-widest z-10">
            New Drop
          </div>
        )}

        {/* Sale Badge */}
        {isSale && inStock && (
          <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest z-10">
            SALE
          </div>
        )}

        {/* Sold Out Badge */}
        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20">
            <div className="bg-brand-black border border-white text-white text-xs font-bold px-4 py-2 uppercase tracking-[0.2em] transform -rotate-12">
              Sold Out
            </div>
          </div>
        )}

        {/* Quick Add Overlay */}
        {inStock && (
          <div className="absolute bottom-0 left-0 w-full bg-brand-black/90 backdrop-blur-sm p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs uppercase text-neutral-400">Select Size</span>
            </div>
            <div className="flex gap-2 mb-3">
              {sizes.map(size => {
                const available = isSizeAvailable(size);
                return (
                  <button
                    key={size}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (available) setSelectedSize(size);
                    }}
                    disabled={!available}
                    className={`w-8 h-8 flex items-center justify-center text-xs border transition-colors relative ${selectedSize === size && available
                      ? 'bg-brand-bone border-brand-bone text-brand-black'
                      : available
                        ? 'border-neutral-700 text-neutral-400 hover:border-white'
                        : 'border-neutral-800 text-neutral-700 cursor-not-allowed opacity-50'
                      }`}
                  >
                    {size}
                    {!available && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-px bg-neutral-600 transform -rotate-45"></div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            <button
              onClick={handleAddToCart}
              className="w-full bg-white text-black py-2 font-bold uppercase text-xs tracking-widest hover:bg-brand-bone transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={14} /> Add to Cart
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-1">
        <div className="flex justify-between items-start">
          <h3 className={`font-bold text-sm uppercase tracking-wide leading-tight max-w-[65%] transition-colors ${inStock ? 'text-white group-hover:text-brand-bone' : 'text-neutral-500'}`}>
            {product.name}
          </h3>
          <div className="flex flex-col items-end">
            {isSale && (
              <span className="text-xs text-neutral-500 line-through">
                {formatPrice(product.originalPrice!)}
              </span>
            )}
            <span className={`font-medium text-sm ${inStock ? (isSale ? 'text-red-500' : 'text-brand-bone') : 'text-neutral-600 line-through'}`}>
              {formatPrice(product.price)}
            </span>
          </div>
        </div>
        <p className="text-neutral-500 text-xs">{product.category}</p>
      </div>
    </Link>
  );
};