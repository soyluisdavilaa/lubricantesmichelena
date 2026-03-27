export const revalidate = 60; // Revalida cada 60s + on-demand vía revalidatePath al guardar config
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/Providers";
import { AppShell } from "@/components/AppShell";
import { getSiteData } from "@/lib/actions";
import { deepMerge } from "@/lib/utils";
import { defaultConfig } from "@/lib/defaults";
import type { SiteConfig } from "@/lib/types";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://lubricantesmichelena.com";

async function getConfig(): Promise<SiteConfig> {
  try {
    const saved = await getSiteData("config");
    if (saved) return deepMerge(defaultConfig, saved) as SiteConfig;
  } catch {}
  return defaultConfig;
}

export async function generateMetadata(): Promise<Metadata> {
  const cfg = await getConfig();

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: cfg.seo.indexTitulo,
      template: `%s | ${cfg.site.nombre}`,
    },
    description: cfg.seo.indexDesc,
    keywords: [
      "lubricantes Valencia Venezuela",
      "aceite de motor",
      "cambio de aceite Valencia",
      "mantenimiento automotriz Venezuela",
      "filtros aceite",
      "lubricantes Carabobo",
      cfg.site.nombre,
    ],
    authors: [{ name: cfg.site.nombre }],
    alternates: { canonical: SITE_URL },
    openGraph: {
      type: "website",
      locale: "es_VE",
      siteName: cfg.site.nombre,
      title: cfg.seo.indexTitulo,
      description: cfg.seo.indexDesc,
      url: SITE_URL,
      images: cfg.hero?.imagen
        ? [{ url: cfg.hero.imagen, width: 1200, height: 630, alt: cfg.seo.indexTitulo }]
        : [{ url: `${SITE_URL}/logo.png`, width: 512, height: 512, alt: cfg.site.nombre }],
    },
    twitter: {
      card: "summary_large_image",
      title: cfg.site.nombre,
      description: cfg.seo.indexDesc,
      images: cfg.hero?.imagen ? [cfg.hero.imagen] : [`${SITE_URL}/logo.png`],
    },
    icons: {
      icon: cfg.site.logo || "/logo.png",
      shortcut: cfg.site.logo || "/logo.png",
      apple: cfg.site.logo || "/logo.png",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cfg = await getConfig();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    "name": cfg.site.nombre,
    "description": cfg.seo.indexDesc,
    "url": SITE_URL,
    "telephone": cfg.site.telefono,
    "email": cfg.site.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": cfg.site.direccion,
      "addressLocality": "Valencia",
      "addressRegion": "Carabobo",
      "postalCode": "2001",
      "addressCountry": "VE",
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 10.162,
      "longitude": -67.994,
    },
    "hasMap": cfg.site.mapsUrl || `${SITE_URL}/contacto`,
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:00",
        "closes": "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Saturday"],
        "opens": "08:00",
        "closes": "14:00",
      },
    ],
    "priceRange": "$$",
    "currenciesAccepted": "USD, VES",
    "paymentAccepted": "Efectivo, Transferencia",
    "areaServed": {
      "@type": "City",
      "name": "Valencia",
      "addressRegion": "Carabobo",
      "addressCountry": "VE",
    },
  };

  return (
    <html lang="es" className={`${inter.variable} dark`} suppressHydrationWarning>
      <head>
        {/* Tema: aplica dark/light ANTES del primer paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('dark')`,
          }}
        />
        {/* Geo-localización */}
        <meta name="geo.region" content="VE-G" />
        <meta name="geo.placename" content="Valencia, Carabobo, Venezuela" />
        <meta name="geo.position" content="10.162;-67.994" />
        <meta name="ICBM" content="10.162, -67.994" />
        {/* Structured Data — LocalBusiness / AutoRepair */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans antialiased">
        <Providers initialConfig={cfg}>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
