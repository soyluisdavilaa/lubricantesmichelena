"use client";

/* Wrapper que combina todos los providers del sitio */

import type { ReactNode } from "react";
import { ThemeProvider } from "@/context/ThemeContext";
import { SiteConfigProvider } from "@/context/SiteConfigContext";
import { ToastProvider } from "@/context/ToastContext";
import { CartProvider } from "@/context/CartContext";
import type { SiteConfig } from "@/lib/types";

export function Providers({ 
  children,
  initialConfig
}: { 
  children: ReactNode;
  initialConfig?: SiteConfig;
}) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <SiteConfigProvider initialConfig={initialConfig}>
          <CartProvider>{children}</CartProvider>
        </SiteConfigProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
