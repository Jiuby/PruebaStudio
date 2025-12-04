import React from 'react';
import { Wrench } from 'lucide-react';

export const MaintenancePage: React.FC = () => {
    return (
        <div className="min-h-screen bg-brand-black flex items-center justify-center p-4">
            <div className="max-w-2xl w-full text-center space-y-8">
                <div className="flex justify-center">
                    <div className="relative">
                        <Wrench size={80} className="text-brand-bone animate-pulse" />
                        <div className="absolute inset-0 bg-brand-bone blur-xl opacity-20"></div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-5xl md:text-7xl font-black uppercase italic text-white">
                        En Mantenimiento
                    </h1>
                    <div className="h-1 w-32 bg-brand-bone mx-auto"></div>
                </div>

                <p className="text-neutral-400 text-lg md:text-xl max-w-xl mx-auto">
                    Estamos actualizando nuestros sistemas para servirte mejor.
                    Por favor, vuelve pronto.
                </p>

                <div className="pt-8">
                    <p className="text-neutral-600 text-sm uppercase tracking-widest">
                        GOUSTTY | Volveremos pronto
                    </p>
                </div>
            </div>
        </div>
    );
};
