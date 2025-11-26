import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { CartSidebar } from './components/layout/CartSidebar';
import { Footer } from './components/layout/Footer';
import { ScrollToTop } from './components/ui/ScrollToTop';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { Collections } from './pages/Collections';
import { About } from './pages/About';
import { ContactUs } from './pages/Support/ContactUs';
import { FAQ } from './pages/Support/FAQ';
import { ShippingInfo } from './pages/Support/ShippingInfo';
import { ReturnsExchanges } from './pages/Support/ReturnsExchanges';
import { SizeGuide } from './pages/Support/SizeGuide';
import { ProductDetails } from './pages/Product/ProductDetails';
import { Account } from './pages/Account';
import { OrderDetails } from './pages/Account/OrderDetails';
import { Checkout } from './pages/Checkout';
import { OrderSuccess } from './pages/Checkout/OrderSuccess';
import { ShopProvider } from './context/ShopContext';
import { AuthProvider } from './context/AuthContext';

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
                <Route path="/" element={<Home />} />
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
