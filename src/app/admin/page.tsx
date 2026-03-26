"use client";

/* ═══════════════════════════════════════════════
   ADMIN — Panel de administración
   Login SHA-256, CRUD completo, exportar
   ═══════════════════════════════════════════════ */

import { useState, useCallback, useEffect } from "react";
import {
  Lock, LogOut, Package, Settings, Tag, Calendar, FileDown,
  Plus, Trash2, ShieldCheck, BookOpen, Star, Cog, Phone,
  Eye, EyeOff, KeyRound, Folder, Mail, RefreshCw, MessageSquare,
} from "lucide-react";
import { motion } from "framer-motion";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { hashPassword, generateId } from "@/lib/utils";
import { getAdminHash, setAdminHash, verifyAdminLogin, changeGlobalAdminHash, getSavedSubscribers, getSavedMensajes } from "@/lib/storage";
import { ImageUploader } from "@/components/admin/ImageUploader";
import type { Product, Service, Promo, BlogArticle, Cita, Subscriber, Mensaje } from "@/lib/types";

const DEFAULT_HASH =
  "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918"; // "admin"

type Tab = "products" | "services" | "config" | "categories" | "citas" | "suscriptores" | "mensajes";

/* ─── Input / Textarea helpers ─── */
const inputCls =
  "px-3 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-1 focus:ring-brand/30";
const labelCls = "block text-xs font-medium text-muted-foreground mb-1";

export default function AdminPage() {
  const {
    products, services, config, categorias, gallery, citas,
    saveProducts, saveServices, saveConfig, saveCategories, saveGallery, saveCitas, refreshCitas,
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

  // local array drafts
  const [productsDraft, setProductsDraft] = useState(products);
  const [servicesDraft, setServicesDraft] = useState(services);
  const [categoriesDraft, setCategoriesDraft] = useState(categorias);
  const [productsSaved, setProductsSaved] = useState(false);
  const [servicesSaved, setServicesSaved] = useState(false);
  const [categoriesSaved, setCategoriesSaved] = useState(false);

  // subscribers
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [subsLoading, setSubsLoading] = useState(false);

  const loadSubscribers = useCallback(async () => {
    setSubsLoading(true);
    const data = await getSavedSubscribers();
    setSubscribers(data ?? []);
    setSubsLoading(false);
  }, []);

  useEffect(() => {
    if (isAuth && activeTab === "suscriptores") loadSubscribers();
  }, [isAuth, activeTab, loadSubscribers]);

  // mensajes
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [mensajesLoading, setMensajesLoading] = useState(false);

  const loadMensajes = useCallback(async () => {
    setMensajesLoading(true);
    const data = await getSavedMensajes();
    setMensajes(data ?? []);
    setMensajesLoading(false);
  }, []);

  useEffect(() => {
    if (isAuth && activeTab === "mensajes") loadMensajes();
  }, [isAuth, activeTab, loadMensajes]);

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
        setProductsDraft(products);
        setServicesDraft(services);
        setCategoriesDraft(categorias);
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
      imagen: "", imagenes: [], disponible: true, badge: "",
      viscosidad: "", tipo: "", aplicacion: "", especificaciones: "",
    };
    setProductsDraft([p, ...productsDraft]);
  };
  const updateProduct = (id: string, field: keyof Product, value: string | boolean | string[]) =>
    setProductsDraft(productsDraft.map((p) => p.id === id ? { ...p, [field]: value } : p));
  const updateProductImagen = (id: string, idx: number, url: string) =>
    setProductsDraft(productsDraft.map((p) => {
      if (p.id !== id) return p;
      const imagenes = [...(p.imagenes ?? ["", "", ""])];
      imagenes[idx] = url;
      return { ...p, imagenes };
    }));
  const deleteProduct = (id: string) => {
    if (confirm("¿Eliminar este producto?")) setProductsDraft(productsDraft.filter((p) => p.id !== id));
  };
  const handleSaveProducts = () => {
    saveProducts(productsDraft);
    setProductsSaved(true);
    setTimeout(() => setProductsSaved(false), 2500);
  };

  // ─── CATEGORIES ───
  const addCategoria = () => setCategoriesDraft([{ id: generateId(), nombre: "Nueva Categoría", subs: [] }, ...categoriesDraft]);
  const updateCategoria = (id: string, nombre: string) => setCategoriesDraft(categoriesDraft.map((c) => c.id === id ? { ...c, nombre } : c));
  const deleteCategoria = (id: string) => { if (confirm("¿Eliminar categoría y sus subcategorías?")) setCategoriesDraft(categoriesDraft.filter((c) => c.id !== id)); };
  const addSub = (catId: string) => setCategoriesDraft(categoriesDraft.map((c) => c.id === catId ? { ...c, subs: [...c.subs, { id: generateId(), nombre: "Nueva Sub" }] } : c));
  const updateSub = (catId: string, subId: string, nombre: string) => setCategoriesDraft(categoriesDraft.map((c) => c.id === catId ? { ...c, subs: c.subs.map((s) => s.id === subId ? { ...s, nombre } : s) } : c));
  const deleteSub = (catId: string, subId: string) => { if (confirm("¿Eliminar sub?")) setCategoriesDraft(categoriesDraft.map((c) => c.id === catId ? { ...c, subs: c.subs.filter((s) => s.id !== subId) } : c)); };
  const handleSaveCategories = () => {
    saveCategories(categoriesDraft);
    setCategoriesSaved(true);
    setTimeout(() => setCategoriesSaved(false), 2500);
  };

  // ─── SERVICES ───
  const addService = () => {
    const s: Service = {
      id: generateId(), nombre: "Nuevo Servicio", descripcion: "",
      precio: "$0", duracion: "30 min", icono: "Wrench",
    };
    setServicesDraft([s, ...servicesDraft]);
  };
  const updateService = (id: string, field: keyof Service, value: string) =>
    setServicesDraft(servicesDraft.map((s) => s.id === id ? { ...s, [field]: value } : s));
  const deleteService = (id: string) => {
    if (confirm("¿Eliminar este servicio?")) setServicesDraft(servicesDraft.filter((s) => s.id !== id));
  };
  const handleSaveServices = () => {
    saveServices(servicesDraft);
    setServicesSaved(true);
    setTimeout(() => setServicesSaved(false), 2500);
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
    { id: "citas", label: "Citas", icon: <Calendar className="w-4 h-4" /> },
    { id: "mensajes", label: "Mensajes", icon: <MessageSquare className="w-4 h-4" /> },
    { id: "suscriptores", label: "Suscriptores", icon: <Mail className="w-4 h-4" /> },
    { id: "config", label: "Configuración", icon: <Cog className="w-4 h-4" /> },
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
              <div className="flex items-center gap-3">
                <h2 className="font-semibold">{productsDraft.length} Productos</h2>
                <button
                  onClick={handleSaveProducts}
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-600/10 text-green-600 text-sm font-medium hover:bg-green-600/20 transition-colors"
                >
                  {productsSaved ? "✓ Guardado" : "Guardar Cambios"}
                </button>
              </div>
              <button onClick={addProduct} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand text-brand-foreground text-sm font-medium hover:bg-brand-hover transition-colors">
                <Plus className="w-4 h-4" /> Agregar
              </button>
            </div>
            
            <button
               onClick={handleSaveProducts}
               className="sm:hidden w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-600/10 text-green-600 font-medium hover:bg-green-600/20 transition-colors"
            >
               {productsSaved ? "✓ Guardado" : "Guardar Cambios"}
            </button>

            <div className="space-y-4">
              {productsDraft.map((p) => (
                <div key={p.id} className="p-4 rounded-xl bg-card border border-border">
                  <div className="flex gap-4">
                    {/* Images (up to 3) */}
                    <div className="flex flex-col gap-1.5 shrink-0">
                      {[0, 1, 2].map((idx) => (
                        <ImageUploader
                          key={idx}
                          value={p.imagenes?.[idx] || (idx === 0 ? p.imagen : "") || ""}
                          onChange={(url) => updateProductImagen(p.id, idx, url)}
                          folder="products"
                          className="w-[72px]"
                          aspectRatio="aspect-square"
                        />
                      ))}
                    </div>

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
                            {categoriesDraft.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className={labelCls}>Subcategoría</label>
                          <select value={p.subcategoria ?? ""} onChange={(e) => updateProduct(p.id, "subcategoria", e.target.value)} className={`w-full ${inputCls} cursor-pointer`}>
                            <option value="">Ninguna</option>
                            {categoriesDraft.find(c => c.id === p.categoria)?.subs.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className={labelCls}>Descripción</label>
                        <textarea value={p.descripcion} onChange={(e) => updateProduct(p.id, "descripcion", e.target.value)} rows={2} className={`w-full ${inputCls} resize-none`} placeholder="Descripción del producto" />
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <div>
                          <label className={labelCls}>Viscosidad</label>
                          <input value={p.viscosidad ?? ""} onChange={(e) => updateProduct(p.id, "viscosidad", e.target.value)} className={`w-full ${inputCls}`} placeholder="5W-30" />
                        </div>
                        <div>
                          <label className={labelCls}>Tipo</label>
                          <input value={p.tipo ?? ""} onChange={(e) => updateProduct(p.id, "tipo", e.target.value)} className={`w-full ${inputCls}`} placeholder="Sintético" />
                        </div>
                        <div>
                          <label className={labelCls}>Aplicación</label>
                          <input value={p.aplicacion ?? ""} onChange={(e) => updateProduct(p.id, "aplicacion", e.target.value)} className={`w-full ${inputCls}`} placeholder="Motor gasolina" />
                        </div>
                        <div>
                          <label className={labelCls}>Especificaciones</label>
                          <input value={p.especificaciones ?? ""} onChange={(e) => updateProduct(p.id, "especificaciones", e.target.value)} className={`w-full ${inputCls}`} placeholder="API SN, ACEA A3" />
                        </div>
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
              <div className="flex items-center gap-3">
                <h2 className="font-semibold">{servicesDraft.length} Servicios</h2>
                <button
                  onClick={handleSaveServices}
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-600/10 text-green-600 text-sm font-medium hover:bg-green-600/20 transition-colors"
                >
                  {servicesSaved ? "✓ Guardado" : "Guardar Cambios"}
                </button>
              </div>
              <button onClick={addService} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand text-brand-foreground text-sm font-medium hover:bg-brand-hover transition-colors">
                <Plus className="w-4 h-4" /> Agregar
              </button>
            </div>
            
            <button
               onClick={handleSaveServices}
               className="sm:hidden w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-600/10 text-green-600 font-medium hover:bg-green-600/20 transition-colors"
            >
               {servicesSaved ? "✓ Guardado" : "Guardar Cambios"}
            </button>

            <div className="space-y-4">
              {servicesDraft.map((s) => (
                <div key={s.id} className="p-4 rounded-xl bg-card border border-border">
                  <div className="flex gap-4">
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
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold border-none hidden sm:block">Categorías</h2>
                <button
                  onClick={handleSaveCategories}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-600/10 text-green-600 text-sm font-medium hover:bg-green-600/20 transition-colors"
                >
                  {categoriesSaved ? "✓ Guardado" : "Guardar Cambios"}
                </button>
              </div>
              <button onClick={addCategoria} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand text-brand-foreground text-sm font-medium hover:bg-brand-hover transition-colors">
                <Plus className="w-4 h-4" /> Nueva
              </button>
            </div>
            <div className="space-y-4">
              {categoriesDraft.map((c) => (
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

        {/* ═══ CITAS ═══ */}
        {activeTab === "citas" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{citas.length} Citas recibidas</h2>
              <button
                onClick={refreshCitas}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary text-sm hover:bg-secondary/80 transition-colors"
              >
                <RefreshCw className="w-4 h-4" /> Actualizar
              </button>
            </div>
            {citas.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No hay citas registradas aún.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {[...citas].sort((a, b) => b.id - a.id).map((cita) => (
                  <div key={cita.id} className="p-4 rounded-xl bg-card border border-border space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold">{cita.nombre}</p>
                        <p className="text-sm text-muted-foreground">{cita.servicio}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <select
                          value={cita.estado}
                          onChange={(e) => {
                            const updated = citas.map((c) => c.id === cita.id ? { ...c, estado: e.target.value as Cita["estado"] } : c);
                            saveCitas(updated);
                          }}
                          className={`text-xs ${inputCls} cursor-pointer`}
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="confirmada">Confirmada</option>
                          <option value="completada">Completada</option>
                        </select>
                        <button
                          onClick={() => { if (confirm("¿Eliminar esta cita?")) saveCitas(citas.filter((c) => c.id !== cita.id)); }}
                          className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span>📅 {cita.fecha} {cita.hora}</span>
                      <span>🚗 {cita.vehiculo}</span>
                      <span>📞 {cita.telefono}</span>
                      {cita.notas && <span>📝 {cita.notas}</span>}
                    </div>
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      cita.estado === "completada" ? "bg-green-500/15 text-green-500" :
                      cita.estado === "confirmada" ? "bg-brand/15 text-brand" :
                      "bg-yellow-500/15 text-yellow-500"
                    }`}>
                      {cita.estado.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══ MENSAJES ═══ */}
        {activeTab === "mensajes" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{mensajes.length} Mensajes</h2>
              <button
                onClick={loadMensajes}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary text-sm hover:bg-secondary/80 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${mensajesLoading ? "animate-spin" : ""}`} /> Actualizar
              </button>
            </div>
            {mensajes.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">{mensajesLoading ? "Cargando..." : "No hay mensajes aún."}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {[...mensajes].sort((a, b) => b.fecha.localeCompare(a.fecha)).map((msg) => (
                  <div key={msg.id} className="p-4 rounded-xl bg-card border border-border space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-sm">{msg.nombre}</p>
                        <p className="text-xs text-muted-foreground">{msg.email}</p>
                      </div>
                      <p className="text-xs text-muted-foreground shrink-0">
                        {new Date(msg.fecha).toLocaleDateString("es-VE", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground border-t border-border pt-2 whitespace-pre-wrap">{msg.mensaje}</p>
                    <a
                      href={`mailto:${msg.email}`}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-brand hover:underline"
                    >
                      <Mail className="w-3.5 h-3.5" /> Responder por email
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══ SUSCRIPTORES ═══ */}
        {activeTab === "suscriptores" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{subscribers.length} Suscriptores</h2>
              <button
                onClick={loadSubscribers}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary text-sm hover:bg-secondary/80 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${subsLoading ? "animate-spin" : ""}`} /> Actualizar
              </button>
            </div>
            {subscribers.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Mail className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">{subsLoading ? "Cargando..." : "No hay suscriptores aún."}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {[...subscribers].sort((a, b) => b.fecha.localeCompare(a.fecha)).map((sub, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-card border border-border">
                    <div>
                      <p className="text-sm font-medium">{sub.email}</p>
                      <p className="text-xs text-muted-foreground">{new Date(sub.fecha).toLocaleDateString("es-VE", { day: "2-digit", month: "short", year: "numeric" })}</p>
                    </div>
                    <Mail className="w-4 h-4 text-muted-foreground/40" />
                  </div>
                ))}
              </div>
            )}
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
                <div>
                  <label className={labelCls}>Mensaje general de WhatsApp</label>
                  <textarea
                    value={cfgDraft.waMessage || ""}
                    onChange={(e) =>
                      setCfgDraft((d) => ({ ...d, waMessage: e.target.value }))
                    }
                    rows={2}
                    className={`w-full ${inputCls} resize-none`}
                    placeholder="¡Hola! 👋 Me gustaría obtener más información..."
                  />
                </div>
                <div>
                  <label className={labelCls}>Plantilla WhatsApp de Productos (Usa {'{{PRODUCTO}}'} y {'{{MARCA}}'})</label>
                  <textarea
                    value={cfgDraft.waProductMessage || ""}
                    onChange={(e) =>
                      setCfgDraft((d) => ({ ...d, waProductMessage: e.target.value }))
                    }
                    rows={2}
                    className={`w-full ${inputCls} resize-none`}
                    placeholder="¡Hola! Me interesa el producto: {{PRODUCTO}}..."
                  />
                </div>
                <div>
                  <label className={labelCls}>URL Google Maps (enlace directo)</label>
                  <input
                    value={cfgDraft.site.mapsUrl || ""}
                    onChange={(e) => setCfgDraft((d) => ({ ...d, site: { ...d.site, mapsUrl: e.target.value } }))}
                    className={`w-full ${inputCls}`}
                    placeholder="https://maps.google.com/?q=..."
                  />
                </div>
                <div>
                  <label className={labelCls}>Embed Google Maps (código src del iframe)</label>
                  <textarea
                    value={cfgDraft.site.mapsEmbed || ""}
                    onChange={(e) => setCfgDraft((d) => ({ ...d, site: { ...d.site, mapsEmbed: e.target.value } }))}
                    rows={3}
                    className={`w-full ${inputCls} resize-none font-mono text-xs`}
                    placeholder="https://www.google.com/maps/embed?pb=..."
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">Ve a Google Maps → Compartir → Insertar mapa → copia solo el valor del atributo src del iframe.</p>
                </div>
              </div>
            </section>

            {/* SEO */}
            <section className="space-y-3">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">SEO (Google)</h3>
              <div className="p-4 rounded-xl bg-card border border-border space-y-3">
                <div>
                  <label className={labelCls}>Título página principal (aparece en Google)</label>
                  <input
                    value={cfgDraft.seo?.indexTitulo || ""}
                    onChange={(e) => setCfgDraft((d) => ({ ...d, seo: { ...d.seo, indexTitulo: e.target.value } }))}
                    className={`w-full ${inputCls}`}
                  />
                </div>
                <div>
                  <label className={labelCls}>Descripción página principal (aparece en Google)</label>
                  <textarea
                    value={cfgDraft.seo?.indexDesc || ""}
                    onChange={(e) => setCfgDraft((d) => ({ ...d, seo: { ...d.seo, indexDesc: e.target.value } }))}
                    rows={3}
                    className={`w-full ${inputCls} resize-none`}
                  />
                </div>
                <div>
                  <label className={labelCls}>Descripción página Catálogo (aparece en Google)</label>
                  <textarea
                    value={cfgDraft.seo?.catalogoDesc || ""}
                    onChange={(e) => setCfgDraft((d) => ({ ...d, seo: { ...d.seo, catalogoDesc: e.target.value } }))}
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
                    className="w-48 max-w-full"
                    aspectRatio="aspect-video"
                  />
                </div>
                <div>
                  <label className={labelCls}>Slides del Carrusel (varios banners)</label>
                  <p className="text-xs text-muted-foreground mb-3">Sube varias imágenes para el carrusel automático. Si no hay slides, se usa la imagen de fondo.</p>
                  <div className="flex flex-wrap gap-3">
                    {(cfgDraft.hero.slides ?? []).map((slide, idx) => (
                      <div key={idx} className="relative group">
                        <ImageUploader
                          value={slide}
                          onChange={(url) => {
                            const slides = [...(cfgDraft.hero.slides ?? [])];
                            slides[idx] = url;
                            setCfgDraft((d) => ({ ...d, hero: { ...d.hero, slides } }));
                          }}
                          folder="config"
                          className="w-40"
                          aspectRatio="aspect-video"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const slides = (cfgDraft.hero.slides ?? []).filter((_, i) => i !== idx);
                            setCfgDraft((d) => ({ ...d, hero: { ...d.hero, slides } }));
                          }}
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setCfgDraft((d) => ({ ...d, hero: { ...d.hero, slides: [...(d.hero.slides ?? []), ""] } }))}
                      className="w-40 aspect-video rounded-xl border-2 border-dashed border-border hover:border-brand/50 flex items-center justify-center text-muted-foreground hover:text-brand transition-colors text-xs font-medium"
                    >
                      + Agregar slide
                    </button>
                  </div>
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

                {/* Valores / trust items */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className={labelCls}>Valores / puntos de confianza</label>
                    <button
                      onClick={() => setCfgDraft((d) => ({
                        ...d,
                        nosotros: {
                          ...d.nosotros,
                          valores: [...(d.nosotros.valores ?? []), { icono: "Shield", titulo: "Nuevo valor", texto: "" }],
                        },
                      }))}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-secondary rounded-lg hover:bg-secondary/80"
                    >
                      <Plus className="w-3.5 h-3.5" /> Añadir
                    </button>
                  </div>
                  {(cfgDraft.nosotros.valores ?? []).map((val, idx) => (
                    <div key={idx} className="p-3 border border-border rounded-lg bg-secondary/20 space-y-2">
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className={labelCls}>Ícono (nombre Lucide)</label>
                          <input
                            value={val.icono}
                            onChange={(e) => {
                              const next = [...cfgDraft.nosotros.valores];
                              next[idx] = { ...next[idx], icono: e.target.value };
                              setCfgDraft((d) => ({ ...d, nosotros: { ...d.nosotros, valores: next } }));
                            }}
                            className={`w-full ${inputCls}`}
                            placeholder="Shield, Award, Clock, Users…"
                          />
                        </div>
                        <button
                          onClick={() => {
                            if (confirm("¿Eliminar este valor?")) {
                              const next = cfgDraft.nosotros.valores.filter((_, i) => i !== idx);
                              setCfgDraft((d) => ({ ...d, nosotros: { ...d.nosotros, valores: next } }));
                            }
                          }}
                          className="mt-5 text-muted-foreground hover:text-destructive transition-colors shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div>
                        <label className={labelCls}>Título</label>
                        <input
                          value={val.titulo}
                          onChange={(e) => {
                            const next = [...cfgDraft.nosotros.valores];
                            next[idx] = { ...next[idx], titulo: e.target.value };
                            setCfgDraft((d) => ({ ...d, nosotros: { ...d.nosotros, valores: next } }));
                          }}
                          className={`w-full ${inputCls}`}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Descripción</label>
                        <input
                          value={val.texto}
                          onChange={(e) => {
                            const next = [...cfgDraft.nosotros.valores];
                            next[idx] = { ...next[idx], texto: e.target.value };
                            setCfgDraft((d) => ({ ...d, nosotros: { ...d.nosotros, valores: next } }));
                          }}
                          className={`w-full ${inputCls}`}
                        />
                      </div>
                    </div>
                  ))}
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
                          className="w-40 sm:w-48 shrink-0"
                          aspectRatio="aspect-video"
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
                          className="w-40 sm:w-48 shrink-0"
                          aspectRatio="aspect-video"
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


          {/* Páginas Legales */}
            <section className="space-y-3">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Páginas Legales</h3>
              <div className="p-4 rounded-xl bg-card border border-border space-y-4">

                <div className="bg-secondary/10 p-3 rounded-lg border border-border/50">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase mb-2">Política de Privacidad</h4>
                  <p className="text-[11px] text-muted-foreground mb-2">Separa secciones con línea en blanco. Los títulos que empiecen con número (1. 2.) se resaltan automáticamente.</p>
                  <textarea
                    value={cfgDraft.legalPages?.privacidad ?? ""}
                    onChange={(e) => setCfgDraft((d) => ({ ...d, legalPages: { ...d.legalPages, privacidad: e.target.value } }))}
                    rows={8}
                    className={`w-full ${inputCls} resize-y font-mono text-xs`}
                  />
                </div>

                <div className="bg-secondary/10 p-3 rounded-lg border border-border/50">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase mb-2">Términos y Condiciones</h4>
                  <textarea
                    value={cfgDraft.legalPages?.terminos ?? ""}
                    onChange={(e) => setCfgDraft((d) => ({ ...d, legalPages: { ...d.legalPages, terminos: e.target.value } }))}
                    rows={8}
                    className={`w-full ${inputCls} resize-y font-mono text-xs`}
                  />
                </div>

                <div className="bg-secondary/10 p-3 rounded-lg border border-border/50">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase mb-2">Política de Devoluciones</h4>
                  <textarea
                    value={cfgDraft.legalPages?.devoluciones ?? ""}
                    onChange={(e) => setCfgDraft((d) => ({ ...d, legalPages: { ...d.legalPages, devoluciones: e.target.value } }))}
                    rows={8}
                    className={`w-full ${inputCls} resize-y font-mono text-xs`}
                  />
                </div>

              </div>
            </section>

            {/* Estadísticas */}
            <section className="space-y-3">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Estadísticas (banda naranja)</h3>
              <div className="p-4 rounded-xl bg-card border border-border space-y-4">
                {(cfgDraft.stats ?? []).map((stat, idx) => (
                  <div key={idx} className="p-3 rounded-lg border border-border space-y-2 relative">
                    <button
                      type="button"
                      onClick={() => setCfgDraft((d) => ({ ...d, stats: (d.stats ?? []).filter((_, i) => i !== idx) }))}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-destructive/10 hover:bg-destructive/30 text-destructive text-xs flex items-center justify-center transition-colors"
                    >×</button>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className={labelCls}>Número</label>
                        <input
                          type="number"
                          value={stat.valor || ""}
                          onChange={(e) => {
                            const stats = [...(cfgDraft.stats ?? [])];
                            stats[idx] = { ...stats[idx], valor: isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber };
                            setCfgDraft((d) => ({ ...d, stats }));
                          }}
                          className={`w-full ${inputCls}`}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Etiqueta</label>
                        <input
                          value={stat.etiqueta}
                          onChange={(e) => {
                            const stats = [...(cfgDraft.stats ?? [])];
                            stats[idx] = { ...stats[idx], etiqueta: e.target.value };
                            setCfgDraft((d) => ({ ...d, stats }));
                          }}
                          className={`w-full ${inputCls}`}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Prefijo (ej: +)</label>
                        <input
                          value={stat.prefijo}
                          onChange={(e) => {
                            const stats = [...(cfgDraft.stats ?? [])];
                            stats[idx] = { ...stats[idx], prefijo: e.target.value };
                            setCfgDraft((d) => ({ ...d, stats }));
                          }}
                          className={`w-full ${inputCls}`}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Ícono Lucide (ej: Trophy)</label>
                        <input
                          value={stat.icono}
                          onChange={(e) => {
                            const stats = [...(cfgDraft.stats ?? [])];
                            stats[idx] = { ...stats[idx], icono: e.target.value };
                            setCfgDraft((d) => ({ ...d, stats }));
                          }}
                          className={`w-full ${inputCls}`}
                          placeholder="Trophy, Wrench, Users, Star..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setCfgDraft((d) => ({ ...d, stats: [...(d.stats ?? []), { valor: 0, etiqueta: "Nueva estadística", prefijo: "+", sufijo: "", icono: "Star" }] }))}
                  className="w-full py-2 rounded-lg border-2 border-dashed border-border hover:border-brand/50 text-muted-foreground hover:text-brand transition-colors text-sm font-medium"
                >
                  + Agregar estadística
                </button>
              </div>
            </section>

            {/* Imágenes de Fondo */}
            <section className="space-y-3">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Imágenes de Fondo</h3>
              <div className="p-4 rounded-xl bg-card border border-border space-y-4">
                <div>
                  <label className={labelCls}>Sección Servicios</label>
                  <ImageUploader
                    value={cfgDraft.bgImages?.servicios || ""}
                    onChange={(url) => setCfgDraft((d) => ({ ...d, bgImages: { ...d.bgImages, servicios: url } }))}
                    folder="config"
                    className="w-48 max-w-full"
                    aspectRatio="aspect-video"
                  />
                </div>
                <div>
                  <label className={labelCls}>Página Catálogo (hero)</label>
                  <ImageUploader
                    value={cfgDraft.bgImages?.catalogo || ""}
                    onChange={(url) => setCfgDraft((d) => ({ ...d, bgImages: { ...d.bgImages, catalogo: url } }))}
                    folder="config"
                    className="w-48 max-w-full"
                    aspectRatio="aspect-video"
                  />
                </div>
                <div>
                  <label className={labelCls}>Página Contacto</label>
                  <ImageUploader
                    value={cfgDraft.bgImages?.contacto || ""}
                    onChange={(url) => setCfgDraft((d) => ({ ...d, bgImages: { ...d.bgImages, contacto: url } }))}
                    folder="config"
                    className="w-48 max-w-full"
                    aspectRatio="aspect-video"
                  />
                </div>
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
