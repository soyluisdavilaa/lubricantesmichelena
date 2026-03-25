"use client";

/* Footer con logo, links, legales, copyright */

import Link from "next/link";
import { MessageCircle, Mail, MapPin, Phone, Clock } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { openWhatsApp } from "@/lib/utils";
import { NewsletterForm } from "@/components/shared/NewsletterForm";
import { useRef, useState } from "react";

function MagneticWrapper({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    if (!ref.current) return;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    // Attract the element slightly towards the mouse (by 25% of the distance)
    setPosition({ x: middleX * 0.25, y: middleY * 0.25 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });
  const { x, y } = position;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}

const quickLinks = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Catálogo" },
];

const legalLinks = [
  { href: "/privacidad", label: "Política de Privacidad" },
  { href: "/terminos", label: "Términos y Condiciones" },
  { href: "/devoluciones", label: "Políticas de Devoluciones" },
];

export function Footer() {
  const { config } = useSiteConfig();

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="inline-block transition-transform hover:scale-105">
              <motion.div
                animate={{
                  y: [0, -4, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Image
                  src="/logo.png"
                  alt="Lubricantes Michelena"
                  width={250}
                  height={90}
                  className="w-auto h-20 object-contain drop-shadow-sm"
                />
              </motion.div>
            </Link>
            <p className="text-muted-foreground/80 leading-relaxed max-w-sm">
              {config.site.footerDesc}
            </p>

            {/* WhatsApp CTA */}
            <MagneticWrapper>
              <button
                onClick={() => openWhatsApp(config.site.waNumber, config.waMessage)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full
                           bg-whatsapp text-white text-sm font-medium
                           hover:bg-whatsapp-hover transition-colors shadow-lg shadow-whatsapp/20"
              >
                <MessageCircle className="w-5 h-5" />
                Contáctanos
              </button>
            </MagneticWrapper>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
              Navegación
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-1">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
              Contacto
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${config.site.waNumber}`}
                  className="flex items-start gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Phone className="w-4 h-4 mt-0.5 shrink-0" />
                  {config.site.telefono}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${config.site.email}`}
                  className="flex items-start gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors break-all"
                >
                  <Mail className="w-4 h-4 mt-0.5 shrink-0" />
                  {config.site.email}
                </a>
              </li>
              <li>
                <a
                  href={config.site.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                  {config.site.direccion}
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
              Novedades
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Recibe ofertas y consejos de mantenimiento.
            </p>
            <NewsletterForm />
            <ul className="mt-4 space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
