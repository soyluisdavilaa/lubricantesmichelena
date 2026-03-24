import Link from "next/link";
import { ArrowLeft, Droplets } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-20 h-20 rounded-2xl bg-brand/10 flex items-center justify-center mx-auto mb-6">
          <Droplets className="w-10 h-10 text-brand" />
        </div>
        <h1 className="text-6xl font-bold text-brand mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-3">Página no encontrada</h2>
        <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
          La página que buscas no existe o fue movida. Vuelve al inicio para
          continuar navegando.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full
                     bg-brand text-brand-foreground font-semibold
                     hover:bg-brand-hover transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Ir al Inicio
        </Link>
      </div>
    </div>
  );
}
