"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { defaultConfig } from "@/lib/defaults";

function getIcon(name: string) {
  const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name];
  return Icon ?? LucideIcons.Star;
}

function CountUp({
  value,
  prefix,
  suffix,
  trigger,
}: {
  value: number;
  prefix: string;
  suffix: string;
  trigger: boolean;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    const duration = 1800;
    const start = Date.now();
    let raf: number;
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [trigger, value]);

  return (
    <span className="tabular-nums">
      {prefix}{display.toLocaleString("es")}{suffix}
    </span>
  );
}

export function StatsSection() {
  const { config } = useSiteConfig();
  const stats = config.stats?.length ? config.stats : defaultConfig.stats;

  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-60px" });

  if (!stats.length) return null;

  return (
    <section ref={sectionRef} className="py-16 bg-brand">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-4">
          {stats.map((stat, i) => {
            const Icon = getIcon(stat.icono);
            return (
              <div
                key={i}
                className="flex flex-col items-center text-center gap-3 px-6 relative
                           sm:[&:not(:last-child)]:after:absolute sm:[&:not(:last-child)]:after:right-0
                           sm:[&:not(:last-child)]:after:top-1/4 sm:[&:not(:last-child)]:after:h-1/2
                           sm:[&:not(:last-child)]:after:w-px sm:[&:not(:last-child)]:after:bg-white/30"
              >
                <div className="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <p className="text-4xl sm:text-5xl font-extrabold text-white">
                  <CountUp
                    value={stat.valor}
                    prefix={stat.prefijo}
                    suffix={stat.sufijo}
                    trigger={inView}
                  />
                </p>
                <p className="text-sm sm:text-base font-semibold text-white/80 uppercase tracking-wide">
                  {stat.etiqueta}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
