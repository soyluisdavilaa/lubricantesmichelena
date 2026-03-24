import { RevealOnScroll } from "@/components/shared/RevealOnScroll";

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <h1 className="text-3xl font-bold mb-8">Política de Privacidad</h1>
        </RevealOnScroll>

        <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
          <RevealOnScroll>
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">
                1. Información que Recopilamos
              </h2>
              <p>
                Lubricantes Michelena C.A. puede recopilar información personal
                como nombre, teléfono y datos del vehículo cuando agendes una
                cita o solicites una cotización a través de nuestro sitio web.
                Esta información se almacena localmente en tu dispositivo
                mediante tecnología IndexedDB.
              </p>
            </section>
          </RevealOnScroll>

          <RevealOnScroll>
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">
                2. Uso de la Información
              </h2>
              <p>
                Usamos la información proporcionada exclusivamente para:
                procesar tus solicitudes de servicio, comunicarnos contigo
                respecto a tu cita, y mejorar nuestros servicios. No vendemos
                ni compartimos tu información con terceros.
              </p>
            </section>
          </RevealOnScroll>

          <RevealOnScroll>
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">
                3. Almacenamiento Local
              </h2>
              <p>
                Los datos de cotizaciones y preferencias se almacenan
                exclusivamente en tu navegador usando IndexedDB. Puedes borrar
                estos datos en cualquier momento limpiando los datos del sitio
                en la configuración de tu navegador.
              </p>
            </section>
          </RevealOnScroll>

          <RevealOnScroll>
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">
                4. WhatsApp
              </h2>
              <p>
                Cuando envías una cotización o cita por WhatsApp, la información
                se transmite directamente a la aplicación de WhatsApp en tu
                dispositivo. No almacenamos el contenido de estos mensajes en
                nuestros servidores.
              </p>
            </section>
          </RevealOnScroll>

          <RevealOnScroll>
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">
                5. Contacto
              </h2>
              <p>
                Si tienes preguntas sobre esta política de privacidad, puedes
                contactarnos a través de WhatsApp o visitarnos en nuestra sede
                en Valencia, Venezuela.
              </p>
            </section>
          </RevealOnScroll>

          <RevealOnScroll>
            <p className="text-xs text-muted-foreground/60 pt-6 border-t border-border">
              Última actualización: Marzo 2026
            </p>
          </RevealOnScroll>
        </div>
      </div>
    </div>
  );
}
