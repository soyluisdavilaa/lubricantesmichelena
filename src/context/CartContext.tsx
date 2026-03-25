"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { CartItem, Product } from "@/lib/types";
import { getSavedCart, saveCart as persistCart } from "@/lib/storage";
import { useToast } from "@/context/ToastContext";

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  itemCount: number;
  justAdded: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const { toast } = useToast();

  // Cargar carrito desde IndexedDB al iniciar
  useEffect(() => {
    async function loadCart() {
      const saved = await getSavedCart();
      if (saved && saved.length > 0) {
        // sanitize cantidad: IndexedDB can return strings, coerce to number
        const sanitized = saved.map(item => ({ ...item, cantidad: Math.max(1, Number(item.cantidad) || 1) }));
        setItems(sanitized);
      }
    }
    loadCart();
  }, []);

  // Guardar carrito en IndexedDB cada vez que cambia
  useEffect(() => {
    persistCart(items).catch(console.error);
  }, [items]);

  const itemCount = items.reduce((total, item) => total + item.cantidad, 0);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setItems((currentItems) => {
      const existing = currentItems.find((item) => item.id === product.id);
      if (existing) {
        return currentItems.map((item) =>
          item.id === product.id
            ? { ...item, cantidad: item.cantidad + quantity }
            : item
        );
      }
      return [
        ...currentItems,
        {
          id: product.id,
          nombre: product.nombre,
          marca: product.marca,
          presentacion: product.presentacion,
          imagen: product.imagen,
          cantidad: quantity,
        },
      ];
    });
    toast(`Has añadido ${product.nombre} a tu cotización`, "success");
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 900);
    setIsOpen(true);
  }, [toast]);

  const removeFromCart = useCallback((productId: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, delta: number) => {
    setItems((currentItems) =>
      currentItems.map((item) => {
        if (item.id === productId) {
          const newQuantity = Math.max(1, item.cantidad + delta);
          return { ...item, cantidad: newQuantity };
        }
        return item;
      })
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        itemCount,
        justAdded,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
}
