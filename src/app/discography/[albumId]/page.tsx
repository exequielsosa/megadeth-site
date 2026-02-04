import { notFound } from "next/navigation";
import type { Metadata } from "next";
import AlbumDetail from "@/components/AlbumDetail";
import discographyData from "@/constants/taylor_discography.json";
import type { Album } from "@/types/album";
import { getAlbumDescription } from "@/utils/albumHelpers";

interface Props {
  params: Promise<{
    albumId: string;
  }>;
}

// Función para buscar el álbum por ID en todos los archivos
function getAlbumById(id: string): Album | undefined {
  // Buscar primero en álbumes de estudio
  const studioAlbum = discographyData.find(
    (album) => album.id === id,
  ) as unknown as Album | undefined;
  if (studioAlbum) return studioAlbum;

  return undefined;
}

// Generar metadata dinámico
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const album = getAlbumById(resolvedParams.albumId);

  if (!album) {
    return {
      title: "Álbum no encontrado - Taylor Swift Fan",
      description: "El álbum que buscas no existe.",
    };
  }

  const albumDescription =
    getAlbumDescription(album, "es", "short") ||
    `Álbum de Taylor Swift lanzado en ${album.year}.`;

  return {
    title: `${album.title} (${album.year}) - Taylor Swift Fan`,
    description: `${album.title} - ${albumDescription}`,
    keywords: [
      "Taylor Swift",
      album.title,
      album.year.toString(),
      "album",
      "pop",
      "country",
      "folk",
      ...(album.producers || []),
    ],
    openGraph: {
      title: `${album.title} (${album.year})`,
      description: albumDescription,
      images: [
        {
          url: album.cover,
          width: 800,
          height: 800,
          alt: `${album.title} album cover`,
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// Generar rutas estáticas en build time
export async function generateStaticParams() {
  // Álbumes de estudio y Taylor's Version
  const studioParams = discographyData.map((album) => ({
    albumId: album.id,
  }));

  return [...studioParams];
}
export default async function AlbumPage({ params }: Props) {
  const resolvedParams = await params;
  const album = getAlbumById(resolvedParams.albumId);

  if (!album) {
    notFound();
  }

  return <AlbumDetail album={album as Album} />;
}
