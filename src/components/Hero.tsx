"use client";

import { Box, Container, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import ContainerGradient from "../components/atoms/ContainerGradient";
import Countdown from "./Countdown";
import YouTubeEmbed from "./YouTubeEmbed";
import Image from "next/image";
import Divider from "@mui/material/Divider";
// import AlbumTeasers from "./AlbumTeasers";
import NewTour from "./NewTour";
import IronMaidenTour from "./IronMaidenTour";
import LatamTour from "./LatamTour";
import Ride from "./Ride";
import NewSingle from "./NewSingle";
import Space from "./Space";
import ArticleCard from "./ArticleCard";

export default function Hero() {
  const t = useTranslations("hero");
  const tAlbum = useTranslations("album");
  const tVic = useTranslations("vicSays");
  const tCanada = useTranslations("canadaTour");
  const tEvent = useTranslations("exclusiveEvent");
  const tCinema = useTranslations("cinemaEvent");
  const tArgentina = useTranslations("argentinaShow");
  const tBTM = useTranslations("behindTheMaskArg");
  const tTickets = useTranslations("argentinaTickets");
  const tTeaser = useTranslations("behindTheMaskTeaser");
  const tLTBS = useTranslations("letThereBeShred");

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

        <ArticleCard
          title={tLTBS("title")}
          description={tLTBS("description")}
          imageUrl="/images/ltbs.jpg"
          imageAlt={tLTBS("imageAlt")}
          imageCaption={tLTBS("imageCaption")}
        />

        <Divider sx={{ my: 6, width: "100%" }} />

        <Typography variant="h3" sx={{ fontSize: { xs: 22, md: 48 } }}>
          {tTeaser("title")}
        </Typography>
        <Box sx={{ width: "100%", maxWidth: 800, mx: "auto" }} mt={5}>
          <YouTubeEmbed videoId="qntDbiz75iI" title={tTeaser("videoTitle")} />
        </Box>

        <Divider sx={{ my: 6, width: "100%" }} />

        <ArticleCard
          title={tTickets("title")}
          description={tTickets("description")}
          imageUrl="/images/campo.jpg"
          imageAlt={tTickets("imageAlt")}
          imageCaption={tTickets("imageCaption")}
          externalLinks={[
            {
              text: tTickets("links.0.text"),
              url: tTickets("links.0.url"),
            },
          ]}
        />

        <Divider sx={{ my: 6, width: "100%" }} />

        <ArticleCard
          title={tBTM("title")}
          description={tBTM("description")}
          imageUrl="/images/btm.jpg"
          imageAlt={tBTM("imageAlt")}
          imageCaption={tBTM("imageCaption")}
          externalLinks={[
            {
              text: tBTM("links.0.text"),
              url: tBTM("links.0.url"),
            },
            {
              text: tBTM("links.1.text"),
              url: tBTM("links.1.url"),
            },
          ]}
        />

        <Divider sx={{ my: 6, width: "100%" }} />

        <ArticleCard
          title={tArgentina("title")}
          description={tArgentina("description")}
          imageUrl="/images/megarg.jpg"
          imageAlt={tArgentina("imageAlt")}
          imageCaption={tArgentina("imageCaption")}
        />

        <Divider sx={{ my: 6, width: "100%" }} />

        <ArticleCard
          title={tCinema("title")}
          description={tCinema("description")}
          imageUrl="/images/megadethcine.webp"
          imageAlt={tCinema("imageAlt")}
          imageCaption={tCinema("imageCaption")}
        />

        <Divider sx={{ my: 6, width: "100%" }} />

        <ArticleCard
          title={tEvent("title")}
          description={tEvent("description")}
          imageUrl="/images/hear.png"
          imageAlt={tEvent("imageAlt")}
          imageCaption={tEvent("imageCaption")}
          linkUrl="https://www.megadeth.com/pages/let-there-be-shred"
        />

        <Divider sx={{ my: 6, width: "100%" }} />

        <ArticleCard
          title={tCanada("title")}
          description={tCanada("description")}
          imageUrl="/images/canada.jpg"
          imageAlt={tCanada("imageAlt")}
          imageCaption={tCanada("imageCaption")}
          linkUrl="/tour"
        />

        <Divider sx={{ my: 6, width: "100%" }} />

        <ArticleCard
          title={tVic("title")}
          description={tVic("description")}
          imageUrl="/images/vicsays.jpg"
          imageAlt={tVic("imageAlt")}
          imageCaption={tVic("imageCaption")}
        />

        <Divider sx={{ my: 6, width: "100%" }} />
        <Space />
        <Divider sx={{ my: 6, width: "100%" }} />
        <Typography variant="h3" sx={{ fontSize: { xs: 22, md: 48 }, mb: 2 }}>
          {t("countdownTitle")}
        </Typography>

        <Typography variant="h3" sx={{ fontSize: { xs: 14, md: 16 } }}>
          {t("countdownDescription")}
        </Typography>
        <Box sx={{ width: "100%", maxWidth: 800, mx: "auto" }} mt={5}>
          <YouTubeEmbed videoId="-E4O5VlRYOY" title={t("videoTitle")} />
        </Box>
        <Divider sx={{ my: 6, width: "100%" }} />
        <NewSingle />

        <Divider sx={{ my: 6, width: "100%" }} />
        <LatamTour />
        <Divider sx={{ my: 6, width: "100%" }} />

        <Ride />
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
      {/* <AlbumTeasers /> */}
    </ContainerGradient>
  );
}
