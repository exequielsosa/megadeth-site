import { getLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import SongsListPage from "../../components/SongsListPage";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("songs");

  const title = `${t("songsListTitle")} | Megadeth`;
  const description = t("songsListDescription");
  const keywords = [
    "Megadeth",
    "songs",
    "canciones",
    "thrash metal",
    "metal",
    "Dave Mustaine",
    "Nick Menza",
    "Marty Friedman",
    "David Ellefson",
    "James LoMenzo",
    "Dirk Verbeuren",
    "Teemu Mäntysaari",
    "discografía Megadeth",
    "álbumes Megadeth",
    "lyrics",
    "letras",
  ];

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: "/songs",
      siteName: "Megadeth Fan Site",
      locale: locale === "es" ? "es_ES" : "en_US",
      type: "website",
      images: [
        {
          url: "/images/discography/og-songs.jpg",
          width: 1200,
          height: 630,
          alt:
            locale === "es"
              ? "Listado de canciones de Megadeth"
              : "Megadeth Songs List",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/discography/og-songs.jpg"],
      creator: "@MegadethFanSite",
    },
    alternates: {
      canonical: "/songs",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default function SongsPage() {
  return <SongsListPage />;
}
