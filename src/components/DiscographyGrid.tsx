"use client";

import { Grid, Container, Typography } from "@mui/material";
import type { Album } from "@/types/album";
import AlbumCard from "./AlbumCard";
import { Box } from "@mui/material";
import { useTranslations } from "next-intl";

type Props = {
  albums: Album[];
  title?: string;
};

export default function DiscographyGrid({ albums }: Props) {
  // Orden por año DESC (primero lo nuevo)
  const sorted = [...albums].sort((a, b) => b.year - a.year);

  const t = useTranslations();

  return (
    <Container maxWidth="lg">
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography
          variant="h1"
          component="h1"
          gutterBottom
          sx={{ fontSize: { xs: 28, md: 56 }, fontWeight: 700 }}
        >
          {t("discography.title")}
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {sorted.map((album) => (
          <Grid key={album.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <AlbumCard album={album} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
