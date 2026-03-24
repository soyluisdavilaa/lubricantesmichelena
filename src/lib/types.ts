/* ═══════════════════════════════════════════════
   TYPES — Lubricantes Michelena
   Interfaces TypeScript para todo el sitio
   ═══════════════════════════════════════════════ */

// ─── Productos ───
export interface Product {
  id: string;
  nombre: string;
  marca: string;
  categoria: string;
  subcategoria?: string;
  descripcion: string;
  presentacion: string;
  imagen: string;
  disponible: boolean;
  /** Etiqueta promo opcional: "Oferta", "Nuevo", "Popular", etc. */
  badge?: string;
}

// ─── Servicios ───
export interface Service {
  id: string;
  nombre: string;
  descripcion: string;
  precio: string;
  duracion: string;
  icono: string;
  imagen?: string;
  galeria?: string[];
}

// ─── Promociones ───
export interface Promo {
  id: string;
  titulo: string;
  descripcion: string;
  descuento: string;
  badge: string;
  vence: string;
  activo: boolean;
}

// ─── Blog ───
export interface BlogArticle {
  id: number;
  titulo: string;
  fecha: string;
  lectura: string;
  categoria: string;
  resumen: string;
  cuerpo: string;
  imagen: string;
  publicado: boolean;
}

// ─── Galería ───
export interface GalleryPhoto {
  imagen: string;
  caption: string;
}

// ─── Categorías ───
export interface SubCategoria {
  id: string;
  nombre: string;
}

export interface Categoria {
  id: string;
  nombre: string;
  subs: SubCategoria[];
}

// ─── Citas ───
export interface Cita {
  id: number;
  nombre: string;
  telefono: string;
  servicio: string;
  fecha: string;
  hora: string;
  vehiculo: string;
  notas?: string;
  fechaRecibido: string;
  estado: "pendiente" | "confirmada" | "completada";
}

// ─── Carrito de Cotización ───
export interface CartItem {
  id: string;
  nombre: string;
  marca: string;
  presentacion: string;
  imagen: string;
}

// ─── Reseñas ───
export interface Review {
  id: string;
  nombre: string;
  texto: string;
  rating: number;
  fecha: string;
  visible: boolean;
}

// ─── Horarios ───
export interface Horario {
  abre: string;
  cierra: string;
  cerrado: boolean;
}

// ─── Configuración del Sitio ───
export interface SiteConfig {
  site: {
    nombre: string;
    waNumber: string;
    telefono: string;
    direccion: string;
    mapsUrl: string;
    mapsEmbed: string;
    logo: string;
    email: string;
    footerDesc: string;
    footerCopy: string;
  };
  hero: {
    titulo: string;
    subtitulo: string;
    btnTexto: string;
    imagen?: string;
    trustPills?: string[];
  };
  banner: {
    activo: boolean;
    texto: string;
    fondo: string;
    color: string;
  };
  stats: Array<{
    valor: number;
    sufijo: string;
    label: string;
  }>;
  horarios: Record<string, Horario>;
  nosotros: {
    badge: string;
    titulo: string;
    parrafo: string;
    valores: Array<{
      icono: string;
      titulo: string;
      texto: string;
    }>;
    imagenes: Array<{
      url: string;
      alt: string;
    }>;
  };
  faq: Array<{
    pregunta: string;
    respuesta: string;
  }>;
  colores: {
    primario: string;
  };
  seo: {
    indexTitulo: string;
    indexDesc: string;
    catalogoDesc: string;
  };
  analytics: {
    gaId: string;
  };
  waMessage: string;
  waProductMessage?: string;
  mantenimiento: {
    activo: boolean;
    mensaje: string;
  };
  serviciosText: {
    badge: string;
    titulo: string;
    descripcion: string;
  };
  instalacionesText: {
    titulo: string;
    descripcion: string;
  };
  ctaText: {
    titulo: string;
    descripcion: string;
  };
}

// ─── Cupones ───
export interface Cupon {
  id: string;
  codigo: string;
  tipo: "%" | "$";
  valor: number;
  vence: string;
  usosMax: number;
  usosActuales: number;
  activo: boolean;
}

// ─── Suscriptores Newsletter ───
export interface Subscriber {
  email: string;
  fecha: string;
}
