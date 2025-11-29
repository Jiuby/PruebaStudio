
import React, { useState } from 'react';
import { AdminSidebar, AdminTab } from '../../components/features/admin/AdminSidebar';
import { DashboardOverview } from '../../components/features/admin/DashboardOverview';
import { AnalyticsTab } from '../../components/features/admin/AnalyticsTab';
import { ProductsTab } from '../../components/features/admin/ProductsTab';
import { CategoriesTab } from '../../components/features/admin/CategoriesTab';
import { CollectionsTab } from '../../components/features/admin/CollectionsTab';
import { OrdersTab } from '../../components/features/admin/OrdersTab';
import { CustomersTab } from '../../components/features/admin/CustomersTab';
import { SettingsTab } from '../../components/features/admin/SettingsTab';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [quickAddMode, setQuickAddMode] = useState(false);

  const handleQuickAdd = () => {
    setActiveTab('products');
    setQuickAddMode(true);
  };

  const handleAutoOpenConsumed = () => {
    setQuickAddMode(false);
  };

  return (
    <div className="min-h-screen bg-brand-black flex flex-col md:flex-row pt-0">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 p-6 md:p-12 overflow-y-auto h-screen">
        {activeTab === 'dashboard' && <DashboardOverview onQuickAdd={handleQuickAdd} />}
        {activeTab === 'analytics' && <AnalyticsTab />}
        {activeTab === 'products' && (
          <ProductsTab
            autoOpenModal={quickAddMode}
            onAutoOpenConsumed={handleAutoOpenConsumed}
          />
        )}
        {activeTab === 'categories' && <CategoriesTab />}
        {activeTab === 'collections' && <CollectionsTab />}
        {activeTab === 'orders' && <OrdersTab />}
        {activeTab === 'customers' && <CustomersTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </div>
    </div>
  );
};
