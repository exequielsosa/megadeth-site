import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://megadeth.com.ar';
  return [
    { url: `${base}/`, priority: 1 },
    { url: `${base}/shows`, priority: 0.9 },
    { url: `${base}/albums`, priority: 0.8 },
    { url: `${base}/news`, priority: 0.7 },
  ];
}
