"use client";

/* Grid de servicios con íconos animados y hover card premium */

import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import type { LucideProps } from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

export function ServicesSection() {
  const { services } = useSiteConfig();

  return (
    <section className="py-20 relative">
      {/* Subtle top wave from hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <RevealOnScroll>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-brand font-semibold text-sm uppercase tracking-wider">
              Servicios
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4">
              Soluciones Profesionales para Tu Vehículo
            </h2>
            <p className="text-muted-foreground">
              Ofrecemos una gama completa de servicios de mantenimiento con técnicos certificados y
              productos de primera calidad.
            </p>
          </div>
        </RevealOnScroll>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => {
            const IconComponent = (
              Icons as unknown as Record<
                string,
                ForwardRefExoticComponent<LucideProps & RefAttributes<SVGSVGElement>>
              >
            )[service.icono];

            return (
              <RevealOnScroll key={service.id} delay={i * 0.07}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="group p-6 rounded-2xl bg-card border border-border relative overflow-hidden
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

                  <h3 className="text-lg font-semibold mb-2 relative">{service.nombre}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 relative flex-1">
                    {service.descripcion}
                  </p>

                  <div className="flex items-center justify-between relative mt-auto">
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
                </motion.div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
