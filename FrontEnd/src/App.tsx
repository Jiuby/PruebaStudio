
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CartSidebar } from './components/features/cart/CartSidebar';
import { Home } from './pages/Home';
import { ProductDetails } from './pages/Product';
import { Shop } from './pages/Shop';
import { Collections } from './pages/Collections';
import { LatestDrops } from './components/features/home/LatestDrops';
import { Account } from './pages/Account';
import { AdminDashboard } from './pages/Admin/Dashboard';
import { AdminLogin } from './pages/Admin/Login';
import { OrderDetails } from './pages/Account/OrderDetails';
import { Checkout } from './pages/Checkout';
import { OrderSuccess } from './pages/Checkout/OrderSuccess';
import { GuestOrderTracking } from './pages/Account/GuestOrderTracking';
import { About } from './pages/Info/About';
import { ShippingInfo } from './pages/Info/ShippingInfo';
import { ReturnsExchanges } from './pages/Info/ReturnsExchanges';
import { SizeGuide } from './pages/Info/SizeGuide';
import { ContactUs } from './pages/Info/ContactUs';
import { FAQ } from './pages/Info/FAQ';
import { MaintenancePage } from './pages/Info/Maintenance';
import { ShopProvider, useShop } from './context/ShopContext';
import { AuthProvider, useAuth } from './context/AuthContext';

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

// Maintenance Guard Component
const MaintenanceGuard = ({ children }: { children: React.ReactElement }) => {
  const { storeSettings } = useShop();
  const { isAdmin } = useAuth();
  const location = useLocation();

  // Always allow access to Admin Routes
  if (location.pathname.startsWith('/admin')) {
    return children;
  }

  // If Maintenance Mode is ON and user is NOT an admin, show maintenance page
  if (storeSettings.maintenanceMode && !isAdmin) {
    return <MaintenancePage />;
  }

  // Otherwise, render the site normally
  return children;
};

const AppRoutes = () => {
  const location = useLocation();
  // Don't show Navbar on Admin pages for full immersion
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <MaintenanceGuard>
      <>
        {!isAdminRoute && <Navbar />}
        <CartSidebar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:category" element={<Shop />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/latest-drops" element={<LatestDrops />} />
            <Route path="/account" element={<Account />} />
            <Route path="/account/order/:id" element={<OrderDetails />} />
            <Route path="/track-order" element={<GuestOrderTracking />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success" element={<OrderSuccess />} />

            {/* Info pages */}
            <Route path="/about" element={<About />} />
            <Route path="/shipping" element={<ShippingInfo />} />
            <Route path="/returns" element={<ReturnsExchanges />} />
            <Route path="/size-guide" element={<SizeGuide />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/faq" element={<FAQ />} />

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
    </MaintenanceGuard>
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
