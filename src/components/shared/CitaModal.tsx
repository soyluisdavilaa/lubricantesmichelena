"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CalendarCheck, CheckCircle2 } from "lucide-react";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { addCitaPublic } from "@/lib/actions";

interface CitaModalProps {
  open: boolean;
  onClose: () => void;
  servicioInicial?: string;
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed inset-x-3 top-[5%] bottom-3 sm:inset-auto sm:left-1/2 sm:top-1/2
                       sm:-translate-x-1/2 sm:-translate-y-1/2
                       z-[91] sm:w-full sm:max-w-lg sm:max-h-[92vh]
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
            <div className="flex-1 overflow-y-auto p-6">
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
                <form onSubmit={handleSubmit} className="space-y-4">
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

                  <div>
                    <label className="block text-sm font-medium mb-1.5">Servicio *</label>
                    <select name="servicio" required value={data.servicio} onChange={handleChange} className={inputCls}>
                      <option value="">Selecciona un servicio</option>
                      {services.map((s) => (
                        <option key={s.id} value={s.nombre}>{s.nombre}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Fecha *</label>
                      <input type="date" name="fecha" required value={data.fecha} onChange={handleChange} min={new Date().toISOString().split("T")[0]} className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Hora *</label>
                      <input type="time" name="hora" required value={data.hora} onChange={handleChange} className={inputCls} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">Vehículo *</label>
                    <input type="text" name="vehiculo" required value={data.vehiculo} onChange={handleChange} placeholder="Ej: Toyota Corolla 2020" className={inputCls} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">Notas adicionales</label>
                    <textarea name="notas" rows={2} value={data.notas} onChange={handleChange} placeholder="Cualquier detalle..." className={`${inputCls} resize-none`} />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl
                               bg-brand text-white font-bold hover:bg-brand/90 transition-all
                               active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
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
