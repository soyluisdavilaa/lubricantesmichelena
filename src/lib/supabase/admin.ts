import { createClient } from "@supabase/supabase-js";

/**
 * Cliente de Supabase de uso EXCLUSIVO para Server Actions / APIs.
 * Usa la llave service_role para bypassear todas las reglas RLS
 * y poder forzar la escritura de datos y subida de archivos (solo si la contraseña de admin fue verificada).
 */
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
