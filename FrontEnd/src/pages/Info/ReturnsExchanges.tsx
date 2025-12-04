
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, CheckCircle, Mail, XCircle } from 'lucide-react';

export const ReturnsExchanges: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-brand-black min-h-screen pt-24 pb-20 px-4 md:px-8">
            {/* Header */}
            <div className="container mx-auto mb-16 text-center">
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-brand-bone uppercase tracking-[0.3em] text-xs font-bold mb-4"
                >
                    Servicio al Cliente
                </motion.p>
                <motion.h1
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter"
                >
                    Cambios y Devoluciones
                </motion.h1>
            </div>

            <div className="container mx-auto max-w-4xl">
                {/* Main Policy Card */}
                <div className="bg-brand-dark/20 border border-brand-dark p-8 md:p-12 mb-12 text-center">
                    <RefreshCw size={48} className="text-brand-bone mx-auto mb-6" />
                    <h2 className="text-2xl font-black text-white uppercase italic mb-4">Política de 30 Días Sin Complicaciones</h2>
                    <p className="text-neutral-400 leading-relaxed max-w-2xl mx-auto">
                        Queremos que estés completamente satisfecho con tu compra en GOUSTTY. Si el ajuste no es el correcto, o simplemente no es tu estilo, tienes <strong>30 días</strong> desde la fecha de entrega para solicitar una devolución o cambio.
                    </p>
                </div>

                {/* Conditions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    <div className="space-y-6">
                        <h3 className="text-white font-bold uppercase tracking-widest text-lg border-b border-brand-dark pb-4">
                            <CheckCircle className="inline-block mr-2 mb-1" size={20} />
                            Condiciones de Devolución
                        </h3>
                        <ul className="space-y-4 text-sm text-neutral-400">
                            <li className="flex gap-3">
                                <span className="text-brand-bone font-bold">•</span>
                                <span>Los artículos deben estar sin usar, sin lavar y en su condición original.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-brand-bone font-bold">•</span>
                                <span>Las etiquetas originales deben estar adjuntas.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-brand-bone font-bold">•</span>
                                <span>Se requiere comprobante de compra (Nº de Pedido).</span>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-white font-bold uppercase tracking-widest text-lg border-b border-brand-dark pb-4">
                            <XCircle className="inline-block mr-2 mb-1" size={20} />
                            Artículos No Devolubles
                        </h3>
                        <ul className="space-y-4 text-sm text-neutral-400">
                            <li className="flex gap-3">
                                <span className="text-brand-bone font-bold">•</span>
                                <span>Artículos de Venta Final (marcados como tales).</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-brand-bone font-bold">•</span>
                                <span>Ropa interior, calcetines y mascarillas por razones de higiene.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-brand-bone font-bold">•</span>
                                <span>Tarjetas de regalo.</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* How to Process */}
                <div className="mb-16">
                    <h3 className="text-center text-white font-bold uppercase tracking-widest text-lg mb-8">Cómo Iniciar una Devolución</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { step: '01', title: 'Contáctanos', desc: 'Envía un correo a support@goustty.com con tu Nº de Pedido y el motivo de la devolución.' },
                            { step: '02', title: 'Empácalo', desc: 'Coloca el/los artículo(s) en el empaque original. Te enviaremos una etiqueta de envío.' },
                            { step: '03', title: 'Envíalo', desc: 'Déjalo en la oficina de transporte más cercana. El reembolso se procesa tras la inspección.' }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-brand-dark/10 p-6 border border-brand-dark hover:border-brand-bone transition-colors">
                                <span className="text-4xl font-black text-brand-dark/50 block mb-4">{item.step}</span>
                                <h4 className="text-white font-bold uppercase mb-2">{item.title}</h4>
                                <p className="text-neutral-500 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact CTA */}
                <div className="bg-brand-bone text-brand-black p-8 md:p-12 text-center">
                    <Mail size={32} className="mx-auto mb-4" />
                    <h3 className="text-2xl font-black uppercase italic mb-4">¿Necesitas Ayuda?</h3>
                    <p className="font-medium mb-6 max-w-lg mx-auto">
                        Si recibiste un artículo defectuoso o tienes preguntas sobre tallas antes de comprar, nuestro equipo está aquí para ayudar.
                    </p>
                    <a href="mailto:support@goustty.com" className="inline-block border-2 border-brand-black px-8 py-3 font-bold uppercase tracking-widest hover:bg-brand-black hover:text-brand-bone transition-colors">
                        Contactar Soporte
                    </a>
                </div>

            </div>
        </div>
    );
};
