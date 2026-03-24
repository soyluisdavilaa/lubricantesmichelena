"use client";

/* Tarjeta de producto — 3D tilt hover, gradient border, badges */

import { useRef, useState } from "react";
import { ShoppingCart, Eye, MessageCircle, Zap } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { openWhatsApp } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  onViewDetail: (product: Product) => void;
  index: number;
}

export function ProductCard({ product, onViewDetail, index }: ProductCardProps) {
  const { addToCart } = useCart();
  const { config } = useSiteConfig();
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  function handleMouseLeave() {
    setIsHovered(false);
  }

  const badge = product.badge;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.4 }}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="group relative rounded-2xl overflow-hidden bg-card border border-border
                 hover:shadow-2xl hover:shadow-brand/20 transition-all duration-300 transform-gpu"
    >
      {/* Spotlight Hover Effect */}
      {isHovered && (
        <div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100 z-10 hidden sm:block"
          style={{
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(249,115,22,0.15), transparent 40%)`,
          }}
        />
      )}

      {/* Image */}
      <div
        className="aspect-square bg-muted relative overflow-hidden cursor-pointer"
        onClick={() => onViewDetail(product)}
      >
        {product.imagen ? (
          <img
            src={product.imagen}
            alt={product.nombre}
            className="w-full h-full object-cover origin-bottom transition-transform duration-700 ease-out group-hover:scale-[1.15]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingCart className="w-12 h-12 text-muted-foreground/20" />
          </div>
        )}

        {/* Hover overlay */}
        <div
          className="absolute inset-0 bg-black/0 group-hover:bg-black/25
                     flex items-center justify-center opacity-0 group-hover:opacity-100
                     transition-all duration-300"
        >
          <span className="px-4 py-2 rounded-full bg-white/90 text-foreground text-sm font-medium flex items-center gap-2 shadow-lg">
            <Eye className="w-4 h-4" /> Ver Detalle
          </span>
        </div>

        {/* Brand badge */}
        <span className="absolute top-3 left-3 px-2 py-1 rounded-md bg-background/80 backdrop-blur text-xs font-semibold z-20">
          {product.marca}
        </span>

        {/* Status / promo badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1 z-20">
          {!product.disponible && (
            <span className="px-2 py-1 rounded-md bg-destructive/90 text-white text-xs font-medium">
              Agotado
            </span>
          )}
          {badge && product.disponible && (
            <span
              className="px-2 py-1 rounded-md text-white text-xs font-bold flex items-center gap-1"
              style={{ background: "#e87b20" }}
            >
              <Zap className="w-3 h-3" />
              {badge}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2 relative z-20">
        <p className="text-xs text-muted-foreground capitalize">
          {product.categoria}
          {product.subcategoria && ` · ${product.subcategoria}`}
        </p>
        <h3 className="font-semibold text-sm line-clamp-2 min-h-[2.5rem]">{product.nombre}</h3>
        <p className="text-xs text-muted-foreground">{product.presentacion}</p>

        <div className="flex items-center justify-end pt-2">
          <button
            onClick={() =>
              addToCart({
                id: product.id,
                nombre: product.nombre,
                marca: product.marca,
                presentacion: product.presentacion,
                imagen: product.imagen,
              })
            }
            disabled={!product.disponible}
            className="relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 overflow-hidden
                       disabled:opacity-50 disabled:cursor-not-allowed
                       bg-brand/10 text-brand hover:bg-brand hover:text-white group/btn"
          >
            <span
              className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full
                         transition-transform duration-500
                         bg-gradient-to-r from-transparent via-white/20 to-transparent"
            />
            {product.disponible ? "Cotizar" : "Agotado"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
