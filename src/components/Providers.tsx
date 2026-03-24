"use client";

/* Wrapper que combina todos los providers del sitio */

import type { ReactNode } from "react";
import { ThemeProvider } from "@/context/ThemeContext";
import { SiteConfigProvider } from "@/context/SiteConfigContext";
import { ToastProvider } from "@/context/ToastContext";
import { CartProvider } from "@/context/CartContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <SiteConfigProvider>
          <CartProvider>{children}</CartProvider>
        </SiteConfigProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
