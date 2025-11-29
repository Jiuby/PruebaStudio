
import React, { useState, useEffect } from 'react';
import { Check, Globe, Truck, ShieldAlert, Save } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
import { useAuth } from '../../../context/AuthContext';
import { StoreSettings } from '../../../types';

export const SettingsTab: React.FC = () => {
   const { storeSettings, updateStoreSettings } = useShop();

   const [settingsFormData, setSettingsFormData] = useState<StoreSettings>(storeSettings);
   const [settingsSaved, setSettingsSaved] = useState(false);

   useEffect(() => {
      setSettingsFormData(storeSettings);
   }, [storeSettings]);

   const handleSaveSettings = (e: React.FormEvent) => {
      e.preventDefault();
      updateStoreSettings(settingsFormData);
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 3000);
   };

   return (
      <div className="space-y-6 animate-fade-in max-w-4xl">
         <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-black uppercase italic text-white">Store Settings</h2>
            {settingsSaved && (
               <div className="flex items-center gap-2 text-green-500 text-xs font-bold uppercase animate-fade-in">
                  <Check size={16} /> Changes Saved
               </div>
            )}
         </div>

         <form onSubmit={handleSaveSettings} className="space-y-8">
            {/* General Info */}
            <div className="bg-brand-dark/10 border border-brand-dark p-8">
               <div className="flex items-center gap-3 mb-6 border-b border-brand-dark pb-4">
                  <Globe size={20} className="text-brand-bone" />
                  <h3 className="text-white font-bold uppercase tracking-widest text-sm">General Information</h3>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                     <label className="block text-xs uppercase font-bold text-neutral-500 mb-2">Store Name</label>
                     <input
                        type="text"
                        value={settingsFormData.storeName}
                        onChange={(e) => setSettingsFormData({ ...settingsFormData, storeName: e.target.value })}
                        className="w-full bg-brand-dark/30 border border-brand-dark p-3 text-white focus:outline-none focus:border-brand-bone"
                     />
                  </div>
                  <div>
                     <label className="block text-xs uppercase font-bold text-neutral-500 mb-2">Support Email</label>
                     <input
                        type="email"
                        value={settingsFormData.supportEmail}
                        onChange={(e) => setSettingsFormData({ ...settingsFormData, supportEmail: e.target.value })}
                        className="w-full bg-brand-dark/30 border border-brand-dark p-3 text-white focus:outline-none focus:border-brand-bone"
                     />
                  </div>
                  <div>
                     <label className="block text-xs uppercase font-bold text-neutral-500 mb-2">Currency Code</label>
                     <input
                        type="text"
                        value={settingsFormData.currency}
                        onChange={(e) => setSettingsFormData({ ...settingsFormData, currency: e.target.value })}
                        className="w-full bg-brand-dark/30 border border-brand-dark p-3 text-white focus:outline-none focus:border-brand-bone uppercase"
                     />
                  </div>
               </div>
            </div>

            {/* Shipping Configuration */}
            <div className="bg-brand-dark/10 border border-brand-dark p-8">
               <div className="flex items-center gap-3 mb-6 border-b border-brand-dark pb-4">
                  <Truck size={20} className="text-brand-bone" />
                  <h3 className="text-white font-bold uppercase tracking-widest text-sm">Shipping Configuration</h3>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                     <label className="block text-xs uppercase font-bold text-neutral-500 mb-2">Standard Shipping Rate</label>
                     <input
                        type="number"
                        value={settingsFormData.shippingFlatRate}
                        onChange={(e) => setSettingsFormData({ ...settingsFormData, shippingFlatRate: Number(e.target.value) })}
                        className="w-full bg-brand-dark/30 border border-brand-dark p-3 text-white focus:outline-none focus:border-brand-bone"
                     />
                  </div>
                  <div>
                     <label className="block text-xs uppercase font-bold text-neutral-500 mb-2">Free Shipping Threshold</label>
                     <input
                        type="number"
                        value={settingsFormData.freeShippingThreshold}
                        onChange={(e) => setSettingsFormData({ ...settingsFormData, freeShippingThreshold: Number(e.target.value) })}
                        className="w-full bg-brand-dark/30 border border-brand-dark p-3 text-white focus:outline-none focus:border-brand-bone"
                     />
                  </div>
               </div>
            </div>

            {/* System */}
            <div className="bg-brand-dark/10 border border-brand-dark p-8">
               <div className="flex items-center gap-3 mb-6 border-b border-brand-dark pb-4">
                  <ShieldAlert size={20} className="text-brand-bone" />
                  <h3 className="text-white font-bold uppercase tracking-widest text-sm">System</h3>
               </div>
               <div className="flex items-center justify-between">
                  <div>
                     <h4 className="text-white font-bold text-sm uppercase">Maintenance Mode</h4>
                     <p className="text-neutral-500 text-xs">Disable the public storefront temporarily.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                     <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settingsFormData.maintenanceMode}
                        onChange={(e) => setSettingsFormData({ ...settingsFormData, maintenanceMode: e.target.checked })}
                     />
                     <div className="w-11 h-6 bg-brand-dark rounded-full peer peer-focus:ring-2 peer-focus:ring-brand-bone peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-bone"></div>
                  </label>
               </div>
            </div>

            <div className="flex justify-end pt-4">
               <button
                  type="submit"
                  className="bg-brand-bone text-brand-black px-8 py-4 font-black uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-2"
               >
                  <Save size={18} /> Save Settings
               </button>
            </div>
         </form>
      </div>
   );
};
