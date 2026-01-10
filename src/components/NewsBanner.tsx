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
      es: "Explora todos los álbumes de Megadeth",
      en: "Explore all Megadeth albums",
    },
  },
  {
    id: "news",
    name: { es: "Noticias", en: "News" },
    route: "/noticias",
    image: "/images/banners/news.png",
    adText: {
      es: "Mantente al día con las últimas novedades",
      en: "Stay up to date with the latest news",
    },
  },
  {
    id: "tour",
    name: { es: "Tour", en: "Tour" },
    route: "/tour",
    image: "/images/banners/tour.png",
    adText: {
      es: "Conoce las próximas fechas de la gira",
      en: "Check out the upcoming tour dates",
    },
  },
  {
    id: "songs",
    name: { es: "Canciones", en: "Songs" },
    route: "/songs",
    image: "/images/banners/songs.png",
    adText: {
      es: "Descubre todas las canciones de Megadeth",
      en: "Discover all Megadeth songs",
    },
  },
  {
    id: "dvds",
    name: { es: "DVDs", en: "DVDs" },
    route: "/dvds",
    image: "/images/banners/dvd.png",
    adText: {
      es: "Revive los mejores conciertos en video",
      en: "Relive the best concerts on video",
    },
  },
  {
    id: "videos",
    name: { es: "Videos", en: "Videos" },
    route: "/videos",
    image: "/images/banners/videos.png",
    adText: {
      es: "Mira los videoclips oficiales",
      en: "Watch the official music videos",
    },
  },
  {
    id: "history",
    name: { es: "Historia", en: "History" },
    route: "/historia",
    image: "/images/banners/history.png",
    adText: {
      es: "Conoce la historia completa de la banda",
      en: "Learn the complete history of the band",
    },
  },
  {
    id: "members",
    name: { es: "Miembros", en: "Members" },
    route: "/miembros",
    image: "/images/banners/members.png",
    adText: {
      es: "Conoce a todos los miembros de Megadeth",
      en: "Meet all Megadeth members",
    },
  },
  {
    id: "lineups",
    name: { es: "Formaciones", en: "Lineups" },
    route: "/formaciones",
    image: "/images/banners/lineup.png",
    adText: {
      es: "Descubre las formaciones a lo largo de los años",
      en: "Discover the lineups throughout the years",
    },
  },
  {
    id: "shows",
    name: { es: "Shows", en: "Shows" },
    route: "/shows",
    image: "/images/banners/shows.png",
    adText: {
      es: "Revive todos los conciertos históricos",
      en: "Relive all the historic concerts",
    },
  },
  {
    id: "interviews",
    name: { es: "Entrevistas", en: "Interviews" },
    route: "/entrevistas",
    image: "/images/banners/interviews.png",
    adText: {
      es: "Lee las entrevistas más interesantes",
      en: "Read the most interesting interviews",
    },
  },
  {
    id: "bootlegs",
    name: { es: "Bootlegs", en: "Bootlegs" },
    route: "/bootlegs",
    image: "/images/banners/bootlegs.png",
    adText: {
      es: "Descubre grabaciones no oficiales",
      en: "Discover unofficial recordings",
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
