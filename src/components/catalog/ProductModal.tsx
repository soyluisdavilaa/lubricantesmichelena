"use client";

/* Modal de detalle de producto — rediseño premium */

import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle, ShoppingCart, Package, Tag, Box } from "lucide-react";
import type { Product } from "@/lib/types";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { useCart } from "@/context/CartContext";
import { openWhatsApp, getProductWaMessage } from "@/lib/utils";

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
            className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed inset-x-3 top-[10%] bottom-3 sm:inset-auto sm:left-1/2 sm:top-1/2
                       sm:-translate-x-1/2 sm:-translate-y-1/2
                       z-[91] sm:w-full sm:max-w-4xl sm:max-h-[90vh]
                       bg-card rounded-3xl border border-border/80 shadow-2xl
                       overflow-hidden flex flex-col sm:flex-row"
            role="dialog"
            aria-modal="true"
            aria-label={product.nombre}
          >
            {/* ── Left: Image panel ── */}
            <div className="sm:w-[45%] relative bg-muted shrink-0 overflow-hidden h-[150px] sm:h-auto">
              {product.imagen ? (
                <img
                  src={product.imagen}
                  alt={`${product.nombre} - ${product.marca} - ${product.categoria}`}
                  className="w-full h-full object-cover object-center absolute inset-0"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-24 h-24 text-muted-foreground/10" />
                </div>
              )}

              {/* Gradient overlay — bottom to top */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Category badge — top left */}
              <div className="absolute top-4 left-4 z-10">
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-brand/90 backdrop-blur-sm text-white text-xs font-bold shadow-lg">
                  <Tag className="w-3 h-3" />
                  {product.categoria}
                </span>
              </div>

              {/* Brand name — bottom left */}
              <div className="absolute bottom-4 left-4 right-4 z-10">
                <p className="text-white/60 text-xs font-medium uppercase tracking-widest mb-1">Marca</p>
                <p className="text-white text-xl font-black tracking-tight drop-shadow-lg">{product.marca}</p>
              </div>

              {/* Agotado badge */}
              {!product.disponible && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="px-3 py-1.5 rounded-full bg-destructive/90 text-white text-xs font-bold">
                    Agotado
                  </span>
                </div>
              )}
            </div>

            {/* ── Right: Info panel ── */}
            <div className="flex-1 flex flex-col overflow-y-auto">
              {/* Top bar */}
              <div className="flex items-start justify-between p-4 sm:p-6 pb-3 sm:pb-4">
                <div className="flex flex-wrap gap-2">
                  {product.subcategoria && (
                    <span className="px-2.5 py-1 rounded-lg bg-secondary text-xs font-semibold text-muted-foreground">
                      {product.subcategoria}
                    </span>
                  )}
                  {product.badge && (
                    <span
                      className="px-2.5 py-1 rounded-lg text-white text-xs font-bold"
                      style={{ background: "#e87b20" }}
                    >
                      {product.badge}
                    </span>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="ml-3 shrink-0 w-9 h-9 rounded-full bg-secondary hover:bg-secondary/80
                             flex items-center justify-center transition-colors"
                  aria-label="Cerrar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Product name */}
              <div className="px-4 sm:px-6 pb-3 sm:pb-4">
                <h2 className="text-xl sm:text-3xl font-black leading-tight mb-2">{product.nombre}</h2>
                <div className="w-10 h-1 rounded-full bg-brand" />
              </div>

              {/* Description */}
              <div className="px-4 sm:px-6 flex-1">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {product.descripcion || "Consulta con nosotros para más información sobre este producto."}
                </p>
              </div>

              {/* Details grid */}
              <div className="px-4 sm:px-6 pt-3 sm:pt-5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-secondary/60 border border-border/50 space-y-1">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Box className="w-3.5 h-3.5" />
                      <p className="text-[11px] uppercase tracking-wider font-semibold">Presentación</p>
                    </div>
                    <p className="font-bold text-sm">{product.presentacion || "—"}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-secondary/60 border border-border/50 space-y-1">
                    <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
                      Disponibilidad
                    </p>
                    <p className={`font-bold text-sm flex items-center gap-1.5 ${product.disponible ? "text-emerald-500" : "text-destructive"}`}>
                      <span className={`w-2 h-2 rounded-full ${product.disponible ? "bg-emerald-500" : "bg-destructive"}`} />
                      {product.disponible ? "En stock" : "Agotado"}
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="p-4 sm:p-6 space-y-2 sm:space-y-3 mt-2 sm:mt-4">
                <button
                  onClick={() => {
                    addToCart(product);
                    onClose();
                  }}
                  disabled={!product.disponible}
                  className="w-full flex items-center justify-center gap-2 px-5 py-4 rounded-2xl
                             bg-brand text-white font-bold text-sm
                             hover:bg-brand/90 hover:scale-[1.02] active:scale-95 transition-all duration-200
                             disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                             shadow-xl shadow-brand/25"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {product.disponible ? "Añadir a Cotización" : "No disponible"}
                </button>

                <button
                  onClick={() => {
                    const msg = getProductWaMessage(config.waProductMessage, product);
                    openWhatsApp(config.site.waNumber, msg);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-5 py-4 rounded-2xl
                             bg-[#16a34a] text-white font-bold text-sm
                             hover:bg-[#15803d] hover:scale-[1.02] active:scale-95 transition-all duration-200
                             shadow-xl shadow-green-700/25"
                >
                  <MessageCircle className="w-5 h-5" />
                  Consultar por WhatsApp
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
