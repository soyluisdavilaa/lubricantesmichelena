"use client";

/* ═══════════════════════════════════════════════
   CATÁLOGO — toggle grid/lista, búsqueda global
   ═══════════════════════════════════════════════ */

import { useState, useMemo } from "react";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { FilterBar } from "@/components/catalog/FilterBar";
import { ProductCard } from "@/components/catalog/ProductCard";
import { ProductModal } from "@/components/catalog/ProductModal";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { Package, LayoutGrid, List, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "@/lib/types";
import { openWhatsApp, cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 12;

function parsePrice(price: string): number {
  return parseFloat(price.replace(/[^0-9.]/g, "")) || 0;
}

/* ── List row view ── */
function ProductRow({
  product,
  onViewDetail,
  index,
}: {
  product: Product;
  onViewDetail: (p: Product) => void;
  index: number;
}) {
  const { config } = useSiteConfig();

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03, duration: 0.35 }}
      className="group flex items-center gap-4 p-4 rounded-xl bg-card border border-border
                 hover:border-brand/25 hover:shadow-lg hover:shadow-brand/5
                 transition-all duration-200 cursor-pointer"
      onClick={() => onViewDetail(product)}
    >
      <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden shrink-0">
        {product.imagen ? (
          <img src={product.imagen} alt={product.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-6 h-6 text-muted-foreground/30" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-muted-foreground">{product.marca}</span>
          {product.badge && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white"
              style={{ background: "#e87b20" }}>
              {product.badge}
            </span>
          )}
        </div>
        <p className="font-semibold text-sm truncate">{product.nombre}</p>
        <p className="text-xs text-muted-foreground">{product.presentacion} · {product.categoria}</p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {!product.disponible && (
          <span className="text-xs text-destructive font-medium">Agotado</span>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            openWhatsApp(config.site.waNumber, `Hola, me interesa: ${product.nombre} (${product.marca})`);
          }}
          className="p-2 rounded-lg text-whatsapp hover:bg-whatsapp/10 transition-colors"
          aria-label="Consultar por WhatsApp"
        >
          <MessageCircle className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

export default function CatalogoPage() {
  const { products, isLoading } = useSiteConfig();
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("");
  const [selectedSub, setSelectedSub] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filtered = useMemo(() => {
    let result = [...products];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.nombre.toLowerCase().includes(q) ||
          p.marca.toLowerCase().includes(q) ||
          p.descripcion.toLowerCase().includes(q) ||
          p.categoria.toLowerCase().includes(q)
      );
    }
    if (selectedCat) result = result.filter((p) => p.categoria === selectedCat);
    if (selectedSub) result = result.filter((p) => p.subcategoria === selectedSub);
    switch (sortBy) {
      case "name-asc":   result.sort((a, b) => a.nombre.localeCompare(b.nombre)); break;
      case "name-desc":  result.sort((a, b) => b.nombre.localeCompare(a.nombre)); break;
    }
    return result;
  }, [products, search, selectedCat, selectedSub, sortBy]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const reset = (setter: (v: string) => void) => (v: string) => { setter(v); setPage(1); };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-12 border-b border-border bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <span className="text-brand font-semibold text-sm uppercase tracking-wider">Catálogo</span>
            <h1 className="text-3xl sm:text-4xl font-bold mt-2 mb-2">Nuestros Productos</h1>
            <p className="text-muted-foreground">
              {filtered.length} producto{filtered.length !== 1 ? "s" : ""} disponible{filtered.length !== 1 ? "s" : ""}
            </p>
          </RevealOnScroll>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter bar + view toggle */}
          <div className="flex items-start gap-3 mb-8">
            <div className="flex-1">
              <FilterBar
                search={search}
                onSearchChange={reset(setSearch)}
                selectedCat={selectedCat}
                onCatChange={reset(setSelectedCat)}
                selectedSub={selectedSub}
                onSubChange={reset(setSelectedSub)}
                sortBy={sortBy}
                onSortChange={reset(setSortBy)}
              />
            </div>

            {/* View toggle */}
            <div className="flex items-center gap-1 p-1 rounded-lg bg-secondary border border-border shrink-0">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2 rounded-md transition-colors",
                  viewMode === "grid"
                    ? "bg-background shadow-sm text-brand"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-label="Vista grilla"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-2 rounded-md transition-colors",
                  viewMode === "list"
                    ? "bg-background shadow-sm text-brand"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-label="Vista lista"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Products */}
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading-catalog"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-6"
                    : "space-y-3"
                }
              >
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={`skeleton-catalog-${i}`}
                    className={
                      viewMode === "grid"
                        ? "h-[340px] rounded-2xl bg-card border border-border animate-pulse"
                        : "h-24 rounded-xl bg-card border border-border animate-pulse"
                    }
                  />
                ))}
              </motion.div>
            ) : paginated.length > 0 ? (
              <motion.div
                key={viewMode}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-6">
                    {paginated.map((product, i) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onViewDetail={setSelectedProduct}
                        index={i}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {paginated.map((product, i) => (
                      <ProductRow
                        key={product.id}
                        product={product}
                        onViewDetail={setSelectedProduct}
                        index={i}
                      />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 rounded-lg bg-secondary text-sm font-medium
                                 hover:bg-secondary/80 transition-colors
                                 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                       Anterior
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                      <button
                        key={num}
                        onClick={() => setPage(num)}
                        className={cn(
                          "w-10 h-10 rounded-lg text-sm font-medium transition-colors",
                          num === page ? "bg-brand text-white" : "bg-secondary hover:bg-secondary/80"
                        )}
                      >
                        {num}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-2 rounded-lg bg-secondary text-sm font-medium
                                 hover:bg-secondary/80 transition-colors
                                 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                       Siguiente
                    </button>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No se encontraron productos</h3>
                <p className="text-sm text-muted-foreground">
                  Intenta con otra búsqueda o cambia los filtros.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
}
