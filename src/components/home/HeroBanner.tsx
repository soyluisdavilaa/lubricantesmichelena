"use client";

/* Banner superior — promo strip animado */

import { motion } from "framer-motion";
import { useSiteConfig } from "@/context/SiteConfigContext";

export function HeroBanner() {
  const { config } = useSiteConfig();
  const { banner } = config;

  if (!banner.activo) return null;

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="w-full py-2.5 text-center text-sm font-medium overflow-hidden"
      style={{ background: banner.fondo, color: banner.color }}
    >
      <motion.span
        animate={{ x: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      >
        {banner.texto}
      </motion.span>
    </motion.div>
  );
}
