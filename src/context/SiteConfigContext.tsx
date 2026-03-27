"use client";

/* ═══════════════════════════════════════════════
   SITE CONFIG CONTEXT
   Provee toda la data del sitio a la app.
   Carga de localforage con fallback a defaults.
   ═══════════════════════════════════════════════ */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type {
  SiteConfig,
  Product,
  Service,
  Promo,
  BlogArticle,
  GalleryPhoto,
  Categoria,
  Review,
  Cita,
} from "@/lib/types";
import {
  defaultConfig,
  defaultProducts,
  defaultServices,
  defaultPromos,
  defaultBlog,
  defaultGallery,
  defaultCategorias,
  defaultReviews,
} from "@/lib/defaults";
import {
  getSavedConfig,
  getCachedConfig,
  setCachedConfig,
  saveConfig as persistConfig,
  getSavedProducts,
  saveProducts as persistProducts,
  getSavedServices,
  saveServices as persistServices,
  getSavedPromos,
  savePromos as persistPromos,
  getSavedBlog,
  saveBlog as persistBlog,
  getSavedGallery,
  saveGallery as persistGallery,
  getSavedCategories,
  saveCategories as persistCategories,
  getSavedReviews,
  saveReviews as persistReviews,
  getSavedCitas,
  saveCitas as persistCitas,
  addCita as persistAddCita,
} from "@/lib/storage";
import { deepMerge } from "@/lib/utils";

interface SiteConfigContextType {
  config: SiteConfig;
  products: Product[];
  services: Service[];
  promos: Promo[];
  blog: BlogArticle[];
  gallery: GalleryPhoto[];
  categorias: Categoria[];
  reviews: Review[];
  citas: Cita[];
  isLoading: boolean;
  // Setters — actualizan state + persisten en localforage
  saveConfig: (config: SiteConfig) => void;
  saveProducts: (products: Product[]) => void;
  saveServices: (services: Service[]) => void;
  savePromos: (promos: Promo[]) => void;
  saveBlog: (articles: BlogArticle[]) => void;
  saveGallery: (photos: GalleryPhoto[]) => void;
  saveCategories: (categories: Categoria[]) => void;
  saveReviews: (reviews: Review[]) => void;
  saveCitas: (citas: Cita[]) => void;
  addCita: (cita: Cita) => void;
  refreshCitas: () => Promise<void>;
}

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(
  undefined
);

export function SiteConfigProvider({ 
  children,
  initialConfig 
}: { 
  children: ReactNode;
  initialConfig?: SiteConfig;
}) {
  // Aplicar caché de localStorage de forma síncrona en el primer render, 
  // o usar initialConfig del servidor (SSR)
  const [config, setConfig] = useState<SiteConfig>(() => {
    if (initialConfig) return initialConfig;
    const cached = getCachedConfig();
    return cached ? deepMerge(defaultConfig, cached) : defaultConfig;
  });
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [services, setServices] = useState<Service[]>(defaultServices);
  const [promos, setPromos] = useState<Promo[]>(defaultPromos);
  const [blog, setBlog] = useState<BlogArticle[]>(defaultBlog);
  const [gallery, setGallery] = useState<GalleryPhoto[]>(defaultGallery);
  const [categorias, setCategorias] = useState<Categoria[]>(defaultCategorias);
  const [reviews, setReviews] = useState<Review[]>(defaultReviews);
  const [citas, setCitas] = useState<Cita[]>([]);
  // Siempre arrancamos en loading=true hasta que los productos y datos reales carguen de Supabase
  const [isLoading, setIsLoading] = useState(true);

  // Cargar todo desde localforage al montar
  useEffect(() => {
    async function loadAll() {
      try {
        const [
          savedProducts,
          savedServices,
          savedPromos,
          savedBlog,
          savedGallery,
          savedCategories,
          savedReviews,
          savedCitas,
        ] = await Promise.all([
          getSavedProducts(),
          getSavedServices(),
          getSavedPromos(),
          getSavedBlog(),
          getSavedGallery(),
          getSavedCategories(),
          getSavedReviews(),
          getSavedCitas(),
        ]);

        // Si NO recibimos initialConfig del servidor (e.g. CSR route), 
        // leemos de localforage. Si sí lo recibimos, la verdad absoluta es el servidor.
        if (!initialConfig) {
          const savedConfig = await getSavedConfig();
          if (savedConfig) {
            const merged = deepMerge(defaultConfig, savedConfig);
            setConfig(merged);
            setCachedConfig(merged);
          }
        } else {
          // Asegurar que el caché del navegador se actualice con la nueva data del servidor
          setCachedConfig(initialConfig);
        }

        if (savedProducts?.length) setProducts(savedProducts);
        if (savedServices?.length) setServices(savedServices);
        if (savedPromos?.length) setPromos(savedPromos);
        if (savedBlog?.length) setBlog(savedBlog);
        if (savedGallery?.length) setGallery(savedGallery);
        if (savedCategories?.length) setCategorias(savedCategories);
        if (savedReviews?.length) setReviews(savedReviews);
        if (savedCitas) setCitas(savedCitas);
      } catch (err) {
        console.error("Error cargando datos:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadAll();
  }, []);

  // Aplicar color primario dinámicamente
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--brand",
      config.colores.primario
    );
  }, [config.colores.primario]);

  // Precargar imágenes de fondo solo cuando cambien las URLs
  useEffect(() => {
    if (isLoading) return;
    const urls = [
      config.bgImages?.servicios,
      config.bgImages?.catalogo,
      config.bgImages?.contacto,
      config.hero?.imagen,
      ...(config.hero?.slides ?? []),
    ].filter(Boolean) as string[];
    urls.forEach((url) => {
      const img = new window.Image();
      img.src = url;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isLoading,
    config.bgImages?.servicios,
    config.bgImages?.catalogo,
    config.bgImages?.contacto,
    config.hero?.imagen,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    config.hero?.slides?.join(","),
  ]);

  // Setters con optimistic UI (actualiza state inmediato + persiste en background)
  const saveConfig = useCallback((c: SiteConfig) => {
    setConfig(c);
    setCachedConfig(c);
    persistConfig(c);
  }, []);

  const saveProducts = useCallback((p: Product[]) => {
    setProducts(p);
    persistProducts(p);
  }, []);

  const saveServices = useCallback((s: Service[]) => {
    setServices(s);
    persistServices(s);
  }, []);

  const savePromos = useCallback((p: Promo[]) => {
    setPromos(p);
    persistPromos(p);
  }, []);

  const saveBlog = useCallback((a: BlogArticle[]) => {
    setBlog(a);
    persistBlog(a);
  }, []);

  const saveGallery = useCallback((g: GalleryPhoto[]) => {
    setGallery(g);
    persistGallery(g);
  }, []);

  const saveCategories = useCallback((c: Categoria[]) => {
    setCategorias(c);
    persistCategories(c);
  }, []);

  const saveReviews = useCallback((r: Review[]) => {
    setReviews(r);
    persistReviews(r);
  }, []);

  const saveCitas = useCallback((c: Cita[]) => {
    setCitas(c);
    persistCitas(c);
  }, []);

  const addCita = useCallback((cita: Cita) => {
    setCitas((prev) => [...prev, cita]);
    persistAddCita(cita);
  }, []);

  const refreshCitas = useCallback(async () => {
    const saved = await getSavedCitas();
    if (saved) setCitas(saved);
  }, []);

  return (
    <SiteConfigContext.Provider
      value={{
        config,
        products,
        services,
        promos,
        blog,
        gallery,
        categorias,
        reviews,
        citas,
        isLoading,
        saveConfig,
        saveProducts,
        saveServices,
        savePromos,
        saveBlog,
        saveGallery,
        saveCategories,
        saveReviews,
        saveCitas,
        addCita,
        refreshCitas,
      }}
    >
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig() {
  const ctx = useContext(SiteConfigContext);
  if (!ctx)
    throw new Error("useSiteConfig debe usarse dentro de SiteConfigProvider");
  return ctx;
}
