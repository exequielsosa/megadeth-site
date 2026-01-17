"use client";

import {
  Container,
  Typography,
  Box,
  Chip,
  Divider,
  Paper,
} from "@mui/material";
import { Review } from "@/types/review";
import Image from "next/image";
import StarIcon from "@mui/icons-material/Star";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import Breadcrumb from "./Breadcrumb";
import { useTranslations } from "next-intl";
import ContainerGradientNoPadding from "./atoms/ContainerGradientNoPadding";

interface ReviewDetailPageProps {
  review: Review;
  locale: string;
}

export default function ReviewDetailPage({
  review,
  locale,
}: ReviewDetailPageProps) {
  const t = useTranslations("reviews");
  const localeKey = locale as "es" | "en";

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === "es" ? "es-AR" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      album: { es: "Álbum", en: "Album" },
      concert: { es: "Concierto", en: "Concert" },
      documentary: { es: "Documental", en: "Documentary" },
      other: { es: "Otro", en: "Other" },
    };
    return labels[category as keyof typeof labels]?.[localeKey] || category;
  };

  // JSON-LD para SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "MusicAlbum",
      name: review.title[localeKey],
      byArtist: {
        "@type": "MusicGroup",
        name: "Megadeth",
      },
      image: `https://megadeth.com.ar${review.imageUrl}`,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: review.rating,
      bestRating: 10,
      worstRating: 1,
    },
    author: {
      "@type": "Organization",
      name: review.author?.[localeKey] || "Megadeth Argentina",
      url: "https://megadeth.com.ar",
    },
    publisher: {
      "@type": "Organization",
      name: "Megadeth Argentina",
      url: "https://megadeth.com.ar",
      logo: {
        "@type": "ImageObject",
        url: "https://megadeth.com.ar/logo-megadeth.png",
      },
    },
    datePublished: review.publishedDate,
    dateModified: review.publishedDate,
    reviewBody: review.content[localeKey],
    inLanguage: locale,
    url: `https://megadeth.com.ar/discography/reviews/${review.id}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://megadeth.com.ar/discography/reviews/${review.id}`,
    },
    about: {
      "@type": "MusicGroup",
      name: "Megadeth",
    },
  };

  // Función para procesar el contenido
  const processContent = (text: string) => {
    const paragraphs = text.split("\n\n");

    return paragraphs.map((paragraph, pIndex) => {
      // Detectar subtítulos
      if (paragraph.startsWith("###")) {
        const title = paragraph.replace("###", "").trim();
        return (
          <Typography
            key={`subtitle-${pIndex}`}
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 700,
              mt: 4,
              mb: 2,
              color: "primary.main",
            }}
          >
            {title}
          </Typography>
        );
      }

      // Procesar negritas
      const parts = paragraph.split(/(\*\*.*?\*\*)/g);

      return (
        <Typography
          key={`p-${pIndex}`}
          variant="body1"
          sx={{
            mb: 2.5,
            lineHeight: 1.8,
            fontSize: { xs: "0.95rem", md: "1.05rem" },
          }}
        >
          {parts.map((part, partIndex) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              const boldText = part.slice(2, -2);
              return (
                <Box
                  key={`bold-${pIndex}-${partIndex}`}
                  component="strong"
                  sx={{ fontWeight: 700, color: "primary.main" }}
                >
                  {boldText}
                </Box>
              );
            }
            return part;
          })}
        </Typography>
      );
    });
  };

  return (
    <ContainerGradientNoPadding>
      {/* JSON-LD para SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Box pt={4}>
        <Breadcrumb
          items={[
            { label: t("breadcrumb.discography"), href: `/discography` },
            { label: t("breadcrumb.reviews"), href: `/discography/reviews` },
            { label: review.title[localeKey] },
          ]}
        />
      </Box>

      <Container
        maxWidth={false}
        sx={{ maxWidth: 1440, mx: "auto", pt: 2, pb: 4 }}
      >
        {/* Header con imagen */}
        <Paper
          elevation={0}
          sx={{ mt: 3, mb: 4, overflow: "hidden", borderRadius: 2 }}
        >
          <Box sx={{ position: "relative", height: { xs: 250, md: 400 } }}>
            <Image
              src={review.imageUrl}
              alt={review.imageAlt[localeKey]}
              fill
              style={{ objectFit: "cover" }}
              priority
            />
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)",
                p: 3,
              }}
            >
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  color: "white",
                  fontWeight: 800,
                  fontSize: { xs: "1.75rem", md: "2.5rem" },
                  textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                }}
              >
                {review.title[localeKey]}
              </Typography>
              {review.subtitle && (
                <Typography
                  variant="h6"
                  sx={{
                    color: "white",
                    mt: 1,
                    textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
                  }}
                >
                  {review.subtitle[localeKey]}
                </Typography>
              )}
            </Box>
          </Box>
        </Paper>

        {/* Meta información */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            mb: 4,
            alignItems: "center",
          }}
        >
          <Chip
            label={getCategoryLabel(review.category)}
            color="primary"
            sx={{ fontWeight: 600 }}
          />
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <StarIcon sx={{ fontSize: 20, color: "warning.main" }} />
            <Typography variant="h6" fontWeight="bold">
              {review.rating}/10
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CalendarTodayIcon sx={{ fontSize: 16, opacity: 0.7 }} />
            <Typography variant="body2" color="text.secondary">
              {formatDate(review.publishedDate)}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Contenido */}
        <Box sx={{ maxWidth: 1440, mx: "auto" }}>
          {processContent(review.content[localeKey])}
        </Box>
      </Container>
    </ContainerGradientNoPadding>
  );
}
