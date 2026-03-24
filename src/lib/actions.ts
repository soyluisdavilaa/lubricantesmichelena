"use server";

/* ═══════════════════════════════════════════════
   SERVER ACTIONS - Seguridad y Base de Datos Global
   Reemplaza el uso de localforage por Supabase.
   ═══════════════════════════════════════════════ */

import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient as createBrowserSupabase } from "@/lib/supabase/client";

/**
 * Verifica internamente si el hash proporcionado coincide con el de la DB.
 */
async function isAdminValid(hash: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from("site_settings")
    .select("value")
    .eq("key", "admin_hash")
    .single();

  if (error || !data) return false;
  return data.value === hash;
}

/**
 * Obtiene la data pública (productos, configuración, etc) de Supabase.
 * No requiere autenticación (porque los visitantes de la web necesitan leerlo).
 */
export async function getSiteData(key: string) {
  const { data, error } = await supabaseAdmin
    .from("site_data")
    .select("data")
    .eq("id", key)
    .single();

  if (error || !data) return null;
  return data.data;
}

/**
 * Guarda data en Supabase (Solo Admin)
 */
export async function saveSiteData(key: string, data: any, adminHash: string) {
  const isValid = await isAdminValid(adminHash);
  if (!isValid) throw new Error("No autorizado");

  const { error } = await supabaseAdmin
    .from("site_data")
    .upsert({ id: key, data, updated_at: new Date().toISOString() });

  if (error) {
    console.error("Error guardando site_data:", error.message);
    throw new Error("Fallo al guardar en base de datos");
  }

  return true;
}

/**
 * Sube una imagen a Supabase Storage de manera segura (Solo Admin)
 */
export async function uploadSecureImage(formData: FormData, folder: string, adminHash: string): Promise<string | null> {
  const isValid = await isAdminValid(adminHash);
  if (!isValid) throw new Error("No autorizado");

  const file = formData.get("file") as File;
  if (!file) return null;

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  // Fix para iOS/Safari: Asegurar que el contentType no sea application/octet-stream o vacío
  let mimeType = file.type;
  if (!mimeType || mimeType === "application/octet-stream") {
    if (ext === "jpg" || ext === "jpeg") mimeType = "image/jpeg";
    else if (ext === "png") mimeType = "image/png";
    else if (ext === "webp") mimeType = "image/webp";
    else if (ext === "svg") mimeType = "image/svg+xml";
    else mimeType = "image/jpeg";
  }

  // Usar admin para saltarse el RLS y subir la foto
  const { data, error } = await supabaseAdmin.storage
    .from("lm-assets")
    .upload(safeName, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: mimeType,
    });

  if (error) {
    console.error("Error secure upload:", error.message);
    return null;
  }

  const { data: { publicUrl } } = supabaseAdmin.storage
    .from("lm-assets")
    .getPublicUrl(data.path);

  return publicUrl;
}

/**
 * Elimina una imagen de Supabase Storage (Solo Admin)
 */
export async function deleteSecureImage(publicUrl: string, adminHash: string): Promise<boolean> {
  const isValid = await isAdminValid(adminHash);
  if (!isValid) throw new Error("No autorizado");

  try {
    const url = new URL(publicUrl);
    const pathParts = url.pathname.split(`/object/public/lm-assets/`);
    if (pathParts.length < 2) return false;
    const filePath = decodeURIComponent(pathParts[1]);

    const { error } = await supabaseAdmin.storage.from("lm-assets").remove([filePath]);
    if (error) {
      console.error("Error eliminando imagen segura:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Error en deleteSecureImage:", err);
    return false;
  }
}

/**
 * Añadir Cita (Público)
 */
export async function addCitaPublic(cita: any) {
  // Obtenemos citas actuales
  const { data } = await supabaseAdmin.from("site_data").select("data").eq("id", "citas").single();
  const citas = data ? (data.data as any[]) : [];
  citas.push(cita);
  await supabaseAdmin.from("site_data").upsert({ id: "citas", data: citas, updated_at: new Date().toISOString() });
  return true;
}

/**
 * Añadir Suscriptor (Público)
 */
export async function addSubscriberPublic(email: string) {
  const { data } = await supabaseAdmin.from("site_data").select("data").eq("id", "subscribers").single();
  const subs = data ? (data.data as any[]) : [];
  if (subs.some(s => s.email === email)) return false;
  subs.push({ email, fecha: new Date().toISOString() });
  await supabaseAdmin.from("site_data").upsert({ id: "subscribers", data: subs, updated_at: new Date().toISOString() });
  return true;
}

/**
 * Verifica la contraseña actual / Login Admin
 */
export async function verifyAdminHashAction(hash: string): Promise<boolean> {
  return await isAdminValid(hash);
}

/**
 * Cambia la contraseña de Admin
 */
export async function changeAdminHashAction(newHash: string, currentHash: string): Promise<boolean> {
  const isValid = await isAdminValid(currentHash);
  if (!isValid) throw new Error("No autorizado");

  const { error } = await supabaseAdmin
    .from("site_settings")
    .upsert({ key: "admin_hash", value: newHash });

  if (error) throw new Error("Error actualizando contraseña");
  return true;
}
