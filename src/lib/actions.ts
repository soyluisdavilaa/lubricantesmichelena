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

import { revalidatePath } from "next/cache";

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

  // Limpiar caché global en todas partes (Vercel Cache)
  revalidatePath("/", "layout");

  return true;
}

/**
 * Sube una imagen a Cloudinary de manera segura (Solo Admin)
 */
export async function uploadSecureImage(formData: FormData, folder: string, adminHash: string): Promise<string | null> {
  const isValid = await isAdminValid(adminHash);
  if (!isValid) throw new Error("No autorizado");

  const file = formData.get("file") as File;
  if (!file) return null;

  // Convertir File a Buffer para Cloudinary
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { uploadToCloudinary } = await import("@/lib/cloudinary");
  const url = await uploadToCloudinary(buffer, folder);

  return url;
}

/**
 * Elimina una imagen de Cloudinary por su URL pública (Solo Admin)
 */
export async function deleteSecureImage(publicUrl: string, adminHash: string): Promise<boolean> {
  const isValid = await isAdminValid(adminHash);
  if (!isValid) throw new Error("No autorizado");

  try {
    const { deleteFromCloudinary } = await import("@/lib/cloudinary");
    return await deleteFromCloudinary(publicUrl);
  } catch (err) {
    console.error("Error en deleteSecureImage:", err);
    return false;
  }
}

/**
 * Añadir Mensaje de Contacto (Público)
 */
export async function addMensajePublic(mensaje: any) {
  const { data } = await supabaseAdmin.from("site_data").select("data").eq("id", "mensajes").single();
  const mensajes = data ? (data.data as any[]) : [];
  mensajes.push(mensaje);
  await supabaseAdmin.from("site_data").upsert({ id: "mensajes", data: mensajes, updated_at: new Date().toISOString() });
  return true;
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
