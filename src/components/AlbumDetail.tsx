"use client";

import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  Chip,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Stack,
} from "@mui/material";
import Image from "next/image";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import ContainerGradient from "./atoms/ContainerGradient";
import type { Album, Track } from "@/types/album";
import {
  getAlbumDescription,
  getMusicianInstrument,
} from "@/utils/albumHelpers";
import LyricsIcon from "@mui/icons-material/MusicNote";

interface AlbumDetailProps {
  album: Album;
}

export default function AlbumDetail({ album }: AlbumDetailProps) {
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [lyricsOpen, setLyricsOpen] = useState(false);
  const t = useTranslations("albumDetail");
  const locale = useLocale();

  const handleTrackClick = (track: Track) => {
    if (track.lyrics) {
      setSelectedTrack(track);
      setLyricsOpen(true);
    }
  };

  const handleCloseLyrics = () => {
    setLyricsOpen(false);
    setSelectedTrack(null);
  };

  return (
    <ContainerGradient>
      <Container maxWidth={false} sx={{ maxWidth: 1440, mx: "auto", py: 4 }}>
        <Grid container spacing={4}>
          {/* Portada del álbum */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                position: "relative",
                aspectRatio: "1/1",
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: 4,
                border: "2px solid",
                borderColor: "primary.main",
              }}
            >
              <Image
                src={album.cover}
                alt={`${album.title} cover`}
                fill
                style={{ objectFit: "cover" }}
                priority
              />
            </Box>
          </Grid>

          {/* Información del álbum */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={3}>
              <Box>
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    fontSize: { xs: "2rem", md: "3rem" },
                    fontWeight: 700,
                    mb: 1,
                  }}
                >
                  {album.title}
                </Typography>

                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                  <Chip label={album.year} color="primary" variant="filled" />
                  {album.isUpcoming && (
                    <Chip
                      label={t("upcoming") || "Próximo"}
                      color="secondary"
                      variant="filled"
                    />
                  )}
                </Stack>

                {album.description && (
                  <Typography
                    variant="body1"
                    sx={{ mb: 3, color: "text.secondary" }}
                  >
                    {getAlbumDescription(album, locale, "extended")}
                  </Typography>
                )}
              </Box>

              <Box>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                  {t("details") || "Detalles"}
                </Typography>
                <Stack spacing={1}>
                  {album.label && (
                    <Typography variant="body2">
                      <strong>{t("label") || "Sello"}:</strong> {album.label}
                    </Typography>
                  )}
                  {album.producers && album.producers.length > 0 && (
                    <Typography variant="body2">
                      <strong>{t("producers") || "Productores"}:</strong>{" "}
                      {album.producers.join(", ")}
                    </Typography>
                  )}
                  {album.releaseDate && (
                    <Typography variant="body2">
                      <strong>
                        {t("releaseDate") || "Fecha de lanzamiento"}:
                      </strong>{" "}
                      {album.releaseDate}
                    </Typography>
                  )}
                </Stack>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        {/* Formación de la banda */}
        {album.musicians && album.musicians.length > 0 && (
          <Box sx={{ mt: 6 }}>
            <Typography
              variant="h4"
              component="h2"
              sx={{ mb: 3, fontWeight: 700 }}
            >
              {t("lineup") || "Formación"}
            </Typography>

            <Card variant="outlined">
              <Box sx={{ p: 3 }}>
                <Grid container spacing={2}>
                  {album.musicians.map((musician, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                      <Stack spacing={0.5}>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {musician.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {getMusicianInstrument(musician.instrument, locale)}
                        </Typography>
                      </Stack>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Card>
          </Box>
        )}

        {/* Lista de canciones */}
        {album.tracks && album.tracks.length > 0 && (
          <Box sx={{ mt: 6 }}>
            <Typography
              variant="h4"
              component="h2"
              sx={{ mb: 3, fontWeight: 700 }}
            >
              {t("tracklist") || "Lista de canciones"}
            </Typography>

            <Card variant="outlined">
              <List sx={{ p: 0 }}>
                {album.tracks.map((track, index) => (
                  <Box key={track.n}>
                    <ListItem
                      sx={{
                        py: 2,
                        px: 3,
                        cursor: track.lyrics ? "pointer" : "default",
                        "&:hover": track.lyrics
                          ? {
                              backgroundColor: "action.hover",
                            }
                          : {},
                      }}
                      onClick={() => handleTrackClick(track)}
                    >
                      <ListItemText
                        primary={
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                minWidth: 24,
                                color: "text.secondary",
                                fontWeight: 600,
                              }}
                            >
                              {track.n}
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 500 }}
                            >
                              {track.title}
                            </Typography>
                            {track.lyrics && (
                              <LyricsIcon
                                fontSize="small"
                                sx={{ color: "primary.main" }}
                              />
                            )}
                          </Stack>
                        }
                        secondary={
                          <Box
                            component="span"
                            sx={{ display: "block", mt: 0.5 }}
                          >
                            {track.duration && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                component="span"
                                sx={{ display: "block", mb: 0.5 }}
                              >
                                {t("duration") || "Duración"}: {track.duration}
                              </Typography>
                            )}
                            {track.writers && track.writers.length > 0 && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                component="span"
                                sx={{ display: "block" }}
                              >
                                {t("writers") || "Compositores"}:{" "}
                                {track.writers.join(", ")}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < (album.tracks?.length || 0) - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            </Card>
          </Box>
        )}

        {/* Modal de letras */}
        <Dialog
          open={lyricsOpen}
          onClose={handleCloseLyrics}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>{selectedTrack?.title}</DialogTitle>
          <DialogContent>
            <Typography
              variant="body2"
              sx={{
                whiteSpace: "pre-line",
                fontFamily: "monospace",
                lineHeight: 1.6,
              }}
            >
              {selectedTrack?.lyrics ||
                t("noLyrics") ||
                "Letras no disponibles"}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseLyrics}>
              {t("close") || "Cerrar"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ContainerGradient>
  );
}
