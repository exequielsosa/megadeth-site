"use client";
import { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Box,
} from "@mui/material";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import songsData from "@/constants/songs.json";
import songsCountData from "@/constants/songs.counts.fixed.json";

import Breadcrumb from "./Breadcrumb";
import ContainerGradientNoPadding from "./atoms/ContainerGradientNoPadding";
import RandomSectionBanner from "./NewsBanner";
import { CommentsSection } from "./CommentsSection";

interface Song {
  id: string;
  title: string;
  album: {
    title: string;
    year: number;
    cover: string;
  };
  credits: {
    musicians: Array<{
      name: string;
      id: string;
      instrument: { es: string; en: string } | string;
    }>;
    writers: {
      lyrics: string[];
      music: string[];
    };
  };
  details: {
    track_number: number;
    duration: string;
  };
  theme?: { es?: string; en?: string };
  lyrics?: { es?: string; en?: string };
}

interface AlbumGroup {
  title: string;
  year: number;
  songs: Song[];
}

function getFilterValue(song: Song, filter: string) {
  const lower = filter.toLowerCase();
  return (
    song.title.toLowerCase().includes(lower) ||
    song.album.title.toLowerCase().includes(lower) ||
    song.album.year.toString().includes(lower) ||
    song.credits.musicians.some((m) => {
      const nameMatch = m.name.toLowerCase().includes(lower);
      let instrumentText = "";
      if (typeof m.instrument === "string") {
        instrumentText = m.instrument.toLowerCase();
      } else if (m.instrument && typeof m.instrument === "object") {
        instrumentText = `${m.instrument.es.toLowerCase()} ${m.instrument.en.toLowerCase()}`;
      }
      return nameMatch || instrumentText.includes(lower);
    }) ||
    song.credits.writers.lyrics
      .concat(song.credits.writers.music)
      .some((w) => w.toLowerCase().includes(lower))
  );
}

// Agrupa las canciones por álbum (más reciente primero) para que las 200
// queden presentes en el HTML desde el primer render, sin paginación oculta
// detrás de clicks que Google nunca llega a ver.
function groupByAlbum(songs: Song[]): AlbumGroup[] {
  const groups = new Map<string, AlbumGroup>();

  for (const song of songs) {
    const key = song.album.title;
    if (!groups.has(key)) {
      groups.set(key, { title: key, year: song.album.year, songs: [] });
    }
    groups.get(key)!.songs.push(song);
  }

  return Array.from(groups.values())
    .sort((a, b) => b.year - a.year)
    .map((group) => ({
      ...group,
      songs: group.songs.sort(
        (a, b) => a.details.track_number - b.details.track_number
      ),
    }));
}

export default function SongsListPage() {
  const t = useTranslations("songs");
  const tb = useTranslations("breadcrumb");
  const locale = useLocale();
  const [filter, setFilter] = useState("");
  const songs: Song[] = songsData;
  const songsCounts: Record<string, number> = songsCountData;

  // Obtener top 10 canciones más tocadas
  const top10Songs = Object.entries(songsCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([title, count]) => ({
      title,
      count,
      song: songs.find((s) => s.title === title),
    }))
    .filter(
      (item): item is typeof item & { song: Song } => item.song !== undefined
    );

  // Función para verificar si una canción está en el top 10
  const isTop10 = (songTitle: string): boolean => {
    return top10Songs.some((item) => item.title === songTitle);
  };

  // Función helper para obtener el número de veces tocada
  const getTimesPlayed = (songTitle: string): number => {
    return songsCounts[songTitle] || 0;
  };

  const filtered = filter
    ? songs.filter((song) => getFilterValue(song, filter))
    : songs;

  const albumGroups = groupByAlbum(filtered);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  return (
    <ContainerGradientNoPadding>
      <Box pt={{ xs: 2, md: 4 }} px={{ xs: 2, md: 0 }} pb={{ xs: 2, md: 0 }}>
        <Breadcrumb items={[{ label: tb("songs") }]} />
      </Box>
      <Container maxWidth={false} sx={{ maxWidth: 1440, mx: "auto" }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width={"100%"}
        >
          <Typography
            variant="h1"
            sx={{ fontSize: { xs: 32, md: 56 }, mb: 3, fontWeight: 700 }}
          >
            {t("title")}
          </Typography>
        </Box>

        {/* Top 10 Canciones más tocadas */}
        <Card sx={{ mb: 4, p: 3 }}>
          <Typography
            variant="h4"
            sx={{ fontSize: { xs: 24, md: 32 }, mb: 1, fontWeight: 700 }}
          >
            {t("top10Title")}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 3, fontSize: { xs: 14, md: 16 } }}
          >
            {t("top10Description")}
          </Typography>
          <Grid container spacing={2}>
            {top10Songs.map((item, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4 }} key={item.title}>
                <Card
                  component={Link}
                  href={`/songs/${item.song.id}`}
                  sx={{
                    display: "block",
                    textDecoration: "none",
                    color: "inherit",
                    cursor: "pointer",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    border: "1px solid",
                    borderColor: "primary.main",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: 3,
                    },
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Typography
                        variant="h3"
                        color="primary"
                        sx={{
                          fontWeight: 700,
                          minWidth: 40,
                          fontSize: { xs: 32, md: 40 },
                        }}
                      >
                        {index + 1}
                      </Typography>
                      <Box flex={1}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            fontSize: { xs: 16, md: 18 },
                            mb: 0.5,
                          }}
                        >
                          {item.title}
                        </Typography>
                        {item.song && (
                          <Chip
                            label={item.song.album.title}
                            size="small"
                            sx={{ fontSize: { xs: 10, md: 11 }, mb: 0.5 }}
                          />
                        )}
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 1, fontSize: { xs: 13, md: 14 } }}
                        >
                          {item.count} {locale === "es" ? "veces" : "times"}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Card>

        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: 24, md: 32 },
            mb: 1,
            fontWeight: 700,
            pt: 3,
            pb: 2,
          }}
        >
          {t("titleTable")}
        </Typography>

        <TextField
          label={t("search")}
          variant="outlined"
          fullWidth
          sx={{ mb: 4 }}
          value={filter}
          onChange={handleFilterChange}
        />

        {/* Todas las canciones, agrupadas por álbum (más reciente primero) */}
        {albumGroups.map((album) => (
          <Box key={album.title} sx={{ mb: 5 }}>
            <Typography
              component="h2"
              variant="h5"
              sx={{ fontSize: { xs: 20, md: 26 }, fontWeight: 700, mb: 2 }}
            >
              {album.title} ({album.year})
            </Typography>

            {/* Tabla solo visible en desktop */}
            <TableContainer
              component={Paper}
              sx={{ mb: 2, display: { xs: "none", md: "block" } }}
            >
              <Table size="small" sx={{ tableLayout: "fixed" }}>
                <TableHead sx={{ backgroundColor: "primary.main", height: 50 }}>
                  <TableRow>
                    <TableCell sx={{ width: "34%" }}>
                      <Typography fontWeight={600} fontSize={18} color="white">
                        {t("title")}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ width: "20%" }}>
                      <Typography fontWeight={600} fontSize={18} color="white">
                        {t("album")}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ width: "12%" }}>
                      <Typography fontWeight={600} fontSize={18} color="white">
                        {t("year")}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ width: "16%" }}>
                      <Typography fontWeight={600} fontSize={18} color="white">
                        {t("duration")}
                      </Typography>
                    </TableCell>
                    <TableCell align="center" sx={{ width: "18%" }}>
                      <Typography fontWeight={600} fontSize={18} color="white">
                        {t("timesPlayed")}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {album.songs.map((song) => (
                    <TableRow
                      key={song.id}
                      hover
                      sx={{ cursor: "pointer", height: 55, position: "relative" }}
                    >
                      <TableCell>
                        {/* Link real que cubre toda la fila (técnica de
                        "stretched link"): así el crawler tiene un <a href>
                        de verdad hacia cada canción, no solo un onClick. */}
                        <Link
                          href={`/songs/${song.id}`}
                          aria-label={song.title}
                          style={{ position: "absolute", inset: 0 }}
                        />
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography fontWeight={500}>
                            {song.title}
                          </Typography>
                          {isTop10(song.title) && (
                            <Chip
                              label="TOP 10"
                              color="error"
                              size="small"
                              sx={{ fontWeight: 600, fontSize: 10 }}
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip label={song.album.title} sx={{ mr: 1 }} />
                      </TableCell>
                      <TableCell>
                        <Chip label={song.album.year} color="secondary" />
                      </TableCell>
                      <TableCell>{song.details.duration}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={getTimesPlayed(song.title)}
                          color="primary"
                          variant="outlined"
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Cards solo visibles en mobile/tablet */}
            <Grid
              container
              spacing={2}
              sx={{ display: { xs: "flex", md: "none" } }}
            >
              {album.songs.map((song) => (
                <Grid size={{ xs: 12, sm: 6 }} key={song.id}>
                  <Card>
                    <CardActionArea component={Link} href={`/songs/${song.id}`}>
                      <CardContent>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <Typography variant="h6" fontWeight={600}>
                            {song.title}
                          </Typography>
                          {isTop10(song.title) && (
                            <Chip
                              label="TOP 10"
                              color="error"
                              size="small"
                              sx={{ fontWeight: 600, fontSize: 10 }}
                            />
                          )}
                        </Box>
                        <Chip label={song.album.title} sx={{ mr: 1, mb: 1 }} />
                        <Chip
                          label={song.album.year}
                          color="secondary"
                          sx={{ mb: 1 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {t("duration")}: {song.details.duration}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 0.5 }}
                        >
                          {t("timesPlayedLive")}: {getTimesPlayed(song.title)}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </Container>
      <Box
        pb={4}
        sx={{
          px: { xs: 2, sm: 2, md: 0 },
        }}
      >
        <RandomSectionBanner currentSection="songs" />
        <Box sx={{ maxWidth: 1440, mx: "auto" }}>
          <CommentsSection
            pageType="article"
            pageId="songs-list"
            customSubtitle={t("preSubtitle")}
          />
        </Box>
      </Box>
    </ContainerGradientNoPadding>
  );
}
