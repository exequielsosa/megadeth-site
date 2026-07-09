import SongDetailPage from "../../../components/SongDetailPage";
import songsData from "@/constants/songs.json";
import { getLocale } from "next-intl/server";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return songsData.map((song) => ({ songId: song.id }));
}

interface Props {
  params: Promise<{
    songId: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = await getLocale();
  const song = songsData.find((s) => s.id === resolvedParams.songId);
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
  const canonicalUrl = `/songs/${song.id}`;

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
        es: canonicalUrl,
        en: canonicalUrl,
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

function toAbsoluteUrl(path: string): string {
  return path.startsWith("http") ? path : `https://megadeth.com.ar${path}`;
}

function parseDurationToISO8601(duration?: string): string | undefined {
  if (!duration) return undefined;
  const parts = duration.split(":").map(Number);
  if (parts.some((n) => Number.isNaN(n))) return undefined;
  const [minutes, seconds] = parts.length === 2 ? parts : [0, parts[0]];
  return `PT${minutes}M${seconds}S`;
}

function buildSongJsonLd(song: (typeof songsData)[number]) {
  const lyricists = song.credits?.writers?.lyrics?.map((name) => ({
    "@type": "Person",
    name,
  }));
  const composers = song.credits?.writers?.music?.map((name) => ({
    "@type": "Person",
    name,
  }));
  const duration = parseDurationToISO8601(song.details?.duration);

  return {
    "@context": "https://schema.org",
    "@type": "MusicRecording",
    name: song.title,
    byArtist: { "@type": "MusicGroup", name: "Megadeth" },
    ...(duration && { duration }),
    inAlbum: {
      "@type": "MusicAlbum",
      name: song.album.title,
      datePublished: song.album.year.toString(),
    },
    recordingOf: {
      "@type": "MusicComposition",
      name: song.title,
      ...(lyricists?.length && { lyricist: lyricists }),
      ...(composers?.length && { composer: composers }),
    },
    image: toAbsoluteUrl(song.album.cover),
    url: toAbsoluteUrl(`/songs/${song.id}`),
  };
}

export default async function SongPage({ params }: Props) {
  const resolvedParams = await params;
  const song = songsData.find((s) => s.id === resolvedParams.songId);

  return (
    <>
      {song && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildSongJsonLd(song)),
          }}
        />
      )}
      <SongDetailPage songId={resolvedParams.songId} />
    </>
  );
}
