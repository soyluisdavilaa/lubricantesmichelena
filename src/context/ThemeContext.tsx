"use client";

/* ═══════════════════════════════════════════════
   THEME CONTEXT — Dark / Light mode
   ═══════════════════════════════════════════════ */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

interface ThemeContextType {
  isDark: boolean;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // El script inline de layout.tsx ya aplicó la clase antes del primer paint.
  // Aquí solo sincronizamos el estado de React con lo que hay en el DOM.
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return true; // SSR: dark por defecto
    return document.documentElement.classList.contains("dark");
  });

  // Sincronizar en caso de hidratación
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("lm_theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("lm_theme", "light");
      }
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ isDark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme debe usarse dentro de ThemeProvider");
  return ctx;
}
