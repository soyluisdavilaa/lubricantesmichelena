"use client";

/* Botón de WhatsApp reutilizable */

import { MessageCircle } from "lucide-react";
import { openWhatsApp } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface WhatsAppButtonProps {
  number: string;
  message: string;
  label?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function WhatsAppButton({
  number,
  message,
  label = "WhatsApp",
  className,
  size = "md",
}: WhatsAppButtonProps) {
  const sizes = {
    sm: "px-3 py-1.5 text-sm gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2",
  };

  return (
    <button
      onClick={() => openWhatsApp(number, message)}
      className={cn(
        "inline-flex items-center justify-center font-medium rounded-full",
        "bg-whatsapp text-white hover:bg-whatsapp-hover",
        "transition-all duration-200 hover:scale-105 active:scale-95",
        sizes[size],
        className
      )}
      aria-label={`Contactar por WhatsApp: ${label}`}
    >
      <MessageCircle className="w-4 h-4" />
      {label}
    </button>
  );
}
