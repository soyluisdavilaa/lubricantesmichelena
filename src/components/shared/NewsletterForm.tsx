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
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
          placeholder="tu@email.com"
          className="flex-1 px-3 py-2 rounded-lg bg-background border border-border text-sm
                     focus:outline-none focus:ring-1 focus:ring-brand/30 min-w-0"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-brand text-brand-foreground
                     text-sm font-medium hover:bg-brand-hover transition-colors disabled:opacity-60 shrink-0"
        >
          {status === "loading" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Mail className="w-4 h-4" />
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
