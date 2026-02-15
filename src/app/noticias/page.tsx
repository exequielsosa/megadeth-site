"use client";

import { Container, Typography, Box, Tabs, Tab, Grid } from "@mui/material";
import { useTranslations, useLocale } from "next-intl";
import { NewsArticle } from "@/types/news";
import Breadcrumb from "@/components/Breadcrumb";
import { useState, useMemo, useEffect } from "react";
import ContainerGradientNoPadding from "@/components/atoms/ContainerGradientNoPadding";
import NewsCard from "@/components/NewsCard";
import RandomSectionBanner from "@/components/NewsBanner";
import { getAllNews } from "@/lib/supabase";
import { getSafeTranslation } from "@/utils/safeContent";
import VicLoader from "@/components/VicLoader";

export default function NoticiasPage() {
  const t = useTranslations("news");
  const tb = useTranslations("breadcrumb");
  const locale = useLocale() as "es" | "en";

  const [newsData, setNewsData] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar noticias desde Supabase
  useEffect(() => {
    async function loadNews() {
      try {
        const data = await getAllNews();
        setNewsData(data);
      } catch (error) {
        console.error("Error loading news:", error);
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, []);

  // Ordenar noticias por fecha más reciente primero
  const sortedNews = useMemo(
    () =>
      ([...newsData] as NewsArticle[]).sort(
        (a, b) =>
          new Date(b.publishedDate).getTime() -
          new Date(a.publishedDate).getTime(),
      ),
    [newsData],
  );

  // Agrupar noticias por mes/año
  const groupedByMonth = useMemo(() => {
    const groups = new Map<string, NewsArticle[]>();
    sortedNews.forEach((article) => {
      const date = new Date(article.publishedDate);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0",
      )}`;
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(article);
    });
    return Array.from(groups.entries()).map(([key, articles]) => ({
      key,
      articles,
    }));
  }, [sortedNews]);

  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  // Formatear nombre del mes
  const getMonthLabel = (key: string) => {
    const [year, month] = key.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString(locale === "es" ? "es-ES" : "en-US", {
      year: "numeric",
      month: "long",
    });
  };

  // JSON-LD para SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t("title"),
    description: t("description"),
    url: `https://megadeth.com.ar/${locale}/noticias`,
    inLanguage: locale,
    publisher: {
      "@type": "Organization",
      name: "Megadeth Argentina",
      logo: {
        "@type": "ImageObject",
        url: "https://megadeth.com.ar/logo-megadeth.png",
      },
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: sortedNews.slice(0, 10).map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "NewsArticle",
          headline: getSafeTranslation(
            article.title,
            locale,
            locale === "es" ? "Noticia sin título" : "Untitled news"
          ),
          description: getSafeTranslation(
            article.description,
            locale,
            locale === "es" ? "Descripción no disponible" : "Description unavailable"
          ).substring(0, 200),
          datePublished: article.publishedDate,
          url: `https://megadeth.com.ar/${locale}/noticias/${article.id}`,
          image: article.imageUrl
            ? `https://megadeth.com.ar${article.imageUrl}`
            : article.youtubeVideoId
              ? `https://img.youtube.com/vi/${article.youtubeVideoId}/hqdefault.jpg`
              : "https://megadeth.com.ar/logo-megadeth.png",
        },
      })),
    },
  };

  const currentMonthArticles = groupedByMonth[selectedTab]?.articles || [];

  if (loading) {
    return (
      <ContainerGradientNoPadding>
        <Container maxWidth={false} sx={{ maxWidth: 1440, mx: "auto", py: 4 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "50vh",
            }}
          >
            <VicLoader size={200} />
            <Typography variant="body1" sx={{ mt: 3, color: "text.secondary" }}>
              {locale === "es" ? "Cargando noticias..." : "Loading news..."}
            </Typography>
          </Box>
        </Container>
      </ContainerGradientNoPadding>
    );
  }

  // Si no hay noticias en absoluto
  if (newsData.length === 0) {
    return (
      <>
        <ContainerGradientNoPadding>
          <Box pt={{ xs: 2, md: 4 }} px={{ xs: 2, md: 0 }} pb={{ xs: 0, md: 0 }}>
            <Breadcrumb items={[{ label: tb("news") }]} />
          </Box>
          <Container maxWidth={false} sx={{ maxWidth: 1440, mx: "auto", py: 4 }}>
            <Typography
              variant="h1"
              sx={{ fontSize: { xs: 32, md: 56 }, mb: 2, fontWeight: 700 }}
            >
              {t("title")}
            </Typography>

            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: 16, md: 18 },
                mb: 4,
                color: "text.secondary",
              }}
            >
              {t("description")}
            </Typography>

            <Box
              sx={{
                textAlign: "center",
                py: 8,
                px: 2,
                backgroundColor: "action.hover",
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" gutterBottom>
                {locale === "es"
                  ? "No hay noticias disponibles"
                  : "No news available"}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {locale === "es"
                  ? "Vuelve pronto para ver las últimas novedades sobre Megadeth."
                  : "Check back soon for the latest Megadeth news."}
              </Typography>
            </Box>

            <Box mt={4}>
              <RandomSectionBanner currentSection="news" />
            </Box>
          </Container>
        </ContainerGradientNoPadding>
      </>
    );
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContainerGradientNoPadding>
        <Box pt={{ xs: 2, md: 4 }} px={{ xs: 2, md: 0 }} pb={{ xs: 0, md: 0 }}>
          <Breadcrumb items={[{ label: tb("news") }]} />
        </Box>
        <Container maxWidth={false} sx={{ maxWidth: 1440, mx: "auto", py: 4 }}>
          <Typography
            variant="h1"
            sx={{ fontSize: { xs: 32, md: 56 }, mb: 2, fontWeight: 700 }}
          >
            {t("title")}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: 16, md: 18 },
              mb: 4,
              color: "text.secondary",
            }}
          >
            {t("description")}
          </Typography>

          {/* Tabs de meses */}
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}>
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
            >
              {groupedByMonth.map((group) => (
                <Tab
                  key={group.key}
                  label={`${getMonthLabel(group.key)} (${
                    group.articles.length
                  })`}
                />
              ))}
            </Tabs>
          </Box>

          {/* Grid de noticias del mes seleccionado */}
          <Grid container spacing={3}>
            {currentMonthArticles.map((article) => (
              <Grid key={article.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <NewsCard article={article} />
              </Grid>
            ))}
          </Grid>

          {currentMonthArticles.length === 0 && (
            <Typography variant="body1" sx={{ textAlign: "center", py: 8 }}>
              {locale === "es"
                ? "No hay noticias para este mes"
                : "No news for this month"}
            </Typography>
          )}
          <Box mt={4}>
            <RandomSectionBanner currentSection="news" />
          </Box>
        </Container>
      </ContainerGradientNoPadding>
    </>
  );
}
