import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Devoluciones",
  description: "Política de devoluciones y reembolsos.",
};

export default function DevolucionesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <h1 className="text-3xl font-bold mb-8">Política de Devoluciones</h1>
      <div className="prose dark:prose-invert max-w-none space-y-4">
        <p>1. Condiciones de Devolución...</p>
        <p>
          Aceptamos devoluciones de productos en su empaque original no abierto
          dentro de los primeros 7 días luego de la compra.
        </p>
        <p>
          Para procesar una devolución, por favor contáctenos a través de nuestro 
          canal oficial de WhatsApp.
        </p>
      </div>
    </div>
  );
}
