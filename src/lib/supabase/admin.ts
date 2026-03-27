import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    "Faltan variables de entorno: NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY son requeridas."
  );
}

/**
 * Cliente de Supabase de uso EXCLUSIVO para Server Actions / APIs.
 * Usa la llave service_role para bypassear todas las reglas RLS
 * y poder forzar la escritura de datos y subida de archivos (solo si la contraseña de admin fue verificada).
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
