"use client";

/* Horario del negocio con estado abierto/cerrado en tiempo real */

import { Clock, MapPin } from "lucide-react";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { useIsOpenNow } from "@/hooks/useIsOpenNow";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { fmtHora } from "@/lib/utils";

const DAYS_ORDER = [
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
  "domingo",
];

export function ScheduleSection() {
  const { config } = useSiteConfig();
  const { isOpen, currentDay } = useIsOpenNow(config.horarios);

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Schedule */}
          <RevealOnScroll direction="left">
            <div className="p-8 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Horario de Atención</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isOpen ? "bg-green-500 animate-pulse" : "bg-red-500"
                      }`}
                    />
                    <span className="text-sm text-muted-foreground">
                      {isOpen ? "Abierto ahora" : "Cerrado ahora"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {DAYS_ORDER.map((day) => {
                  const h = config.horarios[day];
                  const isToday = day === currentDay;
                  return (
                    <div
                      key={day}
                      className={`flex items-center justify-between py-2.5 px-3 rounded-lg text-sm ${
                        isToday
                          ? "bg-brand/10 text-brand font-semibold"
                          : "text-muted-foreground"
                      }`}
                    >
                      <span className="capitalize">{day}</span>
                      <span>
                        {h?.cerrado
                          ? "Cerrado"
                          : `${fmtHora(h?.abre ?? "")} — ${fmtHora(h?.cierra ?? "")}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </RevealOnScroll>

          {/* Map */}
          <RevealOnScroll direction="right">
            <div className="rounded-2xl overflow-hidden border border-border h-full min-h-[400px] relative">
              <div className="absolute inset-0 bg-muted flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-10 h-10 text-brand mx-auto mb-3" />
                  <p className="text-sm font-medium">{config.site.nombre}</p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                    {config.site.direccion}
                  </p>
                  <a
                    href={config.site.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-3 text-sm text-brand hover:underline"
                  >
                    Ver en Google Maps
                  </a>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
