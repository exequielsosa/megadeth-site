import DVDGrid from "@/components/DVDGrid";
import dvdsData from "../../constants/dvd.json";
import type { DVD } from "@/types/dvd";
import { Container, Box } from "@mui/material";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import Breadcrumb from "@/components/Breadcrumb";
import ContainerGradientNoPadding from "@/components/atoms/ContainerGradientNoPadding";
import RandomSectionBanner from "@/components/NewsBanner";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  const titleByLocale = {
    es: "DVDs de Megadeth | Videos Musicales, Documentales y Conciertos en Vivo",
    en: "Megadeth DVDs | Music Videos, Documentaries and Live Concerts",
  };

  const descriptionByLocale = {
    es: "Colección completa de DVDs de Megadeth: videos musicales, documentales, conciertos en vivo y material exclusivo. Desde Rusted Pieces hasta sus últimos lanzamientos en formato audiovisual.",
    en: "Complete collection of Megadeth DVDs: music videos, documentaries, live concerts and exclusive material. From Rusted Pieces to their latest audiovisual releases.",
  };

  const keywordsByLocale = {
    es: [
      "Megadeth DVDs",
      "videos Megadeth",
      "Rusted Pieces",
      "Exposure of a Dream",
      "conciertos Megadeth",
      "documentales metal",
      "Dave Mustaine",
      "thrash metal DVDs",
      "videos musicales",
      "Capitol Records",
      "VHS Megadeth",
      "formato audiovisual",
      "colección DVDs",
      "material exclusivo",
    ],
    en: [
      "Megadeth DVDs",
      "Megadeth videos",
      "Rusted Pieces",
      "Exposure of a Dream",
      "Megadeth concerts",
      "metal documentaries",
      "Dave Mustaine",
      "thrash metal DVDs",
      "music videos",
      "Capitol Records",
      "Megadeth VHS",
      "audiovisual format",
      "DVD collection",
      "exclusive material",
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
      canonical: "/dvds",
      languages: {
        es: "/dvds",
        en: "/dvds",
      },
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
    verification: {
      google: "your-google-verification-code",
    },
    category: "entertainment",
    openGraph: {
      title:
        titleByLocale[locale as keyof typeof titleByLocale] || titleByLocale.es,
      description:
        descriptionByLocale[locale as keyof typeof descriptionByLocale] ||
        descriptionByLocale.es,
      url: "/dvds",
      siteName: "Megadeth Fan Site",
      locale: locale === "es" ? "es_ES" : "en_US",
      type: "website",
      images: [
        {
          url: "/og-dvds.jpg",
          width: 1200,
          height: 630,
          alt:
            locale === "es"
              ? "DVDs de Megadeth - Colección de videos musicales y documentales"
              : "Megadeth DVDs - Music Video and Documentary Collection",
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
      images: ["/og-dvds.jpg"],
      creator: "@MegadethFanSite",
    },
  };
}

// Interfaz para manejar estructuras irregulares del JSON
interface DVDDataItem {
  title?: string;
  album_title?: string;
  year?: number;
  release_year?: number;
  label?: string;
  duration?: string;
  description?: {
    short?: {
      es: string;
      en: string;
    };
  };
}

// Datos estructurados para SEO
function generateStructuredData(locale: string) {
  const dvdList = (dvdsData as DVDDataItem[])
    .filter(
      (item) => (item.title || item.album_title) && item.description?.short,
    ) // Filtrar solo elementos con estructura correcta
    .map((dvd) => ({
      "@type": "CreativeWork",
      name: dvd.title || dvd.album_title || "Unknown",
      description:
        dvd.description?.short?.[
          locale as keyof typeof dvd.description.short
        ] ||
        dvd.description?.short?.es ||
        "",
      datePublished: `${dvd.year || dvd.release_year || 2000}-01-01`,
      duration: dvd.duration || "Unknown",
      publisher: {
        "@type": "Organization",
        name: dvd.label || "Unknown",
      },
      creator: {
        "@type": "MusicGroup",
        name: "Megadeth",
        genre: "Thrash Metal",
      },
    }));

  const titleByLocale = {
    es: "DVDs de Megadeth",
    en: "Megadeth DVDs",
  };

  const descriptionByLocale = {
    es: "Colección completa de DVDs de Megadeth con videos musicales y documentales",
    en: "Complete collection of Megadeth DVDs with music videos and documentaries",
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
    url: "https://megadeth.com.ar/dvds",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: dvdsData.length,
      itemListElement: dvdList.map((dvd, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: dvd,
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

export default async function DVDsPage() {
  const locale = await getLocale();
  const tb = await getTranslations("breadcrumb");
  const structuredData = generateStructuredData(locale);

  // Filtrar solo DVDs válidos que tengan la estructura esperada
  const validDvds = (dvdsData as DVDDataItem[]).filter(
    (item) => (item.title || item.album_title) && item.description?.short,
  );

  return (
    <>
      {/* Datos estructurados JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <ContainerGradientNoPadding>
        <Box pt={{ xs: 2, md: 4 }} px={{ xs: 2, md: 0 }} pb={{ xs: 0, md: 0 }}>
          <Breadcrumb items={[{ label: tb("dvds") }]} />
        </Box>
        <Container maxWidth={false} sx={{ maxWidth: 1440, mx: "auto", py: 4 }}>
          <DVDGrid dvds={validDvds as unknown as DVD[]} />
          <Box mt={4}>
            <RandomSectionBanner currentSection="dvds" />
          </Box>
        </Container>
      </ContainerGradientNoPadding>
    </>
  );
}
