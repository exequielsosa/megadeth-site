"use client";

import { Grid, Container, Typography } from "@mui/material";
import type { Album } from "@/types/album";
import AlbumCard from "./AlbumCard";

type Props = {
  albums: Album[];
  title?: string;
};

export default function DiscographyGrid({
  albums,
  title = "Discografía",
}: Props) {
  // Orden por año DESC (primero lo nuevo)
  const sorted = [...albums].sort((a, b) => b.year - a.year);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
        {title}
      </Typography>

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
