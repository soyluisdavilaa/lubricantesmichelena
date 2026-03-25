"use client";

import { useCart } from "@/context/CartContext";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { generateCartWaMessage } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, X, Plus, Minus, Trash2, MessageCircle } from "lucide-react";

export function FloatingCart() {
  const { items, isOpen, itemCount, openCart, closeCart, updateQuantity, removeFromCart } = useCart();
  const { config } = useSiteConfig();

  // Handle WhatsApp checkout
  const handleCheckout = () => {
    // Si config tiene un mensaje base para el carrito, lo usamos. Podríamos agregar un campo después si se desea.
    const url = generateCartWaMessage(config.site.waNumber, items, "Hola, me gustaría solicitar una cotización de mi cesta de productos:\n");
    window.open(url, "_blank");
  };

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {itemCount > 0 && !isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 50 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={openCart}
            className="fixed bottom-[84px] right-6 sm:bottom-6 z-50 flex items-center justify-center
                       w-14 h-14 rounded-full bg-brand text-white shadow-xl shadow-brand/30
                       border-2 border-brand hover:bg-transparent hover:text-brand transition-colors"
          >
            <ShoppingCart className="w-6 h-6" />
            <motion.div
              key={itemCount}
              initial={{ scale: 1.5 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 rounded-full bg-red-600 text-white text-xs font-bold border-2 border-background shadow-sm"
            >
              {itemCount}
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Cart Overlay Context */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeCart}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 right-0 w-full md:w-[450px] max-w-[100vw] bg-background border-l border-border
                         z-50 flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
                <div className="flex items-center gap-3 text-brand">
                  <ShoppingCart className="w-6 h-6" />
                  <h2 className="text-xl font-bold font-serif text-foreground">Tu Cotización</h2>
                </div>
                <button
                  onClick={closeCart}
                  className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground gap-4">
                    <ShoppingCart className="w-16 h-16 opacity-20" />
                    <p>Tu canasta está vacía</p>
                  </div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      layout
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex gap-4 p-4 rounded-xl bg-card border border-border group"
                    >
                      {/* Image Thumbnail */}
                      <div className="relative w-16 h-16 rounded-lg bg-background border border-border flex-shrink-0 overflow-hidden">
                        {item.imagen ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.imagen} alt={item.nombre} className="w-full h-full object-contain p-1" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <ShoppingCart className="w-6 h-6 opacity-30" />
                          </div>
                        )}
                      </div>

                      {/* Details & Actions */}
                      <div className="flex flex-col justify-between flex-1 min-w-0">
                        <div>
                          <p className="text-xs text-brand font-medium mb-1 truncate">{item.marca || "Lubricantes"}</p>
                          <h3 className="text-sm font-semibold truncate" title={item.nombre}>{item.nombre}</h3>
                          <p className="text-xs text-muted-foreground">{item.presentacion}</p>
                        </div>
                        
                        <div className="flex items-center gap-3 mt-3">
                          <div className="flex items-center gap-2 px-2 py-1 bg-muted rounded-lg border border-border">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="text-muted-foreground hover:text-foreground p-0.5 rounded transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="text-sm font-medium min-w-[1.25rem] text-center">{item.cantidad}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="text-muted-foreground hover:text-foreground p-0.5 rounded transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors ml-auto"
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

              {/* Footer Checkout */}
              {items.length > 0 && (
                <div className="p-6 border-t border-border bg-card/50 backdrop-blur">
                  <button
                    onClick={handleCheckout}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-green-600/20"
                  >
                    <MessageCircle className="w-5 h-5 fill-current" />
                    Cotizar {itemCount} Productos
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
