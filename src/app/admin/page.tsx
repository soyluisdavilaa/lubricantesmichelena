"use client";

/* ═══════════════════════════════════════════════
   ADMIN — Panel de administración
   Login SHA-256, CRUD completo, exportar
   ═══════════════════════════════════════════════ */

import { useState, useCallback } from "react";
import {
  Lock, LogOut, Package, Settings, Tag, Calendar, FileDown,
  Plus, Trash2, ShieldCheck, BookOpen, Star, Cog, Phone,
  Eye, EyeOff, KeyRound, Folder,
} from "lucide-react";
import { motion } from "framer-motion";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { hashPassword, generateId } from "@/lib/utils";
import { getAdminHash, setAdminHash, verifyAdminLogin, changeGlobalAdminHash } from "@/lib/storage";
import { ImageUploader } from "@/components/admin/ImageUploader";
import type { Product, Service, Promo, BlogArticle, Cita } from "@/lib/types";

const DEFAULT_HASH =
  "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918"; // "admin"

type Tab = "products" | "services" | "config" | "categories";

/* ─── Input / Textarea helpers ─── */
const inputCls =
  "px-3 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-1 focus:ring-brand/30";
const labelCls = "block text-xs font-medium text-muted-foreground mb-1";

export default function AdminPage() {
  const {
    products, services, config, categorias, gallery,
    saveProducts, saveServices, saveConfig, saveCategories, saveGallery,
  } = useSiteConfig();

  const [isAuth, setIsAuth] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("products");

  // password change
  const [newPass, setNewPass] = useState("");
  const [newPassConfirm, setNewPassConfirm] = useState("");
  const [passMsg, setPassMsg] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);

  // local config draft (for Config tab)
  const [cfgDraft, setCfgDraft] = useState(config);
  const [galleryDraft, setGalleryDraft] = useState(gallery);
  const [cfgSaved, setCfgSaved] = useState(false);

  // ─── LOGIN ───
  const handleLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Verificar bloqueo temporal
      if (lockedUntil && Date.now() < lockedUntil) {
        const secsLeft = Math.ceil((lockedUntil - Date.now()) / 1000);
        setLoginError(`Demasiados intentos. Espera ${secsLeft}s.`);
        return;
      }

      // Verificar si el hash coincide de verdad en el backend
      const hash = await hashPassword(password);
      const isOk = await verifyAdminLogin(hash);

      if (isOk) {
        await setAdminHash(hash); // guardar sesion localmente tras exito
        setIsAuth(true);
        setLoginError("");
        setFailedAttempts(0);
        setLockedUntil(null);
        setCfgDraft(config);
        setGalleryDraft(gallery);
      } else {
        const next = failedAttempts + 1;
        setFailedAttempts(next);
        if (next >= 5) {
          setLockedUntil(Date.now() + 30_000);
          setFailedAttempts(0);
          setLoginError("Demasiados intentos. Bloqueado 30 segundos.");
        } else {
          setLoginError(`Contraseña incorrecta (${next}/5)`);
        }
      }
    },
    [password, config, failedAttempts, lockedUntil]
  );

  // ─── EXPORT ───
  const handleExport = () => {
    const data = {
      config, products, services, categorias, gallery,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lm-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ─── CHANGE PASSWORD ───
  const handleChangePassword = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (newPass.length < 8) { setPassMsg("Mínimo 8 caracteres"); return; }
      if (newPass !== newPassConfirm) { setPassMsg("Las contraseñas no coinciden"); return; }
      
      const newHash = await hashPassword(newPass);
      const currentHashCtx = await getAdminHash();

      if (!currentHashCtx) {
        setPassMsg("Error de sesión"); 
        return;
      }

      setPassMsg("Actualizando...");
      const success = await changeGlobalAdminHash(newHash, currentHashCtx);
      
      if (success) {
        setPassMsg("✓ Contraseña actualizada en la base de datos");
        setNewPass(""); setNewPassConfirm("");
        setTimeout(() => setPassMsg(""), 3000);
      } else {
        setPassMsg("Error al actualizar (Verifique conexión)");
      }
    },
    [newPass, newPassConfirm]
  );

  // ─── PRODUCTS ───
  const addProduct = () => {
    const p: Product = {
      id: generateId(), nombre: "Nuevo Producto", marca: "", categoria: "aceites",
      subcategoria: "", descripcion: "", presentacion: "",
      imagen: "", disponible: true, badge: "",
    };
    saveProducts([p, ...products]);
  };
  const updateProduct = (id: string, field: keyof Product, value: string | boolean) =>
    saveProducts(products.map((p) => p.id === id ? { ...p, [field]: value } : p));
  const deleteProduct = (id: string) => {
    if (confirm("¿Eliminar este producto?")) saveProducts(products.filter((p) => p.id !== id));
  };


  // ─── CATEGORIES ───
  const addCategoria = () => saveCategories([{ id: generateId(), nombre: "Nueva Categoría", subs: [] }, ...categorias]);
  const updateCategoria = (id: string, nombre: string) => saveCategories(categorias.map((c) => c.id === id ? { ...c, nombre } : c));
  const deleteCategoria = (id: string) => { if (confirm("¿Eliminar categoría y sus subcategorías?")) saveCategories(categorias.filter((c) => c.id !== id)); };
  const addSub = (catId: string) => saveCategories(categorias.map((c) => c.id === catId ? { ...c, subs: [...c.subs, { id: generateId(), nombre: "Nueva Sub" }] } : c));
  const updateSub = (catId: string, subId: string, nombre: string) => saveCategories(categorias.map((c) => c.id === catId ? { ...c, subs: c.subs.map((s) => s.id === subId ? { ...s, nombre } : s) } : c));
  const deleteSub = (catId: string, subId: string) => { if (confirm("¿Eliminar sub?")) saveCategories(categorias.map((c) => c.id === catId ? { ...c, subs: c.subs.filter((s) => s.id !== subId) } : c)); };

  // ─── SERVICES ───
  const addService = () => {
    const s: Service = {
      id: generateId(), nombre: "Nuevo Servicio", descripcion: "",
      precio: "$0", duracion: "30 min", icono: "Wrench",
    };
    saveServices([s, ...services]);
  };
  const updateService = (id: string, field: keyof Service, value: string) =>
    saveServices(services.map((s) => s.id === id ? { ...s, [field]: value } : s));
  const deleteService = (id: string) => {
    if (confirm("¿Eliminar este servicio?")) saveServices(services.filter((s) => s.id !== id));
  };

  // ─── CONFIG ───
  const handleSaveConfig = () => {
    saveConfig(cfgDraft);
    saveGallery(galleryDraft);
    setCfgSaved(true);
    setTimeout(() => setCfgSaved(false), 2500);
  };

  // ─── LOGIN SCREEN ───
  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.form
          variants={{
            hidden: { opacity: 0, scale: 0.95 },
            visible: { opacity: 1, scale: 1, x: 0 },
            shake: {
              x: [-10, 10, -10, 10, -5, 5, 0],
              transition: { duration: 0.4 },
              borderColor: "rgba(239, 68, 68, 0.5)" // Soft red border on error
            }
          }}
          initial="hidden"
          animate={loginError ? "shake" : "visible"}
          onSubmit={handleLogin}
          className="w-full max-w-sm p-8 rounded-2xl bg-card border border-border space-y-6"
        >
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-brand/10 text-brand flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold">Panel Admin</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Acceso restringido
            </p>
          </div>

          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setLoginError(""); }}
              placeholder="Contraseña"
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-sm text-center
                         focus:outline-none focus:ring-2 focus:ring-brand/30"
              autoFocus
            />
            {loginError && (
              <p className="text-xs text-destructive text-center mt-2">{loginError}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-4 py-3
                       rounded-xl bg-brand text-brand-foreground font-medium
                       hover:bg-brand-hover transition-colors"
          >
            <Lock className="w-4 h-4" /> Entrar
          </button>
        </motion.form>
      </div>
    );
  }

  // ─── DASHBOARD ───
  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "products", label: "Productos", icon: <Package className="w-4 h-4" /> },
    { id: "services", label: "Servicios", icon: <Settings className="w-4 h-4" /> },
    { id: "categories", label: "Categorías", icon: <Folder className="w-4 h-4" /> },
    { id: "config", label: "Configuración global", icon: <Cog className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <div className="border-b border-border bg-card/50 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-bold flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand" /> Admin
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary text-sm hover:bg-secondary/80 transition-colors"
            >
              <FileDown className="w-4 h-4" /> Exportar
            </button>
            <button
              onClick={() => setIsAuth(false)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive text-sm hover:bg-destructive/20 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Salir
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border bg-card/30">
        <div className="max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-brand text-brand"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* ═══ PRODUCTS ═══ */}
        {activeTab === "products" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{products.length} Productos</h2>
              <button onClick={addProduct} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand text-brand-foreground text-sm font-medium hover:bg-brand-hover transition-colors">
                <Plus className="w-4 h-4" /> Agregar
              </button>
            </div>

            <div className="space-y-4">
              {products.map((p) => (
                <div key={p.id} className="p-4 rounded-xl bg-card border border-border">
                  <div className="flex gap-4">
                    {/* Image */}
                    <ImageUploader
                      value={p.imagen}
                      onChange={(url) => updateProduct(p.id, "imagen", url)}
                      folder="products"
                      className="w-24 shrink-0"
                      aspectRatio="aspect-square"
                    />

                    {/* Fields */}
                    <div className="flex-1 space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        <div>
                          <label className={labelCls}>Nombre</label>
                          <input value={p.nombre} onChange={(e) => updateProduct(p.id, "nombre", e.target.value)} className={`w-full ${inputCls}`} placeholder="Nombre" />
                        </div>
                        <div>
                          <label className={labelCls}>Marca</label>
                          <input value={p.marca} onChange={(e) => updateProduct(p.id, "marca", e.target.value)} className={`w-full ${inputCls}`} placeholder="Marca" />
                        </div>
                        <div>
                          <label className={labelCls}>Presentación</label>
                          <input value={p.presentacion} onChange={(e) => updateProduct(p.id, "presentacion", e.target.value)} className={`w-full ${inputCls}`} placeholder="1 Litro" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className={labelCls}>Categoría</label>
                          <select value={p.categoria} onChange={(e) => {
                            updateProduct(p.id, "categoria", e.target.value);
                            updateProduct(p.id, "subcategoria", "");
                          }} className={`w-full ${inputCls} cursor-pointer`}>
                            <option value="">Seleccione...</option>
                            {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className={labelCls}>Subcategoría</label>
                          <select value={p.subcategoria ?? ""} onChange={(e) => updateProduct(p.id, "subcategoria", e.target.value)} className={`w-full ${inputCls} cursor-pointer`}>
                            <option value="">Ninguna</option>
                            {categorias.find(c => c.id === p.categoria)?.subs.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className={labelCls}>Descripción</label>
                        <textarea value={p.descripcion} onChange={(e) => updateProduct(p.id, "descripcion", e.target.value)} rows={2} className={`w-full ${inputCls} resize-none`} placeholder="Descripción del producto" />
                      </div>

                      <div className="flex items-center gap-4 flex-wrap justify-between">
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                          <input type="checkbox" checked={p.disponible} onChange={(e) => updateProduct(p.id, "disponible", e.target.checked)} className="accent-brand" />
                          Disponible
                        </label>
                        <div className="flex-1 min-w-[140px] max-w-[200px]">
                          <label className="block text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Badge (opcional)</label>
                          <input value={p.badge ?? ""} onChange={(e) => updateProduct(p.id, "badge", e.target.value)} className={`w-full ${inputCls}`} placeholder="Oferta, Nuevo…" />
                        </div>
                        <button onClick={() => deleteProduct(p.id)} className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ SERVICES ═══ */}
        {activeTab === "services" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{services.length} Servicios</h2>
              <button onClick={addService} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand text-brand-foreground text-sm font-medium hover:bg-brand-hover transition-colors">
                <Plus className="w-4 h-4" /> Agregar
              </button>
            </div>

            <div className="space-y-4">
              {services.map((s) => (
                <div key={s.id} className="p-4 rounded-xl bg-card border border-border">
                  <div className="flex gap-4">
                    <ImageUploader
                      value={s.imagen ?? ""}
                      onChange={(url) => updateService(s.id, "imagen", url)}
                      folder="services"
                      className="w-24 shrink-0"
                      aspectRatio="aspect-square"
                    />

                    <div className="flex-1 space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                        <div>
                          <label className={labelCls}>Nombre</label>
                          <input value={s.nombre} onChange={(e) => updateService(s.id, "nombre", e.target.value)} className={`w-full ${inputCls}`} placeholder="Nombre" />
                        </div>
                        <div>
                          <label className={labelCls}>Precio</label>
                          <input value={s.precio} onChange={(e) => updateService(s.id, "precio", e.target.value)} className={`w-full ${inputCls}`} placeholder="$0" />
                        </div>
                        <div>
                          <label className={labelCls}>Duración</label>
                          <input value={s.duracion} onChange={(e) => updateService(s.id, "duracion", e.target.value)} className={`w-full ${inputCls}`} placeholder="30 min" />
                        </div>
                        <div>
                          <label className={labelCls}>Ícono (Lucide)</label>
                          <input value={s.icono} onChange={(e) => updateService(s.id, "icono", e.target.value)} className={`w-full ${inputCls}`} placeholder="Wrench" />
                        </div>
                      </div>

                      <div>
                        <label className={labelCls}>Descripción</label>
                        <textarea value={s.descripcion} onChange={(e) => updateService(s.id, "descripcion", e.target.value)} rows={2} className={`w-full ${inputCls} resize-none`} placeholder="Descripción del servicio" />
                      </div>

                      <div className="flex justify-end">
                        <button onClick={() => deleteService(s.id)} className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ CATEGORIES ═══ */}
        {activeTab === "categories" && (
          <div className="space-y-6 max-w-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Categorías y Subcategorías</h2>
              <button onClick={addCategoria} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand text-brand-foreground text-sm font-medium hover:bg-brand-hover transition-colors">
                <Plus className="w-4 h-4" /> Nueva Categoría
              </button>
            </div>
            <div className="space-y-4">
              {categorias.map((c) => (
                <div key={c.id} className="p-4 rounded-xl bg-card border border-border shadow-sm flex flex-col gap-4">
                  <div className="flex items-center justify-between gap-4">
                    <input value={c.nombre} onChange={(e) => updateCategoria(c.id, e.target.value)} className={`font-bold text-lg w-full ${inputCls}`} placeholder="Nombre de categoría" />
                    <button onClick={() => deleteCategoria(c.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  
                  <div className="pl-4 border-l-2 border-border space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-muted-foreground">Subcategorías</h4>
                      <button onClick={() => addSub(c.id)} className="text-xs text-brand hover:underline flex items-center gap-1"><Plus className="w-3 h-3" /> Añadir Sub</button>
                    </div>
                    {c.subs.map((s) => (
                      <div key={s.id} className="flex items-center gap-2">
                        <input value={s.nombre} onChange={(e) => updateSub(c.id, s.id, e.target.value)} className={`w-full text-sm ${inputCls}`} placeholder="Nombre subcategoría" />
                        <button onClick={() => deleteSub(c.id, s.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-3 h-3" /></button>
                      </div>
                    ))}
                    {c.subs.length === 0 && <p className="text-xs text-muted-foreground italic">Sin subcategorías</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ CONFIG ═══ */}
        {activeTab === "config" && (
          <div className="space-y-8 max-w-2xl">

            {/* Sitio */}
            <section className="space-y-3">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Sitio</h3>
              <div className="p-4 rounded-xl bg-card border border-border space-y-3">
                {([
                  ["Nombre del negocio", "nombre", "text"],
                  ["Número WhatsApp (sin +)", "waNumber", "text"],
                  ["Teléfono visible", "telefono", "text"],
                  ["Email", "email", "email"],
                ] as const).map(([lbl, field, type]) => (
                  <div key={field}>
                    <label className={labelCls}>{lbl}</label>
                    <input
                      type={type}
                      value={cfgDraft.site[field as keyof typeof cfgDraft.site]}
                      onChange={(e) =>
                        setCfgDraft((d) => ({ ...d, site: { ...d.site, [field]: e.target.value } }))
                      }
                      className={`w-full ${inputCls}`}
                    />
                  </div>
                ))}
                <div>
                  <label className={labelCls}>Dirección</label>
                  <textarea
                    value={cfgDraft.site.direccion}
                    onChange={(e) =>
                      setCfgDraft((d) => ({ ...d, site: { ...d.site, direccion: e.target.value } }))
                    }
                    rows={2}
                    className={`w-full ${inputCls} resize-none`}
                  />
                </div>
                <div>
                  <label className={labelCls}>Descripción del footer</label>
                  <textarea
                    value={cfgDraft.site.footerDesc}
                    onChange={(e) =>
                      setCfgDraft((d) => ({ ...d, site: { ...d.site, footerDesc: e.target.value } }))
                    }
                    rows={2}
                    className={`w-full ${inputCls} resize-none`}
                  />
                </div>
              </div>
            </section>

            {/* Hero */}
            <section className="space-y-3">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Hero</h3>
              <div className="p-4 rounded-xl bg-card border border-border space-y-3">
                <div>
                  <label className={labelCls}>Título principal</label>
                  <input
                    value={cfgDraft.hero.titulo}
                    onChange={(e) => setCfgDraft((d) => ({ ...d, hero: { ...d.hero, titulo: e.target.value } }))}
                    className={`w-full ${inputCls}`}
                  />
                </div>
                <div>
                  <label className={labelCls}>Subtítulo</label>
                  <textarea
                    value={cfgDraft.hero.subtitulo}
                    onChange={(e) => setCfgDraft((d) => ({ ...d, hero: { ...d.hero, subtitulo: e.target.value } }))}
                    rows={2}
                    className={`w-full ${inputCls} resize-none`}
                  />
                </div>
                <div>
                  <label className={labelCls}>Texto del botón</label>
                  <input
                    value={cfgDraft.hero.btnTexto}
                    onChange={(e) => setCfgDraft((d) => ({ ...d, hero: { ...d.hero, btnTexto: e.target.value } }))}
                    className={`w-full ${inputCls}`}
                  />
                </div>
                <div>
                  <label className={labelCls}>Píldoras de Confianza (separadas por coma)</label>
                  <input
                    value={cfgDraft.hero.trustPills?.join(", ") || ""}
                    onChange={(e) => setCfgDraft((d) => ({ ...d, hero: { ...d.hero, trustPills: e.target.value.split(",").map(s => s.trim()).filter(Boolean) } }))}
                    className={`w-full ${inputCls}`}
                    placeholder="✓ 10 años, ✓ Excelente servicio"
                  />
                </div>
                <div>
                  <label className={labelCls}>Imagen de Fondo</label>
                  <ImageUploader
                    value={cfgDraft.hero.imagen || ""}
                    onChange={(url) => setCfgDraft((d) => ({ ...d, hero: { ...d.hero, imagen: url } }))}
                    folder="config"
                  />
                </div>
              </div>
            </section>

            {/* Nosotros */}
            <section className="space-y-3">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Sobre Nosotros</h3>
              <div className="p-4 rounded-xl bg-card border border-border space-y-3">
                <div>
                  <label className={labelCls}>Badge superior</label>
                  <input
                    value={cfgDraft.nosotros.badge}
                    onChange={(e) => setCfgDraft((d) => ({ ...d, nosotros: { ...d.nosotros, badge: e.target.value } }))}
                    className={`w-full ${inputCls}`}
                  />
                </div>
                <div>
                  <label className={labelCls}>Título principal</label>
                  <input
                    value={cfgDraft.nosotros.titulo}
                    onChange={(e) => setCfgDraft((d) => ({ ...d, nosotros: { ...d.nosotros, titulo: e.target.value } }))}
                    className={`w-full ${inputCls}`}
                  />
                </div>
                <div>
                  <label className={labelCls}>Párrafo</label>
                  <textarea
                    value={cfgDraft.nosotros.parrafo}
                    onChange={(e) => setCfgDraft((d) => ({ ...d, nosotros: { ...d.nosotros, parrafo: e.target.value } }))}
                    rows={4}
                    className={`w-full ${inputCls} resize-none`}
                  />
                </div>
                
                <hr className="border-border my-4" />
                
                <div className="space-y-4">
                  <label className={labelCls}>Imágenes del carrusel</label>
                  {cfgDraft.nosotros.imagenes.map((img, idx) => (
                    <div key={idx} className="flex gap-4 p-4 border border-border rounded-lg bg-secondary/20">
                      <div className="flex-1 space-y-2">
                        <ImageUploader
                          value={img.url || ""}
                          onChange={(url) => {
                            const newImgs = [...cfgDraft.nosotros.imagenes];
                            newImgs[idx].url = url;
                            setCfgDraft((d) => ({ ...d, nosotros: { ...d.nosotros, imagenes: newImgs } }));
                          }}
                          folder="config"
                        />
                      </div>
                      <button
                        onClick={() => {
                          const newImgs = cfgDraft.nosotros.imagenes.filter((_, i) => i !== idx);
                          setCfgDraft((d) => ({ ...d, nosotros: { ...d.nosotros, imagenes: newImgs } }));
                        }}
                        className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      setCfgDraft((d) => ({
                        ...d,
                        nosotros: { ...d.nosotros, imagenes: [...d.nosotros.imagenes, { url: "", alt: "Imagen corporativa" }] }
                      }));
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-secondary rounded-lg hover:bg-secondary/80 focus:ring-2 focus:ring-brand/30"
                  >
                    <Plus className="w-4 h-4" /> Añadir Imagen
                  </button>
                </div>
              </div>
            </section>

          {/* Servicios y CTA Textos */}
            <section className="space-y-3">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Textos: Servicios y CTA</h3>
              <div className="p-4 rounded-xl bg-card border border-border space-y-3">
                
                <div className="bg-secondary/10 p-3 rounded-lg border border-border/50">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase mb-3">Sección Servicios</h4>
                  <div className="space-y-3">
                    <div>
                      <label className={labelCls}>Badge superior</label>
                      <input
                        value={cfgDraft.serviciosText?.badge ?? ""}
                        onChange={(e) => setCfgDraft((d) => ({ ...d, serviciosText: { ...d.serviciosText, badge: e.target.value } }))}
                        className={`w-full ${inputCls}`}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Título</label>
                      <input
                        value={cfgDraft.serviciosText?.titulo ?? ""}
                        onChange={(e) => setCfgDraft((d) => ({ ...d, serviciosText: { ...d.serviciosText, titulo: e.target.value } }))}
                        className={`w-full ${inputCls}`}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Descripción</label>
                      <textarea
                        value={cfgDraft.serviciosText?.descripcion ?? ""}
                        onChange={(e) => setCfgDraft((d) => ({ ...d, serviciosText: { ...d.serviciosText, descripcion: e.target.value } }))}
                        rows={2}
                        className={`w-full ${inputCls} resize-none`}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-secondary/10 p-3 rounded-lg border border-border/50 mt-4">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase mb-3">Sección Llamado a la Acción (CTA)</h4>
                  <div className="space-y-3">
                    <div>
                      <label className={labelCls}>Título</label>
                      <input
                        value={cfgDraft.ctaText?.titulo ?? ""}
                        onChange={(e) => setCfgDraft((d) => ({ ...d, ctaText: { ...d.ctaText, titulo: e.target.value } }))}
                        className={`w-full ${inputCls}`}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Descripción</label>
                      <textarea
                        value={cfgDraft.ctaText?.descripcion ?? ""}
                        onChange={(e) => setCfgDraft((d) => ({ ...d, ctaText: { ...d.ctaText, descripcion: e.target.value } }))}
                        rows={2}
                        className={`w-full ${inputCls} resize-none`}
                      />
                    </div>
                  </div>
                </div>

              </div>
            </section>

          {/* Instalaciones / Galería */}
            <section className="space-y-3">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Instalaciones (Galería)</h3>
              <div className="p-4 rounded-xl bg-card border border-border space-y-3">
                
                <div className="bg-secondary/10 p-3 rounded-lg border border-border/50 mb-4">
                  <div className="space-y-3">
                    <div>
                      <label className={labelCls}>Título de la sección</label>
                      <input
                        value={cfgDraft.instalacionesText?.titulo ?? ""}
                        onChange={(e) => setCfgDraft((d) => ({ ...d, instalacionesText: { ...d.instalacionesText, titulo: e.target.value } }))}
                        className={`w-full ${inputCls}`}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Descripción</label>
                      <textarea
                        value={cfgDraft.instalacionesText?.descripcion ?? ""}
                        onChange={(e) => setCfgDraft((d) => ({ ...d, instalacionesText: { ...d.instalacionesText, descripcion: e.target.value } }))}
                        rows={2}
                        className={`w-full ${inputCls} resize-none`}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className={labelCls}>Imágenes de las instalaciones</label>
                  {galleryDraft.map((img, idx) => (
                    <div key={idx} className="flex gap-4 p-4 border border-border rounded-lg bg-secondary/20">
                      <div className="flex-1 space-y-2">
                        <ImageUploader
                          value={img.imagen || ""}
                          onChange={(url) => {
                            const newImgs = [...galleryDraft];
                            newImgs[idx].imagen = url;
                            setGalleryDraft(newImgs);
                          }}
                          folder="gallery"
                        />
                        <input
                          value={img.caption || ""}
                          onChange={(e) => {
                            const newImgs = [...galleryDraft];
                            newImgs[idx].caption = e.target.value;
                            setGalleryDraft(newImgs);
                          }}
                          className={`w-full ${inputCls}`}
                          placeholder="Texto descriptivo de la imagen"
                        />
                      </div>
                      <button
                        onClick={() => {
                          const newImgs = galleryDraft.filter((_, i) => i !== idx);
                          setGalleryDraft(newImgs);
                        }}
                        className="text-muted-foreground hover:text-destructive transition-colors shrink-0 flex items-start"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setGalleryDraft([...galleryDraft, { imagen: "", caption: "Nueva instalación" }])}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-secondary rounded-lg hover:bg-secondary/80 focus:ring-2 focus:ring-brand/30"
                  >
                    <Plus className="w-4 h-4" /> Añadir Instalación
                  </button>
                </div>
              </div>
            </section>

            {/* Banner */}
            <section className="space-y-3">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Banner</h3>
              <div className="p-4 rounded-xl bg-card border border-border space-y-3">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cfgDraft.banner.activo}
                    onChange={(e) => setCfgDraft((d) => ({ ...d, banner: { ...d.banner, activo: e.target.checked } }))}
                    className="accent-brand"
                  />
                  Mostrar banner
                </label>
                <div>
                  <label className={labelCls}>Texto del banner</label>
                  <input
                    value={cfgDraft.banner.texto}
                    onChange={(e) => setCfgDraft((d) => ({ ...d, banner: { ...d.banner, texto: e.target.value } }))}
                    className={`w-full ${inputCls}`}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className={labelCls}>Color de fondo</label>
                    <input
                      type="color"
                      value={cfgDraft.banner.fondo}
                      onChange={(e) => setCfgDraft((d) => ({ ...d, banner: { ...d.banner, fondo: e.target.value } }))}
                      className="h-10 w-full rounded-lg border border-border cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Color de texto</label>
                    <input
                      type="color"
                      value={cfgDraft.banner.color}
                      onChange={(e) => setCfgDraft((d) => ({ ...d, banner: { ...d.banner, color: e.target.value } }))}
                      className="h-10 w-full rounded-lg border border-border cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Analytics & Mantenimiento */}
            <section className="space-y-3">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Otros</h3>
              <div className="p-4 rounded-xl bg-card border border-border space-y-3">
                <div>
                  <label className={labelCls}>Google Analytics ID (GA4)</label>
                  <input
                    value={cfgDraft.analytics.gaId}
                    onChange={(e) => setCfgDraft((d) => ({ ...d, analytics: { gaId: e.target.value } }))}
                    placeholder="G-XXXXXXXXXX"
                    className={`w-full ${inputCls}`}
                  />
                </div>
                <div>
                  <label className={labelCls}>Color primario</label>
                  <input
                    type="color"
                    value={cfgDraft.colores.primario}
                    onChange={(e) => setCfgDraft((d) => ({ ...d, colores: { primario: e.target.value } }))}
                    className="h-10 w-full rounded-lg border border-border cursor-pointer"
                  />
                </div>
                <hr className="border-border" />
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cfgDraft.mantenimiento.activo}
                    onChange={(e) => setCfgDraft((d) => ({ ...d, mantenimiento: { ...d.mantenimiento, activo: e.target.checked } }))}
                    className="accent-brand"
                  />
                  Modo mantenimiento
                </label>
                {cfgDraft.mantenimiento.activo && (
                  <div>
                    <label className={labelCls}>Mensaje de mantenimiento</label>
                    <input
                      value={cfgDraft.mantenimiento.mensaje}
                      onChange={(e) => setCfgDraft((d) => ({ ...d, mantenimiento: { ...d.mantenimiento, mensaje: e.target.value } }))}
                      className={`w-full ${inputCls}`}
                    />
                  </div>
                )}
              </div>
            </section>

            <button
              onClick={handleSaveConfig}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-brand text-brand-foreground font-medium hover:bg-brand-hover transition-colors"
            >
              {cfgSaved ? "✓ Guardado" : "Guardar Configuración"}
            </button>

            {/* Cambiar contraseña */}
            <section className="space-y-3 pt-4 border-t border-border">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <KeyRound className="w-4 h-4" /> Cambiar Contraseña
              </h3>
              <form onSubmit={handleChangePassword} className="p-4 rounded-xl bg-card border border-border space-y-3">
                <div>
                  <label className={labelCls}>Nueva contraseña</label>
                  <div className="relative">
                    <input
                      type={showNewPass ? "text" : "password"}
                      value={newPass}
                      onChange={(e) => { setNewPass(e.target.value); setPassMsg(""); }}
                      placeholder="Nueva contraseña"
                      className={`w-full ${inputCls} pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Confirmar contraseña</label>
                  <input
                    type={showNewPass ? "text" : "password"}
                    value={newPassConfirm}
                    onChange={(e) => { setNewPassConfirm(e.target.value); setPassMsg(""); }}
                    placeholder="Repite la contraseña"
                    className={`w-full ${inputCls}`}
                  />
                </div>
                {passMsg && (
                  <p className={`text-xs ${passMsg.startsWith("✓") ? "text-green-500" : "text-destructive"}`}>
                    {passMsg}
                  </p>
                )}
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-sm font-medium hover:bg-secondary/80 transition-colors"
                >
                  <KeyRound className="w-4 h-4" /> Actualizar Contraseña
                </button>
              </form>
            </section>
          </div>
        )}

      </div>
    </div>
  );
}
