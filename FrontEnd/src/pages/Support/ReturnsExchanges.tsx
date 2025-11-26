
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
          Customer Service
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter"
        >
          Returns & Exchanges
        </motion.h1>
      </div>

      <div className="container mx-auto max-w-4xl">
        {/* Main Policy Card */}
        <div className="bg-brand-dark/20 border border-brand-dark p-8 md:p-12 mb-12 text-center">
            <RefreshCw size={48} className="text-brand-bone mx-auto mb-6" />
            <h2 className="text-2xl font-black text-white uppercase italic mb-4">30-Day Hassle-Free Policy</h2>
            <p className="text-neutral-400 leading-relaxed max-w-2xl mx-auto">
                We want you to be completely satisfied with your GOUSTTY purchase. If the fit isn't right, or it's just not your vibe, you have <strong>30 days</strong> from the delivery date to request a return or exchange.
            </p>
        </div>

        {/* Conditions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="space-y-6">
                <h3 className="text-white font-bold uppercase tracking-widest text-lg border-b border-brand-dark pb-4">
                    <CheckCircle className="inline-block mr-2 mb-1" size={20} />
                    Return Conditions
                </h3>
                <ul className="space-y-4 text-sm text-neutral-400">
                    <li className="flex gap-3">
                        <span className="text-brand-bone font-bold">•</span>
                        <span>Items must be unworn, unwashed, and in original condition.</span>
                    </li>
                    <li className="flex gap-3">
                         <span className="text-brand-bone font-bold">•</span>
                        <span>Original tags must be attached.</span>
                    </li>
                    <li className="flex gap-3">
                         <span className="text-brand-bone font-bold">•</span>
                        <span>Proof of purchase (Order #) is required.</span>
                    </li>
                </ul>
            </div>

            <div className="space-y-6">
                 <h3 className="text-white font-bold uppercase tracking-widest text-lg border-b border-brand-dark pb-4">
                    <XCircle className="inline-block mr-2 mb-1" size={20} />
                    Non-Returnable Items
                </h3>
                <ul className="space-y-4 text-sm text-neutral-400">
                     <li className="flex gap-3">
                        <span className="text-brand-bone font-bold">•</span>
                        <span>Final Sale items (marked as such).</span>
                    </li>
                     <li className="flex gap-3">
                        <span className="text-brand-bone font-bold">•</span>
                        <span>Underwear, socks, and face masks for hygiene reasons.</span>
                    </li>
                     <li className="flex gap-3">
                        <span className="text-brand-bone font-bold">•</span>
                        <span>Gift cards.</span>
                    </li>
                </ul>
            </div>
        </div>

        {/* How to Process */}
        <div className="mb-16">
            <h3 className="text-center text-white font-bold uppercase tracking-widest text-lg mb-8">How to Start a Return</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { step: '01', title: 'Contact Us', desc: 'Email support@goustty.com with your Order # and reason for return.' },
                    { step: '02', title: 'Pack It Up', desc: 'Place item(s) in original packaging. We will send you a shipping label.' },
                    { step: '03', title: 'Ship It', desc: 'Drop off at the nearest carrier location. Refund processed upon inspection.' }
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
            <h3 className="text-2xl font-black uppercase italic mb-4">Need Help?</h3>
            <p className="font-medium mb-6 max-w-lg mx-auto">
                If you received a defective item or have questions about sizing before you buy, our team is here to help.
            </p>
            <a href="mailto:support@goustty.com" className="inline-block border-2 border-brand-black px-8 py-3 font-bold uppercase tracking-widest hover:bg-brand-black hover:text-brand-bone transition-colors">
                Contact Support
            </a>
        </div>

      </div>
    </div>
  );
};
