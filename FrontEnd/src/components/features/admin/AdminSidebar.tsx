
import React from 'react';
import {
  LayoutDashboard,
  BarChart3,
  Package,
  Tag,
  Layers,
  ShoppingBag,
  Users,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export type AdminTab = 'dashboard' | 'analytics' | 'products' | 'orders' | 'customers' | 'categories' | 'collections' | 'settings';

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, setActiveTab }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { id: 'dashboard', label: 'Panel', icon: LayoutDashboard },
    { id: 'analytics', label: 'Analíticas', icon: BarChart3 },
    { id: 'products', label: 'Productos', icon: Package },
    { id: 'categories', label: 'Categorías', icon: Tag },
    { id: 'collections', label: 'Colecciones', icon: Layers },
    { id: 'orders', label: 'Pedidos', icon: ShoppingBag },
    { id: 'customers', label: 'Clientes', icon: Users },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ] as const;

  return (
    <div className="w-full md:w-64 bg-brand-dark/10 border-r border-brand-dark p-6 flex-shrink-0 flex flex-col">
      <div className="mb-8 p-4 bg-brand-bone text-brand-black">
        <h1 className="text-xl font-black uppercase italic tracking-tighter">Goustty</h1>
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Panel de Admin</p>
      </div>

      <div className="space-y-2 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as AdminTab)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === item.id
                ? 'bg-brand-bone text-brand-black'
                : 'text-neutral-500 hover:text-white hover:bg-brand-dark/50'
                }`}
            >
              <Icon size={18} /> {item.label}
            </button>
          );
        })}
      </div>

      <div className="mt-auto pt-6 border-t border-brand-dark">
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-colors">
          <LogOut size={18} /> Cerrar Sesión
        </button>
      </div>
    </div>
  );
};
