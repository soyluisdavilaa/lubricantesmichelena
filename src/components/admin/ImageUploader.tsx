"use client";

/* ═══════════════════════════════════════════════
   IMAGE UPLOADER — Drag & drop, preview, upload
   ═══════════════════════════════════════════════ */

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { uploadImage, deleteImage } from "@/lib/supabase-storage";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  value: string; // URL actual
  onChange: (url: string) => void;
  folder?: string;
  className?: string;
  aspectRatio?: string; // e.g. "aspect-square", "aspect-video"
}

export function ImageUploader({
  value,
  onChange,
  folder = "general",
  className,
  aspectRatio = "aspect-square",
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("Solo se permiten imágenes");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError("Máximo 10MB");
        return;
      }

      setError("");
      setIsUploading(true);

      try {
        const url = await uploadImage(file, folder);
        if (url) {
          // Si ya había una imagen, eliminar la anterior
          if (value && value.includes("supabase")) {
            await deleteImage(value);
          }
          onChange(url);
        } else {
          setError("Error subiendo imagen");
        }
      } catch {
        setError("Error de conexión");
      } finally {
        setIsUploading(false);
      }
    },
    [folder, onChange, value]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleRemove = useCallback(async () => {
    if (value && value.includes("supabase")) {
      await deleteImage(value);
    }
    onChange("");
  }, [value, onChange]);

  return (
    <div className={cn("relative", className)}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !isUploading && inputRef.current?.click()}
        className={cn(
          "relative rounded-xl border-2 border-dashed overflow-hidden cursor-pointer transition-all",
          aspectRatio,
          isDragOver
            ? "border-brand bg-brand/5"
            : value
            ? "border-border"
            : "border-border hover:border-brand/50",
          isUploading && "pointer-events-none opacity-70"
        )}
      >
        <AnimatePresence mode="wait">
          {value ? (
            /* Preview */
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0"
            >
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              {/* Remove button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white
                           flex items-center justify-center hover:bg-destructive transition-colors"
                aria-label="Eliminar imagen"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ) : (
            /* Placeholder */
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground"
            >
              {isUploading ? (
                <Loader2 className="w-8 h-8 animate-spin text-brand" />
              ) : (
                <>
                  <Upload className="w-8 h-8" />
                  <p className="text-xs text-center px-4">
                    Arrastra o haz clic
                  </p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hidden input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
        className="hidden"
      />

      {/* Error */}
      {error && (
        <p className="text-xs text-destructive mt-1">{error}</p>
      )}
    </div>
  );
}
