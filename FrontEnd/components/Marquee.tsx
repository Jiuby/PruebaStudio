import React from 'react';

export const Marquee: React.FC = () => {
  return (
    <div className="bg-brand-bone text-brand-black py-2 overflow-hidden whitespace-nowrap border-y border-brand-black">
      <div className="animate-marquee inline-block font-bold text-xs md:text-sm tracking-[0.2em] uppercase">
        <span className="mx-8">Worldwide Shipping</span>
        <span className="mx-8">♦</span>
        <span className="mx-8">Unisex Collection</span>
        <span className="mx-8">♦</span>
        <span className="mx-8">Premium Fabrics</span>
        <span className="mx-8">♦</span>
        <span className="mx-8">New Drop Available</span>
        <span className="mx-8">♦</span>
        <span className="mx-8">Worldwide Shipping</span>
        <span className="mx-8">♦</span>
        <span className="mx-8">Unisex Collection</span>
        <span className="mx-8">♦</span>
        <span className="mx-8">Premium Fabrics</span>
        <span className="mx-8">♦</span>
        <span className="mx-8">New Drop Available</span>
      </div>
    </div>
  );
};
