export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/Providers";
import { AppShell } from "@/components/AppShell";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Lubricantes Michelena C.A — Centro de Lubricación Automotriz",
    template: "%s | Lubricantes Michelena",
  },
  description:
    "Centro de lubricación automotriz en Valencia, Venezuela. Aceites, filtros, aditivos, cambio de aceite y mantenimiento preventivo.",
  keywords: [
    "lubricantes",
    "aceite de motor",
    "cambio de aceite",
    "Valencia Venezuela",
    "mantenimiento automotriz",
    "filtros",
    "Michelena",
  ],
  authors: [{ name: "Lubricantes Michelena C.A" }],
  openGraph: {
    type: "website",
    locale: "es_VE",
    siteName: "Lubricantes Michelena C.A",
    title: "Lubricantes Michelena C.A — Centro de Lubricación Automotriz",
    description:
      "Centro de lubricación automotriz en Valencia, Venezuela. Aceites, filtros, aditivos y mantenimiento preventivo.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lubricantes Michelena C.A",
    description: "Centro de lubricación automotriz en Valencia, Venezuela.",
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable}`} suppressHydrationWarning>
      <head>
        {/*
          Script síncrono: aplica la clase dark/light ANTES de cualquier paint
          para evitar el flash de tema incorrecto (FOUC).
          No usar next/script aquí — debe ejecutarse en línea y de forma síncrona.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('lm_theme');if(t==='light'){document.documentElement.classList.remove('dark')}else{document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans antialiased">
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
