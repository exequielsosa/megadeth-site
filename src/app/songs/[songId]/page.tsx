import SongDetailPage from "../../../components/SongDetailPage";
import songsData from "@/constants/songs.json";
import { getLocale } from "next-intl/server";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return songsData.map((song) => ({ songId: song.id }));
}

export async function generateMetadata({
  params,
}: {
  params: { songId: string };
}): Promise<Metadata> {
  const locale = await getLocale();

  const song = songsData.find((s) => s.id === params.songId);
  if (!song) return { title: "Song not found" };

  const title = song.title;
  const album = song.album.title;
  const year = song.album.year;
  const theme = locale === "es" ? song.theme.es : song.theme.en;
  const description = `${title} (${year}) - ${album}. ${theme}`;

  const keywords = [
    title,
    album,
    year.toString(),
    "Megadeth",
    "lyrics",
    "letra",
    ...song.credits.musicians.map((m) => m.name),
  ];
  const canonicalUrl = `https://megadeth.com.ar/songs/${song.id}`;

  return {
    title: `${title} | Megadeth`,
    description,
    keywords,
    openGraph: {
      title: `${title} | Megadeth`,
      description,
      url: `/songs/${song.id}`,
      siteName: "Megadeth Fan Site",
      locale: locale === "es" ? "es_ES" : "en_US",
      type: "article",
      images: [
        {
          url: song.album.cover,
          width: 1200,
          height: 630,
          alt: `${title} (${year}) - ${album}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Megadeth`,
      description,
      images: [song.album.cover],
      creator: "@MegadethFanSite",
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        es: `https://megadeth.com.ar/es/songs/${song.id}`,
        en: `https://megadeth.com.ar/en/songs/${song.id}`,
      },
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

export default function SongPage({ params }: { params: { songId: string } }) {
  return <SongDetailPage songId={params.songId} />;
}
