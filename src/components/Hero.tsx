"use client";

import { Box, Container, Stack, Typography, Button } from "@mui/material";
import { useTranslations, useLocale } from "next-intl";
import ContainerGradient from "../components/atoms/ContainerGradient";
import Countdown from "./Countdown";
import Image from "next/image";
import Divider from "@mui/material/Divider";
import ArticleCard from "./ArticleCard";
import QuickAccessGrid from "./QuickAccessGrid";
import TopSongsWidget from "./TopSongsWidget";
import UpcomingToursWidget from "./UpcomingToursWidget";
import newsData from "@/constants/news.json";
import { NewsArticle } from "@/types/news";
import Link from "next/link";
import RandomSectionBanner from "./NewsBanner";
import SiteUpdatesBanner from "./SiteUpdatesBanner";
import siteUpdatesData from "@/constants/site-updates.json";
import LastShowsCards from "./LastShowsCards";
import FeaturedReviewBanner from "./FeaturedReviewBanner";

export default function Hero() {
  const t = useTranslations("hero");
  const tAlbum = useTranslations("album");
  const tNews = useTranslations("news");
  const tIntro = useTranslations("heroIntro");
  const locale = useLocale() as "es" | "en";

  // Obtener las últimas 3 noticias ordenadas por fecha
  const latestNews = ([...newsData] as NewsArticle[])
    .sort(
      (a, b) =>
        new Date(b.publishedDate).getTime() -
        new Date(a.publishedDate).getTime()
    )
    .slice(0, 5);

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

          {/* Intro SEO */}
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: 14, md: 18 },
              color: "text.secondary",
              maxWidth: 1200,
              lineHeight: 1.7,
            }}
          >
            {tIntro("description")}
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

        <FeaturedReviewBanner />

        {/* Quick Access Grid */}
        <QuickAccessGrid />

        {/* Upcoming Tours & Top Songs - Side by Side */}
        <Box
          sx={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
            gap: 3,
            mt: 6,
            mb: 4,
            alignItems: "stretch",
          }}
        >
          <UpcomingToursWidget limit={8} />
          <TopSongsWidget />
        </Box>

        {/* Banner de actualizaciones del sitio */}
        {siteUpdatesData.length > 0 && (
          <Box sx={{ width: "100%", mb: 4 }}>
            <SiteUpdatesBanner updates={siteUpdatesData} />
          </Box>
        )}

        {/* Cards de últimos shows */}
        <Box sx={{ width: "100%" }} pt={3}>
          <LastShowsCards />
        </Box>
        <Divider sx={{ mt: 8, mb: 4, width: "100%" }} />

        {/* Sección de últimas noticias */}
        <Typography
          variant="h2"
          sx={{ fontSize: { xs: 28, md: 48 }, mb: 4, mt: 4 }}
        >
          {tNews("latestNews")}
        </Typography>

        {latestNews.map((article: NewsArticle) => (
          <Box key={article.id}>
            <ArticleCard
              title={article.title[locale]}
              description={article.description[locale]}
              imageUrl={article.imageUrl}
              imageAlt={article.imageAlt?.[locale]}
              imageCaption={article.imageCaption?.[locale]}
              publishedDate={article.publishedDate}
              linkUrl={article.linkUrl}
              linkTarget={article.linkTarget}
              youtubeVideoId={article.youtubeVideoId}
              externalLinks={article.externalLinks?.map((link) => ({
                url: link.url,
                text: link.text[locale],
              }))}
            />
            <Divider sx={{ my: 6, width: "100%" }} />
          </Box>
        ))}

        {/* Botón para ver todas las noticias */}
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <Button
            component={Link}
            href="/noticias"
            variant="contained"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              fontSize: { xs: 16, md: 18 },
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            {tNews("viewAllNews")}
          </Button>
        </Box>
        <RandomSectionBanner currentSection="news" />
      </Container>
    </ContainerGradient>
  );
}
