import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://megadeth.com.ar';
  
  const pages = [
    { path: '/', priority: 1, changeFreq: 'daily' as const },
    { path: '/tour', priority: 0.8, changeFreq: 'weekly' as const },
    { path: '/discography', priority: 0.9, changeFreq: 'monthly' as const },
    { path: '/videos', priority: 0.9, changeFreq: 'weekly' as const },
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

  return sitemap;
}
