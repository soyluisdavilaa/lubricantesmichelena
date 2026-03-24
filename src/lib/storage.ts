/* ═══════════════════════════════════════════════
   STORAGE — Lubricantes Michelena
   Capa de persistencia con localforage (IndexedDB)
   Se usa como caché local + fallback offline.
   Los datos principales viven en Supabase.
   ═══════════════════════════════════════════════ */

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
  CartItem,
  Subscriber,
} from "./types";

// Keys de storage
const KEYS = {
  config: "lm_config",
  products: "lm_products",
  services: "lm_services",
  promos: "lm_promos",
  blog: "lm_blog",
  gallery: "lm_gallery",
  categories: "lm_categories",
  reviews: "lm_reviews",
  citas: "lm_citas",
  cart: "lm_cart",
  subscribers: "lm_subscribers",
  adminHash: "lm_admin_hash",
  theme: "lm_theme",
} as const;

/**
 * Importa localforage dinámicamente (solo en el browser).
 * Esto evita errores de SSR en Next.js.
 */
async function getLocalForage() {
  const lf = (await import("localforage")).default;
  lf.config({
    name: "LubricantesMichelena",
    storeName: "lm_store",
  });
  return lf;
}

// ─── GETTERS GENÉRICOS ───

async function getItem<T>(key: string): Promise<T | null> {
  const lf = await getLocalForage();
  return lf.getItem<T>(key);
}

async function setItem<T>(key: string, value: T): Promise<T> {
  const lf = await getLocalForage();
  return lf.setItem(key, value);
}

// ─── CONFIG ───

export async function getSavedConfig(): Promise<Partial<SiteConfig> | null> {
  return getItem<Partial<SiteConfig>>(KEYS.config);
}

export async function saveConfig(config: SiteConfig): Promise<void> {
  await setItem(KEYS.config, config);
}

// ─── PRODUCTS ───

export async function getSavedProducts(): Promise<Product[] | null> {
  return getItem<Product[]>(KEYS.products);
}

export async function saveProducts(products: Product[]): Promise<void> {
  await setItem(KEYS.products, products);
}

// ─── SERVICES ───

export async function getSavedServices(): Promise<Service[] | null> {
  return getItem<Service[]>(KEYS.services);
}

export async function saveServices(services: Service[]): Promise<void> {
  await setItem(KEYS.services, services);
}

// ─── PROMOS ───

export async function getSavedPromos(): Promise<Promo[] | null> {
  return getItem<Promo[]>(KEYS.promos);
}

export async function savePromos(promos: Promo[]): Promise<void> {
  await setItem(KEYS.promos, promos);
}

// ─── BLOG ───

export async function getSavedBlog(): Promise<BlogArticle[] | null> {
  return getItem<BlogArticle[]>(KEYS.blog);
}

export async function saveBlog(articles: BlogArticle[]): Promise<void> {
  await setItem(KEYS.blog, articles);
}

// ─── GALLERY ───

export async function getSavedGallery(): Promise<GalleryPhoto[] | null> {
  return getItem<GalleryPhoto[]>(KEYS.gallery);
}

export async function saveGallery(photos: GalleryPhoto[]): Promise<void> {
  await setItem(KEYS.gallery, photos);
}

// ─── CATEGORIES ───

export async function getSavedCategories(): Promise<Categoria[] | null> {
  return getItem<Categoria[]>(KEYS.categories);
}

export async function saveCategories(categories: Categoria[]): Promise<void> {
  await setItem(KEYS.categories, categories);
}

// ─── REVIEWS ───

export async function getSavedReviews(): Promise<Review[] | null> {
  return getItem<Review[]>(KEYS.reviews);
}

export async function saveReviews(reviews: Review[]): Promise<void> {
  await setItem(KEYS.reviews, reviews);
}

// ─── CITAS ───

export async function getSavedCitas(): Promise<Cita[] | null> {
  return getItem<Cita[]>(KEYS.citas);
}

export async function saveCitas(citas: Cita[]): Promise<void> {
  await setItem(KEYS.citas, citas);
}

export async function addCita(cita: Cita): Promise<void> {
  const existing = (await getSavedCitas()) || [];
  existing.push(cita);
  await saveCitas(existing);
}

// ─── CART ───

export async function getSavedCart(): Promise<CartItem[] | null> {
  return getItem<CartItem[]>(KEYS.cart);
}

export async function saveCart(items: CartItem[]): Promise<void> {
  await setItem(KEYS.cart, items);
}

// ─── SUBSCRIBERS ───

export async function getSavedSubscribers(): Promise<Subscriber[] | null> {
  return getItem<Subscriber[]>(KEYS.subscribers);
}

export async function addSubscriber(email: string): Promise<boolean> {
  const existing = (await getSavedSubscribers()) || [];
  if (existing.some((s) => s.email === email)) return false;
  existing.push({ email, fecha: new Date().toISOString() });
  await setItem(KEYS.subscribers, existing);
  return true;
}

// ─── ADMIN ───

export async function getAdminHash(): Promise<string | null> {
  return getItem<string>(KEYS.adminHash);
}

export async function setAdminHash(hash: string): Promise<void> {
  await setItem(KEYS.adminHash, hash);
}

// ─── THEME ───

export async function getSavedTheme(): Promise<"dark" | "light" | null> {
  return getItem<"dark" | "light">(KEYS.theme);
}

export async function saveTheme(theme: "dark" | "light"): Promise<void> {
  await setItem(KEYS.theme, theme);
}
