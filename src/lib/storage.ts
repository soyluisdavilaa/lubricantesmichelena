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

import { 
  getSiteData, 
  saveSiteData, 
  addCitaPublic, 
  addSubscriberPublic,
  verifyAdminHashAction,
  changeAdminHashAction
} from "./actions";

// Keys de storage
const KEYS = {
  config: "config",
  products: "products",
  services: "services",
  promos: "promos",
  blog: "blog",
  gallery: "gallery",
  categories: "categories",
  reviews: "reviews",
  citas: "citas",
  cart: "cart", // local only
  subscribers: "subscribers",
  adminHash: "adminHash", // local only
  theme: "theme", // local only
} as const;

/**
 * localforage se usa AHORA SOLO para:
 * - adminHash (sesión local del admin)
 * - theme (preferencia local)
 * - cart (carrito de cotización temporal)
 */
async function getLocalForage() {
  const lf = (await import("localforage")).default;
  lf.config({
    name: "LubricantesMichelena",
    storeName: "lm_store",
  });
  return lf;
}

async function getItemLocal<T>(key: string): Promise<T | null> {
  const lf = await getLocalForage();
  return lf.getItem<T>(key);
}

async function setItemLocal<T>(key: string, value: T): Promise<T> {
  const lf = await getLocalForage();
  return lf.setItem(key, value);
}

// Helper para guardar en Supabase usando el adminHash validado
async function setItemDB<T>(key: string, value: T): Promise<void> {
  const hash = await getAdminHash();
  if (!hash) {
    console.warn("No admin hash in local storage. Fallback local?");
    return;
  }
  try {
    await saveSiteData(key, value, hash);
  } catch (err) {
    console.error(`Error guardando ${key} en DB:`, err);
  }
}

// Helper para obtener de Supabase
async function getItemDB<T>(key: string): Promise<T | null> {
  try {
    const data = await getSiteData(key);
    return data as T | null;
  } catch (err) {
    console.error(`Error obteniendo ${key} de DB:`, err);
    return null;
  }
}

// ─── CONFIG ───

export async function getSavedConfig(): Promise<Partial<SiteConfig> | null> {
  return getItemDB<Partial<SiteConfig>>(KEYS.config);
}

export async function saveConfig(config: SiteConfig): Promise<void> {
  await setItemDB(KEYS.config, config);
}

// ─── PRODUCTS ───

export async function getSavedProducts(): Promise<Product[] | null> {
  return getItemDB<Product[]>(KEYS.products);
}

export async function saveProducts(products: Product[]): Promise<void> {
  await setItemDB(KEYS.products, products);
}

// ─── SERVICES ───

export async function getSavedServices(): Promise<Service[] | null> {
  return getItemDB<Service[]>(KEYS.services);
}

export async function saveServices(services: Service[]): Promise<void> {
  await setItemDB(KEYS.services, services);
}

// ─── PROMOS ───

export async function getSavedPromos(): Promise<Promo[] | null> {
  return getItemDB<Promo[]>(KEYS.promos);
}

export async function savePromos(promos: Promo[]): Promise<void> {
  await setItemDB(KEYS.promos, promos);
}

// ─── BLOG ───

export async function getSavedBlog(): Promise<BlogArticle[] | null> {
  return getItemDB<BlogArticle[]>(KEYS.blog);
}

export async function saveBlog(articles: BlogArticle[]): Promise<void> {
  await setItemDB(KEYS.blog, articles);
}

// ─── GALLERY ───

export async function getSavedGallery(): Promise<GalleryPhoto[] | null> {
  return getItemDB<GalleryPhoto[]>(KEYS.gallery);
}

export async function saveGallery(photos: GalleryPhoto[]): Promise<void> {
  await setItemDB(KEYS.gallery, photos);
}

// ─── CATEGORIES ───

export async function getSavedCategories(): Promise<Categoria[] | null> {
  return getItemDB<Categoria[]>(KEYS.categories);
}

export async function saveCategories(categories: Categoria[]): Promise<void> {
  await setItemDB(KEYS.categories, categories);
}

// ─── REVIEWS ───

export async function getSavedReviews(): Promise<Review[] | null> {
  return getItemDB<Review[]>(KEYS.reviews);
}

export async function saveReviews(reviews: Review[]): Promise<void> {
  await setItemDB(KEYS.reviews, reviews);
}

// ─── CITAS ───

export async function getSavedCitas(): Promise<Cita[] | null> {
  return getItemDB<Cita[]>(KEYS.citas);
}

export async function saveCitas(citas: Cita[]): Promise<void> {
  await setItemDB(KEYS.citas, citas);
}

export async function addCita(cita: Cita): Promise<void> {
  try {
    await addCitaPublic(cita);
  } catch (e) {
    console.error("Error guardando cita", e);
  }
}

// ─── CART ───

export async function getSavedCart(): Promise<CartItem[] | null> {
  return getItemLocal<CartItem[]>(KEYS.cart);
}

export async function saveCart(items: CartItem[]): Promise<void> {
  await setItemLocal(KEYS.cart, items);
}

// ─── SUBSCRIBERS ───

export async function getSavedSubscribers(): Promise<Subscriber[] | null> {
  return getItemDB<Subscriber[]>(KEYS.subscribers);
}

export async function addSubscriber(email: string): Promise<boolean> {
  try {
    return await addSubscriberPublic(email);
  } catch (e) {
    return false;
  }
}

// ─── ADMIN ───

export async function getAdminHash(): Promise<string | null> {
  return getItemLocal<string>(KEYS.adminHash);
}

export async function setAdminHash(hash: string): Promise<void> {
  await setItemLocal(KEYS.adminHash, hash);
}

export async function verifyAdminLogin(hash: string): Promise<boolean> {
  try {
    return await verifyAdminHashAction(hash);
  } catch (e) {
    return false;
  }
}

export async function changeGlobalAdminHash(newHash: string, currentHash: string): Promise<boolean> {
  try {
    const success = await changeAdminHashAction(newHash, currentHash);
    if (success) {
      await setAdminHash(newHash);
      return true;
    }
  } catch(e) { console.error(e); }
  return false;
}

// ─── THEME ───

export async function getSavedTheme(): Promise<"dark" | "light" | null> {
  return getItemLocal<"dark" | "light">(KEYS.theme);
}

export async function saveTheme(theme: "dark" | "light"): Promise<void> {
  await setItemLocal(KEYS.theme, theme);
}
