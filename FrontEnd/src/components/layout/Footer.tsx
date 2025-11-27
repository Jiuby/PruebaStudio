import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => (
  <footer className="bg-brand-black border-t border-brand-dark py-12 px-6">
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
      <div className="col-span-1 md:col-span-2">
        <h2 className="text-3xl font-black uppercase italic text-white mb-4">Goustty</h2>
        <p className="text-neutral-500 text-sm max-w-md">
          Redefining urban aesthetic through oversized silhouettes and aggressive details.
          Born in the streets, made for the world.
        </p>
      </div>
      <div>
        <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-4">Help</h3>
        <ul className="space-y-2 text-neutral-500 text-sm">
          <li><Link to="/shipping" className="hover:text-brand-bone">Shipping Info</Link></li>
          <li><Link to="/returns" className="hover:text-brand-bone">Returns & Exchanges</Link></li>
          <li><Link to="/size-guide" className="hover:text-brand-bone">Size Guide</Link></li>
          <li><Link to="/contact" className="hover:text-brand-bone">Contact Us</Link></li>
          <li><Link to="/faq" className="hover:text-brand-bone">FAQ</Link></li>
        </ul>
      </div>
      <div>
        <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-4">Social</h3>
        <ul className="space-y-2 text-neutral-500 text-sm">
          <li><a href="#" className="hover:text-brand-bone">Instagram</a></li>
          <li><a href="#" className="hover:text-brand-bone">TikTok</a></li>
        </ul>
      </div>
    </div>
    <div className="container mx-auto mt-12 pt-8 border-t border-brand-dark flex flex-col md:flex-row justify-between items-center text-xs text-neutral-600">
      <p>&copy; 2024 GOUSTTY. All rights reserved.</p>
      <p className="mt-2 md:mt-0">Cúcuta, Colombia.</p>
    </div>
  </footer>
);
