"use client";

/* Formulario de suscripción al newsletter */

import { useState } from "react";
import { Mail, CheckCircle, Loader2 } from "lucide-react";
import { addSubscriber } from "@/lib/storage";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "duplicate" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      const added = await addSubscriber(email.trim());
      setStatus(added ? "success" : "duplicate");
      if (added) setEmail("");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex items-center gap-2 text-sm text-green-500">
        <CheckCircle className="w-4 h-4 shrink-0" />
        ¡Suscrito! Te avisaremos de novedades.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 w-full">
      <div className="flex flex-col gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
          placeholder="tu@email.com"
          className="w-full px-4 py-3 rounded-lg bg-background border border-border text-base
                     focus:outline-none focus:ring-1 focus:ring-brand/30 shadow-inner"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-brand text-brand-foreground
                     text-base font-semibold hover:bg-brand-hover transition-colors disabled:opacity-60 shadow-md"
        >
          {status === "loading" ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Mail className="w-5 h-5" />
          )}
          Suscribir
        </button>
      </div>

      {status === "duplicate" && (
        <p className="text-xs text-muted-foreground">Ya estás suscrito con ese email.</p>
      )}
      {status === "error" && (
        <p className="text-xs text-destructive">Email inválido. Intenta de nuevo.</p>
      )}
    </form>
  );
}
