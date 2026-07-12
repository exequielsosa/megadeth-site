import { MetadataRoute } from 'next';
import lineupsData from '@/constants/lineups.json';
import membersData from '@/constants/members.json';
import discographyData from '@/constants/discography.json';
import dvdData from '@/constants/dvd.json';
import songsData from '@/constants/songs.json';
import videosData from '@/constants/videos.json';
import { slugify } from '@/utils/slugify';
import historiaData from '@/constants/historia.json';
import interviewsData from '@/constants/interviews.json';
import showsData from '@/constants/shows.json';
import reviewsData from '@/constants/reviews.json';
import { generateInterviewSlug } from '@/types/interview';
import { generateShowSlug, Show } from '@/types/show';
import { generateBootlegSlug, Bootleg } from '@/types/bootleg';
import { generateDVDSlug } from '@/types/dvd';
import bootlegsData from '@/constants/bootlegs.json';
import { getAllNews } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://megadeth.com.ar';

  // Empuja las dos versiones (en + es) de una misma página, cada una
  // declarando a la otra como alternate — así Google indexa ambos idiomas
  // como URLs propias, no como duplicados.
  function pushBilingual(
    sitemap: MetadataRoute.Sitemap,
    path: string,
    entry: {
      lastModified: Date;
      changeFrequency: NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>;
      priority: number;
    },
  ) {
    const enUrl = `${base}${path}`;
    const esUrl = path === '/' ? `${base}/es` : `${base}/es${path}`;
    const languages = { en: enUrl, es: esUrl };
    sitemap.push({ url: enUrl, alternates: { languages }, ...entry });
    sitemap.push({ url: esUrl, alternates: { languages }, ...entry });
  }

  const pages = [
    { path: '/', priority: 1, changeFreq: 'daily' as const },
    { path: '/tour', priority: 0.8, changeFreq: 'weekly' as const },
    { path: '/noticias', priority: 0.9, changeFreq: 'daily' as const },
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
    { path: '/shows', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/bootlegs', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/discography/reviews', priority: 0.9, changeFreq: 'weekly' as const },
  ];
  const sitemap: MetadataRoute.Sitemap = [];

  // Canciones dinámicas
  if (Array.isArray(songsData)) {
    songsData.forEach(song => {
      if (song.id) {
        pushBilingual(sitemap, `/songs/${song.id}`, {
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.7,
        });
      }
    });
  }

  // Videos dinámicos (watch pages)
  if (Array.isArray(videosData)) {
    videosData.forEach(video => {
      if (video.title) {
        pushBilingual(sitemap, `/videos/${slugify(video.title)}`, {
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.7,
        });
      }
    });
  }

  // Agregar páginas principales
  pages.forEach(page => {
    pushBilingual(sitemap, page.path, {
      lastModified: new Date(),
      changeFrequency: page.changeFreq,
      priority: page.priority,
    });
  });

  // Formaciones dinámicas
  const lineups = lineupsData.lineups;
  lineups.forEach(lineup => {
    pushBilingual(sitemap, `/formaciones/${lineup.id}`, {
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  });

  // Miembros dinámicos
  const memberIds = Object.keys(membersData.members);
  memberIds.forEach(memberId => {
    pushBilingual(sitemap, `/miembros/${memberId}`, {
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  });

  // Discografía dinámica
  if (Array.isArray(discographyData)) {
    discographyData.forEach(album => {
      if (album.id) {
        pushBilingual(sitemap, `/discography/${album.id}`, {
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.7,
        });
      }
    });
  }

  // DVDs dinámica
  if (Array.isArray(dvdData)) {
    (dvdData as { title?: string; album_title?: string }[]).forEach((dvd) => {
      // Usa la MISMA función que resuelve la página (`generateDVDSlug`), no una
      // copia local: con títulos con puntuación especial (ej. apóstrofes) una
      // función distinta genera un slug diferente al que la página realmente
      // busca → 404 real (confirmado con "Peace Sells... But Who's Buying?").
      const slug = generateDVDSlug(dvd.title || dvd.album_title);
      if (slug) {
        pushBilingual(sitemap, `/dvds/${slug}`, {
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
        pushBilingual(sitemap, `/historia/${chapter.slug}`, {
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
        pushBilingual(sitemap, `/entrevistas/${slug}`, {
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.7,
        });
      }
    });
  }

  // Shows dinámicas
  if (Array.isArray(showsData)) {
    (showsData as Show[]).forEach(show => {
      const slug = generateShowSlug(show);
      if (slug) {
        pushBilingual(sitemap, `/shows/${slug}`, {
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.7,
        });
      }
    });
  }

  // Bootlegs dinámicas
  if (Array.isArray(bootlegsData)) {
    (bootlegsData as Bootleg[]).forEach(bootleg => {
      const slug = generateBootlegSlug(bootleg);
      if (slug) {
        pushBilingual(sitemap, `/bootlegs/${slug}`, {
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.7,
        });
      }
    });
  }

  // Noticias dinámicas desde Supabase
  try {
    const newsData = await getAllNews();
    if (Array.isArray(newsData)) {
      newsData.forEach(news => {
        // OJO: acá va el id crudo, NO generateInterviewSlug(news.id). La página
        // busca con getNewsById() -> .eq("id", id), match exacto contra la DB.
        // Un id con guion doble ("...month--178...") se colapsaba a guion simple
        // y generaba una URL que no existía en la DB → 404 real (confirmado con
        // scripts/check-all-sitemap.mjs).
        if (news.id) {
          pushBilingual(sitemap, `/noticias/${news.id}`, {
            lastModified: new Date(news.publishedDate || new Date()),
            changeFrequency: 'weekly',
            priority: 0.8,
          });
        }
      });
    }
  } catch (error) {
    console.error('Error loading news for sitemap:', error);
  }

  // Reviews dinámicas
  if (Array.isArray(reviewsData)) {
    reviewsData.forEach(review => {
      if (review.id) {
        pushBilingual(sitemap, `/discography/reviews/${review.id}`, {
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.8,
        });
      }
    });
  }

  return sitemap;
}
