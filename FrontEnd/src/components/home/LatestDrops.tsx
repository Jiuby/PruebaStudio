import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../ui/ProductCard';
import { useShop } from '../../context/ShopContext';

export const LatestDrops: React.FC = () => {
  const { products } = useShop();
  // Show first 4 items as "Latest"
  const latestProducts = products.slice(0, 4);

  return (
    <section className="bg-brand-black py-20 px-4 md:px-8 border-b border-brand-dark">
      <div className="container mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl md:text-6xl font-black uppercase text-white italic tracking-tighter mb-2">
              Latest Drops
            </h2>
            <p className="text-neutral-500 uppercase tracking-widest text-xs">
              Fresh from the lab
            </p>
          </div>
          <Link
            to="/shop"
            className="hidden md:flex items-center gap-2 text-white font-bold uppercase text-xs tracking-widest hover:text-brand-bone transition-colors"
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {latestProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-12 md:hidden text-center">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-white font-bold uppercase text-xs tracking-widest border border-brand-dark px-8 py-4 hover:bg-brand-bone hover:text-black transition-colors"
          >
            View All Drops <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};