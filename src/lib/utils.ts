/* ═══════════════════════════════════════════════
   UTILS — Lubricantes Michelena
   Funciones utilitarias del sitio
   ═══════════════════════════════════════════════ */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge de clases Tailwind sin conflictos.
 * Usa clsx para condicionales + twMerge para resolver duplicados.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Escapa HTML para prevenir XSS.
 * Usar antes de renderizar contenido dinámico del usuario.
 */
export function escHtml(str: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return str.replace(/[&<>"']/g, (m) => map[m] || m);
}

/**
 * Comprime una imagen a WebP con dimensiones máximas.
 * Retorna un string base64 (data URL).
 */
export function compressImage(
  file: File,
  maxWidth = 800,
  quality = 0.7
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("No se pudo crear el contexto 2D"));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/webp", quality));
      };
      img.onerror = () => reject(new Error("Error cargando imagen"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Error leyendo archivo"));
    reader.readAsDataURL(file);
  });
}

/**
 * Hash SHA-256 usando Web Crypto API.
 * Para la contraseña del admin (NO es auth real, solo protección básica).
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const buffer = await crypto.subtle.digest("SHA-256", data);
  const array = Array.from(new Uint8Array(buffer));
  return array.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Abre WhatsApp con un mensaje predefinido.
 * Construye la URL wa.me con encoding correcto.
 */
export function openWhatsApp(number: string, message: string): void {
  const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

/**
 * Genera el enlace de WhatsApp para solicitar la cotización de varios productos del carrito.
 */
export function generateCartWaMessage(phone: string, items: { nombre: string, presentacion?: string, marca?: string, cantidad: number }[], _baseMessage: string = "") {
  const cleanPhone = phone.replace(/\D/g, "");

  const lines: string[] = [
    "🛢️ *COTIZACIÓN — Lubricantes Michelena C.A.*",
    "──────────────────────────",
  ];

  items.forEach((item, idx) => {
    const qty = Number(item.cantidad) || 1;
    lines.push(`*${idx + 1}.* ${item.nombre}`);
    if (item.marca) lines.push(`   🏷️ Marca: ${item.marca}`);
    if (item.presentacion) lines.push(`   📦 Presentación: ${item.presentacion}`);
    lines.push(`   🔢 Cantidad: ${qty} unidad${qty !== 1 ? "es" : ""}`);
    lines.push("");
  });

  lines.push("──────────────────────────");
  lines.push("Por favor, indíquenme disponibilidad y precio. ¡Gracias! 🙏");

  const text = lines.join("\n");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

/**
 * Procesa la plantilla del mensaje de WhatsApp para productos.
 */
export function getProductWaMessage(template: string | undefined, product: { nombre: string; marca: string }): string {
  const tpl = template || "¡Hola! 👋 Me gustaría cotizar el producto: {{PRODUCTO}} ({{MARCA}})";
  return tpl
    .replace(/\{\{PRODUCTO\}\}/g, product.nombre)
    .replace(/\{\{MARCA\}\}/g, product.marca || "");
}

/**
 * Formatea una hora de "HH:MM" a "H:MM AM/PM".
 */
export function fmtHora(hora: string): string {
  if (!hora) return "Cerrado";
  const [h, m] = hora.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${m.toString().padStart(2, "0")} ${period}`;
}

/**
 * Genera un ID único corto.
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/**
 * Formatea una fecha ISO a formato legible en español.
 * Ejemplo: "2025-03-15" → "15 de marzo de 2025"
 */
export function formatDate(isoDate: string): string {
  const date = new Date(isoDate + "T12:00:00");
  return date.toLocaleDateString("es-VE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Deep merge de dos objetos.
 * El segundo objeto sobreescribe valores del primero.
 * Useful para merging config guardada sobre defaults.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function deepMerge<T>(target: T, source: Partial<T>): T {
  if (!source) return target;
  const result = { ...target };
  for (const key of Object.keys(source) as Array<keyof T>) {
    const sourceVal = source[key];
    const targetVal = target[key];
    if (
      sourceVal &&
      typeof sourceVal === "object" &&
      !Array.isArray(sourceVal) &&
      targetVal &&
      typeof targetVal === "object" &&
      !Array.isArray(targetVal)
    ) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      result[key] = deepMerge(targetVal, sourceVal as any);
    } else if (sourceVal !== undefined) {
      result[key] = sourceVal as T[keyof T];
    }
  }
  return result;
}
