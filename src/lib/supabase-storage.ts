"use client";

/* ═══════════════════════════════════════════════
   SUPABASE STORAGE — Upload, delete, get URL
   Bucket: lm-assets (public)
   ═══════════════════════════════════════════════ */

import { uploadSecureImage, deleteSecureImage } from "./actions";
import { getAdminHash } from "./storage";

const BUCKET = "lm-assets";

/**
 * Sube una imagen al bucket de Supabase Storage pasando por Server Actions.
 * Comprime automáticamente si supera maxSizeKB.
 * Retorna la URL pública o null si falla.
 */
export async function uploadImage(
  file: File,
  folder: string = "general",
  maxSizeKB: number = 500
): Promise<string | null> {
  try {
    const hash = await getAdminHash();
    if (!hash) {
      console.error("No admin hash");
      return null;
    }

    // Comprimir si es muy grande
    let processedFile: File | Blob = file;
    if (file.size > maxSizeKB * 1024 && file.type.startsWith("image/")) {
      processedFile = await compressImage(file, maxSizeKB);
    }

    const formData = new FormData();
    // Wrap con el nombre original o uno fallback por si acaso
    formData.append("file", processedFile, file.name);

    return await uploadSecureImage(formData, folder, hash);
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
    const hash = await getAdminHash();
    if (!hash) return false;
    
    return await deleteSecureImage(publicUrl, hash);
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
