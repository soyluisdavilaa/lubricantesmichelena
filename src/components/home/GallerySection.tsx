"use client";

/* Sección de Galería de la empresa (Masonry/Grilla Asimétrica Premium) */

import { motion } from "framer-motion";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { Image as ImageIcon } from "lucide-react";

export function GallerySection() {
  const { config } = useSiteConfig();
  const gallery = config.nosotros?.imagenes || [];

  if (gallery.length === 0) return null;

  return (
    <section className="py-24 bg-background overflow-hidden relative">
      {/* Background elements */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] opacity-10 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(249,115,22,0.3) 0%, transparent 70%)",
        }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll direction="up">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Nuestras <span className="text-brand">Instalaciones</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Te invitamos a conocer el centro de servicio de Lubricantes Michelena.
              Instalaciones de primer nivel para brindar el cuidado que tu motor merece.
            </p>
          </div>
        </RevealOnScroll>

        {/* Gallery Grid - Responsive Asymmetric Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[200px]">
          {gallery.map((img, i) => {
            // Determine sizes based on index
            const isLarge = i === 0 || i === 3;
            const spanClass = isLarge ? "md:col-span-2 md:row-span-2" : "col-span-1 row-span-1";

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.1,
                  type: "spring",
                  stiffness: 100,
                  damping: 20
                }}
                whileHover={{ scale: 1.02 }}
                className={`relative rounded-2xl overflow-hidden group bg-card border border-white/5 cursor-pointer shadow-lg ${spanClass}`}
              >
                {img.url && !img.url.startsWith("/img/") ? (
                  <>
                    <img
                      src={img.url}
                      alt={img.alt}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <span className="text-white font-medium text-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        {img.alt}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/30 gap-2">
                    <ImageIcon className="w-12 h-12" />
                    <span className="text-xs font-medium px-4 text-center">Falta subir {img.url}</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
