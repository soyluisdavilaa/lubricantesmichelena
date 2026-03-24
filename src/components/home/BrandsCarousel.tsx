"use client";

/* Carrusel infinito de marcas — scroll automático sin pausa */

import { motion } from "framer-motion";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";

const BRANDS = [
  "Mobil",
  "Castrol",
  "Shell",
  "Total",
  "Valvoline",
  "Pennzoil",
  "Motul",
  "Gulf",
  "Quaker State",
  "Havoline",
  "Repsol",
  "Liqui Moly",
];

/* Duplicamos para el loop infinito */
const TRACK = [...BRANDS, ...BRANDS];

export function BrandsCarousel() {
  return (
    <section className="py-14 overflow-hidden border-y border-border bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <RevealOnScroll>
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Marcas que distribuimos
          </p>
        </RevealOnScroll>
      </div>

      {/* Scrolling track */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
          style={{ background: "linear-gradient(90deg, var(--background) 0%, transparent 100%)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
          style={{ background: "linear-gradient(270deg, var(--background) 0%, transparent 100%)" }} />

        <motion.div
          className="flex gap-12 w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        >
          {TRACK.map((brand, i) => (
            <div
              key={i}
              className="flex items-center justify-center px-6 py-3 rounded-xl
                         bg-card border border-border/60 min-w-[120px]
                         hover:border-brand/30 hover:bg-brand/5 transition-colors duration-200
                         cursor-default select-none"
            >
              <span className="text-sm font-semibold text-muted-foreground whitespace-nowrap">
                {brand}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
