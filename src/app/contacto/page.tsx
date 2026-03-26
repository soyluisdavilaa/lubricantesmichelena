"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, MessageCircle, Send, CalendarCheck, CheckCircle2 } from "lucide-react";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { openWhatsApp } from "@/lib/utils";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { addMensajePublic } from "@/lib/actions";
import { CitaModal } from "@/components/shared/CitaModal";

export default function ContactoPage() {
  const { config } = useSiteConfig();
  const [formData, setFormData] = useState({ nombre: "", email: "", mensaje: "" });
  const [msgLoading, setMsgLoading] = useState(false);
  const [msgSuccess, setMsgSuccess] = useState(false);
  const [citaOpen, setCitaOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsgLoading(true);
    try {
      await addMensajePublic({
        id: Date.now(),
        nombre: formData.nombre,
        email: formData.email,
        mensaje: formData.mensaje,
        fecha: new Date().toISOString(),
        leido: false,
      });
      setMsgSuccess(true);
      setFormData({ nombre: "", email: "", mensaje: "" });
    } finally {
      setMsgLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen pt-24 pb-12 relative"
    >
      {config.bgImages?.contacto && (
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={config.bgImages.contacto}
            alt=""
            className="w-full h-full object-cover bg-ken-burns"
            aria-hidden="true"
            loading="eager"
            fetchPriority="high"
          />
        </div>
      )}
      {config.bgImages?.contacto && (
        <div className="absolute inset-0 bg-black/60" />
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center mb-16">
          <RevealOnScroll direction="up">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contáctanos</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Estamos aquí para ayudarte. Escríbenos tu consulta y te responderemos a la brevedad.
            </p>
          </RevealOnScroll>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

          {/* Info de contacto */}
          <RevealOnScroll direction="right">
            <div className="bg-[#141414]/90 border border-white/10 rounded-3xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold mb-6">Información de Contacto</h2>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-brand" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Dirección</h3>
                    <p className="text-muted-foreground">{config.site.direccion}</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-brand" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Teléfono</h3>
                    <a href={`tel:${config.site.waNumber}`} className="text-muted-foreground hover:text-brand transition-colors">
                      {config.site.telefono}
                    </a>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-brand" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Correo Electrónico</h3>
                    <a href={`mailto:${config.site.email}`} className="text-muted-foreground hover:text-brand transition-colors">
                      {config.site.email}
                    </a>
                  </div>
                </li>
              </ul>

              {/* Botones de acción */}
              <div className="mt-10 space-y-3">
                {/* Agendar Cita */}
                <button
                  onClick={() => setCitaOpen(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-brand text-white font-bold hover:bg-brand/90 transition-colors"
                >
                  <CalendarCheck className="w-5 h-5" />
                  Agendar una Cita
                </button>

                {/* WhatsApp */}
                <button
                  onClick={() => openWhatsApp(config.site.waNumber, config.waMessage)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-whatsapp text-white font-medium hover:bg-whatsapp-hover transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  Chatear por WhatsApp
                </button>
              </div>

              {/* Mapa */}
              {config.site.mapsEmbed && (
                <div className="mt-8 rounded-2xl overflow-hidden border border-border h-56">
                  <iframe
                    src={config.site.mapsEmbed}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              )}
            </div>
          </RevealOnScroll>

          {/* Formulario de mensaje */}
          <RevealOnScroll direction="left">
            <div className="p-8 rounded-3xl bg-[#141414]/90 border border-white/10 shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Envíanos un Mensaje</h2>
              {msgSuccess ? (
                <div className="flex flex-col items-center gap-4 text-center py-10">
                  <CheckCircle2 className="w-14 h-14 text-emerald-500" />
                  <h3 className="text-lg font-bold">¡Mensaje enviado!</h3>
                  <p className="text-muted-foreground text-sm">Te responderemos a la brevedad.</p>
                  <button
                    onClick={() => setMsgSuccess(false)}
                    className="mt-2 px-6 py-2.5 rounded-xl bg-brand text-white font-bold text-sm hover:bg-brand/90 transition-colors"
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="nombre" className="block text-sm font-medium mb-2">Nombre Completo</label>
                    <input
                      type="text" id="nombre" name="nombre" required
                      value={formData.nombre} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-all"
                      placeholder="Tu nombre y apellido"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">Correo Electrónico</label>
                    <input
                      type="email" id="email" name="email" required
                      value={formData.email} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-all"
                      placeholder="tu@correo.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="mensaje" className="block text-sm font-medium mb-2">Mensaje</label>
                    <textarea
                      id="mensaje" name="mensaje" required rows={5}
                      value={formData.mensaje} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-all resize-none"
                      placeholder="¿En qué podemos ayudarte?"
                    />
                  </div>
                  <button
                    type="submit" disabled={msgLoading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-brand text-white font-bold hover:bg-brand/90 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                    {msgLoading ? "Enviando..." : "Enviar Mensaje"}
                  </button>
                </form>
              )}
            </div>
          </RevealOnScroll>
        </div>
      </div>

      <CitaModal open={citaOpen} onClose={() => setCitaOpen(false)} />
    </div>
  );
}
