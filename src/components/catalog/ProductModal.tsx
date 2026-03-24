"use client";

/* Modal de detalle de producto */

import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle, ShoppingCart } from "lucide-react";
import type { Product } from "@/lib/types";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { useCart } from "@/context/CartContext";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  const { config } = useSiteConfig();
  const { addToCart } = useCart();

  return (
    <AnimatePresence>
      {product && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2
                       sm:-translate-x-1/2 sm:-translate-y-1/2
                       z-[91] w-auto sm:w-full sm:max-w-2xl max-h-[90vh]
                       bg-card rounded-2xl border border-border shadow-2xl
                       overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label={product.nombre}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-secondary
                         flex items-center justify-center hover:bg-secondary/80 transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
              {/* Image */}
              <div className="aspect-square bg-muted relative">
                {product.imagen ? (
                  <img
                    src={product.imagen}
                    alt={product.nombre}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <MessageCircle className="w-16 h-16 text-muted-foreground/20" />
                  </div>
                )}
                <span className="absolute bottom-3 left-3 px-3 py-1 rounded-lg bg-background/80 backdrop-blur text-sm font-semibold">
                  {product.marca}
                </span>
              </div>

              {/* Info */}
              <div className="p-6 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded bg-brand/10 text-brand text-xs font-medium capitalize">
                    {product.categoria}
                  </span>
                  {product.subcategoria && (
                    <span className="px-2 py-0.5 rounded bg-secondary text-xs text-muted-foreground">
                      {product.subcategoria}
                    </span>
                  )}
                </div>

                <h2 className="text-xl font-bold mb-2">{product.nombre}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                  {product.descripcion}
                </p>

                <div className="space-y-4">
                  {/* Details */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="p-3 rounded-lg bg-secondary/50">
                      <p className="text-muted-foreground text-xs">Presentación</p>
                      <p className="font-medium">{product.presentacion}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/50">
                      <p className="text-muted-foreground text-xs">Disponibilidad</p>
                      <p className={`font-medium ${product.disponible ? "text-green-500" : "text-destructive"}`}>
                        {product.disponible ? "En stock" : "Agotado"}
                      </p>
                    </div>
                  </div>

                  {/* Añadir al Carrito */}
                  <button
                    onClick={() => {
                      addToCart(product);
                      onClose(); // Cierra el modal para que el usuario pueda ver el drawer del carrito
                    }}
                    disabled={!product.disponible}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3
                               rounded-xl bg-brand text-white font-bold
                               hover:bg-brand/90 hover:scale-[1.02] active:scale-95 transition-all
                               disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand/20"
                  >
                    {product.disponible ? (
                      <>
                        <ShoppingCart className="w-5 h-5" /> Añadir a Cotización
                      </>
                    ) : (
                      "Agotado"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
