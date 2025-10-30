"use client";

import { Box, Container, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import ContainerGradient from "../components/atoms/ContainerGradient";
import Countdown from "./Countdown";
import YouTubeEmbed from "./YouTubeEmbed";
import Image from "next/image";
import Divider from "@mui/material/Divider";
import AlbumTeasers from "./AlbumTeasers";
import NewTour from "./NewTour";
import IronMaidenTour from "./IronMaidenTour";

export default function Hero() {
  const t = useTranslations("hero");
  const tAlbum = useTranslations("album");

  return (
    <ContainerGradient>
      <Container
        maxWidth={false}
        sx={{ maxWidth: 1440, mx: "auto", px: { xs: 2, sm: 3 } }}
      >
        <Stack spacing={3} alignItems="start">
          <Typography variant="h1" sx={{ fontSize: { xs: 24, md: 56 } }}>
            {t("title")}
          </Typography>

          <Box
            width="100%"
            gap={4}
            display="flex"
            flexDirection={{ xs: "column", lg: "row" }}
            justifyContent={{ xs: "center", lg: "flex-start" }}
            alignItems={{ xs: "center", lg: "flex-start" }}
          >
            <Box
              sx={{
                position: "relative",
                width: { xs: "300px", md: "600px" },
                height: { xs: "300px", md: "600px" },
                flexShrink: 0,
              }}
            >
              <Image
                src="/images/megadeth-megadeth.jpg"
                alt="Megadeth"
                fill
                style={{
                  objectFit: "cover",
                }}
                priority
              />
            </Box>
            <Box>
              <Stack spacing={2} sx={{ mt: 0 }}>
                <Typography
                  variant="h4"
                  color="primary"
                  sx={{ fontSize: { xs: 20, md: 34 }, fontWeight: 600, mb: 1 }}
                >
                  {tAlbum("finalAlbumTitle")}
                </Typography>

                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 500,
                    color: "text.primary",
                    fontSize: { xs: 18, md: 24 },
                  }}
                >
                  {tAlbum("albumName")}: &quot;{tAlbum("albumName")}&quot;
                </Typography>

                <Stack spacing={1.5}>
                  <Typography
                    variant="body1"
                    sx={{ fontSize: { xs: 14, md: 17 } }}
                  >
                    <strong>{tAlbum("releaseDate")}:</strong>{" "}
                    {tAlbum("releaseDateValue")}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontSize: { xs: 14, md: 17 } }}
                  >
                    <strong>{tAlbum("firstSingle")}:</strong> &quot;
                    {tAlbum("firstSingleValue")}&quot;
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontSize: { xs: 14, md: 17 } }}
                  >
                    <strong>{tAlbum("producedBy")}:</strong>{" "}
                    {tAlbum("producedByValue")}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontSize: { xs: 14, md: 17 } }}
                  >
                    <strong>{tAlbum("finalLineup")}:</strong>{" "}
                    {tAlbum("finalLineupValue")}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontSize: { xs: 14, md: 17 } }}
                  >
                    <strong>{tAlbum("includes")}:</strong>{" "}
                    {tAlbum("includesValue")}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontSize: { xs: 14, md: 17 }, mt: 1 }}
                  >
                    <strong>{tAlbum("preOrder")}:</strong>{" "}
                    <Typography
                      component="a"
                      href="https://shop.megadeth.com/collections/megadeth"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: "primary.main",
                        textDecoration: "none",
                        fontWeight: 600,
                        fontSize: "1.1rem",
                        "&:hover": {
                          color: "primary.dark",
                          textDecoration: "underline",
                        },
                      }}
                    >
                      {tAlbum("officialStore")}
                    </Typography>
                  </Typography>
                </Stack>

                {/* Tracklist Section */}
                <Box mt={3}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      fontSize: { xs: 16, md: 22 },
                    }}
                  >
                    Tracklist
                  </Typography>
                  <Stack spacing={0.5}>
                    {[
                      "TIPPING POINT",
                      "I DON'T CARE",
                      "HEY, GOD?!",
                      "LET THERE BE SHRED",
                      "PUPPET PARADE",
                      "ANOTHER BAD DAY",
                      "MADE TO KILL",
                      "OBEY THE CALL",
                      "I AM WAR",
                      "THE LAST NOTE",
                      "RIDE THE LIGHTNING (BONUS)",
                    ].map((track, idx) => (
                      <Typography
                        key={track}
                        variant="body2"
                        sx={{ fontSize: { xs: 13, md: 16 }, pl: 1 }}
                      >
                        <strong>{idx + 1}.</strong> {track}
                      </Typography>
                    ))}
                  </Stack>
                </Box>

                {/* Countdown Component */}
                <Box mt={1}>
                  <Countdown />
                </Box>
              </Stack>
            </Box>
          </Box>
        </Stack>
        <Divider sx={{ my: 6, width: "100%" }} />
        <IronMaidenTour />
        <Divider sx={{ my: 6, width: "100%" }} />

        <NewTour />

        <Divider sx={{ my: 6, width: "100%" }} />

        <Typography variant="h3" sx={{ fontSize: { xs: 22, md: 48 } }}>
          {t("newVideoTitle")}
        </Typography>
        <Box sx={{ width: "100%", maxWidth: 800, mx: "auto" }} mt={5}>
          <YouTubeEmbed videoId="ECXg-a7XZQI" title={t("latestVideo")} />
        </Box>
      </Container>
      <AlbumTeasers />
    </ContainerGradient>
  );
}
