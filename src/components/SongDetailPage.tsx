"use client";
import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Chip,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
} from "@mui/material";
import { useTranslations, useLocale } from "next-intl";
import songsData from "@/constants/songs.json";
import Link from "next/link";
import ContainerGradient from "./atoms/ContainerGradient";
import Image from "next/image";
import membersData from "@/constants/members.json";

interface SongDetailPageProps {
  songId: string;
}

export default function SongDetailPage({ songId }: SongDetailPageProps) {
  const t = useTranslations("songs");
  const [showEs, setShowEs] = useState(false);
  const locale = useLocale();
  const song = songsData.find((s) => s.id === songId);
  if (!song)
    return (
      <Container>
        <Typography>{t("notFound")}</Typography>
      </Container>
    );

  // Instrument y theme dependen del idioma global
  const instrumentKey = locale === "es" ? "es" : "en";
  const themeText = song.theme[instrumentKey];

  return (
    <ContainerGradient>
      <Container maxWidth={false} sx={{ maxWidth: 1440, mx: "auto" }}>
        <Box
          display="flex"
          alignItems={{ xs: "center", md: "flex-start" }}
          flexDirection={{ xs: "column", md: "row" }}
          gap={4}
        >
          <Card sx={{ minWidth: 220, maxWidth: 220, boxShadow: 4 }}>
            <Box
              sx={{
                position: "relative",
                aspectRatio: "1/1",
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: 4,
                border: "1.5px solid",
                borderColor: "primary.main",
                cursor: "pointer",
              }}
            >
              <Link
                href={`/discography/${song.album.title
                  .toLowerCase()
                  .replace(/[^a-z0-9 ]/gi, "")
                  .replace(/ /g, "-")}`}
                passHref
                legacyBehavior
              >
                <Image
                  src={song.album.cover}
                  alt={song.album.title}
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                />
              </Link>
            </Box>
          </Card>
          <Box flex={1}>
            <Typography
              variant="h1"
              fontWeight={600}
              gutterBottom
              sx={{ fontSize: { md: 48, xs: 40 } }}
            >
              {song.title}
            </Typography>
            <Link
              href={`/discography/${song.album.title
                .toLowerCase()
                .replace(/[^a-z0-9 ]/gi, "")
                .replace(/ /g, "-")}`}
              passHref
              legacyBehavior
            >
              <Chip label={song.album.title} sx={{ mr: 1, mb: 1 }} />
            </Link>
            <Chip label={song.album.year} color="secondary" sx={{ mb: 1 }} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              {t("duration")}: {song.details.duration}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {t("track")}: {song.details.track_number}
            </Typography>
            <Card sx={{ padding: 2, mt: 3, boxShadow: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                {t("writers")}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {t("lyricsBy")}: {song.credits.writers.lyrics.join(", ")}
              </Typography>

              <Typography variant="body2" sx={{ mb: 1 }}>
                {t("musicBy")}: {song.credits.writers.music.join(", ")}
              </Typography>
            </Card>
            <Card sx={{ padding: 2, mt: 3, boxShadow: 2, mb: 4 }}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                {t("theme")}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {themeText}
              </Typography>
            </Card>

            <Box
              display={"flex"}
              width={"100%"}
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="subtitle1" sx={{ mt: 3, fontWeight: 600 }}>
                {t("lyrics")}
              </Typography>
              <Button variant="outlined" onClick={() => setShowEs((e) => !e)}>
                {showEs ? t("showEn") : t("showEs")}
              </Button>
            </Box>

            <Box
              sx={{
                whiteSpace: "pre-line",
                fontFamily: "monospace",
                fontSize: 16,
                background: "rgba(0,0,0,0.04)",
                p: 2,
                borderRadius: 2,
                mb: 2,
              }}
            >
              {showEs
                ? song.lyrics?.es ?? t("lyricsNotAvailable")
                : song.lyrics?.en ?? t("lyricsNotAvailable")}
            </Box>
            <Typography variant="subtitle1" sx={{ mt: 3, fontWeight: 600 }}>
              {t("musicians")}
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {song.credits.musicians.map((m) => {
                const memberId = m.name.toLowerCase().replace(/ /g, "-");
                const memberObj = (
                  membersData.members as Record<
                    string,
                    (typeof membersData.members)[keyof typeof membersData.members]
                  >
                )[memberId];
                return (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={m.name}>
                    <Link
                      href={`/miembros/${memberId}`}
                      passHref
                      legacyBehavior
                    >
                      <Card
                        sx={{
                          height: "100%",
                          cursor: "pointer",
                          transition: "transform 0.2s, box-shadow 0.2s",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: 8,
                          },
                        }}
                      >
                        <CardContent sx={{ textAlign: "center" }}>
                          {memberObj && memberObj.image ? (
                            <Image
                              src={memberObj.image}
                              alt={m.name}
                              width={200}
                              height={200}
                              style={{
                                borderRadius: "16px",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <Avatar
                              sx={{
                                bgcolor: "primary.main",
                                width: 56,
                                height: 56,
                              }}
                            >
                              {m.name[0]}
                            </Avatar>
                          )}
                          <Box>
                            {/* <Link
                            href={`/miembros/${memberId}`}
                            passHref
                            legacyBehavior
                          > */}
                            <Typography
                              variant="body1"
                              fontWeight={600}
                              color="primary"
                              component="a"
                              sx={{
                                textDecoration: "none",
                                cursor: "pointer",
                              }}
                            >
                              {m.name}
                            </Typography>
                            {/* </Link> */}
                            <Typography variant="body2" color="text.secondary">
                              {typeof m.instrument === "string"
                                ? m.instrument
                                : m.instrument &&
                                  (m.instrument as { es: string; en: string })[
                                    instrumentKey
                                  ]}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Link>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        </Box>
      </Container>
    </ContainerGradient>
  );
}
