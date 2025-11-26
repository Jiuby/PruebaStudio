import React, { useState } from 'react';
import { Product } from '../../types';
import { useShop } from '../../context/ShopContext';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useShop();
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const sizes = ['S', 'M', 'L', 'XL'];

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
    addToCart(product, selectedSize);
  };

  return (
    <Link to={`/product/${product.id}`} className="group relative flex flex-col block cursor-pointer">
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-brand-dark">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
        />

        {product.isNew && (
          <div className="absolute top-2 left-2 bg-brand-bone text-brand-black text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
            New Drop
          </div>
        )}

        {/* Quick Add Overlay */}
        <div className="absolute bottom-0 left-0 w-full bg-brand-black/90 backdrop-blur-sm p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs uppercase text-neutral-400">Select Size</span>
          </div>
          <div className="flex gap-2 mb-3">
            {sizes.map(size => (
              <button
                key={size}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedSize(size);
                }}
                className={`w-8 h-8 flex items-center justify-center text-xs border ${selectedSize === size
                    ? 'bg-brand-bone border-brand-bone text-brand-black'
                    : 'border-neutral-700 text-neutral-400 hover:border-white'
                  }`}
              >
                {size}
              </button>
            ))}
          </div>
          <button
            onClick={handleAddToCart}
            className="w-full bg-white text-black py-2 font-bold uppercase text-xs tracking-widest hover:bg-brand-bone transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={14} /> Add to Cart
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-1">
        <div className="flex justify-between items-start">
          <h3 className="text-white font-bold text-sm uppercase tracking-wide leading-tight max-w-[70%] group-hover:text-brand-bone transition-colors">
            {product.name}
          </h3>
          <span className="text-brand-bone font-medium text-sm">{formatPrice(product.price)}</span>
        </div>
        <p className="text-neutral-500 text-xs">{product.category}</p>
      </div>
    </Link>
  );
};
