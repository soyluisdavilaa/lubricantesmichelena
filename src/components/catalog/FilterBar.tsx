"use client";

/* Barra de filtros — categoría, subcategoría, búsqueda, ordenar */

import { useState, useRef, useEffect } from "react";
import { Search, X, SlidersHorizontal, ChevronDown, Check } from "lucide-react";
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

const SORT_OPTIONS = [
  { value: "default", label: "Orden predeterminado" },
  { value: "name-asc", label: "Nombre A → Z" },
  { value: "name-desc", label: "Nombre Z → A" },
];

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
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const activeCat = categorias.find((c) => c.id === selectedCat);
  const subs = activeCat?.subs ?? [];

  const clearFilters = () => {
    onSearchChange("");
    onCatChange("");
    onSubChange("");
    onSortChange("default");
  };

  const hasActiveFilters = Boolean(search || selectedCat || selectedSub || sortBy !== "default");

  return (
    <div className="space-y-5">
      {/* Search + Sort row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search bar — modern glowing design */}
        <div className="relative flex-1 group">
          {/* Glow border */}
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-brand/40 via-brand/20 to-brand/40 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-sm pointer-events-none" />
          <div className="relative flex items-center bg-card border border-border group-focus-within:border-brand/50 rounded-2xl shadow-sm transition-all duration-300 overflow-hidden">
            <div className="flex items-center justify-center w-12 h-full shrink-0 text-muted-foreground group-focus-within:text-brand transition-colors duration-300">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar por nombre, categoría, descripción…"
              className="flex-1 py-3.5 pr-4 bg-transparent text-sm placeholder:text-muted-foreground/60 focus:outline-none font-medium"
            />
            {search && (
              <button
                onClick={() => onSearchChange("")}
                className="mr-3 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Sort selector — custom dropdown */}
        <div className="relative shrink-0" ref={sortRef}>
          <button
            type="button"
            onClick={() => setSortOpen((o) => !o)}
            className="flex items-center gap-2 pl-4 pr-3 py-3.5 bg-card border border-border rounded-2xl shadow-sm
                       hover:border-brand/30 transition-colors text-sm font-semibold min-w-[200px] justify-between"
          >
            <span className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-muted-foreground shrink-0" />
              {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
            </span>
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${sortOpen ? "rotate-180" : ""}`} />
          </button>

          {sortOpen && (
            <div className="absolute right-0 top-full mt-2 w-full bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => { onSortChange(opt.value); setSortOpen(false); }}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-secondary
                    ${sortBy === opt.value ? "text-brand font-bold" : "font-medium"}`}
                >
                  {opt.label}
                  {sortBy === opt.value && <Check className="w-4 h-4 text-brand" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Category + subcategory chips */}
      <div className="bg-card/60 backdrop-blur-sm p-4 rounded-2xl border border-border/60 space-y-3">
        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
          <span className="w-4 h-px bg-brand/50" />
          Categoría
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { onCatChange(""); onSubChange(""); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
              !selectedCat
                ? "bg-brand text-white shadow-md shadow-brand/30 scale-[1.03]"
                : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/70 hover:scale-[1.02]"
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
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                selectedCat === cat.id
                  ? "bg-brand text-white shadow-md shadow-brand/30 scale-[1.03]"
                  : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/70 hover:scale-[1.02]"
              }`}
            >
              {cat.nombre}
            </button>
          ))}
        </div>

        {/* Subcategory chips */}
        {subs.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1 pt-3 border-t border-border/40">
            {subs.map((sub) => (
              <button
                key={sub.id}
                onClick={() => onSubChange(sub.id === selectedSub ? "" : sub.id)}
                className={`px-3 py-1.5 rounded-lg text-[11px] uppercase font-bold tracking-wider transition-all duration-200 ${
                  selectedSub === sub.id
                    ? "bg-brand/20 text-brand ring-1 ring-brand/40 scale-[1.03]"
                    : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary/80 hover:scale-[1.02]"
                }`}
              >
                {sub.nombre}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Clear filters */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-brand transition-colors group"
        >
          <X className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-200" />
          Limpiar todos los filtros
        </button>
      )}
    </div>
  );
}
