import { MetadataRoute } from 'next';
import lineupsData from '@/constants/lineups.json';
import membersData from '@/constants/members.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://megadeth.com.ar';
  
  const pages = [
    { path: '/', priority: 1, changeFreq: 'daily' as const },
    { path: '/tour', priority: 0.8, changeFreq: 'weekly' as const },
    { path: '/discography', priority: 0.9, changeFreq: 'monthly' as const },
    { path: '/videos', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/dvds', priority: 0.9, changeFreq: 'monthly' as const },
    { path: '/historia', priority: 0.9, changeFreq: 'monthly' as const },
    { path: '/formaciones', priority: 0.8, changeFreq: 'monthly' as const },
    { path: '/miembros', priority: 0.8, changeFreq: 'monthly' as const },
    { path: '/faq', priority: 0.7, changeFreq: 'monthly' as const },
    { path: '/terminos', priority: 0.6, changeFreq: 'yearly' as const },
    { path: '/privacidad', priority: 0.6, changeFreq: 'yearly' as const },
    { path: '/contacto', priority: 0.7, changeFreq: 'monthly' as const },
  ];

  const sitemap: MetadataRoute.Sitemap = [];

  // Agregar páginas principales
  pages.forEach(page => {
    sitemap.push({
      url: `${base}${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changeFreq,
      priority: page.priority,
    });
  });

  // Agregar versiones en español
  pages.forEach(page => {
    if (page.path !== '/') {
      sitemap.push({
        url: `${base}/es${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFreq,
        priority: page.priority,
      });
    }
  });

  // Agregar versiones en inglés  
  pages.forEach(page => {
    if (page.path !== '/') {
      sitemap.push({
        url: `${base}/en${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFreq,
        priority: page.priority,
      });
    }
  });

  // Agregar páginas individuales de formaciones
  const lineups = lineupsData.lineups;
  lineups.forEach(lineup => {
    sitemap.push({
      url: `${base}/formaciones/${lineup.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  });

  // Agregar páginas individuales de miembros
  const memberIds = Object.keys(membersData.members);
  memberIds.forEach(memberId => {
    sitemap.push({
      url: `${base}/miembros/${memberId}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  });

  return sitemap;
}
