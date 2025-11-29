
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PenTool, Scissors, Package, Globe, ArrowRight } from 'lucide-react';

export const About: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const processSteps = [
    {
      icon: PenTool,
      title: 'Concept & Design',
      desc: 'Born from the chaos of the streets. Every piece starts as a sketch in our Cúcuta studio, focusing on aggressive silhouettes and oversized fits.'
    },
    {
      icon: Scissors,
      title: 'Premium Sourcing',
      desc: 'We reject fast fashion fabrics. We source only heavyweight cottons (240gsm+) and durable denims that stand the test of time and wear.'
    },
    {
      icon: Package,
      title: 'Local Production',
      desc: 'Manufactured locally in Colombia. We work closely with skilled artisans to ensure every stitch, embroidery, and print meets our obsession with quality.'
    },
    {
      icon: Globe,
      title: 'Global Delivery',
      desc: 'From our block to yours. We carefully package every order to ensure the GOUSTTY experience remains authentic, wherever you are.'
    }
  ];

  return (
    <div className="bg-brand-black min-h-screen pt-24 pb-20">
      
      {/* Hero / Manifesto */}
      <section className="container mx-auto px-4 md:px-8 mb-24 text-center">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-brand-bone uppercase tracking-[0.3em] text-xs font-bold mb-6"
        >
          The Goustty Manifesto
        </motion.p>
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl lg:text-9xl font-black text-white uppercase italic tracking-tighter leading-none mb-8"
        >
          Not Just<br />A Brand.<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-bone to-neutral-500">A Movement.</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
        >
          Redefining the urban landscape of Cúcuta, Colombia. We blend Y2K aesthetics with modern streetwear culture to create unisex pieces that demand attention.
        </motion.p>
      </section>

      {/* The Vision / Image Grid */}
      <section className="border-y border-brand-dark bg-brand-dark/10 py-24 mb-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter">
                The Goustty<br/>Aesthetic
              </h2>
              <div className="h-1 w-20 bg-brand-bone"></div>
              <p className="text-neutral-400 leading-relaxed">
                We believe clothing has no gender, only attitude. Our collections are strictly unisex, designed to drape and flow on any body type. We draw inspiration from the raw energy of the city—concrete textures, neon lights, and the underground music scene.
              </p>
              <p className="text-neutral-400 leading-relaxed">
                Founded in 2024, GOUSTTY started as a reaction against boring, fitted clothing. We wanted volume. We wanted structure. We wanted pieces that felt like armor for the urban explorer.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="aspect-[3/4] bg-brand-dark overflow-hidden mt-8"
              >
                <img src="https://picsum.photos/id/103/600/800" alt="Urban Vibe 1" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="aspect-[3/4] bg-brand-dark overflow-hidden"
              >
                <img src="https://picsum.photos/id/338/600/800" alt="Urban Vibe 2" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="aspect-[3/4] bg-brand-dark overflow-hidden col-span-2"
              >
                <img src="https://picsum.photos/id/249/1200/800" alt="Store Environment" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* The Process */}
      <section className="container mx-auto px-4 md:px-8 mb-24">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">
            How We Work
          </h2>
          <p className="text-neutral-500 uppercase tracking-widest text-xs">
            Quality over quantity. Always.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {processSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="bg-brand-dark/20 border border-brand-dark p-8 group hover:bg-brand-dark/40 transition-colors">
                <div className="w-12 h-12 bg-brand-black border border-brand-dark flex items-center justify-center mb-6 text-brand-bone group-hover:scale-110 transition-transform">
                  <Icon size={24} />
                </div>
                <h3 className="text-xl font-black text-white uppercase italic mb-4">{step.title}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 md:px-8 text-center">
        <div className="bg-brand-bone text-brand-black py-16 md:py-24 px-4">
          <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-6">
            Ready to Join?
          </h2>
          <p className="text-brand-black/70 font-bold uppercase tracking-widest text-sm mb-8">
            Explore the latest drop and define your style.
          </p>
          <Link 
            to="/shop"
            className="inline-flex items-center gap-2 border-2 border-brand-black px-8 py-4 font-black uppercase tracking-widest hover:bg-brand-black hover:text-brand-bone transition-colors"
          >
            Go To Shop <ArrowRight size={20} />
          </Link>
        </div>
      </section>

    </div>
  );
};
