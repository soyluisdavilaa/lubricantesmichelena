"use client";

/* Botón flotante de WhatsApp — bottom-right */

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { openWhatsApp } from "@/lib/utils";
import { useSiteConfig } from "@/context/SiteConfigContext";

export function FloatingWhatsApp() {
  const { config } = useSiteConfig();

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
      onClick={() => openWhatsApp(config.site.waNumber, config.waMessage)}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full
                 bg-whatsapp text-white shadow-lg shadow-whatsapp/30
                 hover:bg-whatsapp-hover hover:scale-110
                 active:scale-95 transition-all duration-200
                 flex items-center justify-center"
      aria-label="Contactar por WhatsApp"
    >
      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full bg-whatsapp/40 animate-ping" />
      <MessageCircle className="w-6 h-6 relative z-10" />
    </motion.button>
  );
}
