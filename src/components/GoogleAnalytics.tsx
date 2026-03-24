"use client";

/* Google Analytics 4 — se activa solo cuando gaId está configurado */

import Script from "next/script";
import { useSiteConfig } from "@/context/SiteConfigContext";

export function GoogleAnalytics() {
  const { config } = useSiteConfig();
  const gaId = config.analytics.gaId;

  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { page_path: window.location.pathname });
        `}
      </Script>
    </>
  );
}
