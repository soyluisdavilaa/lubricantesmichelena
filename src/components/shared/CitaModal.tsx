"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CalendarCheck, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { addCitaPublic } from "@/lib/actions";

interface CitaModalProps {
  open: boolean;
  onClose: () => void;
  servicioInicial?: string;
}

// Lun–Sáb (sin domingo)
const DIAS = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa"];
const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

// Convierte "HH:MM" → "H:MM AM/PM"
function to12h(time: string): string {
  const [hStr, mStr] = time.split(":");
  const h = parseInt(hStr, 10);
  const ampm = h < 12 ? "AM" : "PM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${mStr} ${ampm}`;
}

// Horarios: Lun-Vie 8:00-17:00, Sáb 8:00-13:00
function getHorarios(fecha: string): string[] {
  if (!fecha) return [];
  const dow = new Date(fecha + "T12:00:00").getDay(); // 0=Dom,6=Sáb
  if (dow === 0) return [];
  const fin = dow === 6 ? 16 : 17;
  const slots: string[] = [];
  for (let h = 8; h < fin; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
    slots.push(`${String(h).padStart(2, "0")}:30`);
  }
  slots.push(`${String(fin).padStart(2, "0")}:00`);
  return slots;
}

function MiniCalendar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const days = useMemo(() => {
    // dow 0=Sun,1=Mon..6=Sat → map to Mon-first (0=Mon..5=Sat), skip Sun
    const firstDow = new Date(viewYear, viewMonth, 1).getDay();
    const offset = firstDow === 0 ? 6 : firstDow - 1; // Sun→6, Mon→0, Sat→5
    const total = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells: (number | null)[] = Array(offset).fill(null);
    for (let d = 1; d <= total; d++) {
      const dow = new Date(viewYear, viewMonth, d).getDay();
      if (dow !== 0) cells.push(d); // skip Sundays entirely
    }
    return cells;
  }, [viewYear, viewMonth]);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const toISO = (d: number) =>
    `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  return (
    <div className="rounded-2xl border border-border bg-background p-3 select-none">
      {/* Nav */}
      <div className="flex items-center justify-between mb-3">
        <button type="button" onClick={prevMonth} className="w-7 h-7 rounded-lg hover:bg-secondary flex items-center justify-center transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-semibold">{MESES[viewMonth]} {viewYear}</span>
        <button type="button" onClick={nextMonth} className="w-7 h-7 rounded-lg hover:bg-secondary flex items-center justify-center transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-6 mb-1">
        {DIAS.map(d => (
          <div key={d} className="text-center text-[10px] font-semibold text-muted-foreground py-1">{d}</div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-6 gap-0.5">
        {days.map((d, i) => {
          if (!d) return <div key={`e-${i}`} />;
          const iso = toISO(d);
          const date = new Date(iso + "T12:00:00");
          const isPast = date < today;
          const isSelected = iso === value;
          const isToday = iso === today.toISOString().split("T")[0];
          const disabled = isPast;

          return (
            <button
              key={iso}
              type="button"
              disabled={disabled}
              onClick={() => onChange(iso)}
              className={`
                h-8 w-full rounded-lg text-xs font-medium transition-all
                ${disabled ? "text-muted-foreground/30 cursor-not-allowed" : "hover:bg-brand/15 cursor-pointer"}
                ${isSelected ? "bg-brand text-white hover:bg-brand font-bold" : ""}
                ${isToday && !isSelected ? "ring-1 ring-brand text-brand" : ""}
              `}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function CitaModal({ open, onClose, servicioInicial = "" }: CitaModalProps) {
  const { services } = useSiteConfig();
  const [data, setData] = useState({
    nombre: "",
    telefono: "",
    servicio: servicioInicial,
    fecha: "",
    hora: "",
    vehiculo: "",
    notas: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const horarios = getHorarios(data.fecha);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.fecha || !data.hora) return;
    setLoading(true);
    try {
      await addCitaPublic({
        id: Date.now(),
        ...data,
        fechaRecibido: new Date().toISOString(),
        estado: "pendiente",
      });
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setSuccess(false);
      setData({ nombre: "", telefono: "", servicio: servicioInicial, fecha: "", hora: "", vehiculo: "", notas: "" });
    }, 300);
  };

  const inputCls = "w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-all text-sm";

  // Format display date
  const fechaDisplay = data.fecha
    ? new Date(data.fecha + "T12:00:00").toLocaleDateString("es-VE", { weekday: "long", day: "numeric", month: "long" })
    : null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed inset-x-3 top-[4%] bottom-3 sm:inset-auto sm:left-1/2 sm:top-1/2
                       sm:-translate-x-1/2 sm:-translate-y-1/2
                       z-[91] sm:w-full sm:max-w-lg sm:max-h-[94vh]
                       bg-card rounded-3xl border border-border shadow-2xl
                       overflow-hidden flex flex-col"
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
              <div className="flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-brand" />
                <h2 className="font-bold text-lg">Agendar Cita</h2>
              </div>
              <button
                onClick={handleClose}
                className="w-9 h-9 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5">
              {success ? (
                <div className="flex flex-col items-center gap-4 text-center py-10">
                  <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                  <h3 className="text-xl font-bold">¡Cita recibida!</h3>
                  <p className="text-muted-foreground text-sm">
                    Te contactaremos pronto para confirmar tu turno.
                  </p>
                  <button
                    onClick={handleClose}
                    className="mt-2 px-6 py-2.5 rounded-xl bg-brand text-white font-bold text-sm hover:bg-brand/90 transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">

                  {/* Nombre + Teléfono */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Nombre *</label>
                      <input type="text" name="nombre" required value={data.nombre} onChange={handleChange} placeholder="Tu nombre" className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Teléfono *</label>
                      <input type="tel" name="telefono" required value={data.telefono} onChange={handleChange} placeholder="04XX-XXXXXXX" className={inputCls} />
                    </div>
                  </div>

                  {/* Servicio */}
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Servicio *</label>
                    <select name="servicio" required value={data.servicio} onChange={handleChange} className={inputCls}>
                      <option value="">Selecciona un servicio</option>
                      {services.map((s) => (
                        <option key={s.id} value={s.nombre}>{s.nombre}</option>
                      ))}
                    </select>
                  </div>

                  {/* Calendario */}
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      Fecha *
                      {fechaDisplay && (
                        <span className="ml-2 text-brand font-normal capitalize">{fechaDisplay}</span>
                      )}
                    </label>
                    <MiniCalendar value={data.fecha} onChange={(v) => setData(prev => ({ ...prev, fecha: v, hora: "" }))} />
                  </div>

                  {/* Horarios */}
                  {data.fecha && (
                    <div>
                      <label className="block text-sm font-medium mb-1.5">
                        Hora *
                        {data.hora && <span className="ml-2 text-brand font-normal">{to12h(data.hora)}</span>}
                      </label>
                      {horarios.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No hay turnos disponibles este día.</p>
                      ) : (
                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                          {horarios.map((h) => (
                            <button
                              key={h}
                              type="button"
                              onClick={() => setData(prev => ({ ...prev, hora: h }))}
                              className={`
                                py-2 rounded-xl text-xs font-semibold border transition-all
                                ${data.hora === h
                                  ? "bg-brand text-white border-brand"
                                  : "bg-background border-border hover:border-brand/50 hover:bg-brand/5"}
                              `}
                            >
                              {to12h(h)}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Vehículo */}
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Vehículo *</label>
                    <input type="text" name="vehiculo" required value={data.vehiculo} onChange={handleChange} placeholder="Ej: Toyota Corolla 2020" className={inputCls} />
                  </div>

                  {/* Notas */}
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Notas adicionales</label>
                    <textarea name="notas" rows={2} value={data.notas} onChange={handleChange} placeholder="Cualquier detalle..." className={`${inputCls} resize-none`} />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading || !data.fecha || !data.hora}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl
                               bg-brand text-white font-bold hover:bg-brand/90 transition-all
                               active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CalendarCheck className="w-5 h-5" />
                    {loading ? "Enviando..." : "Confirmar Cita"}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
