"use client";

import { Box, Container, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import ContainerGradient from "../components/atoms/ContainerGradient";
import Countdown from "./Countdown";
import YouTubeEmbed from "./YouTubeEmbed";
import Image from "next/image";
import Divider from "@mui/material/Divider";

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
          <Typography variant="h1" sx={{ fontSize: { xs: 36, md: 56 } }}>
            {t("title")}
          </Typography>

          <Box
            width="100%"
            gap={4}
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
          >
            <Image
              src="/images/megadeth-megadeth.jpg"
              alt="Megadeth"
              width={600}
              height={600}
            />
            <Box>
              <Stack spacing={2} sx={{ mt: 3 }}>
                <Typography
                  variant="h4"
                  color="primary"
                  sx={{ fontWeight: 700, mb: 1 }}
                >
                  {tAlbum("finalAlbumTitle")}
                </Typography>

                <Typography
                  variant="h5"
                  sx={{ fontWeight: 600, color: "text.primary" }}
                >
                  {tAlbum("albumName")}: &quot;{tAlbum("albumName")}&quot;
                </Typography>

                <Stack spacing={1.5}>
                  <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                    <strong>{tAlbum("releaseDate")}:</strong>{" "}
                    {tAlbum("releaseDateValue")}
                  </Typography>

                  <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                    <strong>{tAlbum("firstSingle")}:</strong> &quot;
                    {tAlbum("firstSingleValue")}&quot;
                  </Typography>

                  <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                    <strong>{tAlbum("producedBy")}:</strong>{" "}
                    {tAlbum("producedByValue")}
                  </Typography>

                  <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                    <strong>{tAlbum("finalLineup")}:</strong>{" "}
                    {tAlbum("finalLineupValue")}
                  </Typography>

                  <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                    <strong>{tAlbum("includes")}:</strong>{" "}
                    {tAlbum("includesValue")}
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: "1.1rem",
                      mt: 1,
                    }}
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

                {/* Countdown Component */}
                <Box mt={1}>
                  <Countdown />
                </Box>
              </Stack>
            </Box>
          </Box>
        </Stack>
        <Divider sx={{ my: 6, width: "100%" }} />
        {/* YouTube Video */}

        <Typography variant="h3" sx={{ fontSize: { xs: 28, md: 48 } }}>
          {t("newVideoTitle")}
        </Typography>
        <Box sx={{ width: "100%", maxWidth: 800, mx: "auto" }} mt={5}>
          <YouTubeEmbed videoId="ECXg-a7XZQI" title={t("latestVideo")} />
        </Box>
      </Container>
    </ContainerGradient>
  );
}
