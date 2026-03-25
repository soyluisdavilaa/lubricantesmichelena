"use client";

/* Sección Sobre Nosotros con valores y stagger en items */

import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import type { LucideProps } from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";

function renderAnimatedTitle(title: string) {
  // Ej: "+5000" -> ["+", "5000", ""]
  // Ej: "12 Años" -> ["", "12", " Años"]
  const match = title.match(/^([^\d]*)(\d+)(.*)$/);
  if (match) {
    const [, prefix, numStr, suffix] = match;
    const target = parseInt(numStr, 10);
    return (
      <span className="inline-flex items-center gap-0.5">
        {prefix && <span>{prefix}</span>}
        <AnimatedCounter target={target} suffix={suffix} duration={2000} />
      </span>
    );
  }
  return title;
}

export function AboutSection() {
  const { config } = useSiteConfig();
  const { nosotros } = config;

  return (
    <section className="py-20 bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <RevealOnScroll direction="left">
            <div>
              <span className="inline-flex py-1 text-brand font-bold text-base sm:text-lg uppercase tracking-widest">
                {nosotros.badge}
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-6">
                {nosotros.titulo}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                {nosotros.parrafo}
              </p>

              {/* Values grid con stagger */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {nosotros.valores.map((valor, i) => {
                  const IconComponent = (
                    Icons as unknown as Record<
                      string,
                      ForwardRefExoticComponent<LucideProps & RefAttributes<SVGSVGElement>>
                    >
                  )[valor.icono];

                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ delay: i * 0.08, type: "spring", stiffness: 260, damping: 22 }}
                      whileHover={{ scale: 1.02, borderColor: "rgba(249,115,22,0.3)" }}
                      className="flex items-start gap-3 p-3 rounded-xl bg-card border border-border
                                 transition-colors duration-200 cursor-default"
                    >
                      <motion.div
                        whileHover={{ rotate: [0, -8, 8, 0] }}
                        transition={{ duration: 0.4 }}
                        className="w-9 h-9 rounded-lg bg-brand/10 text-brand flex items-center justify-center shrink-0"
                      >
                        {IconComponent ? (
                          <IconComponent className="w-4 h-4" />
                        ) : (
                          <Icons.Star className="w-4 h-4" />
                        )}
                      </motion.div>
                      <div>
                        <h4 className="text-sm font-semibold">{renderAnimatedTitle(valor.titulo)}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {valor.texto}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </RevealOnScroll>

          {/* Image grid */}
          <RevealOnScroll direction="right">
            <div className="grid grid-cols-2 gap-3">
              {nosotros.imagenes.map((img, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className={`rounded-2xl overflow-hidden bg-muted ${
                    i === 0 ? "row-span-2" : ""
                  }`}
                >
                  {img.url ? (
                    <img
                      src={img.url}
                      alt={img.alt}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full min-h-[150px] flex items-center justify-center">
                      <Icons.Image className="w-8 h-8 text-muted-foreground/20" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
