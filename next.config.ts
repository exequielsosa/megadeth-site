import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  trailingSlash: false,
  
  // Optimización de imágenes
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 año
    remotePatterns: [
      // RSS Feed sources - Blabbermouth (todos los subdominios)
      {
        protocol: 'https',
        hostname: '*.blabbermouth.net',
      },
      {
        protocol: 'https',
        hostname: 'blabbermouth.net',
      },
      {
        protocol: 'https',
        hostname: 'cdn-p.smehost.net',
      },
      {
        protocol: 'https',
        hostname: '*.smehost.net',
      },
      // Loudwire (todos los subdominios)
      {
        protocol: 'https',
        hostname: '*.loudwire.com',
      },
      {
        protocol: 'https',
        hostname: 'loudwire.com',
      },
      // Metal Injection (todos los subdominios)
      {
        protocol: 'https',
        hostname: '*.metalinjection.net',
      },
      {
        protocol: 'https',
        hostname: 'metalinjection.net',
      },
      // MetalSucks (todos los subdominios)
      {
        protocol: 'https',
        hostname: '*.metalsucks.net',
      },
      {
        protocol: 'https',
        hostname: 'metalsucks.net',
      },
      // CDNs comunes de medios
      {
        protocol: 'https',
        hostname: '*.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: '*.imgix.net',
      },
      {
        protocol: 'https',
        hostname: '*.wordpress.com',
      },
      {
        protocol: 'https',
        hostname: '*.wp.com',
      },
      // YouTube thumbnails
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      // BraveWords (nueva fuente)
      {
        protocol: 'https',
        hostname: '*.bravewords.com',
      },
      {
        protocol: 'https',
        hostname: 'bravewords.com',
      },
      // Metal Hammer / LouderSound (nueva fuente)
      {
        protocol: 'https',
        hostname: '*.loudersound.com',
      },
      {
        protocol: 'https',
        hostname: 'loudersound.com',
      },
      // Revolver Magazine (nueva fuente)
      {
        protocol: 'https',
        hostname: '*.revolvermag.com',
      },
      {
        protocol: 'https',
        hostname: 'revolvermag.com',
      },
      // Consequence (nueva fuente)
      {
        protocol: 'https',
        hostname: '*.consequence.net',
      },
      {
        protocol: 'https',
        hostname: 'consequence.net',
      },
      // The PRP (nueva fuente)
      {
        protocol: 'https',
        hostname: '*.theprp.com',
      },
      {
        protocol: 'https',
        hostname: 'theprp.com',
      },
      // Mariskal Rock (medio español)
      {
        protocol: 'https',
        hostname: '*.mariskalrock.com',
      },
      {
        protocol: 'https',
        hostname: 'mariskalrock.com',
      },
    ],
  },

  // Compresión
  compress: true,
  
  // Experimental features para mejor performance
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
  },
};

export default withNextIntl(nextConfig);
