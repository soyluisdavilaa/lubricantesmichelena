import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lubricantesmichelena.com'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/'], // Ocultar el panel de administración a los bots
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
