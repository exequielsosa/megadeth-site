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
  Pagination,
  Button,
} from "@mui/material";
import { useTranslations, useLocale } from "next-intl";
import songsData from "@/constants/songs.json";
import ContainerGradient from "./atoms/ContainerGradient";
import Breadcrumb from "./Breadcrumb";
import ContainerGradientNoPadding from "./atoms/ContainerGradientNoPadding";

const ITEMS_PER_PAGE_DESKTOP = 10;
const ITEMS_PER_PAGE_MOBILE = 10;

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
  const tb = useTranslations("breadcrumb");
  const locale = useLocale();
  const [filter, setFilter] = useState("");
  const [pageDesktop, setPageDesktop] = useState(1);
  const [displayCountMobile, setDisplayCountMobile] = useState(
    ITEMS_PER_PAGE_MOBILE
  );
  const songs: Song[] = songsData;
  const filtered = filter
    ? songs.filter((song) => getFilterValue(song, filter))
    : songs;

  // Reset pagination cuando se filtra
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
    setPageDesktop(1);
    setDisplayCountMobile(ITEMS_PER_PAGE_MOBILE);
  };

  // Paginación para desktop
  const totalPagesDesktop = Math.ceil(filtered.length / ITEMS_PER_PAGE_DESKTOP);
  const startIndexDesktop = (pageDesktop - 1) * ITEMS_PER_PAGE_DESKTOP;
  const endIndexDesktop = startIndexDesktop + ITEMS_PER_PAGE_DESKTOP;
  const displayedDesktop = filtered.slice(startIndexDesktop, endIndexDesktop);

  // "Cargar más" para mobile
  const displayedMobile = filtered.slice(0, displayCountMobile);
  const hasMoreMobile = displayCountMobile < filtered.length;

  const loadMoreMobile = () => {
    setDisplayCountMobile((prev) =>
      Math.min(prev + ITEMS_PER_PAGE_MOBILE, filtered.length)
    );
  };
  // const [mounted, setMounted] = useState(false);
  // useEffect(() => {
  //   console.log(mounted);
  //   setMounted(true);
  // }, []);
  // if (!mounted) return null; // o un loader

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
        <TextField
          label={t("search")}
          variant="outlined"
          fullWidth
          sx={{ mb: 4 }}
          value={filter}
          onChange={handleFilterChange}
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
              {displayedDesktop.map((song) => (
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

        {/* Paginación para desktop */}
        {totalPagesDesktop > 1 && (
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              justifyContent: "center",
              mb: 4,
            }}
          >
            <Pagination
              count={totalPagesDesktop}
              page={pageDesktop}
              onChange={(_, page) => setPageDesktop(page)}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
            />
          </Box>
        )}

        {/* Cards solo visibles en mobile/tablet */}
        <Grid
          container
          spacing={2}
          sx={{ mb: 4, display: { xs: "flex", md: "none" } }}
        >
          {displayedMobile.map((song) => (
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

        {/* Botón "Cargar más" para mobile */}
        {hasMoreMobile && (
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              justifyContent: "center",
              mt: 4,
              mb: 4,
            }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={loadMoreMobile}
              sx={{
                px: 6,
                py: 1.5,
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              {locale === "es" ? "Cargar más canciones" : "Load more songs"}
            </Button>
          </Box>
        )}
      </Container>
    </ContainerGradientNoPadding>
  );
}
