"use client";

import { Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Image from "next/image";
import { useMemo } from "react";

interface Section {
  id: string;
  name: { es: string; en: string };
  route: string;
  image: string;
  adText: { es: string; en: string };
}

const sections: Section[] = [
  {
    id: "discography",
    name: { es: "Discografía", en: "Discography" },
    route: "/discography",
    image: "/images/banners/discography.png",
    adText: {
      es: "Explora el legado: Albumes de Estudio, en vivo, compilaciones y más",
      en: "Explore the legacy: Studio albums, live albums, compilations and more",
    },
  },
  {
    id: "news",
    name: { es: "Noticias", en: "News" },
    route: "/noticias",
    image: "/images/banners/news.png",
    adText: {
      es: "Mantente al día con las últimas novedades sobre Megadeth",
      en: "Stay up to date with the latest news about Megadeth",
    },
  },
  {
    id: "tour",
    name: { es: "Tour", en: "Tour" },
    route: "/tour",
    image: "/images/banners/tour.png",
    adText: {
      es: "Conoce las próximas fechas de la gira y el detalle de todos los shows de los ultimos 40 años",
      en: "Discover upcoming tour dates and details of all shows from the last 40 years",
    },
  },
  {
    id: "songs",
    name: { es: "Canciones", en: "Songs" },
    route: "/songs",
    image: "/images/banners/songs.png",
    adText: {
      es: "Descubre todas las canciones de Megadeth, letras, analisis, veces tocadas en vivo y mas!",
      en: "Discover all Megadeth songs, lyrics, analysis, live play counts and more!",
    },
  },
  {
    id: "dvds",
    name: { es: "DVDs", en: "DVDs" },
    route: "/dvds",
    image: "/images/banners/dvd.png",
    adText: {
      es: "Revive los mejores conciertos en video, documentales y mucho mas!",
      en: "Relive the best concerts on video, documentaries and much more!",
    },
  },
  {
    id: "videos",
    name: { es: "Videos", en: "Videos" },
    route: "/videos",
    image: "/images/banners/videos.png",
    adText: {
      es: "Mira todos los videoclips oficiales",
      en: "Watch all the official music videos",
    },
  },
  {
    id: "history",
    name: { es: "Historia", en: "History" },
    route: "/historia",
    image: "/images/banners/history.png",
    adText: {
      es: "La cronologia completa del legado: Linea de tiempo, hechos y mas",
      en: "The complete chronology of the legacy: Timeline, facts and more",
    },
  },
  {
    id: "members",
    name: { es: "Miembros", en: "Members" },
    route: "/miembros",
    image: "/images/banners/members.png",
    adText: {
      es: "Profile a todos los miembros de Megadeth, conoce a los musicos detras de la leyenda",
      en: "Profile all Megadeth members, meet the musicians behind the legend",
    },
  },
  {
    id: "lineups",
    name: { es: "Formaciones", en: "Lineups" },
    route: "/formaciones",
    image: "/images/banners/lineup.png",
    adText: {
      es: "Descubre todas las formaciones a lo largo de los años",
      en: "Discover all the lineups throughout the years",
    },
  },
  {
    id: "shows",
    name: { es: "Shows", en: "Shows" },
    route: "/shows",
    image: "/images/banners/shows.png",
    adText: {
      es: "Revive todos los conciertos históricos a lo largo de los años y formaciones",
      en: "Relive all the historic concerts throughout the years and lineups",
    },
  },
  {
    id: "interviews",
    name: { es: "Entrevistas", en: "Interviews" },
    route: "/entrevistas",
    image: "/images/banners/interviews.png",
    adText: {
      es: "Lee y mira las entrevistas más interesantes a lo largo de los ultimos 40 años",
      en: "Read the most interesting interviews throughout the last 40 years",
    },
  },
  {
    id: "bootlegs",
    name: { es: "Bootlegs", en: "Bootlegs" },
    route: "/bootlegs",
    image: "/images/banners/bootlegs.png",
    adText: {
      es: "Descubre grabaciones no oficiales, tesoros escondidos para fans",
      en: "Discover unofficial recordings, hidden treasures for fans",
    },
  },
];

interface RandomSectionBannerProps {
  currentSection: string;
}

export default function RandomSectionBanner({
  currentSection,
}: RandomSectionBannerProps) {
  const router = useRouter();
  const locale = useLocale() as "es" | "en";

  // Filtrar la sección actual y seleccionar una aleatoria
  const randomSection = useMemo(() => {
    const availableSections = sections.filter((s) => s.id !== currentSection);
    const randomIndex = Math.floor(Math.random() * availableSections.length);
    return availableSections[randomIndex];
  }, [currentSection]);

  const handleClick = () => {
    router.push(randomSection.route);
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 720,
        mx: "auto",
      }}
    >
      <Box
        onClick={handleClick}
        sx={{
          position: "relative",
          width: "100%",
          cursor: "pointer",
          overflow: "hidden",
          borderRadius: 2,
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "scale(1.02)",
            boxShadow: (theme) =>
              `0 8px 24px ${
                theme.palette.mode === "dark"
                  ? "rgba(0, 0, 0, 0.6)"
                  : "rgba(0, 0, 0, 0.2)"
              }`,
          },
          "&:active": {
            transform: "scale(0.98)",
          },
        }}
      >
        <Image
          src={randomSection.image}
          alt={randomSection.name[locale]}
          width={1200}
          height={400}
          style={{
            width: "100%",
            height: "auto",
            display: "block",
          }}
        />
      </Box>
      <Typography
        variant="body2"
        sx={{
          textAlign: "center",
          mt: 1,
          color: "text.secondary",
          fontStyle: "italic",
        }}
      >
        {randomSection.adText[locale]}
      </Typography>
    </Box>
  );
}
