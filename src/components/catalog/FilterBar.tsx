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
  sortBy,
  onSortChange,
}: FilterBarProps) {
  const { categorias } = useSiteConfig();

  const activeCat = categorias.find((c) => c.id === selectedCat);
  const subs = activeCat?.subs ?? [];

  const clearFilters = () => {
    onSearchChange("");
    onCatChange("");
    onSubChange("");
    onSortChange("default");
  };

  const hasActiveFilters = search || selectedCat || selectedSub || sortBy !== "default";

  return (
    <div className="space-y-4">
      {/* Search + Sort row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar productos..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border
                       text-sm placeholder:text-muted-foreground focus:outline-none
                       focus:ring-2 focus:ring-brand/30 focus:border-brand/50 transition-all"
          />
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-card border border-border text-sm
                     focus:outline-none focus:ring-2 focus:ring-brand/30 cursor-pointer"
        >
          <option value="default">Ordenar por</option>
          <option value="name-asc">Nombre A-Z</option>
          <option value="name-desc">Nombre Z-A</option>
          <option value="price-asc">Precio: menor a mayor</option>
          <option value="price-desc">Precio: mayor a menor</option>
        </select>
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => {
            onCatChange("");
            onSubChange("");
          }}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            !selectedCat
              ? "bg-brand text-brand-foreground"
              : "bg-secondary text-muted-foreground hover:text-foreground"
          }`}
        >
          Todos
        </button>
        {categorias.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              onCatChange(cat.id === selectedCat ? "" : cat.id);
              onSubChange("");
            }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedCat === cat.id
                ? "bg-brand text-brand-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat.nombre}
          </button>
        ))}
      </div>

      {/* Subcategory chips (only if a category is selected) */}
      {subs.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {subs.map((sub) => (
            <button
              key={sub.id}
              onClick={() => onSubChange(sub.id === selectedSub ? "" : sub.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedSub === sub.id
                  ? "bg-brand/20 text-brand"
                  : "bg-secondary/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              {sub.nombre}
            </button>
          ))}
        </div>
      )}

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
