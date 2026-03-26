"use client";

/* Grid de servicios con íconos animados y hover card premium */

import { useState } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { openWhatsApp } from "@/lib/utils";
import { CitaModal } from "@/components/shared/CitaModal";
import type { LucideProps } from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

export function ServicesSection() {
  const { services, config, isLoading } = useSiteConfig();
  const [citaOpen, setCitaOpen] = useState(false);
  const [servicioSeleccionado, setServicioSeleccionado] = useState("");

  return (
    <section
      className="py-20 relative"
      style={config.bgImages?.servicios ? {
        backgroundImage: `url(${config.bgImages.servicios})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      } : undefined}
    >
      {config.bgImages?.servicios && (
        <div className="absolute inset-0 bg-black/60" />
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <RevealOnScroll>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-flex items-center px-5 py-2 mb-4 rounded-full border border-brand/30 bg-brand/5 text-brand font-bold text-sm sm:text-base uppercase tracking-widest shadow-sm">
              {config.serviciosText.badge}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4">
              {config.serviciosText.titulo}
            </h2>
            <p className="text-muted-foreground">
              {config.serviciosText.descripcion}
            </p>
          </div>
        </RevealOnScroll>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={`skeleton-service-${i}`}
                  className="h-[240px] rounded-2xl bg-card border border-border bg-gradient-to-r from-card to-muted animate-pulse"
                />
              ))
            : services.map((service, i) => {
            const IconComponent = (
              Icons as unknown as Record<
                string,
                ForwardRefExoticComponent<LucideProps & RefAttributes<SVGSVGElement>>
              >
            )[service.icono];

            const waMsg = `Hola, me gustaría consultar sobre el servicio: ${service.nombre}`;

            return (
              <RevealOnScroll key={service.id} delay={i * 0.07}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="group p-4 sm:p-6 rounded-2xl bg-card border border-border relative overflow-hidden
                             hover:border-brand/30 hover:shadow-xl hover:shadow-brand/8
                             transition-colors duration-300 cursor-default flex flex-col h-full"
                >
                  {/* Gradient bg on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(ellipse at top left, rgba(249,115,22,0.06) 0%, transparent 60%)",
                    }}
                  />

                  {/* Icon with animated ring */}
                  <div className="relative w-12 h-12 mb-4">
                    <div
                      className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100
                                 transition-all duration-300 scale-110"
                      style={{
                        background: "rgba(6,149,66,0.15)",
                        boxShadow: "0 0 0 1px rgba(249,115,22,0.2)",
                      }}
                    />
                    <div
                      className="relative w-12 h-12 rounded-xl bg-brand/10 text-brand
                                 flex items-center justify-center
                                 group-hover:bg-brand group-hover:text-white
                                 transition-colors duration-300"
                    >
                      {IconComponent ? (
                        <motion.div
                          whileHover={{ rotate: [0, -10, 10, 0] }}
                          transition={{ duration: 0.4 }}
                        >
                          <IconComponent className="w-6 h-6" />
                        </motion.div>
                      ) : (
                        <Icons.Wrench className="w-6 h-6" />
                      )}
                    </div>
                  </div>

                  <h3 className="text-sm sm:text-lg font-semibold mb-1 sm:mb-2 relative leading-tight">{service.nombre}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-3 sm:mb-4 relative flex-1">
                    {service.descripcion}
                  </p>

                  {/* Precio + Duración */}
                  <div className="flex items-center justify-between relative mb-4">
                    <span
                      className="text-lg font-bold"
                      style={{
                        background: "#069542",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {service.precio}
                    </span>
                    <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                      {service.duracion}
                    </span>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex gap-1 sm:gap-2 mt-auto">
                    <button
                      onClick={() => { setServicioSeleccionado(service.nombre); setCitaOpen(true); }}
                      className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-2 rounded-xl
                                 bg-brand/10 text-brand text-xs font-bold border border-brand/20
                                 hover:bg-brand hover:text-white transition-all duration-200"
                    >
                      <Icons.CalendarCheck className="w-3.5 h-3.5 shrink-0" />
                      <span className="hidden sm:inline">Agendar</span>
                    </button>
                    <button
                      onClick={() => openWhatsApp(config.site.waNumber, waMsg)}
                      className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-2 rounded-xl
                                 bg-whatsapp/10 text-whatsapp text-xs font-bold border border-whatsapp/20
                                 hover:bg-whatsapp hover:text-white transition-all duration-200"
                    >
                      <Icons.MessageCircle className="w-3.5 h-3.5 shrink-0" />
                      <span className="hidden sm:inline">Consultar</span>
                    </button>
                  </div>
                </motion.div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>

      <CitaModal
        open={citaOpen}
        onClose={() => setCitaOpen(false)}
        servicioInicial={servicioSeleccionado}
      />
    </section>
  );
}


