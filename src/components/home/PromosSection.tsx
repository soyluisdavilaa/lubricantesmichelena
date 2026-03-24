"use client";

/* Sección de promociones — 3 tarjetas premium con hover motion */

import { motion } from "framer-motion";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { Tag, MessageCircle } from "lucide-react";
import { openWhatsApp } from "@/lib/utils";

export function PromosSection() {
  const { promos, config } = useSiteConfig();
  const activePromos = promos.filter((p) => p.activo);

  if (activePromos.length === 0) return null;

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-brand font-semibold text-sm uppercase tracking-wider">
              Ofertas
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4">
              Promociones Activas
            </h2>
            <p className="text-muted-foreground">
              Aprovecha nuestras ofertas especiales y ahorra en el mantenimiento
              de tu vehículo.
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activePromos.map((promo, i) => (
            <RevealOnScroll key={promo.id} delay={i * 0.12}>
              <motion.div
                whileHover={{ y: -8, boxShadow: "0 24px 48px rgba(249,115,22,0.14)" }}
                transition={{ type: "spring", stiffness: 280, damping: 20 }}
                className="group relative p-6 rounded-2xl bg-card border border-border
                           hover:border-brand/30 transition-colors duration-300 overflow-hidden cursor-default"
              >
                {/* Top gradient bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-brand-gradient" />

                {/* Gradient bg on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse at top left, rgba(249,115,22,0.07) 0%, transparent 60%)",
                  }}
                />

                {/* Badge */}
                <span className="relative inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-semibold mb-4">
                  {promo.badge}
                </span>

                {/* Discount */}
                <div className="relative flex items-center gap-3 mb-3">
                  <motion.div
                    whileHover={{ rotate: [0, -8, 8, 0] }}
                    transition={{ duration: 0.4 }}
                    className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center
                               group-hover:bg-brand group-hover:text-white transition-colors duration-300"
                  >
                    <Tag className="w-6 h-6 text-brand group-hover:text-white transition-colors duration-300" />
                  </motion.div>
                  <span className="text-2xl font-bold text-brand">
                    {promo.descuento}
                  </span>
                </div>

                <h3 className="relative text-lg font-semibold mb-2">{promo.titulo}</h3>
                <p className="relative text-sm text-muted-foreground leading-relaxed mb-5">
                  {promo.descripcion}
                </p>

                <button
                  onClick={() =>
                    openWhatsApp(
                      config.site.waNumber,
                      `¡Hola! Me interesa la promo: ${promo.titulo} (${promo.descuento})`
                    )
                  }
                  className="relative w-full flex items-center justify-center gap-2 px-4 py-2.5
                             rounded-xl bg-whatsapp/10 text-whatsapp font-medium text-sm
                             hover:bg-whatsapp hover:text-white transition-colors duration-200"
                >
                  <MessageCircle className="w-4 h-4" />
                  Consultar por WhatsApp
                </button>
              </motion.div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
