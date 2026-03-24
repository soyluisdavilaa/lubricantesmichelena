"use client";

/* Sección de testimonios / reseñas con hover motion */

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";

export function TestimonialsSection() {
  const { reviews } = useSiteConfig();
  const visible = reviews.filter((r) => r.visible);

  if (visible.length === 0) return null;

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-brand font-semibold text-sm uppercase tracking-wider">
              Testimonios
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4">
              Lo Que Dicen Nuestros Clientes
            </h2>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visible.map((review, i) => (
            <RevealOnScroll key={review.id} delay={i * 0.12}>
              <motion.div
                whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(249,115,22,0.10)" }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="group p-6 rounded-2xl bg-card border border-border
                           hover:border-brand/25 transition-colors duration-300 relative overflow-hidden"
              >
                {/* Subtle gradient bg on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse at top left, rgba(249,115,22,0.05) 0%, transparent 65%)",
                  }}
                />

                <motion.div
                  whileHover={{ rotate: -10, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="absolute top-4 right-4"
                >
                  <Quote className="w-8 h-8 text-brand/15" />
                </motion.div>

                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      className={`w-4 h-4 transition-colors duration-200 ${
                        j < review.rating
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-4 relative">
                  &ldquo;{review.texto}&rdquo;
                </p>

                <div className="flex items-center gap-3 relative">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white shrink-0"
                    style={{ background: "#069542" }}
                  >
                    {review.nombre.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{review.nombre}</p>
                    <p className="text-xs text-muted-foreground">
                      {review.fecha}
                    </p>
                  </div>
                </div>
              </motion.div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
