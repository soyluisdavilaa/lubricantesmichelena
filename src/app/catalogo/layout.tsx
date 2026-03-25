import type { Metadata } from "next";
import { getSiteData } from "@/lib/actions";
import { deepMerge } from "@/lib/utils";
import { defaultConfig } from "@/lib/defaults";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://lubricantesmichelena.com";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const saved = await getSiteData("config");
    const cfg = saved ? deepMerge(defaultConfig, saved) : defaultConfig;
    return {
      title: "Catálogo de Productos",
      description: cfg.seo?.catalogoDesc || defaultConfig.seo.catalogoDesc,
      alternates: { canonical: `${SITE_URL}/catalogo` },
      openGraph: {
        title: `Catálogo | ${cfg.site?.nombre || defaultConfig.site.nombre}`,
        description: cfg.seo?.catalogoDesc || defaultConfig.seo.catalogoDesc,
        url: `${SITE_URL}/catalogo`,
      },
    };
  } catch {
    return {
      title: "Catálogo de Productos",
      description: defaultConfig.seo.catalogoDesc,
    };
  }
}

export default function CatalogoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
