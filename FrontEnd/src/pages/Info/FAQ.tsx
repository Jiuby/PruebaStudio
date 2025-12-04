
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';

type Category = 'General' | 'Envíos' | 'Devoluciones' | 'Producto';

interface Question {
  q: string;
  a: string;
}

export const FAQ: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [activeCategory, setActiveCategory] = useState<Category>('General');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const categories: Category[] = ['General', 'Envíos', 'Devoluciones', 'Producto'];

  const faqData: Record<Category, Question[]> = {
    General: [
      {
        q: '¿Dónde está ubicado CARAMEL DYE?',
        a: 'Estamos ubicados en Medellín, Colombia. Todos nuestros diseños se conceptualizan aquí y fabricamos localmente para asegurar el más alto control de calidad.'
      },
      {
        q: '¿Tienen tienda física?',
        a: 'Actualmente, operamos exclusivamente en línea. Sin embargo, ocasionalmente organizamos tiendas pop-up en las principales ciudades de Colombia. Sigue nuestro Instagram para actualizaciones.'
      },
      {
        q: '¿Cómo puedo contactar a soporte al cliente?',
        a: 'Puedes contactarnos a través de nuestra página de Contacto o enviando un correo a support@carameldye.com. Normalmente respondemos en 24-48 horas.'
      }
    ],
    Envíos: [
      {
        q: '¿Cuánto tarda el envío?',
        a: 'Las entregas locales en Medellín son el mismo día o al día siguiente. Los envíos nacionales suelen tardar de 2 a 4 días hábiles. Los pedidos internacionales varían de 5 a 10 días hábiles vía DHL.'
      },
      {
        q: '¿Hacen envíos internacionales?',
        a: 'Para más información sobre envíos internacionales, por favor contáctanos a través de WhatsApp.'
      },
      {
        q: '¿Cómo puedo rastrear mi pedido?',
        a: 'Una vez que se envíe tu pedido, recibirás un correo electrónico con un número de rastreo. También puedes ver el estado en tu Panel de Cuenta.'
      }
    ],
    Devoluciones: [
      {
        q: '¿Cuál es su política de devolución?',
        a: 'Aceptamos devoluciones dentro de los 30 días posteriores a la entrega. Los artículos deben estar sin usar, sin lavar y con las etiquetas originales. Los artículos de venta final no se pueden devolver.'
      },
      {
        q: '¿Ofrecen devoluciones gratuitas?',
        a: 'Las devoluciones son gratuitas para pedidos dentro de Colombia. Los clientes internacionales son responsables de los costos de envío de devolución a menos que el artículo esté defectuoso.'
      },
      {
        q: '¿Cuánto tardan los reembolsos?',
        a: 'Una vez que recibamos e inspeccionemos tu devolución, los reembolsos se procesan a tu método de pago original dentro de 5-7 días hábiles.'
      }
    ],
    Producto: [
      {
        q: '¿Cómo es el ajuste de su ropa?',
        a: 'La mayoría de nuestros artículos están diseñados con un ajuste oversize estilo streetwear. Si prefieres un ajuste más estándar, recomendamos elegir una talla menos. Por favor, consulta nuestra Guía de Tallas para medidas específicas.'
      },
      {
        q: '¿Cómo debo lavar mis prendas CARAMEL DYE?',
        a: 'Para preservar la calidad del algodón pesado y los estampados, recomendamos lavar en agua fría al revés y secar colgado. No planchar directamente sobre los estampados.'
      },
      {
        q: '¿Repondrán artículos agotados?',
        a: 'Algunos artículos son parte de lanzamientos limitados y no se repondrán. Sin embargo, los artículos de la colección principal se reponen periódicamente.'
      }
    ]
  };

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-brand-black min-h-screen pt-24 pb-20 px-4 md:px-8">

      {/* Header */}
      <div className="container mx-auto mb-16 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-brand-bone uppercase tracking-[0.3em] text-xs font-bold mb-4"
        >
          Centro de Ayuda
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter"
        >
          Preguntas Comunes
        </motion.h1>
      </div>

      <div className="container mx-auto max-w-4xl">

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setOpenIndex(null); }}
              className={`px-6 py-2 text-xs font-bold uppercase tracking-widest border transition-all ${activeCategory === cat
                ? 'bg-brand-bone text-brand-black border-brand-bone'
                : 'text-neutral-500 border-brand-dark hover:border-white hover:text-white'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {faqData[activeCategory].map((item, index) => (
            <div
              key={index}
              className="bg-brand-dark/20 border border-brand-dark overflow-hidden transition-colors hover:border-neutral-700"
            >
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              >
                <span className={`text-sm md:text-base font-bold uppercase tracking-wide pr-4 ${openIndex === index ? 'text-brand-bone' : 'text-white'
                  }`}>
                  {item.q}
                </span>
                <span className={`flex-shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-brand-bone' : 'text-neutral-500'}`}>
                  {openIndex === index ? <Minus size={18} /> : <Plus size={18} />}
                </span>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="px-6 pb-6 text-neutral-400 text-sm leading-relaxed border-t border-brand-dark/50 pt-4">
                      {item.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>

        {/* Still Need Help */}
        <div className="mt-20 border-t border-brand-dark pt-12 text-center">
          <HelpCircle size={32} className="text-brand-bone mx-auto mb-4" />
          <h3 className="text-white font-bold uppercase tracking-widest text-lg mb-2">¿Aún tienes preguntas?</h3>
          <p className="text-neutral-500 text-sm mb-6">¿No encuentras la respuesta que buscas? Por favor chatea con nuestro amable equipo.</p>
          <a href="/#/contact" className="inline-block bg-white text-black px-8 py-3 font-bold uppercase tracking-widest hover:bg-brand-bone transition-colors">
            Contáctanos
          </a>
        </div>

      </div>
    </div>
  );
};
