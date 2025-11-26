
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, Search, User } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { AuthModal } from '../ui/AuthModal';

export const Navbar: React.FC = () => {
  const { toggleCart, cartCount } = useShop();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleUserClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAuthenticated) {
      navigate('/account');
    } else {
      setAuthModalOpen(true);
    }
  };

  return (
    <>
      <nav
        className={`fixed w-full top-0 z-30 transition-all duration-300 border-b ${scrolled || mobileMenuOpen
            ? 'bg-brand-black/90 backdrop-blur-md border-brand-dark py-4'
            : 'bg-transparent border-transparent py-6'
          }`}
      >
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8 text-xs font-bold uppercase tracking-widest text-neutral-400">
            <Link to="/shop" className="hover:text-brand-bone transition-colors">Shop</Link>
            <Link to="/collections" className="hover:text-brand-bone transition-colors">Collections</Link>
            <Link to="/about" className="hover:text-brand-bone transition-colors">About</Link>
          </div>

          {/* Logo */}
          <Link to="/" className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-black tracking-tighter text-white uppercase italic">
            Goustty
          </Link>

          {/* Icons */}
          <div className="flex items-center space-x-6">
            <button className="text-white hover:text-brand-bone transition-colors hidden md:block">
              <Search size={20} />
            </button>

            <button
              onClick={handleUserClick}
              className="text-white hover:text-brand-bone transition-colors hidden md:flex items-center gap-2"
            >
              <User size={20} />
              {isAuthenticated && user && (
                <span className="text-[10px] font-bold uppercase tracking-wide max-w-[80px] truncate hidden lg:block">
                  {user.name.split(' ')[0]}
                </span>
              )}
            </button>

            <button
              onClick={toggleCart}
              className="text-white hover:text-brand-bone transition-colors relative"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-bone text-brand-black text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-20 bg-brand-black pt-24 px-6 md:hidden flex flex-col space-y-8">
          <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-black uppercase text-white hover:text-brand-bone">Shop All</Link>
          <Link to="/collections" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-black uppercase text-white hover:text-brand-bone">Collections</Link>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-black uppercase text-white hover:text-brand-bone">About Us</Link>
          <div className="mt-auto pb-12 border-t border-brand-dark pt-8">
            <p className="text-neutral-500 uppercase tracking-widest text-xs mb-4">Account</p>
            {isAuthenticated ? (
              <>
                <Link to="/account" onClick={() => setMobileMenuOpen(false)} className="text-white font-bold block mb-2 text-xl uppercase italic">My Dashboard</Link>
                <Link to="/account" onClick={() => setMobileMenuOpen(false)} className="text-neutral-400 text-sm block">Orders & Data</Link>
              </>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAuthModalOpen(true);
                }}
                className="text-white font-bold block text-xl uppercase italic"
              >
                Log In / Sign Up
              </button>
            )}
          </div>
        </div>
      )}

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
};
