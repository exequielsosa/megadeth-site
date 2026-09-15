import { MetadataRoute } from 'next';

// Crawlers de IA: rastrean el sitio entero para entrenar modelos y no traen
// visitas. En septiembre de 2026, meta-externalagent generaba el 58% del
// tráfico (24k requests/día) y disparaba el optimizador de imágenes.
// Googlebot, Bingbot y facebookexternalhit (las previews de Facebook e
// Instagram) NO están en esta lista y siguen entrando normalmente.
const AI_CRAWLERS = [
  'meta-externalagent',
  'meta-webindexer',
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'anthropic-ai',
  'CCBot',
  'PerplexityBot',
  'Bytespider',
  'Amazonbot',
  'Applebot-Extended',
  'Google-Extended',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, disallow: '/' })),
    ],
    sitemap: 'https://megadeth.com.ar/sitemap.xml',
  };
}
