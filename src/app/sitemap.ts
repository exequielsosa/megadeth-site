import { MetadataRoute } from 'next';
import lineupsData from '@/constants/lineups.json';
import membersData from '@/constants/members.json';
import discographyData from '@/constants/discography.json';
import dvdData from '@/constants/dvd.json';
import songsData from '@/constants/songs.json';
import historiaData from '@/constants/historia.json';
import interviewsData from '@/constants/interviews.json';
import { generateInterviewSlug } from '@/types/interview';

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
    { path: '/entrevistas', priority: 0.9, changeFreq: 'monthly' as const },
    { path: '/faq', priority: 0.7, changeFreq: 'monthly' as const },
    { path: '/terminos', priority: 0.6, changeFreq: 'yearly' as const },
    { path: '/privacidad', priority: 0.6, changeFreq: 'yearly' as const },
    { path: '/contacto', priority: 0.7, changeFreq: 'monthly' as const },
    { path: '/songs', priority: 0.9, changeFreq: 'monthly' as const },
  ];
  const sitemap: MetadataRoute.Sitemap = [];

  // Canciones dinámicas
  if (Array.isArray(songsData)) {
    songsData.forEach(song => {
      if (song.id) {
        sitemap.push({
          url: `${base}/songs/${song.id}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.7,
        });
      }
    });
  }

  // Agregar páginas principales
  pages.forEach(page => {
    sitemap.push({
      url: `${base}${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changeFreq,
      priority: page.priority,
    });
  });

  // Agregar páginas individuales de formaciones
  // Formaciones dinámicas
  const lineups = lineupsData.lineups;
  lineups.forEach(lineup => {
    sitemap.push({
      url: `${base}/formaciones/${lineup.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  });

  // Miembros dinámicos
  const memberIds = Object.keys(membersData.members);
  memberIds.forEach(memberId => {
    sitemap.push({
      url: `${base}/miembros/${memberId}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  });

  // Discografía dinámica
  if (Array.isArray(discographyData)) {
    discographyData.forEach(album => {
      if (album.id) {
        sitemap.push({
          url: `${base}/discography/${album.id}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.7,
        });
      }
    });
  }

  // DVDs dinámica
  if (Array.isArray(dvdData)) {
    // Función para normalizar el título a slug
    const slugify = (str: string) =>
      str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    dvdData.forEach((dvd) => {
      const slug = dvd.title ? slugify(dvd.title) : undefined;
      if (slug) {
        sitemap.push({
          url: `${base}/dvds/${slug}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.7,
        });
      }
    });
  }

  // Historia dinámica
  if (historiaData && Array.isArray(historiaData.chapters)) {
    historiaData.chapters.forEach(chapter => {
      if (chapter.slug) {
        sitemap.push({
          url: `${base}/historia/${chapter.slug}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.7,
        });
      }
    });
  }

  // Entrevistas dinámicas
  if (Array.isArray(interviewsData)) {
    interviewsData.forEach(interview => {
      const slug = generateInterviewSlug(interview.id);
      if (slug) {
        sitemap.push({
          url: `${base}/entrevistas/${slug}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.7,
        });
      }
    });
  }

  return sitemap;
}
