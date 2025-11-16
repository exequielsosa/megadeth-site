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
} from "@mui/material";
import { useTranslations } from "next-intl";
import songsData from "@/constants/songs.json";
import ContainerGradient from "./atoms/ContainerGradient";

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

export default function SongsListPage() {
  const t = useTranslations("songs");
  const [filter, setFilter] = useState("");
  const songs: Song[] = songsData;
  const filtered = filter
    ? songs.filter((song) => getFilterValue(song, filter))
    : songs;
  // const [mounted, setMounted] = useState(false);
  // useEffect(() => {
  //   console.log(mounted);
  //   setMounted(true);
  // }, []);
  // if (!mounted) return null; // o un loader

  return (
    <ContainerGradient>
      <Container maxWidth={false} sx={{ maxWidth: 1440, mx: "auto" }}>
        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontSize: { xs: "2.5rem", md: "4rem" },
            fontWeight: 600,
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
        <TextField
          label={t("search")}
          variant="outlined"
          fullWidth
          sx={{ mb: 4 }}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        {/* Tabla solo visible en desktop */}
        <TableContainer
          component={Paper}
          sx={{ mb: 4, display: { xs: "none", md: "block" } }}
        >
          <Table size="small">
            <TableHead sx={{ backgroundColor: "primary.main", height: 50 }}>
              <TableRow>
                <TableCell>
                  <Typography fontWeight={600} fontSize={18} color="white">
                    {t("title")}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight={600} fontSize={18} color="white">
                    {t("album")}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight={600} fontSize={18} color="white">
                    {t("year")}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight={600} fontSize={18} color="white">
                    {t("duration")}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((song) => (
                <TableRow
                  key={song.id}
                  hover
                  sx={{ cursor: "pointer", height: 55 }}
                  onClick={() => (window.location.href = `/songs/${song.id}`)}
                >
                  <TableCell>
                    <Typography fontWeight={500}>{song.title}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={song.album.title} sx={{ mr: 1 }} />
                  </TableCell>
                  <TableCell>
                    <Chip label={song.album.year} color="secondary" />
                  </TableCell>
                  <TableCell>{song.details.duration}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {/* Cards solo visibles en mobile/tablet */}
        <Grid
          container
          spacing={2}
          sx={{ mb: 4, display: { xs: "flex", md: "none" } }}
        >
          {filtered.map((song) => (
            <Grid size={{ xs: 12, sm: 6 }} key={song.id}>
              <Card>
                <CardActionArea
                  onClick={() => (window.location.href = `/songs/${song.id}`)}
                >
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {song.title}
                    </Typography>
                    <Chip label={song.album.title} sx={{ mr: 1, mb: 1 }} />
                    <Chip
                      label={song.album.year}
                      color="secondary"
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {t("duration")}: {song.details.duration}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </ContainerGradient>
  );
}
