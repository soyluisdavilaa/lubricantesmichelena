"use client";

import { useSiteConfig } from "@/context/SiteConfigContext";

export default function TerminosPage() {
  const { config } = useSiteConfig();
  const texto = config.legalPages?.terminos ?? "";
  const parrafos = texto.split("\n\n").filter(Boolean);

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Términos y Condiciones</h1>
        <div className="space-y-5 text-sm text-muted-foreground leading-relaxed">
          {parrafos.map((p, i) => (
            <p key={i} className={p.match(/^\d+\./) ? "text-foreground font-semibold text-base" : ""}>
              {p}
            </p>
          ))}
        </div>
        <p className="text-xs text-muted-foreground/60 pt-8 mt-8 border-t border-border">
          Última actualización: {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
