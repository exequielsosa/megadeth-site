"use client";

import { Container, Typography, Box, Button } from "@mui/material";
import { useTranslations, useLocale } from "next-intl";
import ArticleCard from "@/components/ArticleCard";
import newsData from "@/constants/news.json";
import { NewsArticle } from "@/types/news";
import ContainerGradient from "../../components/atoms/ContainerGradient";
import { useState } from "react";

const ITEMS_PER_PAGE = 10;

export default function NoticiasPage() {
  const t = useTranslations("news");
  const locale = useLocale() as "es" | "en";
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);

  // Ordenar noticias por fecha más reciente primero
  const sortedNews = ([...newsData] as NewsArticle[]).sort(
    (a, b) =>
      new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
  );

  const hasMore = displayCount < sortedNews.length;
  const displayedNews = sortedNews.slice(0, displayCount);

  const loadMore = () => {
    setDisplayCount((prev) =>
      Math.min(prev + ITEMS_PER_PAGE, sortedNews.length)
    );
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
          headline: article.title[locale],
          description: article.description[locale].substring(0, 200),
          datePublished: article.publishedDate,
          url: article.linkUrl
            ? `https://megadeth.com.ar${article.linkUrl}`
            : `https://megadeth.com.ar/${locale}/noticias#${article.id}`,
          image: article.imageUrl
            ? `https://megadeth.com.ar${article.imageUrl}`
            : "https://megadeth.com.ar/logo-megadeth.png",
        },
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContainerGradient>
        <Container maxWidth={false} sx={{ maxWidth: 1440, mx: "auto" }}>
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
              mb: 6,
              color: "text.secondary",
            }}
          >
            {t("description")}
          </Typography>

          <Box>
            {displayedNews.map((article: NewsArticle) => (
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
                <Box sx={{ my: 6, borderBottom: 1, borderColor: "divider" }} />
              </Box>
            ))}
          </Box>

          {hasMore && (
            <Box
              sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 6 }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={loadMore}
                sx={{
                  px: 6,
                  py: 1.5,
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                {locale === "es" ? "Cargar más noticias" : "Load more news"}
              </Button>
            </Box>
          )}
        </Container>
      </ContainerGradient>
    </>
  );
}
