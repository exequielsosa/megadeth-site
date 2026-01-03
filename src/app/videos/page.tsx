import VideosGrid from "@/components/VideosGrid";
import videosData from "../../constants/videos.json";
import ContainerGradient from "../../components/atoms/ContainerGradient";
import type { Video } from "@/types/video";
import { Container } from "@mui/material";
import type { Metadata } from "next";
import { getLocale } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  const titleByLocale = {
    es: "Videos Oficiales de Megadeth | Videoclips y Performances en Vivo",
    en: "Official Megadeth Videos | Music Videos and Live Performances",
  };

  const descriptionByLocale = {
    es: "Colección completa de videos musicales oficiales de Megadeth: desde Peace Sells hasta sus últimos éxitos. Videoclips, performances en vivo y contenido exclusivo de la legendaria banda de thrash metal.",
    en: "Complete collection of official Megadeth music videos: from Peace Sells to their latest hits. Music videos, live performances and exclusive content from the legendary thrash metal band.",
  };

  const keywordsByLocale = {
    es: [
      "Megadeth videos",
      "videoclips Megadeth",
      "Peace Sells video",
      "Symphony of Destruction",
      "Hangar 18",
      "thrash metal videos",
      "Dave Mustaine",
      "música metal",
      "videos oficiales",
      "performances en vivo",
      "Wake Up Dead",
      "Sweating Bullets",
      "Trust",
      "A Tout Le Monde",
    ],
    en: [
      "Megadeth videos",
      "Megadeth music videos",
      "Peace Sells video",
      "Symphony of Destruction",
      "Hangar 18",
      "thrash metal videos",
      "Dave Mustaine",
      "metal music",
      "official videos",
      "live performances",
      "Wake Up Dead",
      "Sweating Bullets",
      "Trust",
      "A Tout Le Monde",
    ],
  };

  return {
    title:
      titleByLocale[locale as keyof typeof titleByLocale] || titleByLocale.es,
    description:
      descriptionByLocale[locale as keyof typeof descriptionByLocale] ||
      descriptionByLocale.es,
    keywords:
      keywordsByLocale[locale as keyof typeof keywordsByLocale] ||
      keywordsByLocale.es,
    authors: [{ name: "Megadeth Fan Site" }],
    creator: "Megadeth Fan Site",
    publisher: "Megadeth Fan Site",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates: {
      canonical: "/videos",
      languages: {
        es: "/videos",
        en: "/videos",
      },
    },
    openGraph: {
      title:
        titleByLocale[locale as keyof typeof titleByLocale] || titleByLocale.es,
      description:
        descriptionByLocale[locale as keyof typeof descriptionByLocale] ||
        descriptionByLocale.es,
      url: "/videos",
      siteName: "Megadeth Fan Site",
      locale: locale === "es" ? "es_ES" : "en_US",
      type: "website",
      images: [
        {
          url: "/og-videos.jpg",
          width: 1200,
          height: 630,
          alt:
            locale === "es"
              ? "Videos de Megadeth - Colección de videoclips oficiales"
              : "Megadeth Videos - Official Music Video Collection",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title:
        titleByLocale[locale as keyof typeof titleByLocale] || titleByLocale.es,
      description:
        descriptionByLocale[locale as keyof typeof descriptionByLocale] ||
        descriptionByLocale.es,
      images: ["/og-videos.jpg"],
      creator: "@MegadethFanSite",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

// Datos estructurados para SEO
function generateStructuredData(locale: string) {
  const videoList = videosData.map((video: Video) => ({
    "@type": "VideoObject",
    name: video.title,
    description:
      video.description[locale as keyof typeof video.description] ||
      video.description.es,
    thumbnailUrl: `https://img.youtube.com/vi/${
      video.youtube.split("v=")[1]?.split("&")[0]
    }/maxresdefault.jpg`,
    uploadDate: `${video.year}-01-01`,
    duration: "PT3M30S", // Duración promedio estimada
    contentUrl: video.youtube,
    embedUrl: `https://www.youtube.com/embed/${
      video.youtube.split("v=")[1]?.split("&")[0]
    }`,
    creator: {
      "@type": "MusicGroup",
      name: "Megadeth",
      genre: "Thrash Metal",
    },
  }));

  const titleByLocale = {
    es: "Videos Oficiales de Megadeth",
    en: "Official Megadeth Videos",
  };

  const descriptionByLocale = {
    es: "Colección completa de videos musicales oficiales de Megadeth",
    en: "Complete collection of official Megadeth music videos",
  };

  const aboutDescriptionByLocale = {
    es: "Banda estadounidense de thrash metal formada en 1983 por Dave Mustaine",
    en: "American thrash metal band formed in 1983 by Dave Mustaine",
  };

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name:
      titleByLocale[locale as keyof typeof titleByLocale] || titleByLocale.es,
    description:
      descriptionByLocale[locale as keyof typeof descriptionByLocale] ||
      descriptionByLocale.es,
    url: "https://megadeth.com.ar/videos",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: videosData.length,
      itemListElement: videoList.map((video, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: video,
      })),
    },
    about: {
      "@type": "MusicGroup",
      name: "Megadeth",
      genre: "Thrash Metal",
      foundingDate: "1983",
      description:
        aboutDescriptionByLocale[
          locale as keyof typeof aboutDescriptionByLocale
        ] || aboutDescriptionByLocale.es,
    },
  };
}

export default async function VideosPage() {
  const locale = await getLocale();
  const structuredData = generateStructuredData(locale);

  return (
    <>
      {/* Datos estructurados JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <ContainerGradient>
        <Container maxWidth={false} sx={{ maxWidth: 1440, mx: "auto" }}>
          <VideosGrid videos={videosData as unknown as Video[]} />
        </Container>
      </ContainerGradient>
    </>
  );
}
