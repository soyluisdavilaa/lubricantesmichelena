"use client";

import { useCart } from "@/context/CartContext";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { generateCartWaMessage } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, X, Plus, Minus, Trash2, MessageCircle, Package } from "lucide-react";

export function FloatingCart() {
  const { items, isOpen, itemCount, justAdded, openCart, closeCart, updateQuantity, removeFromCart } = useCart();
  const { config } = useSiteConfig();

  const handleCheckout = () => {
    const url = generateCartWaMessage(
      config.site.waNumber,
      items,
      "Hola, me gustaría solicitar una cotización de mi cesta de productos:\n"
    );
    window.open(url, "_blank");
  };

  return (
    <>
      {/* FAB — solo cuando hay items y el modal está cerrado */}
      <AnimatePresence>
        {itemCount > 0 && !isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={
              justAdded
                ? {
                    opacity: 1, scale: [1, 1.25, 1], y: 0,
                    boxShadow: ["0 0 0 0px rgba(232,123,32,0.5)", "0 0 0 18px rgba(232,123,32,0)"],
                  }
                : { opacity: 1, scale: 1, y: 0 }
            }
            exit={{ opacity: 0, scale: 0.5, y: 50 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.5 }}
            onClick={openCart}
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center
                       w-16 h-16 rounded-full bg-brand text-white shadow-2xl shadow-brand/40
                       border-2 border-brand/50"
          >
            <ShoppingCart className="w-7 h-7" />
            <motion.div
              key={itemCount}
              initial={{ scale: 1.5 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6
                         rounded-full bg-red-500 text-white text-xs font-black
                         border-2 border-white shadow-md"
            >
              {itemCount > 9 ? "9+" : itemCount}
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Modal centrado */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeCart}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[90]"
            />

            {/* Ventana modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed z-[91] inset-x-3 bottom-3 top-[72px]
                         sm:inset-auto sm:left-1/2 sm:top-1/2
                         sm:-translate-x-1/2 sm:-translate-y-1/2
                         sm:w-full sm:max-w-md sm:max-h-[85vh]
                         bg-background rounded-3xl border border-border
                         shadow-2xl flex flex-col overflow-hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Tu cotización"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-card shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-brand/10 flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-brand" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-foreground leading-none">Tu Cotización</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {itemCount} {itemCount === 1 ? "producto" : "productos"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeCart}
                  className="w-10 h-10 rounded-2xl bg-secondary hover:bg-muted flex items-center justify-center
                             text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Cerrar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Lista de productos */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full py-16 text-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
                      <ShoppingCart className="w-9 h-9 text-muted-foreground/30" />
                    </div>
                    <div>
                      <p className="font-bold text-base text-foreground">Tu canasta está vacía</p>
                      <p className="text-sm text-muted-foreground mt-1">Agrega productos desde el catálogo</p>
                    </div>
                  </div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      layout
                      key={item.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex gap-4 p-4 rounded-2xl bg-card border border-border"
                    >
                      {/* Imagen */}
                      <div className="w-20 h-20 rounded-xl bg-muted border border-border shrink-0 overflow-hidden">
                        {item.imagen ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.imagen}
                            alt={item.nombre}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-8 h-8 text-muted-foreground/20" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex flex-col justify-between flex-1 min-w-0">
                        <div>
                          <p className="text-xs font-bold text-brand mb-0.5">{item.marca || "—"}</p>
                          <h3 className="text-sm font-bold leading-snug line-clamp-2">{item.nombre}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5">{item.presentacion}</p>
                        </div>

                        {/* Controles */}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-0 rounded-xl border border-border overflow-hidden bg-secondary">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-9 h-9 flex items-center justify-center text-muted-foreground
                                         hover:text-foreground hover:bg-muted transition-colors text-lg font-bold"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-10 text-center text-base font-black text-foreground">
                              {item.cantidad}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-9 h-9 flex items-center justify-center text-muted-foreground
                                         hover:text-foreground hover:bg-muted transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="w-9 h-9 rounded-xl flex items-center justify-center
                                       text-muted-foreground hover:text-red-500 hover:bg-red-500/10
                                       transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer CTA */}
              {items.length > 0 && (
                <div className="px-4 py-5 border-t border-border bg-card/60 backdrop-blur shrink-0">
                  <button
                    onClick={handleCheckout}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl
                               bg-[#16a34a] text-white font-black text-base
                               hover:bg-[#15803d] active:scale-95 transition-all
                               shadow-xl shadow-green-700/30"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Cotizar {itemCount} {itemCount === 1 ? "Producto" : "Productos"} por WhatsApp
                  </button>
                  <p className="text-xs text-center text-muted-foreground mt-3">
                    Se abrirá WhatsApp con el resumen listo para enviar.
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
