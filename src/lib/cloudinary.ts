// SERVER ONLY — Cloudinary v2 SDK configuration
// Este archivo nunca llega al cliente, solo corre en el servidor de Next.js

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Sube un Buffer o base64 a Cloudinary y devuelve la URL pública.
 * @param buffer - Buffer o string base64 de la imagen
 * @param folder - Carpeta dentro de Cloudinary (ej. "productos", "hero")
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  folder: string = "lm-assets"
): Promise<string | null> {
  try {
    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image",
          overwrite: false,
          format: "webp",          // convierte automáticamente a WebP (más rápido)
          quality: "auto:good",    // optimización automática de calidad
          fetch_format: "auto",
        },
        (error, result) => {
          if (error || !result) reject(error);
          else resolve(result as { secure_url: string });
        }
      ).end(buffer);
    });

    return result.secure_url;
  } catch (err) {
    console.error("[Cloudinary] Error al subir imagen:", err);
    return null;
  }
}

/**
 * Elimina una imagen de Cloudinary por su URL pública.
 */
export async function deleteFromCloudinary(publicUrl: string): Promise<boolean> {
  try {
    // Extraer el public_id desde la URL (formato: .../lm-assets/filename.webp)
    const urlParts = publicUrl.split("/upload/");
    if (urlParts.length < 2) return false;

    // Quitar extensión para obtener el public_id
    const publicIdWithExt = urlParts[1];
    const publicId = publicIdWithExt.replace(/\.[^/.]+$/, "").replace(/^v\d+\//, "");

    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === "ok";
  } catch (err) {
    console.error("[Cloudinary] Error al eliminar imagen:", err);
    return false;
  }
}
