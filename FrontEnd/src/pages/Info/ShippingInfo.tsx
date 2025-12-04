
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Truck, MapPin, Globe, Clock, PackageCheck, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ShippingInfo: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const shippingMethods = [
    {
      icon: MapPin,
      title: 'Entrega Local',
      subtitle: 'Cúcuta y Área Metropolitana',
      time: 'Mismo Día / Día Siguiente',
      cost: 'Gratis',
      desc: 'Pedidos realizados antes de las 2:00 PM se entregan el mismo día. Pedidos después de las 2:00 PM se entregan el siguiente día hábil.'
    },
    {
      icon: Truck,
      title: 'Envíos Nacionales',
      subtitle: 'Toda Colombia',
      time: '2-4 Días Hábiles',
      cost: '$12.000 COP',
      desc: 'Usamos Interrapidisimo y Coordinadora. Envío gratis en pedidos superiores a $200.000 COP.'
    },
    {
      icon: Globe,
      title: 'Internacional',
      subtitle: 'Resto del Mundo',
      time: '5-10 Días Hábiles',
      cost: 'Calculado al Pagar',
      desc: 'Enviado vía DHL Express. Los impuestos y aranceles internacionales son responsabilidad del cliente al momento de la entrega.'
    }
  ];

  return (
    <div className="bg-brand-black min-h-screen pt-24 pb-20 px-4 md:px-8">

      {/* Header */}
      <div className="container mx-auto mb-16 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-brand-bone uppercase tracking-[0.3em] text-xs font-bold mb-4"
        >
          Logística
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter"
        >
          Envíos y Entregas
        </motion.h1>
      </div>

      {/* Main Grid */}
      <div className="container mx-auto mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {shippingMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className="bg-brand-dark/20 border border-brand-dark p-8 flex flex-col"
              >
                <div className="w-12 h-12 bg-brand-black border border-brand-dark flex items-center justify-center mb-6 text-brand-bone">
                  <Icon size={24} />
                </div>
                <h3 className="text-xl font-black text-white uppercase italic mb-1">{method.title}</h3>
                <p className="text-brand-bone text-xs font-bold uppercase tracking-widest mb-4">{method.subtitle}</p>

                <div className="mt-auto space-y-4">
                  <div className="flex items-center gap-3 text-sm text-neutral-300">
                    <Clock size={16} className="text-neutral-500" />
                    <span>{method.time}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-white">
                    <span className="text-neutral-500 font-normal uppercase text-xs tracking-wider">Costo:</span>
                    <span>{method.cost}</span>
                  </div>
                  <p className="text-xs text-neutral-500 leading-relaxed border-t border-brand-dark pt-4 mt-4">
                    {method.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Detailed Info */}
      <div className="container mx-auto max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          <div className="space-y-8">
            <h3 className="text-white font-bold uppercase tracking-widest text-lg border-b border-brand-dark pb-4">
              <PackageCheck className="inline-block mr-2 mb-1" size={20} />
              Procesamiento de Pedidos
            </h3>
            <p className="text-neutral-400 text-sm leading-loose">
              Todos los pedidos se procesan dentro de las <strong className="text-white">24-48 horas</strong> posteriores a la compra.
              Los pedidos realizados fines de semana o festivos se procesarán el siguiente día hábil.
              Una vez enviado, recibirás un correo de confirmación con tu número de guía.
            </p>
            <p className="text-neutral-400 text-sm leading-loose">
              Asegúrate de que tu dirección de envío sea correcta. No nos hacemos responsables de paquetes perdidos o robados confirmados como entregados en la dirección ingresada.
            </p>
          </div>

          <div className="space-y-8">
            <h3 className="text-white font-bold uppercase tracking-widest text-lg border-b border-brand-dark pb-4">
              <AlertCircle className="inline-block mr-2 mb-1" size={20} />
              Notas Importantes
            </h3>
            <ul className="space-y-4 text-sm text-neutral-400">
              <li className="flex gap-3">
                <span className="text-brand-bone font-bold">•</span>
                <span>Los artículos en preventa se enviarán en la fecha especificada en la página del producto.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-brand-bone font-bold">•</span>
                <span>Si tu pedido incluye artículos disponibles y en preventa, todo el pedido se enviará cuando el artículo en preventa esté listo.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-brand-bone font-bold">•</span>
                <span>Los clientes internacionales son responsables de todos los aranceles e impuestos aduaneros.</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-16 text-center border-t border-brand-dark pt-12">
          <p className="text-neutral-500 text-sm mb-6">¿Tienes más preguntas sobre envíos?</p>
          <Link
            to="/"
            className="inline-block border border-white px-8 py-3 text-white font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-colors"
          >
            Contactar Soporte
          </Link>
        </div>
      </div>

    </div>
  );
};
