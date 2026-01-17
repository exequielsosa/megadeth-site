"use client";

import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  Typography,
  Chip,
} from "@mui/material";
import { useLocale } from "next-intl";
import { FeaturedArticle as FeaturedArticleType } from "@/types/featured-article";
import articleData from "@/constants/featured-article.json";
import StarIcon from "@mui/icons-material/Star";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

export default function FeaturedArticle() {
  const locale = useLocale() as "es" | "en";
  const article = articleData as FeaturedArticleType;

  // No mostrar si no está activo
  if (!article.isActive) {
    return null;
  }

  // Función para procesar el contenido: negritas y saltos de línea
  const processContent = (text: string) => {
    // Dividir por párrafos (doble salto de línea)
    const paragraphs = text.split("\n\n");

    return paragraphs.map((paragraph, pIndex) => {
      // Detectar si es un subtítulo (comienza con ###)
      if (paragraph.startsWith("###")) {
        const title = paragraph.replace("###", "").trim();
        return (
          <Typography
            key={`subtitle-${pIndex}`}
            variant="h6"
            component="h3"
            sx={{
              fontWeight: 700,
              mt: 3,
              mb: 1.5,
              color: "primary.main",
            }}
          >
            {title}
          </Typography>
        );
      }

      // Procesar negritas dentro del párrafo
      const parts = paragraph.split(/(\*\*.*?\*\*)/g);

      return (
        <Typography
          key={`p-${pIndex}`}
          variant="body1"
          sx={{
            mb: 2,
            lineHeight: 1.8,
            color: "text.primary",
          }}
        >
          {parts.map((part, partIndex) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              // Es texto en negrita
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

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === "es" ? "es-AR" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Card
        elevation={6}
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 3,
          border: "2px solid",
          borderColor: "primary.main",
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "linear-gradient(145deg, rgba(30,30,30,0.95) 0%, rgba(20,20,20,0.98) 100%)"
              : "linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(245,245,245,1) 100%)",
        }}
      >
        {/* Badge destacado */}
        <Chip
          icon={<StarIcon />}
          label={locale === "es" ? "Artículo Destacado" : "Featured Article"}
          color="primary"
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 10,
            fontWeight: 700,
            fontSize: "0.875rem",
            boxShadow: 3,
          }}
        />

        {/* Imagen */}
        <CardMedia
          component="img"
          height="300"
          image={article.imageUrl}
          alt={article.imageAlt[locale]}
          sx={{
            objectFit: "cover",
            filter: "brightness(0.85)",
          }}
        />

        {/* Contenido con scroll */}
        <CardContent
          sx={{
            maxHeight: "600px",
            overflowY: "auto",
            p: { xs: 2, md: 4 },
            // Estilos del scrollbar
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: (theme) =>
                theme.palette.mode === "dark" ? "#2a2a2a" : "#f1f1f1",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: (theme) => theme.palette.primary.main,
              borderRadius: "10px",
              "&:hover": {
                background: (theme) => theme.palette.primary.dark,
              },
            },
          }}
        >
          {/* Título */}
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 800,
              mb: 2,
              fontSize: { xs: "1.75rem", md: "2.5rem" },
              color: "primary.main",
            }}
          >
            {article.title[locale]}
          </Typography>

          {/* Fecha */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <CalendarTodayIcon sx={{ mr: 1, fontSize: "1rem", opacity: 0.7 }} />
            <Typography variant="body2" color="text.secondary">
              {formatDate(article.publishedDate)}
            </Typography>
          </Box>

          {/* Contenido procesado */}
          <Box sx={{ mt: 3 }}>{processContent(article.content[locale])}</Box>
        </CardContent>
      </Card>
    </Container>
  );
}
