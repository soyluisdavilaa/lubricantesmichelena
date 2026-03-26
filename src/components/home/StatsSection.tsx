"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface Stat {
  prefix: string;
  value: number;
  suffix: string;
  label: string;
  icon: string;
}

const STATS: Stat[] = [
  { prefix: "+", value: 53,     suffix: "",   label: "Años de Experiencia",    icon: "🏆" },
  { prefix: "+", value: 400000, suffix: "",   label: "Servicios Realizados",   icon: "🔧" },
  { prefix: "+", value: 5000,   suffix: "",   label: "Clientes Satisfechos",   icon: "😊" },
];

function CountUp({ value, prefix, suffix }: { value: number; prefix: string; suffix: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!inView) return;
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
  }, [inView, value]);

  return (
    <span ref={ref}>
      {prefix}{display.toLocaleString("es")}{suffix}
    </span>
  );
}

export function StatsSection() {
  return (
    <section className="py-14 border-y border-border bg-card/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-4">
          {STATS.map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center gap-2 px-6 relative
                         sm:[&:not(:last-child)]:after:absolute sm:[&:not(:last-child)]:after:right-0
                         sm:[&:not(:last-child)]:after:top-1/4 sm:[&:not(:last-child)]:after:h-1/2
                         sm:[&:not(:last-child)]:after:w-px sm:[&:not(:last-child)]:after:bg-border"
            >
              <span className="text-3xl mb-1">{stat.icon}</span>
              <p className="text-4xl sm:text-5xl font-extrabold text-brand tabular-nums">
                <CountUp value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              </p>
              <p className="text-sm sm:text-base font-medium text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
