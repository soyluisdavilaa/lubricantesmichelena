import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Imágenes: solo Supabase Storage (bucket lm-assets)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
