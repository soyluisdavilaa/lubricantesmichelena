"use client";

/* Wrapper que combina todos los providers del sitio */

import type { ReactNode } from "react";
import { ThemeProvider } from "@/context/ThemeContext";
import { SiteConfigProvider } from "@/context/SiteConfigContext";
import { CartProvider } from "@/context/CartContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <SiteConfigProvider>
        <CartProvider>{children}</CartProvider>
      </SiteConfigProvider>
    </ThemeProvider>
  );
}
