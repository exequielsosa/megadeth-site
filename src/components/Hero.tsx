"use client";

import { Box, Container, Stack, Typography, Button } from "@mui/material";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import ContainerGradient from "../components/atoms/ContainerGradient";
import Divider from "@mui/material/Divider";
import ArticleCard from "./ArticleCard";
import QuickAccessGrid from "./QuickAccessGrid";
import TopSongsWidget from "./TopSongsWidget";
import UpcomingToursWidget from "./UpcomingToursWidget";
import { NewsArticle } from "@/types/news";
import Link from "next/link";
import RandomSectionBanner from "./NewsBanner";
import SiteUpdatesBanner from "./SiteUpdatesBanner";
import siteUpdatesData from "@/constants/site-updates.json";
import LastShowsCards from "./LastShowsCards";
import FeaturedReviewBanner from "./FeaturedReviewBanner";
import HeroTabs from "./HeroTabs";

export default function Hero({ latestNews }: { latestNews: NewsArticle[] }) {
  const t = useTranslations("hero");
  const tAlbum = useTranslations("album");
  const tNews = useTranslations("news");
  const locale = useLocale() as "es" | "en";

  return (
    <ContainerGradient>
      <Container
        maxWidth={false}
        sx={{ maxWidth: 1440, mx: "auto", px: { xs: 2, sm: 3 } }}
      >
        <HeroTabs />

        {/* Sección Álbum Final - Elemento Secundario */}
        <Box sx={{ mt: 8, mb: 6 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "250px 1fr 1fr" },
              gap: 4,
              alignItems: "start",
            }}
          >
            {/* Imagen del álbum - más pequeña */}
            <Box
              sx={{
                position: "relative",
                width: { xs: "200px", md: "250px" },
                height: { xs: "200px", md: "250px" },
                mx: { xs: "auto", md: 0 },
                borderRadius: 1,
                overflow: "hidden",
                transition: "border-radius 0.3s ease",
                "&:hover": {
                  borderRadius: 2,
                },
              }}
            >
              <Link
                href="/discography/megadeth"
                passHref
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Image
                  src="/images/megadeth-megadeth.jpg"
                  alt="Megadeth"
                  fill
                  style={{ objectFit: "cover" }}
                  priority={false}
                />
              </Link>
            </Box>

            {/* Contenido del álbum - info */}
            <Stack spacing={2}>
              <Typography
                variant="h5"
                sx={{
                  fontSize: { xs: 18, md: 24 },
                  fontWeight: 700,
                  color: "primary.main",
                }}
              >
                {tAlbum("finalAlbumTitle")}
              </Typography>

              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                <strong>{tAlbum("albumName")}:</strong> &quot;
                {tAlbum("albumName")}&quot;
              </Typography>

              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                <strong>{tAlbum("firstSingle")}:</strong> &quot;
                {tAlbum("firstSingleValue")}&quot;
              </Typography>

              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                <strong>{tAlbum("producedBy")}:</strong>{" "}
                {tAlbum("producedByValue")}
              </Typography>

              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                <strong>{tAlbum("finalLineup")}:</strong>{" "}
                {tAlbum("finalLineupValue")}
              </Typography>

              <Box sx={{ pt: 1 }}>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
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
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    {tAlbum("officialStore")}
                  </Typography>
                </Typography>
              </Box>
            </Stack>

            {/* Tracklist - Columna Derecha */}
            <Box>
              <Typography
                variant="body2"
                sx={{
                  fontSize: { xs: 12, md: 13 },
                  fontWeight: 700,
                  color: "primary.main",
                  mb: 1.5,
                }}
              >
                {tAlbum("tracklist")}
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 1,
                }}
              >
                {[
                  {
                    number: 1,
                    title: "Tipping Point",
                    slug: "tipping-point",
                  },
                  { number: 2, title: "I Don't Care", slug: "i-dont-care" },
                  { number: 3, title: "Hey, God?!", slug: "hey-god" },
                  {
                    number: 4,
                    title: "Let There Be Shred",
                    slug: "let-there-be-shred",
                  },
                  {
                    number: 5,
                    title: "Puppet Parade",
                    slug: "puppet-parade",
                  },
                  {
                    number: 6,
                    title: "Another Bad Day",
                    slug: "another-bad-day",
                  },
                  { number: 7, title: "Made to Kill", slug: "made-to-kill" },
                  {
                    number: 8,
                    title: "Obey the Call",
                    slug: "obey-the-call",
                  },
                  { number: 9, title: "I Am War", slug: "i-am-war" },
                  {
                    number: 10,
                    title: "The Last Note",
                    slug: "the-last-note",
                  },
                  {
                    number: 11,
                    title: "Ride the Lightning",
                    slug: "ride-the-lightning",
                  },
                  { number: 12, title: "Bloodlust", slug: "bloodlust" },
                  {
                    number: 13,
                    title: "Nobody's Hero",
                    slug: "nobodys-hero",
                  },
                ].map((song) => (
                  <Link
                    key={song.slug}
                    href={`/songs/${song.slug}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        fontSize: { xs: 11, md: 12 },
                        transition: "color 0.2s ease",
                        display: "block",
                        "&:hover": {
                          color: "primary.main",
                        },
                      }}
                    >
                      {song.number}. {song.title}
                    </Typography>
                  </Link>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Banner de concierto en Argentina */}
        {/* <Box mt={4}>
          <ArgentinaConcertBanner />
        </Box> */}

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

        {/* Sección de últimas noticias - Solo mostrar si hay noticias */}
        {latestNews.length > 0 && (
          <>
            <Divider sx={{ mt: 8, mb: 4, width: "100%" }} />

            <Typography
              variant="h2"
              sx={{ fontSize: { xs: 28, md: 48 }, mb: 4, mt: 4 }}
            >
              {tNews("latestNews")}
            </Typography>

            {latestNews.map((article: NewsArticle) => (
              <Box key={article.id}>
                <ArticleCard
                  title={
                    article.title?.[locale] ||
                    (locale === "es" ? "Noticia sin título" : "Untitled news")
                  }
                  description={article.description?.[locale] || ""}
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
          </>
        )}
      </Container>
    </ContainerGradient>
  );
}
