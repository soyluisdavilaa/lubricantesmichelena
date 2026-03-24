import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente Supabase para Client Components (navegador).
 * Usa las variables NEXT_PUBLIC_ que se inyectan en el bundle del cliente.
 * Llamar esta función en cualquier componente con "use client".
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Faltan variables de entorno de Supabase: " +
        "NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY son requeridas."
    );
  }

  return createBrowserClient(url, key);
}
