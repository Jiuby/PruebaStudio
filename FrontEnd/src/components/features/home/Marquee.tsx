import React from 'react';

const MARQUEE_CONTENT = [
  "Envíos a Todo el Mundo",
  "♦",
  "Colección Unisex",
  "♦",
  "Telas Premium",
  "♦",
  "Nuevo Lanzamiento Disponible",
  "♦",
  "Envíos a Todo el Mundo",
  "♦",
  "Colección Unisex",
  "♦",
  "Telas Premium",
  "♦",
  "Nuevo Lanzamiento Disponible",
  "♦"
];

export const Marquee: React.FC = () => {
  return (
    <div className="bg-brand-bone text-brand-black py-2 overflow-hidden border-y border-brand-black flex select-none">
      <div className="animate-marquee flex flex-shrink-0 items-center whitespace-nowrap">
        {MARQUEE_CONTENT.map((text, index) => (
          <span key={`original-${index}`} className="mx-8 font-bold text-xs md:text-sm tracking-[0.2em] uppercase">
            {text}
          </span>
        ))}
      </div>
      <div className="animate-marquee flex flex-shrink-0 items-center whitespace-nowrap">
        {MARQUEE_CONTENT.map((text, index) => (
          <span key={`copy-${index}`} className="mx-8 font-bold text-xs md:text-sm tracking-[0.2em] uppercase">
            {text}
          </span>
        ))}
      </div>
    </div>
  );
};