"use client";

/* Sección de estadísticas — números con gradiente naranja→verde */

import { useSiteConfig } from "@/context/SiteConfigContext";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";

export function StatsSection() {
  const { config } = useSiteConfig();

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-card/60 border-y border-border" />
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(249,115,22,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.8) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {config.stats.map((stat, i) => (
            <RevealOnScroll key={i} delay={i * 0.08}>
              <div className="text-center group">
                <div
                  className="text-4xl sm:text-5xl font-bold mb-2 tabular-nums"
                  style={{
                    background: "#069542",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  <AnimatedCounter target={stat.valor} suffix={stat.sufijo} />
                </div>
                <div
                  className="mx-auto mb-2 h-0.5 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "#e87b20" }}
                />
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
