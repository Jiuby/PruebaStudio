
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Marquee } from './components/Marquee';
import { CartSidebar } from './components/CartSidebar';
import { ProductDetails } from './components/ProductDetails';
import { Shop } from './components/Shop';
import { Collections } from './components/Collections';
import { LatestDrops } from './components/LatestDrops';
import { Account } from './components/Account';
import { OrderDetails } from './components/OrderDetails';
import { Checkout } from './components/Checkout';
import { OrderSuccess } from './components/OrderSuccess';
import { About } from './components/About';
import { ShippingInfo } from './components/ShippingInfo';
import { ReturnsExchanges } from './components/ReturnsExchanges';
import { SizeGuide } from './components/SizeGuide';
import { ContactUs } from './components/ContactUs';
import { FAQ } from './components/FAQ';
import { ShopProvider } from './context/ShopContext';
import { AuthProvider } from './context/AuthContext';

// ScrollToTop Component
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Footer: React.FC = () => (
  <footer className="bg-brand-black border-t border-brand-dark py-12 px-6">
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
      <div className="col-span-1 md:col-span-2">
        <h2 className="text-3xl font-black uppercase italic text-white mb-4">Goustty</h2>
        <p className="text-neutral-500 text-sm max-w-md">
          Redefining urban aesthetic through oversized silhouettes and aggressive details. 
          Born in the streets, made for the world.
        </p>
      </div>
      <div>
        <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-4">Help</h3>
        <ul className="space-y-2 text-neutral-500 text-sm">
          <li><Link to="/shipping" className="hover:text-brand-bone">Shipping Info</Link></li>
          <li><Link to="/returns" className="hover:text-brand-bone">Returns & Exchanges</Link></li>
          <li><Link to="/size-guide" className="hover:text-brand-bone">Size Guide</Link></li>
          <li><Link to="/contact" className="hover:text-brand-bone">Contact Us</Link></li>
          <li><Link to="/faq" className="hover:text-brand-bone">FAQ</Link></li>
        </ul>
      </div>
      <div>
        <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-4">Social</h3>
        <ul className="space-y-2 text-neutral-500 text-sm">
          <li><a href="#" className="hover:text-brand-bone">Instagram</a></li>
          <li><a href="#" className="hover:text-brand-bone">TikTok</a></li>
        </ul>
      </div>
    </div>
    <div className="container mx-auto mt-12 pt-8 border-t border-brand-dark flex flex-col md:flex-row justify-between items-center text-xs text-neutral-600">
      <p>&copy; 2024 GOUSTTY. All rights reserved.</p>
      <p className="mt-2 md:mt-0">Cúcuta, Colombia.</p>
    </div>
  </footer>
);

const App: React.FC = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <ShopProvider>
          <div className="bg-brand-black min-h-screen text-brand-light font-sans selection:bg-brand-bone selection:text-brand-black">
            <ScrollToTop />
            <Navbar />
            <CartSidebar />
            <main>
              <Routes>
                <Route path="/" element={
                  <>
                    <Hero />
                    <Marquee />
                    <LatestDrops />
                  </>
                } />
                <Route path="/shop" element={<Shop />} />
                <Route path="/collections" element={<Collections />} />
                <Route path="/about" element={<About />} />
                <Route path="/shipping" element={<ShippingInfo />} />
                <Route path="/returns" element={<ReturnsExchanges />} />
                <Route path="/size-guide" element={<SizeGuide />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/account" element={<Account />} />
                <Route path="/account/order/:id" element={<OrderDetails />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-success" element={<OrderSuccess />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </ShopProvider>
      </AuthProvider>
    </HashRouter>
  );
};

export default App;
