import { MetadataRoute } from 'next'
import dvdsData from '../../constants/dvd.json'
import { generateDVDSlug } from '@/types/dvd'

interface DVDDataItem {
  title?: string;
  album_title?: string;
  year?: number;
  release_year?: number;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://megadeth.com.ar'
  
  // Página principal de DVDs
  const dvdsPage = {
    url: `${baseUrl}/dvds`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
    alternates: {
      languages: {
        es: `${baseUrl}/es/dvds`,
        en: `${baseUrl}/en/dvds`,
      },
    },
  }

  // Páginas individuales de DVDs
  const dvdPages = (dvdsData as DVDDataItem[])
    .filter((item) => item.title || item.album_title)
    .map((dvd) => {
      const slug = generateDVDSlug(dvd.title || dvd.album_title)
      return {
        url: `${baseUrl}/dvds/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
        alternates: {
          languages: {
            es: `${baseUrl}/es/dvds/${slug}`,
            en: `${baseUrl}/en/dvds/${slug}`,
          },
        },
      }
    })

  return [dvdsPage, ...dvdPages]
}