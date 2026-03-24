/* ═══════════════════════════════════════════════
   DEFAULTS — Lubricantes Michelena
   Datos por defecto del sitio completo
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
} from "./types";

// ─── CONFIGURACIÓN DEL SITIO ───
export const defaultConfig: SiteConfig = {
  site: {
    nombre: "Lubricantes Michelena C.A",
    waNumber: "584228422455",
    telefono: "+58 422-842-2455",
    direccion:
      "Av. Michelena, CC Industrial, Galpón 5, Valencia, Carabobo, Venezuela",
    mapsUrl: "https://maps.google.com/?q=10.162,-67.994",
    mapsEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3927.0!2d-67.994!3d10.162!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0!2zMTDCsDA5JzQzLjIiTiA2N8KwNTknMzguNCJX!5e0!3m2!1ses!2sve!4v1",
    logo: "",
    email: "lubricantesmichelena@gmail.com",
    footerDesc:
      "Tu centro de confianza para el mantenimiento automotriz en Valencia. Más de 10 años brindando calidad y servicio premium.",
    footerCopy: `© ${new Date().getFullYear()} Lubricantes Michelena C.A. Todos los derechos reservados.`,
  },
  hero: {
    titulo: "El Cuidado Que Tu Motor Merece",
    subtitulo:
      "Aceites premium, filtros de calidad y servicio experto para tu vehículo. Tu centro de lubricación de confianza en Valencia.",
    btnTexto: "Consultar Ahora",
    imagen: "",
    trustPills: [
      "✓ +53 años de experiencia",
      "✓ Atención personalizada",
      "✓ Servicio garantizado",
    ],
  },
  banner: {
    activo: true,
    texto: "🔥 ¡15% de descuento en cambio de aceite + filtro este mes!",
    fondo: "#f97316",
    color: "#ffffff",
  },
  stats: [
    { valor: 10000, sufijo: "+", label: "Vehículos Atendidos" },
    { valor: 12, sufijo: "+", label: "Años de Experiencia" },
    { valor: 50, sufijo: "+", label: "Marcas Disponibles" },
    { valor: 98, sufijo: "%", label: "Clientes Satisfechos" },
  ],
  horarios: {
    lunes: { abre: "08:00", cierra: "18:00", cerrado: false },
    martes: { abre: "08:00", cierra: "18:00", cerrado: false },
    miércoles: { abre: "08:00", cierra: "18:00", cerrado: false },
    jueves: { abre: "08:00", cierra: "18:00", cerrado: false },
    viernes: { abre: "08:00", cierra: "18:00", cerrado: false },
    sábado: { abre: "08:00", cierra: "14:00", cerrado: false },
    domingo: { abre: "", cierra: "", cerrado: true },
  },
  nosotros: {
    badge: "Sobre Nosotros",
    titulo: "Más de una Década de Confianza Automotriz",
    parrafo:
      "En Lubricantes Michelena nos especializamos en el cuidado integral de tu motor. Contamos con técnicos certificados, productos de las mejores marcas mundiales y un compromiso inquebrantable con la calidad. Desde 2012, hemos atendido más de 10.000 vehículos en Valencia, Carabobo.",
    valores: [
      {
        icono: "Shield",
        titulo: "Garantía Total",
        texto: "Respaldamos cada servicio con garantía de satisfacción.",
      },
      {
        icono: "Award",
        titulo: "Calidad Premium",
        texto: "Solo trabajamos con marcas reconocidas mundialmente.",
      },
      {
        icono: "Clock",
        titulo: "Servicio Rápido",
        texto: "Cambio de aceite en 30 minutos o menos.",
      },
      {
        icono: "Users",
        titulo: "Equipo Experto",
        texto: "Técnicos certificados con años de experiencia.",
      },
    ],
    imagenes: [
      { url: "/img/taller-1.jpg", alt: "Instalaciones del taller" },
      { url: "/img/taller-2.jpg", alt: "Equipo de trabajo" },
      { url: "/img/taller-3.jpg", alt: "Área de servicio" },
      { url: "/img/taller-4.jpg", alt: "Productos disponibles" },
    ],
  },
  faq: [
    {
      pregunta: "¿Cada cuánto debo cambiar el aceite de mi vehículo?",
      respuesta:
        "Se recomienda cada 5.000–10.000 km dependiendo del tipo de aceite (mineral, semi-sintético o sintético) y las condiciones de manejo. Nuestros técnicos pueden asesorarte según tu modelo.",
    },
    {
      pregunta: "¿Cuánto tiempo toma un servicio de cambio de aceite?",
      respuesta:
        "Un cambio de aceite estándar toma aproximadamente 30 minutos. Servicios más completos como entonación o mantenimiento preventivo pueden tomar entre 1 y 3 horas.",
    },
    {
      pregunta: "¿Ofrecen garantía en sus servicios?",
      respuesta:
        "Sí, todos nuestros servicios incluyen garantía. Los productos instalados mantienen su garantía de fabricante y nuestro trabajo está respaldado por 30 días de garantía.",
    },
    {
      pregunta: "¿Qué marcas de vehículos atienden?",
      respuesta:
        "Atendemos todas las marcas: Toyota, Chevrolet, Ford, Hyundai, Kia, Honda, Mazda, Mitsubishi, Volkswagen, y muchas más. Contamos con filtros y aceites para cada modelo.",
    },
    {
      pregunta: "¿Necesito cita previa?",
      respuesta:
        "No es obligatorio, pero recomendamos agendar tu cita para garantizar atención inmediata y reducir tu tiempo de espera. Puedes hacerlo por WhatsApp o en nuestra sección de citas.",
    },
  ],
  colores: {
    primario: "#f97316",
  },
  seo: {
    indexTitulo:
      "Lubricantes Michelena C.A — Centro de Lubricación Automotriz en Valencia",
    indexDesc:
      "Centro de lubricación automotriz en Valencia, Venezuela. Aceites, filtros, aditivos, cambio de aceite y mantenimiento preventivo. +10 años de experiencia.",
    catalogoDesc:
      "Catálogo de aceites, filtros, aditivos y lubricantes de las mejores marcas. Precios competitivos en Valencia, Venezuela.",
  },
  analytics: {
    gaId: "",
  },
  waMessage:
    "¡Hola! 👋 Me gustaría obtener más información sobre sus servicios.",
  mantenimiento: {
    activo: false,
    mensaje: "Estamos mejorando nuestro sitio web. ¡Volvemos pronto!",
  },
};

// ─── PRODUCTOS ───
export const defaultProducts: Product[] = [
  {
    id: "p1",
    nombre: "Shell Helix Ultra 5W-40",
    marca: "Shell",
    categoria: "aceites",
    subcategoria: "sintetico",
    descripcion:
      "Aceite 100% sintético de alto rendimiento. Protección superior contra el desgaste, depósitos y lodos. Ideal para motores modernos de gasolina y diésel.",
    presentacion: "1 Litro",
    imagen: "",
    disponible: true,
  },
  {
    id: "p2",
    nombre: "Shell HX7 10W-40",
    marca: "Shell",
    categoria: "aceites",
    subcategoria: "semi-sintetico",
    descripcion:
      "Aceite semi-sintético con tecnología de limpieza activa. Protege y limpia el motor de manera eficiente. Excelente relación precio-calidad.",
    presentacion: "4 Litros",
    imagen: "",
    disponible: true,
  },
  {
    id: "p3",
    nombre: "Castrol Magnatec 5W-30",
    marca: "Castrol",
    categoria: "aceites",
    subcategoria: "sintetico",
    descripcion:
      "Con moléculas inteligentes que se adhieren a las partes críticas del motor, protegiendo desde el momento del arranque. Reduce el desgaste hasta un 50%.",
    presentacion: "1 Litro",
    imagen: "",
    disponible: true,
  },
  {
    id: "p4",
    nombre: "Motul 8100 X-clean 5W-40",
    marca: "Motul",
    categoria: "aceites",
    subcategoria: "sintetico",
    descripcion:
      "Aceite 100% sintético de última generación. Compatible con catalizadores y filtros de partículas. Máxima protección para motores europeos.",
    presentacion: "1 Litro",
    imagen: "",
    disponible: true,
  },
  {
    id: "p5",
    nombre: "WIX Filtro de Aceite",
    marca: "WIX",
    categoria: "filtros",
    subcategoria: "aceite",
    descripcion:
      "Filtro de aceite de alta eficiencia con medio filtrante de celulosa y fibra sintética. Retiene partículas de hasta 25 micrones.",
    presentacion: "Unidad",
    imagen: "",
    disponible: true,
  },
  {
    id: "p6",
    nombre: "Bosch Filtro de Aire",
    marca: "Bosch",
    categoria: "filtros",
    subcategoria: "aire",
    descripcion:
      "Filtro de aire de alta calidad que garantiza una mezcla óptima de aire y combustible. Compatible con múltiples modelos.",
    presentacion: "Unidad",
    imagen: "",
    disponible: true,
  },
  {
    id: "p7",
    nombre: "Mann Filtro de Combustible",
    marca: "Mann",
    categoria: "filtros",
    subcategoria: "combustible",
    descripcion:
      "Filtro de combustible premium que protege el sistema de inyección contra partículas y agua. Fabricación alemana de primera calidad.",
    presentacion: "Unidad",
    imagen: "",
    disponible: false,
  },
  {
    id: "p8",
    nombre: "Lucas Tratamiento para Inyectores",
    marca: "Lucas",
    categoria: "aditivos",
    subcategoria: "combustible",
    descripcion:
      "Limpiador de inyectores que restaura el rendimiento del motor. Elimina depósitos de carbono y mejora la atomización del combustible.",
    presentacion: "473 ml",
    imagen: "",
    disponible: true,
  },
  {
    id: "p9",
    nombre: "Lucas Oil Stabilizer",
    marca: "Lucas",
    categoria: "aditivos",
    subcategoria: "motor",
    descripcion:
      "Estabilizador de aceite que reduce el consumo de aceite, ruido del motor y extiende la vida del lubricante. Ideal para motores con alto kilometraje.",
    presentacion: "946 ml",
    imagen: "",
    disponible: true,
  },
  {
    id: "p10",
    nombre: "STP Limpiador de Sistema",
    marca: "STP",
    categoria: "aditivos",
    subcategoria: "motor",
    descripcion:
      "Limpiador completo del sistema de lubricación. Disuelve y remueve lodos, barnices y depósitos que afectan el rendimiento.",
    presentacion: "450 ml",
    imagen: "",
    disponible: true,
  },
  {
    id: "p11",
    nombre: "AC Delco Refrigerante",
    marca: "AC Delco",
    categoria: "refrigerantes",
    subcategoria: "",
    descripcion:
      "Refrigerante de vida extendida con tecnología de ácidos orgánicos (OAT). Protege el sistema de enfriamiento contra corrosión y sobrecalentamiento.",
    presentacion: "4 Litros",
    imagen: "",
    disponible: true,
  },
  {
    id: "p12",
    nombre: "Prestone Coolant 50/50",
    marca: "Prestone",
    categoria: "refrigerantes",
    subcategoria: "",
    descripcion:
      "Refrigerante pre-mezclado listo para usar. Compatible con todas las marcas y colores de refrigerante. Protección hasta -37°C.",
    presentacion: "3.78 Litros",
    imagen: "",
    disponible: false,
  },
];

// ─── SERVICIOS ───
export const defaultServices: Service[] = [
  {
    id: "s1",
    nombre: "Cambio de Aceite",
    descripcion:
      "Cambio completo de aceite y filtro con lubricante de la mejor calidad según las especificaciones de tu vehículo.",
    precio: "$25",
    duracion: "30 min",
    icono: "Droplets",
  },
  {
    id: "s2",
    nombre: "Entonación de Motor",
    descripcion:
      "Ajuste completo del motor: bujías, cables, filtro de aire, revisión de sensores y limpieza de inyectores.",
    precio: "$45",
    duracion: "60 min",
    icono: "Settings",
  },
  {
    id: "s3",
    nombre: "Limpieza de Tanque",
    descripcion:
      "Limpieza profunda del tanque de combustible, líneas y filtros. Elimina sedimentos y contaminantes acumulados.",
    precio: "$60",
    duracion: "90 min",
    icono: "Sparkles",
  },
  {
    id: "s4",
    nombre: "Reemplazo de Filtros",
    descripcion:
      "Cambio de filtros de aceite, aire, combustible y habitáculo con repuestos de marcas reconocidas.",
    precio: "$12",
    duracion: "20 min",
    icono: "Filter",
  },
  {
    id: "s5",
    nombre: "Diagnóstico Computarizado",
    descripcion:
      "Lectura de códigos de error OBD-II, diagnóstico de sensores y evaluación completa del sistema electrónico.",
    precio: "$20",
    duracion: "30 min",
    icono: "Monitor",
  },
  {
    id: "s6",
    nombre: "Mantenimiento Preventivo",
    descripcion:
      "Servicio integral: aceite, filtros, revisión de frenos, suspensión, luces, niveles y diagnóstico completo.",
    precio: "$80",
    duracion: "2 horas",
    icono: "Wrench",
  },
];

// ─── PROMOCIONES ───
export const defaultPromos: Promo[] = [
  {
    id: "promo1",
    titulo: "Cambio de Aceite + Filtro",
    descripcion:
      "Incluye aceite sintético o semi-sintético + filtro de aceite + revisión de niveles completa.",
    descuento: "15% OFF",
    badge: "⭐ Más Popular",
    vence: "2026-12-31",
    activo: true,
  },
  {
    id: "promo2",
    titulo: "Diagnóstico Computarizado Gratis",
    descripcion:
      "Diagnóstico OBD-II sin costo con cualquier servicio de mantenimiento. Conoce el estado real de tu motor.",
    descuento: "GRATIS",
    badge: "🎁 Regalo",
    vence: "2026-12-31",
    activo: true,
  },
  {
    id: "promo3",
    titulo: "Mantenimiento Full",
    descripcion:
      "Servicio completo: aceite + 3 filtros + diagnóstico + revisión de frenos y suspensión. El paquete más completo.",
    descuento: "20% OFF",
    badge: "🔥 Ahorra más",
    vence: "2026-12-31",
    activo: true,
  },
];

// ─── CATEGORÍAS ───
export const defaultCategorias: Categoria[] = [
  {
    id: "aceites",
    nombre: "Aceites",
    subs: [
      { id: "mineral", nombre: "Mineral" },
      { id: "semi-sintetico", nombre: "Semi-Sintético" },
      { id: "sintetico", nombre: "Sintético" },
      { id: "diesel", nombre: "Diésel" },
    ],
  },
  {
    id: "filtros",
    nombre: "Filtros",
    subs: [
      { id: "aceite", nombre: "Aceite" },
      { id: "aire", nombre: "Aire" },
      { id: "combustible", nombre: "Combustible" },
      { id: "habitaculo", nombre: "Habitáculo" },
    ],
  },
  {
    id: "aditivos",
    nombre: "Aditivos",
    subs: [
      { id: "motor", nombre: "Motor" },
      { id: "combustible", nombre: "Combustible" },
    ],
  },
  {
    id: "refrigerantes",
    nombre: "Refrigerantes",
    subs: [],
  },
  {
    id: "lubricantes",
    nombre: "Lubricantes",
    subs: [
      { id: "grasa", nombre: "Grasa" },
      { id: "cadena", nombre: "Cadena" },
    ],
  },
];

// ─── BLOG ───
export const defaultBlog: BlogArticle[] = [
  {
    id: 1,
    titulo: "¿Cada cuánto debes cambiar el aceite de tu motor?",
    fecha: "2025-03-15",
    lectura: "5 min",
    categoria: "Mantenimiento",
    resumen:
      "Descubre los intervalos recomendados para el cambio de aceite según el tipo de lubricante y las condiciones de uso de tu vehículo.",
    cuerpo:
      "El cambio de aceite es el mantenimiento más importante para la vida de tu motor.\n\nPara aceite mineral, se recomienda cada 5.000 km o 3 meses.\nPara aceite semi-sintético, cada 7.500 km o 6 meses.\nPara aceite sintético, cada 10.000 km o 12 meses.\n\nFactores que aceleran el cambio:\n• Conducción en ciudad con tráfico pesado\n• Temperaturas extremas\n• Viajes cortos frecuentes\n• Vehículos con alto kilometraje\n\nNuestro equipo puede evaluar tu aceite actual y recomendarte el mejor lubricante para tu motor.",
    imagen: "",
    publicado: true,
  },
  {
    id: 2,
    titulo: "Cómo elegir el filtro correcto para tu vehículo",
    fecha: "2025-03-10",
    lectura: "4 min",
    categoria: "Productos",
    resumen:
      "Guía práctica para seleccionar el filtro de aceite, aire y combustible adecuado para tu modelo de vehículo.",
    cuerpo:
      "Elegir el filtro correcto es crucial para el rendimiento de tu motor.\n\nFiltro de aceite: debe coincidir con las especificaciones del fabricante. Las marcas WIX, Mann y Bosch ofrecen catálogos por modelo.\n\nFiltro de aire: reemplazar cada 15.000-20.000 km. Un filtro sucio puede aumentar el consumo de combustible hasta un 10%.\n\nFiltro de combustible: protege los inyectores de partículas y agua. Cambiar cada 30.000 km.\n\nFiltro de habitáculo: aunque no afecta el motor, mantiene la calidad del aire interior. Cambiar cada 15.000 km.\n\nConsulta con nuestros técnicos para encontrar el filtro exacto para tu vehículo.",
    imagen: "",
    publicado: true,
  },
  {
    id: 3,
    titulo: "5 señales de que tu motor necesita mantenimiento urgente",
    fecha: "2025-03-05",
    lectura: "6 min",
    categoria: "Diagnóstico",
    resumen:
      "Aprende a identificar las señales de alerta que indican que tu motor necesita atención inmediata.",
    cuerpo:
      "No ignores estas señales de tu vehículo:\n\n1. Luz de aceite encendida: indica presión baja. Detente y verifica el nivel inmediatamente.\n\n2. Ruidos inusuales: golpeteos o chirridos pueden indicar falta de lubricación o piezas desgastadas.\n\n3. Humo excesivo: humo azul = quema de aceite, humo blanco = refrigerante en la cámara, humo negro = mezcla rica.\n\n4. Pérdida de potencia: puede ser filtros sucios, bujías gastadas o problemas de inyección.\n\n5. Consumo excesivo de combustible: sensores defectuosos, filtro de aire sucio o aceite degradado.\n\nAnte cualquiera de estas señales, visítanos para un diagnóstico computarizado gratuito con cualquier servicio.",
    imagen: "",
    publicado: true,
  },
];

// ─── GALERÍA ───
export const defaultGallery: GalleryPhoto[] = [
  { imagen: "/img/galeria-1.jpg", caption: "Área de cambio de aceite" },
  { imagen: "/img/galeria-2.jpg", caption: "Productos premium disponibles" },
  { imagen: "/img/galeria-3.jpg", caption: "Diagnóstico computarizado" },
  { imagen: "/img/galeria-4.jpg", caption: "Equipo de técnicos" },
  { imagen: "/img/galeria-5.jpg", caption: "Sala de espera" },
  { imagen: "/img/galeria-6.jpg", caption: "Instalaciones exteriores" },
];

// ─── RESEÑAS ───
export const defaultReviews: Review[] = [
  {
    id: "r1",
    nombre: "Carlos Pérez",
    texto:
      "Excelente servicio, rápido y profesional. El cambio de aceite quedó perfecto y los precios son muy competitivos.",
    rating: 5,
    fecha: "2025-02-20",
    visible: true,
  },
  {
    id: "r2",
    nombre: "María González",
    texto:
      "Muy buena atención y me explicaron todo sobre el estado de mi motor. El diagnóstico fue muy completo. Recomendados.",
    rating: 5,
    fecha: "2025-02-15",
    visible: true,
  },
  {
    id: "r3",
    nombre: "José Rodríguez",
    texto:
      "Llevo más de 3 años trayendo mi carro aquí. Siempre puntuales, honestos con los precios y garantía en todo.",
    rating: 5,
    fecha: "2025-01-28",
    visible: true,
  },
];
