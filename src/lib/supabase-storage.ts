"use client";

/* ═══════════════════════════════════════════════
   SUPABASE STORAGE — Upload, delete, get URL
   Bucket: lm-assets (public)
   ═══════════════════════════════════════════════ */

import { createClient } from "@/lib/supabase/client";

const BUCKET = "lm-assets";

/**
 * Sube una imagen al bucket de Supabase Storage.
 * Comprime automáticamente si supera maxSizeKB.
 * Retorna la URL pública o null si falla.
 */
export async function uploadImage(
  file: File,
  folder: string = "general",
  maxSizeKB: number = 500
): Promise<string | null> {
  try {
    const supabase = createClient();

    // Comprimir si es muy grande
    let processedFile: File | Blob = file;
    if (file.size > maxSizeKB * 1024 && file.type.startsWith("image/")) {
      processedFile = await compressImage(file, maxSizeKB);
    }

    // Generar nombre único
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const safeName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { data, error } = await supabase.storage
      .from(BUCKET)
      .upload(safeName, processedFile, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (error) {
      console.error("Error subiendo imagen:", error);
      return null;
    }

    // Obtener URL pública
    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET).getPublicUrl(data.path);

    return publicUrl;
  } catch (err) {
    console.error("Error en uploadImage:", err);
    return null;
  }
}

/**
 * Elimina una imagen de Supabase Storage por su URL pública.
 */
export async function deleteImage(publicUrl: string): Promise<boolean> {
  try {
    const supabase = createClient();

    // Extraer path del URL público
    const url = new URL(publicUrl);
    const pathParts = url.pathname.split(`/object/public/${BUCKET}/`);
    if (pathParts.length < 2) return false;
    const filePath = decodeURIComponent(pathParts[1]);

    const { error } = await supabase.storage.from(BUCKET).remove([filePath]);
    if (error) {
      console.error("Error eliminando imagen:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Error en deleteImage:", err);
    return false;
  }
}

/**
 * Comprime una imagen usando canvas.
 */
async function compressImage(file: File, maxSizeKB: number): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;

        // Max 1200px de lado largo
        const MAX_SIDE = 1200;
        if (width > MAX_SIDE || height > MAX_SIDE) {
          if (width > height) {
            height = (height * MAX_SIDE) / width;
            width = MAX_SIDE;
          } else {
            width = (width * MAX_SIDE) / height;
            height = MAX_SIDE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file); // fallback: devolver original si el canvas falla
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);

        // Reducir calidad iterativamente hasta cumplir tamaño o mínimo
        let quality = 0.85;
        const MIN_QUALITY = 0.3;

        const tryCompress = () => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                resolve(file); // canvas no generó blob — devolver original
                return;
              }
              if (blob.size <= maxSizeKB * 1024 || quality <= MIN_QUALITY) {
                resolve(blob);
              } else {
                quality = Math.max(quality - 0.1, MIN_QUALITY);
                tryCompress();
              }
            },
            "image/webp",
            quality
          );
        };
        tryCompress();
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
