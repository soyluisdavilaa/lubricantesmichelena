"use client";

/* Productos destacados — 4 cards con CTA y hover motion */

import { motion } from "framer-motion";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { useCart } from "@/context/CartContext";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { ShoppingCart, ArrowRight, MessageCircle } from "lucide-react";
import { openWhatsApp, getProductWaMessage } from "@/lib/utils";
import Link from "next/link";

export function FeaturedProducts() {
  const { products, isLoading, config } = useSiteConfig();
  const { addToCart } = useCart();

  const featured = products.filter((p) => p.disponible).slice(0, 4);

  return (
    <section className="py-20 bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="flex items-end justify-between mb-14">
            <div>
              <span className="inline-flex items-center px-5 py-2 rounded-full border border-brand/30 bg-brand/5 text-brand font-bold text-sm sm:text-base uppercase tracking-widest shadow-sm">
                Productos
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-3">
                Los Más Populares
              </h2>
            </div>
            <Link
              href="/catalogo"
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-brand hover:underline"
            >
              Ver todos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={`skeleton-featured-${i}`}
                  className="h-[340px] rounded-2xl bg-card border border-border animate-pulse"
                />
              ))
            : featured.map((product, i) => (
            <RevealOnScroll key={product.id} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -8, boxShadow: "0 24px 48px rgba(249,115,22,0.12)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group rounded-2xl bg-card border border-border overflow-hidden
                           hover:border-brand/25 transition-colors duration-300 cursor-default"
              >
                {/* Image */}
                <div className="aspect-square bg-muted relative overflow-hidden">
                  {product.imagen ? (
                    <img
                      src={product.imagen}
                      alt={product.nombre}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingCart className="w-12 h-12 text-muted-foreground/20" />
                    </div>
                  )}
                  {/* Brand badge */}
                  <span className="absolute top-3 left-3 px-2 py-1 rounded-md bg-background/80 backdrop-blur text-xs font-medium">
                    {product.marca}
                  </span>
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  <p className="text-xs text-muted-foreground capitalize">
                    {product.categoria}
                  </p>
                  <h3 className="font-semibold text-sm truncate">
                    {product.nombre}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {product.descripcion}
                  </p>
                  <div className="flex items-center justify-end pt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg bg-brand/10 text-brand text-[10px] sm:text-xs font-medium
                                 hover:bg-brand hover:text-white transition-colors duration-200"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" /> Añadir
                    </button>
                  </div>
                </div>
              </motion.div>
            </RevealOnScroll>
          ))}
        </div>

        {/* Mobile "Ver todos" */}
        <div className="sm:hidden mt-8 text-center">
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full
                       bg-secondary text-foreground font-medium"
          >
            Ver todo el catálogo <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
