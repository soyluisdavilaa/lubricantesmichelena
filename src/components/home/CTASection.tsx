"use client";

/* CTA final grande — llama a la acción con WhatsApp */

import { MessageCircle, Phone, ArrowRight } from "lucide-react";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { openWhatsApp } from "@/lib/utils";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import Link from "next/link";

export function CTASection() {
  const { config } = useSiteConfig();

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll direction="scale">
          <div
            className="relative rounded-3xl p-10 md:p-16 overflow-hidden
                       bg-brand-gradient text-white text-center"
          >
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                {config.ctaText.titulo}
              </h2>
              <p className="text-white/80 max-w-xl mx-auto mb-8 text-lg">
                {config.ctaText.descripcion}
              </p>

              <div className="flex flex-row flex-wrap gap-3 sm:gap-4 justify-center items-center w-full">
                <button
                  onClick={() =>
                    openWhatsApp(config.site.waNumber, config.waMessage)
                  }
                  className="flex-1 min-w-[130px] sm:min-w-[150px] flex justify-center items-center gap-2 px-3 sm:px-7 py-3.5 rounded-full
                             bg-white text-brand font-bold text-sm sm:text-base
                             hover:bg-white/90 hover:scale-105
                             active:scale-95 transition-all duration-200"
                >
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  WhatsApp
                </button>

                <Link
                  href="/contacto"
                  className="flex-1 min-w-[130px] sm:min-w-[150px] flex justify-center items-center gap-2 px-3 sm:px-7 py-3.5 rounded-full
                             bg-white/20 text-white font-bold border border-white/30 text-sm sm:text-base
                             hover:bg-white/30 hover:scale-105
                             active:scale-95 transition-all duration-200"
                >
                  Contactar <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href={`tel:${config.site.waNumber}`}
                  className="flex-1 min-w-[130px] sm:min-w-[150px] flex justify-center items-center gap-2 px-3 sm:px-7 py-3.5 rounded-full
                             bg-white/20 text-white font-bold border border-white/30 text-sm sm:text-base
                             hover:bg-white/30 hover:scale-105
                             active:scale-95 transition-all duration-200"
                >
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                  Llamar
                </a>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
