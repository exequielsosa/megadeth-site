"use client";

import { Card, CardContent, Typography, Box, Chip } from "@mui/material";
import { NewsArticle } from "@/types/news";
import Link from "next/link";
import { useLocale } from "next-intl";
import {
  getSafeTranslation,
  formatSafeDate,
  getSafeUrl,
} from "@/utils/safeContent";
import SafeNewsImage from "./SafeNewsImage";

interface NewsCardProps {
  article: NewsArticle;
}

export default function NewsCard({ article }: NewsCardProps) {
  const locale = useLocale() as "es" | "en";

  // Obtener datos de forma segura con fallbacks
  const title = getSafeTranslation(
    article.title,
    locale,
    locale === "es" ? "Noticia sin título" : "Untitled news",
  );

  const description = getSafeTranslation(
    article.description,
    locale,
    locale === "es" ? "Descripción no disponible" : "Description unavailable",
  );

  const imageAlt = getSafeTranslation(article.imageAlt, locale, title);

  // Formatear fecha de forma segura
  const formattedDate = formatSafeDate(article.publishedDate, locale);

  const hasYouTube = !!article.youtubeVideoId;
  const imageUrl = getSafeUrl(article.imageUrl);
  const hasImage = !!imageUrl;

  return (
    <Card
      component={Link}
      href={`/noticias/${article.id}`}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        textDecoration: "none",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        },
      }}
    >
      {(hasImage || hasYouTube) && (
        <Box sx={{ position: "relative", width: "100%", height: 200 }}>
          <SafeNewsImage
            src={
              imageUrl ||
              `https://img.youtube.com/vi/${article.youtubeVideoId}/hqdefault.jpg`
            }
            alt={imageAlt}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Box>
      )}
      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <Box sx={{ mb: 1 }}>
          <Chip
            label={formattedDate}
            size="small"
            sx={{ fontSize: "0.75rem" }}
          />
          {hasYouTube && (
            <Chip
              label="Video"
              size="small"
              color="error"
              sx={{ ml: 1, fontSize: "0.75rem" }}
            />
          )}
        </Box>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontWeight: 600,
            lineHeight: 1.3,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            lineHeight: 1.5,
            minHeight: "4.5em", // 3 líneas * 1.5 line-height
          }}
        >
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}
