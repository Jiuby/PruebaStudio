
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';

type Category = 'General' | 'Shipping' | 'Returns' | 'Product';

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

  const categories: Category[] = ['General', 'Shipping', 'Returns', 'Product'];

  const faqData: Record<Category, Question[]> = {
    General: [
      {
        q: 'Where is GOUSTTY located?',
        a: 'We are based in Cúcuta, Colombia. All our designs are conceptualized here, and we manufacture locally to ensure the highest quality control.'
      },
      {
        q: 'Do you have a physical store?',
        a: 'Currently, we operate exclusively online. However, we occasionally host pop-up shops in major cities across Colombia. Follow our Instagram for updates.'
      },
      {
        q: 'How can I contact customer support?',
        a: 'You can reach us via our Contact page or by emailing support@goustty.com. We typically respond within 24-48 hours.'
      }
    ],
    Shipping: [
      {
        q: 'How long does shipping take?',
        a: 'Local deliveries in Cúcuta are same-day or next-day. National shipments typically take 2-4 business days. International orders range from 5-10 business days via DHL.'
      },
      {
        q: 'Do you ship internationally?',
        a: 'Yes, we ship worldwide. Shipping costs are calculated at checkout based on your location and the weight of your order.'
      },
      {
        q: 'How can I track my order?',
        a: 'Once your order ships, you will receive an email with a tracking number. You can also view the status in your Account Dashboard.'
      }
    ],
    Returns: [
      {
        q: 'What is your return policy?',
        a: 'We accept returns within 30 days of delivery. Items must be unworn, unwashed, and have original tags attached. Final sale items cannot be returned.'
      },
      {
        q: 'Do you offer free returns?',
        a: 'Returns are free for orders within Colombia. International customers are responsible for return shipping costs unless the item is defective.'
      },
      {
        q: 'How long do refunds take?',
        a: 'Once we receive and inspect your return, refunds are processed to your original payment method within 5-7 business days.'
      }
    ],
    Product: [
      {
        q: 'How do your clothes fit?',
        a: 'Most of our items are designed with an oversized, streetwear fit. If you prefer a more standard fit, we recommend sizing down. Please check our Size Guide for specific measurements.'
      },
      {
        q: 'How should I wash my GOUSTTY items?',
        a: 'To preserve the quality of the heavy cotton and prints, we recommend washing in cold water inside out and hanging to dry. Do not iron directly on prints.'
      },
      {
        q: 'Will you restock sold-out items?',
        a: 'Some items are part of limited drops and will not be restocked. However, core collection items are restocked periodically. Sign up for our newsletter to be notified.'
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
          Help Center
        </motion.p>
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter"
        >
          Common Questions
        </motion.h1>
      </div>

      <div className="container mx-auto max-w-4xl">
        
        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setOpenIndex(null); }}
              className={`px-6 py-2 text-xs font-bold uppercase tracking-widest border transition-all ${
                activeCategory === cat
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
                <span className={`text-sm md:text-base font-bold uppercase tracking-wide pr-4 ${
                  openIndex === index ? 'text-brand-bone' : 'text-white'
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
          <h3 className="text-white font-bold uppercase tracking-widest text-lg mb-2">Still have questions?</h3>
          <p className="text-neutral-500 text-sm mb-6">Can't find the answer you're looking for? Please chat to our friendly team.</p>
          <a href="/#/contact" className="inline-block bg-white text-black px-8 py-3 font-bold uppercase tracking-widest hover:bg-brand-bone transition-colors">
            Get in Touch
          </a>
        </div>

      </div>
    </div>
  );
};
