"use client";

/* ═══════════════════════════════════════════════
   CART CONTEXT — Carrito de cotización
   ═══════════════════════════════════════════════ */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import type { CartItem } from "@/lib/types";
import { getSavedCart, saveCart } from "@/lib/storage";
import { openWhatsApp } from "@/lib/utils";
import { defaultConfig } from "@/lib/defaults";

type ToastType = "success" | "warning" | null;

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  sendWhatsApp: () => void;
  toast: { message: string; type: ToastType };
  isDrawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [toast, setToast] = useState<{ message: string; type: ToastType }>({
    message: "",
    type: null,
  });
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  // Evita sobrescribir storage antes de que termine la carga inicial
  const loadedRef = useRef(false);

  // Cargar carrito guardado al montar
  useEffect(() => {
    getSavedCart().then((saved) => {
      if (saved) setItems(saved);
      loadedRef.current = true;
    });
  }, []);

  // Persistir en cada cambio (incluyendo vaciado)
  useEffect(() => {
    if (!loadedRef.current) return;
    saveCart(items);
  }, [items]);

  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: null }), 3000);
  }, []);

  const addToCart = useCallback(
    (item: CartItem) => {
      setItems((prev) => {
        if (prev.some((i) => i.id === item.id)) {
          showToast("⚠️ Ya está en la cotización", "warning");
          return prev;
        }
        showToast("✅ Agregado a la cotización", "success");
        return [...prev, item];
      });
    },
    [showToast]
  );

  const removeFromCart = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const sendWhatsApp = useCallback(() => {
    if (items.length === 0) return;
    const lines = items.map(
      (i, idx) => `${idx + 1}. ${i.nombre} (${i.marca}) — ${i.presentacion}`
    );
    const message = `¡Hola! 👋 Me gustaría cotizar los siguientes productos:\n\n${lines.join("\n")}\n\n¿Podrían indicarme disponibilidad y precio total? Gracias.`;
    openWhatsApp(defaultConfig.site.waNumber, message);
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        clearCart,
        sendWhatsApp,
        toast,
        isDrawerOpen,
        setDrawerOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
}
