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
  const inStock = product?.inStock !== false;
  const isSale = product?.originalPrice && product.originalPrice > product.price;

  // Initialize selectedSize. If availableSizes exists, try to pick the first one.
  const initialSize = product?.availableSizes && product.availableSizes.length > 0
    ? product.availableSizes[0]
    : 'M';

  const [selectedSize, setSelectedSize] = useState(initialSize);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'shipping'>('details');
  const [showCopied, setShowCopied] = useState(false);

  // Image Gallery State
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    if (product) {
      setActiveImage(product.image);
      // Reset selected size when product changes if current selected isn't available
      if (product.availableSizes && !product.availableSizes.includes(selectedSize)) {
        setSelectedSize(product.availableSizes[0] || 'M');
      }
    }
  }, [id, product]);

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

  // Determine gallery images (fallback to main image if array is missing/empty)
  const galleryImages = product.images && product.images.length > 0 ? product.images : [product.image];

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
    if (!inStock) return;
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

  const isSizeAvailable = (size: string) => {
    if (!product.availableSizes) return true;
    return product.availableSizes.includes(size);
  };

  return (
    <div className="min-h-screen bg-brand-black pt-24 pb-20 px-4 md:px-8">
      {/* Breadcrumb */}
      <div className="container mx-auto mb-8">
        <button onClick={() => navigate(-1)} className="flex items-center text-neutral-500 hover:text-white transition-colors text-xs uppercase tracking-widest gap-2 mb-6">
          <ArrowLeft size={16} /> Back
        </button>
        <div className="text-xs uppercase tracking-widest text-neutral-500">
          <Link to="/" className="hover:text-white">Home</Link> / <Link to={`/shop?category=${product.category}`} className="text-white hover:text-brand-bone transition-colors">{product.category}</Link> / {product.name}
        </div>
      </div>

      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-24">

        {/* Image Gallery Section */}
        <div className="space-y-4">
          {/* Main Active Image */}
          <motion.div
            key={activeImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="relative aspect-[4/5] bg-brand-dark overflow-hidden group w-full"
          >
            <img
              src={activeImage || product.image}
              alt={product.name}
              className={`w-full h-full object-cover ${!inStock ? 'grayscale opacity-70' : ''}`}
            />

            {/* New Drop Badge */}
            {product.isNew && inStock && (
              <div className="absolute top-4 left-4 bg-brand-bone text-brand-black text-xs font-bold px-3 py-1 uppercase tracking-widest z-10">
                New Drop
              </div>
            )}

            {/* Sale Badge */}
            {isSale && inStock && (
              <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1 uppercase tracking-widest z-10">
                SALE
              </div>
            )}

            {/* Sold Out Overlay */}
            {!inStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <div className="bg-brand-black border border-white text-white text-xl font-bold px-6 py-3 uppercase tracking-[0.2em] transform -rotate-12">
                  Sold Out
                </div>
              </div>
            )}
          </motion.div>

          {/* Thumbnails */}
          {galleryImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-20 h-24 flex-shrink-0 overflow-hidden border-2 transition-all ${activeImage === img ? 'border-brand-bone opacity-100' : 'border-transparent opacity-50 hover:opacity-100'
                    }`}
                >
                  <img src={img} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

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

          <div className="flex items-center gap-4 mb-6">
            <p className={`text-2xl font-bold ${isSale ? 'text-red-500' : 'text-brand-bone'}`}>
              {formatPrice(product.price)}
            </p>
            {isSale && (
              <p className="text-xl text-neutral-500 line-through decoration-neutral-500">
                {formatPrice(product.originalPrice!)}
              </p>
            )}
            {isSale && (
              <span className="bg-red-600/20 text-red-500 text-xs font-bold px-2 py-1 uppercase tracking-widest border border-red-600/50">
                Save {Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}%
              </span>
            )}
          </div>

          <p className="text-neutral-400 text-sm leading-relaxed mb-8 max-w-md">
            {product.description} Designed for the urban environment with premium heavyweight materials.
            Features reinforced stitching and signature Goustty branding. Unisex oversized fit.
          </p>

          {/* Selectors */}
          <div className={`space-y-8 mb-8 border-y border-brand-dark py-8 ${!inStock ? 'opacity-50 pointer-events-none' : ''}`}>
            {/* Size */}
            <div>
              <div className="flex justify-between mb-3">
                <span className="text-xs font-bold uppercase text-white tracking-widest">Select Size</span>
                <Link to="/size-guide" className="flex items-center gap-1 text-xs text-neutral-500 hover:text-white transition-colors uppercase tracking-wider">
                  <Ruler size={14} /> Size Guide
                </Link>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {['S', 'M', 'L', 'XL'].map((size) => {
                  const available = isSizeAvailable(size);
                  return (
                    <button
                      key={size}
                      onClick={() => { if (available) setSelectedSize(size); }}
                      disabled={!available}
                      className={`h-12 border flex items-center justify-center text-sm font-bold transition-all relative ${selectedSize === size && available
                        ? 'bg-brand-bone border-brand-bone text-brand-black'
                        : available
                          ? 'border-neutral-800 text-neutral-400 hover:border-white hover:text-white'
                          : 'border-neutral-900 text-neutral-700 cursor-not-allowed'
                        }`}
                    >
                      {size}
                      {!available && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-full h-[1px] bg-neutral-700 transform -rotate-45"></div>
                        </div>
                      )}
                    </button>
                  );
                })}
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
            disabled={!inStock}
            className={`w-full h-14 font-black uppercase tracking-[0.2em] transition-all mb-8 flex items-center justify-center gap-3 group ${inStock
              ? 'bg-white text-black hover:bg-brand-bone'
              : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
              }`}
          >
            {inStock ? (
              <>Add To Bag <span className="group-hover:translate-x-1 transition-transform">→</span></>
            ) : (
              'Sold Out'
            )}
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
