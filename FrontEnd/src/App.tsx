import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation, Link, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Hero } from './components/home/Hero';
import { Marquee } from './components/home/Marquee';
import { CartSidebar } from './components/layout/CartSidebar';
import { ProductDetails } from './pages/Product/ProductDetails';
import { Shop } from './pages/Shop';
import { Collections } from './pages/Collections';
import { LatestDrops } from './components/home/LatestDrops';
import { Account } from './pages/Account';
import { AdminDashboard } from './pages/Admin/AdminDashboard';
import AdminLogin from './pages/Admin/AdminLogin';
import { OrderDetails } from './pages/Account/OrderDetails';
import { Checkout } from './pages/Checkout';
import { OrderSuccess } from './pages/Checkout/OrderSuccess';
import { About } from './pages/About';
import { ShippingInfo } from './pages/Support/ShippingInfo';
import { ReturnsExchanges } from './pages/Support/ReturnsExchanges';
import { SizeGuide } from './pages/Support/SizeGuide';
import { ContactUs } from './pages/Support/ContactUs';
import { FAQ } from './pages/Support/FAQ';
import { ShopProvider } from './context/ShopContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Footer } from './components/layout/Footer';

// ScrollToTop Component
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Protected Admin Route Component
const RequireAdmin = ({ children }: { children: React.ReactElement }) => {
  const { isAdmin } = useAuth();
  const location = useLocation();

  if (!isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

const AppRoutes = () => {
  const location = useLocation();
  // Don't show Navbar on Admin pages for full immersion
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Navbar />}
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

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <RequireAdmin>
              <AdminDashboard />
            </RequireAdmin>
          } />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <ShopProvider>
          <div className="bg-brand-black min-h-screen text-brand-light font-sans selection:bg-brand-bone selection:text-brand-black">
            <ScrollToTop />
            <AppRoutes />
          </div>
        </ShopProvider>
      </AuthProvider>
    </HashRouter>
  );
};

export default App;
