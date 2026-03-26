"use client";

/* Tarjeta de producto — 3D tilt hover, gradient border, badges, two CTAs */

import { useRef, useState } from "react";
import { ShoppingCart, Eye, MessageCircle, Zap, Package } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { openWhatsApp, getProductWaMessage } from "@/lib/utils";

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

  const badge = product.badge;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.4 }}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative rounded-2xl overflow-hidden bg-card border border-border
                 hover:shadow-2xl hover:shadow-brand/20 hover:border-brand/25
                 transition-all duration-300 transform-gpu flex flex-col"
    >
      {/* Spotlight Hover Effect */}
      {isHovered && (
        <div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100 z-10 hidden sm:block"
          style={{
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(249,115,22,0.12), transparent 40%)`,
          }}
        />
      )}

      {/* Image */}
      <div
        className="aspect-square bg-muted relative overflow-hidden cursor-pointer"
        onClick={() => onViewDetail(product)}
      >
        {(product.imagenes?.[0] || product.imagen) ? (
          <img
            src={(product.imagenes?.[0] || product.imagen)}
            alt={`${product.nombre} - ${product.marca} - ${product.categoria}`}
            className="w-full h-full object-cover origin-bottom transition-transform duration-700 ease-out group-hover:scale-[1.12]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-12 h-12 text-muted-foreground/20" />
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/55 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <span className="px-4 py-2 rounded-full bg-white text-black text-xs font-bold flex items-center gap-2 shadow-xl hover:scale-105 transition-transform">
            <Eye className="w-3.5 h-3.5" /> Ver Detalle
          </span>
        </div>

        {/* Brand badge */}
        <span className="absolute top-3 left-3 px-2 py-1 rounded-md bg-background/80 backdrop-blur text-xs font-bold z-20">
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
      <div className="p-4 space-y-2 relative z-20 flex flex-col flex-1">
        <p className="text-xs text-muted-foreground capitalize">
          {product.categoria}
          {product.subcategoria && ` · ${product.subcategoria}`}
        </p>
        <h3 className="font-bold text-sm line-clamp-2 min-h-[2.5rem] flex-1">{product.nombre}</h3>
        <p className="text-xs text-muted-foreground">{product.presentacion}</p>

        {/* Two permanent CTA buttons */}
        <div className="pt-2 space-y-2">
          {/* Añadir a Cotización */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            disabled={!product.disponible}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold
                       bg-brand text-white hover:bg-brand/85 active:scale-95 transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-brand
                       shadow-md shadow-brand/30"
          >
            <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
            {product.disponible ? "Añadir a Cotización" : "Agotado"}
          </button>

          {/* Consultar por WhatsApp */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              const msg = getProductWaMessage(config.waProductMessage, product);
              openWhatsApp(config.site.waNumber, msg);
            }}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold
                       bg-[#16a34a] text-white hover:bg-[#15803d] active:scale-95 transition-all duration-200
                       shadow-md shadow-green-700/30"
          >
            <MessageCircle className="w-3.5 h-3.5 shrink-0" />
            Consultar
          </button>
        </div>
      </div>
    </motion.div>
  );
}
