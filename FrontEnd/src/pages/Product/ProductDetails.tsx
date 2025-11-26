import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { PRODUCTS } from '../../constants';
import { ArrowLeft, Minus, Plus, Share2, Ruler, Truck, ShieldCheck, Check } from 'lucide-react';
import { ProductCard } from '../../components/ui/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useShop();

  const product = PRODUCTS.find(p => p.id === id);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'shipping'>('details');
  const [showCopied, setShowCopied] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-4xl font-black uppercase mb-4">Product Not Found</h2>
          <Link to="/" className="text-brand-bone underline uppercase tracking-widest text-sm">Return Home</Link>
        </div>
      </div>
    );
  }

  const relatedProducts = PRODUCTS
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedSize);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `GOUSTTY | ${product.name}`,
      text: `Check out ${product.name} - ${product.description}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.debug('Share cancelled');
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-brand-black pt-24 pb-20 px-4 md:px-8">
      {/* Breadcrumb */}
      <div className="container mx-auto mb-8">
        <button onClick={() => navigate(-1)} className="flex items-center text-neutral-500 hover:text-white transition-colors text-xs uppercase tracking-widest gap-2 mb-6">
          <ArrowLeft size={16} /> Back
        </button>
        <div className="text-xs uppercase tracking-widest text-neutral-500">
          <Link to="/" className="hover:text-white">Home</Link> / <span className="text-white">{product.category}</span> / {product.name}
        </div>
      </div>

      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-24">
        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative aspect-[4/5] bg-brand-dark overflow-hidden group"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {product.isNew && (
            <div className="absolute top-4 left-4 bg-brand-bone text-brand-black text-xs font-bold px-3 py-1 uppercase tracking-widest">
              New Drop
            </div>
          )}
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col h-full"
        >
          <div className="mb-2 flex justify-between items-start relative">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase italic tracking-tighter leading-none">
              {product.name}
            </h1>

            {/* Share Button */}
            <div className="relative">
              <button
                onClick={handleShare}
                className="text-neutral-500 hover:text-white transition-colors p-2 relative z-10"
                aria-label="Share Product"
              >
                {showCopied ? <Check size={20} className="text-brand-bone" /> : <Share2 size={20} />}
              </button>
              <AnimatePresence>
                {showCopied && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="absolute right-full top-1/2 -translate-y-1/2 mr-2 bg-brand-bone text-brand-black text-[10px] font-bold uppercase px-2 py-1 tracking-widest whitespace-nowrap"
                  >
                    Link Copied
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <p className="text-2xl font-bold text-brand-bone mb-6">{formatPrice(product.price)}</p>

          <p className="text-neutral-400 text-sm leading-relaxed mb-8 max-w-md">
            {product.description} Designed for the urban environment with premium heavyweight materials.
            Features reinforced stitching and signature Goustty branding. Unisex oversized fit.
          </p>

          {/* Selectors */}
          <div className="space-y-8 mb-8 border-y border-brand-dark py-8">
            {/* Size */}
            <div>
              <div className="flex justify-between mb-3">
                <span className="text-xs font-bold uppercase text-white tracking-widest">Select Size</span>
                <Link to="/size-guide" className="flex items-center gap-1 text-xs text-neutral-500 hover:text-white transition-colors uppercase tracking-wider">
                  <Ruler size={14} /> Size Guide
                </Link>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {['S', 'M', 'L', 'XL'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-12 border flex items-center justify-center text-sm font-bold transition-all ${selectedSize === size
                        ? 'bg-brand-bone border-brand-bone text-brand-black'
                        : 'border-neutral-800 text-neutral-400 hover:border-white hover:text-white'
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <span className="text-xs font-bold uppercase text-white tracking-widest mb-3 block">Quantity</span>
              <div className="flex items-center border border-neutral-800 w-32 h-12">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex-1 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="text-white font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex-1 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-white text-black h-14 font-black uppercase tracking-[0.2em] hover:bg-brand-bone transition-all mb-8 flex items-center justify-center gap-3 group"
          >
            Add To Bag <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>

          {/* Tabs */}
          <div className="mt-auto">
            <div className="flex gap-8 border-b border-brand-dark mb-4">
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-4 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'details' ? 'text-brand-bone border-b-2 border-brand-bone' : 'text-neutral-500 hover:text-white'
                  }`}
              >
                Details
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`pb-4 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'shipping' ? 'text-brand-bone border-b-2 border-brand-bone' : 'text-neutral-500 hover:text-white'
                  }`}
              >
                Shipping
              </button>
            </div>

            <div className="min-h-[100px] text-sm text-neutral-400 leading-relaxed">
              {activeTab === 'details' ? (
                <ul className="space-y-2 list-disc list-inside marker:text-brand-bone">
                  <li>Heavyweight cotton blend</li>
                  <li>Oversized, boxy fit</li>
                  <li>Signature lightning embroidery</li>
                  <li>Designed in Cúcuta, Colombia</li>
                  <li>Care: Cold wash, hang dry</li>
                </ul>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Truck size={18} className="text-brand-bone mt-1" />
                    <p>Free standard shipping in Colombia on orders over $200.000 COP. International shipping available.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <ShieldCheck size={18} className="text-brand-bone mt-1" />
                    <p>30-day return policy for unworn items with original tags attached.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="container mx-auto border-t border-brand-dark pt-16">
          <h2 className="text-2xl font-black uppercase text-white mb-8 italic">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
