"use client";

import { Grid, Container } from "@mui/material";
import type { Album } from "@/types/album";
import AlbumCard from "./AlbumCard";

type Props = {
  albums: Album[];
  title?: string;
};

export default function DiscographyGrid({ albums }: Props) {
  // Orden por año DESC (primero lo nuevo)
  const sorted = [...albums].sort((a, b) => b.year - a.year);

  return (
    <Container maxWidth="lg">
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
