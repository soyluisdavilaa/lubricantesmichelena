"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, MessageCircle, Send } from "lucide-react";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { openWhatsApp, cn } from "@/lib/utils";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";

export default function ContactoPage() {
  const { config } = useSiteConfig();
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    mensaje: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Hola, mi nombre es ${formData.nombre}. Mi correo es ${formData.email}. Mensaje: ${formData.mensaje}`;
    openWhatsApp(config.site.waNumber, message);
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
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
            <div>
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

              {/* Botón WhatsApp */}
              <div className="mt-10 p-6 rounded-2xl bg-card border border-border">
                <h3 className="font-semibold text-lg mb-2">¿Atención inmediata?</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Haz clic en el enlace directo a WhatsApp y chatea con nuestro equipo de ventas y asesores.
                </p>
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

          {/* Formulario */}
          <RevealOnScroll direction="left">
            <div className="p-8 rounded-3xl bg-card border border-border shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Envíanos un Mensaje</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium mb-2">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    required
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border 
                               focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-all"
                    placeholder="Tu nombre y apellido"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border 
                               focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-all"
                    placeholder="tu@correo.com"
                  />
                </div>
                <div>
                  <label htmlFor="mensaje" className="block text-sm font-medium mb-2">
                    Mensaje
                  </label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    required
                    rows={5}
                    value={formData.mensaje}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border 
                               focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-all resize-none"
                    placeholder="¿En qué podemos ayudarte?"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl 
                             bg-brand text-white font-bold hover:bg-brand/90 transition-all 
                             active:scale-[0.98]"
                >
                  <Send className="w-5 h-5" />
                  Enviar Mensaje
                </button>
              </form>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </div>
  );
}
