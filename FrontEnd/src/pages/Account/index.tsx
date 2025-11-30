
import React, { useState } from 'react';
import { User, Package, LogOut, Truck, ChevronRight, Check } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authService } from '../../services/auth';

type Tab = 'profile' | 'orders';

export const Account: React.FC = () => {
  const { user, logout, token } = useAuth();
  const { orders } = useShop();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('orders');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Local state for editing profile
  const [profileData, setProfileData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.profile?.phone || '',
    address: user?.profile?.address || '',
    city: user?.profile?.city || '',
    postalCode: user?.profile?.postal_code || ''
  });

  if (!user) {
    // Redirect if not logged in (handled by useEffect in real app, simple check here)
    setTimeout(() => navigate('/'), 0);
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleUpdateProfile = async () => {
    if (!token) {
      setSaveMessage('Error: Not authenticated. Please log in again.');
      console.error('No auth token available');
      return;
    }

    setSaving(true);
    setSaveMessage('');

    try {
      console.log('Updating profile with token:', token.substring(0, 10) + '...');
      await authService.updateProfileAddress(token, {
        phone: profileData.phone,
        address: profileData.address,
        city: profileData.city,
        postal_code: profileData.postalCode
      });

      setSaveMessage('✓ Data updated successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error updating data. Please try again.';
      setSaveMessage(errorMessage);
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-brand-black pt-24 pb-20 px-4 md:px-8">
      <div className="container mx-auto">

        {/* Header */}
        <div className="mb-12 border-b border-brand-dark pb-8">
          <h1 className="text-4xl md:text-6xl font-black uppercase text-white italic tracking-tighter mb-4">
            My Dashboard
          </h1>
          <p className="text-neutral-500 uppercase tracking-widest text-xs">
            Logged in as <span className="text-brand-bone">{user.email}</span>
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* Sidebar Nav */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-brand-dark/20 border border-brand-dark p-2 sticky top-32">
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-4 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'orders'
                  ? 'bg-brand-bone text-brand-black'
                  : 'text-neutral-400 hover:text-white hover:bg-brand-dark/50'
                  }`}
              >
                <Package size={16} /> Recent Orders
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-4 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'profile'
                  ? 'bg-brand-bone text-brand-black'
                  : 'text-neutral-400 hover:text-white hover:bg-brand-dark/50'
                  }`}
              >
                <User size={16} /> My Data
              </button>

              <div className="h-px bg-brand-dark my-2"></div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-4 text-xs font-bold uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-colors"
              >
                <LogOut size={16} /> Log Out
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-h-[500px]">

            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h3 className="text-white font-bold uppercase tracking-widest text-xl mb-6">Recent Purchases</h3>
                {orders.map((order) => (
                  <div key={order.id} className="border border-brand-dark bg-brand-dark/10 p-6 group hover:border-brand-bone/50 transition-colors">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-brand-dark pb-4">
                      <div>
                        <div className="flex items-center gap-4 mb-1">
                          <span className="text-brand-bone font-bold text-lg">#{order.id}</span>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 border ${order.status === 'Delivered' ? 'border-green-500 text-green-500' :
                            order.status === 'Shipped' ? 'border-blue-500 text-blue-500' :
                              'border-yellow-500 text-yellow-500'
                            }`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 uppercase">{order.date}</p>
                      </div>
                      <div className="mt-2 md:mt-0 text-right">
                        <p className="text-white font-bold">{formatPrice(order.total)}</p>
                        <p className="text-xs text-neutral-500 uppercase">{order.items.length} Items</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                          <div className="w-12 h-16 bg-brand-dark flex-shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-white text-sm font-bold uppercase leading-none mb-1">{item.name}</h4>
                            <p className="text-xs text-neutral-500 uppercase">Size: {item.size} • Color: {item.color} • Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-brand-dark flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs text-neutral-500 uppercase flex items-center gap-2">
                        <Truck size={14} /> Track Order
                      </span>
                      <button
                        onClick={() => navigate(`/account/order/${order.id}`)}
                        className="text-xs text-white uppercase font-bold flex items-center gap-1 hover:text-brand-bone transition-colors"
                      >
                        View Details <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-white font-bold uppercase tracking-widest text-xl mb-8">Personal Data</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-6">
                    <h3 className="text-neutral-500 font-bold uppercase tracking-widest text-xs border-b border-brand-dark pb-2">
                      Contact Info
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs uppercase text-neutral-500 mb-2">Username</label>
                        <input
                          type="text"
                          value={profileData.username}
                          readOnly
                          className="w-full bg-brand-dark/20 border border-brand-dark py-3 px-4 text-white font-medium focus:outline-none focus:border-brand-bone transition-colors cursor-not-allowed opacity-70"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase text-neutral-500 mb-2">First Name</label>
                        <input
                          type="text"
                          value={profileData.firstName}
                          readOnly
                          className="w-full bg-brand-dark/20 border border-brand-dark py-3 px-4 text-white font-medium focus:outline-none focus:border-brand-bone transition-colors cursor-not-allowed opacity-70"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase text-neutral-500 mb-2">Last Name</label>
                        <input
                          type="text"
                          value={profileData.lastName}
                          readOnly
                          className="w-full bg-brand-dark/20 border border-brand-dark py-3 px-4 text-white font-medium focus:outline-none focus:border-brand-bone transition-colors cursor-not-allowed opacity-70"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase text-neutral-500 mb-2">Email Address</label>
                        <input
                          type="email"
                          value={profileData.email}
                          readOnly
                          className="w-full bg-brand-dark/20 border border-brand-dark py-3 px-4 text-white font-medium focus:outline-none focus:border-brand-bone transition-colors cursor-not-allowed opacity-70"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase text-neutral-500 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          className="w-full bg-transparent border-b border-brand-dark py-2 text-white font-medium focus:outline-none focus:border-brand-bone transition-colors"
                          placeholder="+57..."
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-neutral-500 font-bold uppercase tracking-widest text-xs border-b border-brand-dark pb-2">
                      Shipping Details
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs uppercase text-neutral-500 mb-2">Address</label>
                        <input
                          type="text"
                          value={profileData.address}
                          onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                          className="w-full bg-transparent border-b border-brand-dark py-2 text-white font-medium focus:outline-none focus:border-brand-bone transition-colors"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs uppercase text-neutral-500 mb-2">City</label>
                          <input
                            type="text"
                            value={profileData.city}
                            onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                            className="w-full bg-transparent border-b border-brand-dark py-2 text-white font-medium focus:outline-none focus:border-brand-bone transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-xs uppercase text-neutral-500 mb-2">Postal Code</label>
                          <input
                            type="text"
                            value={profileData.postalCode}
                            onChange={(e) => setProfileData({ ...profileData, postalCode: e.target.value })}
                            className="w-full bg-transparent border-b border-brand-dark py-2 text-white font-medium focus:outline-none focus:border-brand-bone transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end items-center gap-4 pt-6 border-t border-brand-dark">
                  {saveMessage && (
                    <span className={`text-sm ${saveMessage.startsWith('✓') ? 'text-green-400' : 'text-red-400'}`}>
                      {saveMessage}
                    </span>
                  )}
                  <button
                    onClick={handleUpdateProfile}
                    disabled={saving}
                    className="bg-white text-black px-8 py-3 font-bold uppercase tracking-widest hover:bg-brand-bone transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {saving ? 'Saving...' : 'Update Data'}
                    {!saving && <Check size={16} />}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
