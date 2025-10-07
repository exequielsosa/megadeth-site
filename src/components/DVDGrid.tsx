"use client";

import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import DVDCard from "./DVDCard";
import type { DVD } from "@/types/dvd";

// Interfaz flexible para DVDs
interface DVDGridData extends Partial<DVD> {
  title?: string;
  album_title?: string;
  year?: number;
  release_year?: number;
}

interface DVDGridProps {
  dvds: DVDGridData[];
}

export default function DVDGrid({ dvds }: DVDGridProps) {
  const t = useTranslations("dvds");

  return (
    <Box component="main" role="main">
      {/* Title */}
      <Typography
        variant="h1"
        component="h1"
        sx={{
          fontSize: { xs: "2.5rem", md: "4rem" },
          fontWeight: "bold",
          textAlign: "center",
          mb: 2,
          background: "linear-gradient(45deg, #ff6b6b, #4ecdc4)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {t("title")}
      </Typography>

      {/* Subtitle */}
      <Typography
        variant="h5"
        component="h2"
        sx={{
          textAlign: "center",
          color: "text.secondary",
          mb: 6,
          maxWidth: "600px",
          mx: "auto",
        }}
      >
        {t("subtitle")}
      </Typography>

      {/* DVDs Grid */}
      <Box
        component="section"
        aria-label="Colección de DVDs de Megadeth"
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 3,
        }}
      >
        {dvds.map((dvd, index) => (
          <DVDCard dvd={dvd} key={`${dvd.title}-${dvd.year}-${index}`} />
        ))}
      </Box>
    </Box>
  );
}
