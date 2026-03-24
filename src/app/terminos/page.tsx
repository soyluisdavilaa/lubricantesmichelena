import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  description: "Términos y Condiciones de uso de Lubricantes Michelena C.A.",
};

export default function TerminosPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <h1 className="text-3xl font-bold mb-8">Términos y Condiciones</h1>
      <div className="prose dark:prose-invert max-w-none space-y-4">
        <p>1. Condiciones Generales de Uso...</p>
        <p>
          Estos términos y condiciones rigen el uso de nuestro sitio web y los
          servicios que ofrecemos en Lubricantes Michelena C.A.
        </p>
        <p>
          Todos los precios están sujetos a cambio sin previo aviso. La 
          disponibilidad de los productos depende del stock actual.
        </p>
      </div>
    </div>
  );
}
