"use client";

/* ═══════════════════════════════════════════════
   CLOUDINARY CLIENT — Upload & Delete via Server Actions
   Reemplaza completamente Supabase Storage para imágenes.
   ═══════════════════════════════════════════════ */

import { uploadSecureImage, deleteSecureImage } from "./actions";
import { getAdminHash } from "./storage";

/**
 * Sube una imagen a Cloudinary pasando por Server Actions.
 * Comprime automáticamente si supera maxSizeKB.
 * Retorna la URL pública de Cloudinary o null si falla.
 */
export async function uploadImage(
  file: File,
  folder: string = "general",
  maxSizeKB: number = 800
): Promise<string | null> {
  try {
    const hash = await getAdminHash();
    if (!hash) {
      console.error("No admin hash");
      return null;
    }

    // Comprimir si es demasiado grande
    let processedFile: File | Blob = file;
    let finalName = file.name;

    if (file.size > maxSizeKB * 1024 && file.type.startsWith("image/") && !file.type.includes("svg")) {
      processedFile = await compressImage(file, maxSizeKB);
      if (processedFile.type === "image/webp") {
        finalName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
      }
    }

    const formData = new FormData();
    formData.append("file", processedFile, finalName);

    return await uploadSecureImage(formData, folder, hash);
  } catch (err) {
    console.error("Error en uploadImage:", err);
    return null;
  }
}

/**
 * Elimina una imagen de Cloudinary por su URL pública.
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
 * Comprime una imagen usando canvas antes de enviarla al servidor.
 */
async function compressImage(file: File, maxSizeKB: number): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;

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
        if (!ctx) { resolve(file); return; }
        ctx.drawImage(img, 0, 0, width, height);

        let quality = 0.85;
        const MIN_QUALITY = 0.3;

        const tryCompress = () => {
          canvas.toBlob(
            (blob) => {
              if (!blob) { resolve(file); return; }
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
