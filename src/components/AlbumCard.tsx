"use client";

import Image from "next/image";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Stack,
  Typography,
  IconButton,
  Tooltip,
  Divider,
  Collapse,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import AppleIcon from "@mui/icons-material/Apple";
import YouTubeIcon from "@mui/icons-material/YouTube";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";
import type { Album } from "@/types/album";
import { useState } from "react";

const Expand = styled((props: any) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }: any) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

function StreamingIcons({ links }: { links?: Album["streaming"] }) {
  if (!links) return null;
  const { spotify, appleMusic, youtube, tidal, deezer, bandcamp } = links;
  const iconBtn = (href: string, label: string, icon: React.ReactNode) => (
    <Tooltip title={label} key={label}>
      <IconButton
        size="small"
        component="a"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
      >
        {icon}
      </IconButton>
    </Tooltip>
  );

  return (
    <Stack direction="row" spacing={0.5}>
      {spotify && iconBtn(spotify, "Escuchar en Spotify", <PlayArrowIcon />)}
      {appleMusic &&
        iconBtn(appleMusic, "Escuchar en Apple Music", <AppleIcon />)}
      {youtube && iconBtn(youtube, "Ver en YouTube", <YouTubeIcon />)}
      {tidal && iconBtn(tidal, "Escuchar en Tidal", <MusicNoteIcon />)}
      {deezer && iconBtn(deezer, "Escuchar en Deezer", <MusicNoteIcon />)}
      {bandcamp && iconBtn(bandcamp, "Ver en Bandcamp", <MusicNoteIcon />)}
    </Stack>
  );
}

export default function AlbumCard({ album }: { album: Album }) {
  const [expanded, setExpanded] = useState(false);
  const toggle = () => setExpanded((v) => !v);

  const metaChips = (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
      <Chip size="small" label={album.year} />
      {album.label && (
        <Chip size="small" label={album.label} variant="outlined" />
      )}
      {album.isUpcoming && album.releaseDate && (
        <Chip
          size="small"
          color="primary"
          label={`Lanzamiento: ${new Date(
            album.releaseDate
          ).toLocaleDateString()}`}
        />
      )}
    </Stack>
  );

  return (
    <Card
      sx={{ height: "100%", display: "flex", flexDirection: "column" }}
      variant="outlined"
    >
      <Box
        sx={{
          position: "relative",
          aspectRatio: "1/1",
          bgColor: "background.paper",
        }}
      >
        <Image
          src={album.cover}
          alt={`${album.title} cover`}
          fill
          sizes="(max-width: 600px) 100vw, 33vw"
          style={{ objectFit: "cover" }}
          priority={album.isUpcoming}
        />
        {album.isUpcoming && (
          <Box
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
              bgcolor: "primary.main",
              color: "primary.contrastText",
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            Próximo lanzamiento
          </Box>
        )}
      </Box>

      <CardHeader
        title={
          <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            {album.title}
          </Typography>
        }
        subheader={metaChips}
        sx={{ pb: 0 }}
      />

      <CardContent sx={{ flexGrow: 1 }}>
        {album.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            {album.description}
          </Typography>
        )}

        {album.producers?.length ? (
          <Typography variant="caption" color="text.secondary">
            Productores: {album.producers.join(", ")}
          </Typography>
        ) : null}
      </CardContent>

      <Box sx={{ px: 2, pb: 1 }}>
        <StreamingIcons links={album.streaming} />
      </Box>

      {album.tracks?.length ? (
        <>
          <Divider />
          <Box
            sx={{ px: 1, py: 0.5, display: "flex", justifyContent: "flex-end" }}
          >
            <Expand
              expand={expanded ? 1 : 0}
              onClick={toggle}
              aria-expanded={expanded}
              aria-label="Mostrar tracklist"
            >
              <ExpandMoreIcon />
            </Expand>
          </Box>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Box sx={{ px: 2, pb: 2 }}>
              <Stack spacing={0.5} component="ol" sx={{ m: 0, pl: 2 }}>
                {album.tracks.map((t) => (
                  <li key={t.n}>
                    <Typography variant="body2">
                      <strong>{t.n}.</strong> {t.title}{" "}
                      {t.duration ? `— ${t.duration}` : ""}
                    </Typography>
                  </li>
                ))}
              </Stack>
            </Box>
          </Collapse>
        </>
      ) : null}
    </Card>
  );
}
