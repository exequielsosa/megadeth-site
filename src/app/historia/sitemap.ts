import { MetadataRoute } from 'next';
import historiaData from '@/constants/historia.json';
import { HistoryData } from '@/types/historia';

export default function sitemap(): MetadataRoute.Sitemap {
  const data = historiaData as HistoryData;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://megadeth.com';

  // Página principal de historia
  const mainHistoryPage = {
    url: `${baseUrl}/historia`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  };

  // Páginas de capítulos individuales
  const chapterPages = data.chapters.map((chapter) => ({
    url: `${baseUrl}/historia/${chapter.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [mainHistoryPage, ...chapterPages];
}