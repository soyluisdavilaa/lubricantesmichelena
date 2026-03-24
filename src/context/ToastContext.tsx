"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto dismiss after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-24 sm:bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              layout
              key={t.id}
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
              className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl shadow-black/10 text-sm font-medium border min-w-[300px]"
              style={{
                backgroundColor: t.type === "success" ? "#f0fdf4" : t.type === "error" ? "#fef2f2" : "#ffffff",
                borderColor: t.type === "success" ? "#bbf7d0" : t.type === "error" ? "#fecaca" : "#e4e4e7",
                color: t.type === "success" ? "#166534" : t.type === "error" ? "#991b1b" : "#18181b",
              }}
            >
              {t.type === "success" && <CheckCircle2 className="w-5 h-5 text-green-600" />}
              {t.type === "error" && <AlertCircle className="w-5 h-5 text-red-600" />}
              {t.type === "info" && <Info className="w-5 h-5 text-blue-600" />}
              
              <span className="flex-1">{t.message}</span>
              
              <button
                onClick={() => removeToast(t.id)}
                className="p-1 hover:bg-black/5 rounded-full transition-colors"
              >
                <X className="w-4 h-4 opacity-50" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast debe usarse dentro de un ToastProvider");
  }
  return context;
}
