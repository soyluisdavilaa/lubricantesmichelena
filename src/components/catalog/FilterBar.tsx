"use client";

/* Barra de filtros — categoría, subcategoría, búsqueda, ordenar */

import { Search, SlidersHorizontal, X } from "lucide-react";
import { useSiteConfig } from "@/context/SiteConfigContext";

interface FilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  selectedCat: string;
  onCatChange: (val: string) => void;
  selectedSub: string;
  onSubChange: (val: string) => void;
  selectedBrand: string;
  onBrandChange: (val: string) => void;
  sortBy: string;
  onSortChange: (val: string) => void;
}

export function FilterBar({
  search,
  onSearchChange,
  selectedCat,
  onCatChange,
  selectedSub,
  onSubChange,
  selectedBrand,
  onBrandChange,
  sortBy,
  onSortChange,
}: FilterBarProps) {
  const { categorias, products } = useSiteConfig();

  const activeCat = categorias.find((c) => c.id === selectedCat);
  const subs = activeCat?.subs ?? [];

  // Extraer las marcas únicas de los productos activos
  const uniqueBrands = Array.from(new Set(products.filter(p => p.disponible).map(p => p.marca))).filter(Boolean).sort();

  const clearFilters = () => {
    onSearchChange("");
    onCatChange("");
    onSubChange("");
    onBrandChange("");
    onSortChange("default");
  };

  const hasActiveFilters = Boolean(search || selectedCat || selectedSub || selectedBrand || sortBy !== "default");

  return (
    <div className="space-y-4">
      {/* Search + Sort row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Búsqueda Inteligente (ej. viscosidad, nombre, marca...)"
            className="w-full pl-10 pr-10 py-3 rounded-xl bg-card border border-brand/20
                       text-sm placeholder:text-muted-foreground focus:outline-none focus:bg-background
                       focus:ring-2 focus:ring-brand/50 focus:border-brand/50 transition-all font-medium shadow-sm"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-4 py-3 rounded-xl bg-card border border-border text-sm font-medium
                     focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/30 cursor-pointer shadow-sm"
        >
          <option value="default">Ordenar por</option>
          <option value="name-asc">Nombre A-Z</option>
          <option value="name-desc">Nombre Z-A</option>
        </select>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 bg-card/50 p-4 rounded-xl border border-border/50">
        {/* Category chips */}
        <div className="flex-1 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Categoría</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                onCatChange("");
                onSubChange("");
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                !selectedCat
                  ? "bg-brand text-white shadow-md shadow-brand/20"
                  : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
              }`}
            >
              Todas
            </button>
            {categorias.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onCatChange(cat.id === selectedCat ? "" : cat.id);
                  onSubChange("");
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedCat === cat.id
                    ? "bg-brand text-white shadow-md shadow-brand/20"
                    : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                }`}
              >
                {cat.nombre}
              </button>
            ))}
          </div>
          
          {/* Subcategory chips (only if a category is selected) */}
          {subs.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {subs.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => onSubChange(sub.id === selectedSub ? "" : sub.id)}
                  className={`px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider transition-all ${
                    selectedSub === sub.id
                      ? "bg-brand/20 text-brand outline outline-1 outline-brand/30"
                      : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                  }`}
                >
                  {sub.nombre}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Brand chips */}
        {uniqueBrands.length > 0 && (
          <div className="flex-1 space-y-2 lg:border-l lg:border-border/50 lg:pl-8">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Marcas</p>
            <div className="flex flex-wrap gap-2">
              {uniqueBrands.map((marca) => (
                <button
                  key={marca}
                  onClick={() => onBrandChange(marca === selectedBrand ? "" : marca)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedBrand === marca
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                      : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                  }`}
                >
                  {marca}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Active filters indicator */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <SlidersHorizontal className="w-3 h-3" />
          Limpiar filtros
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
