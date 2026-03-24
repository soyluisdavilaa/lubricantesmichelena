"use client";

/* Shell global — Header, Footer y componentes flotantes */

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { PageTransition } from "@/components/layout/PageTransition";
import { FloatingWhatsApp } from "@/components/shared/FloatingWhatsApp";
import { BackToTop } from "@/components/shared/BackToTop";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { usePathname } from "next/navigation";
import { Wrench } from "lucide-react";
import { FloatingCart } from "@/components/layout/FloatingCart";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { config, isLoading } = useSiteConfig();
  const pathname = usePathname();

  // Modo mantenimiento — bloquea todo excepto /admin
  if (!isLoading && config.mantenimiento.activo && !pathname?.startsWith("/admin")) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-brand/10 flex items-center justify-center mx-auto">
            <Wrench className="w-8 h-8 text-brand" />
          </div>
          <h1 className="text-2xl font-bold">Sitio en mantenimiento</h1>
          <p className="text-muted-foreground text-sm">
            {config.mantenimiento.mensaje}
          </p>
          <p className="text-xs text-muted-foreground">{config.site.nombre}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <GoogleAnalytics />
      <ScrollProgress />
      <Header />
      <main className="flex-1 pt-16"><PageTransition>{children}</PageTransition></main>
      <Footer />
      <FloatingCart />
      <FloatingWhatsApp />
      <BackToTop />
    </>
  );
}

