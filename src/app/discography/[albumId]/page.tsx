import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import type { Metadata } from "next";
import AlbumDetail from "@/components/AlbumDetail";
import discographyData from "@/constants/discography.json";
import type { Album } from "@/types/album";

interface Props {
  params: {
    albumId: string;
  };
}

// Función para buscar el álbum por ID
function getAlbumById(id: string): Album | undefined {
  return discographyData.find((album) => album.id === id);
}

// Generar metadata dinámico
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const album = getAlbumById(params.albumId);

  if (!album) {
    return {
      title: "Álbum no encontrado - Megadeth Fan",
      description: "El álbum que buscas no existe.",
    };
  }

  return {
    title: `${album.title} (${album.year}) - Megadeth Fan`,
    description: `${album.title} - ${
      album.description || `Álbum de Megadeth lanzado en ${album.year}.`
    }`,
    keywords: [
      "Megadeth",
      album.title,
      album.year.toString(),
      "album",
      "thrash metal",
      "metal",
      ...(album.producers || []),
    ],
    openGraph: {
      title: `${album.title} (${album.year})`,
      description:
        album.description || `Álbum de Megadeth lanzado en ${album.year}.`,
      images: [
        {
          url: album.cover,
          width: 800,
          height: 800,
          alt: `${album.title} album cover`,
        },
      ],
    },
  };
}

// Generar rutas estáticas en build time
export async function generateStaticParams() {
  return discographyData.map((album) => ({
    albumId: album.id,
  }));
}

export default function AlbumPage({ params }: Props) {
  const album = getAlbumById(params.albumId);

  if (!album) {
    notFound();
  }

  return <AlbumDetail album={album} />;
}
