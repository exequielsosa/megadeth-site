"use client";

import {
  Box,
  CardContent,
  Typography,
  Link as MuiLink,
  Button,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useLocale } from "next-intl";

interface ArticleCardProps {
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  imageCaption: string;
  linkUrl?: string;
  linkTarget?: "_blank" | "_self";
  priority?: boolean;
  publishedDate?: string; // ISO 8601 format (YYYY-MM-DD) o formato de fecha legible
  externalLinks?: Array<{
    url: string;
    text: string;
  }>;
}

export default function ArticleCard({
  title,
  description,
  imageUrl,
  imageAlt,
  imageCaption,
  linkUrl,
  linkTarget = "_self",
  priority = false,
  publishedDate,
  externalLinks,
}: ArticleCardProps) {
  const locale = useLocale();

  // Formatear la fecha para mostrarla de manera legible según el idioma actual
  // Evita problemas de zona horaria parseando la fecha manualmente
  const formatDate = (dateString: string) => {
    try {
      // Parsear la fecha como YYYY-MM-DD sin conversión de zona horaria
      const [year, month, day] = dateString.split("-").map(Number);
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString(locale === "es" ? "es-ES" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const TitleComponent = linkUrl ? (
    <MuiLink
      component={Link}
      href={linkUrl}
      target={linkTarget}
      sx={{
        textDecoration: "none",
        color: "inherit",
        "&:hover": {
          textDecoration: "underline",
        },
      }}
    >
      <Typography variant="h3" sx={{ fontSize: { xs: 22, md: 48 } }}>
        {title}
      </Typography>
    </MuiLink>
  ) : (
    <Typography variant="h3" sx={{ fontSize: { xs: 22, md: 48 } }}>
      {title}
    </Typography>
  );

  return (
    <>
      {TitleComponent}
      {publishedDate && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mt: 1,
            mb: 2,
            color: "text.secondary",
          }}
        >
          <CalendarTodayIcon sx={{ fontSize: { xs: 16, md: 18 } }} />
          <Typography
            variant="body2"
            sx={{
              fontSize: { xs: 12, md: 14 },
            }}
          >
            {formatDate(publishedDate)}
          </Typography>
        </Box>
      )}
      {publishedDate && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: title,
              description: description,
              datePublished: publishedDate,
              image: imageUrl,
            }),
          }}
        />
      )}
      <Box
        display={"flex"}
        flexDirection={{ xs: "column", md: "row" }}
        alignItems="flex-start"
        mt={3}
        mb={6}
        gap={4}
      >
        <Box width="100%" maxWidth={900}>
          <Typography
            variant="body1"
            sx={{ fontSize: { xs: 14, md: 18 }, whiteSpace: "pre-line" }}
            fontWeight={400}
          >
            {description}
          </Typography>

          {externalLinks && externalLinks.length > 0 && (
            <Box
              sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 1.5 }}
            >
              {externalLinks.map((link, index) => (
                <Button
                  key={index}
                  component="a"
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined"
                  endIcon={<OpenInNewIcon />}
                  sx={{
                    justifyContent: "flex-start",
                    textTransform: "none",
                    fontSize: { xs: 14, md: 16 },
                    fontWeight: 500,
                    borderColor: "primary.main",
                    color: "primary.main",
                    width: "fit-content",

                    "&:hover": {
                      borderColor: "primary.dark",
                      backgroundColor: "primary.main",
                      color: "white",
                    },
                  }}
                >
                  {link.text}
                </Button>
              ))}
            </Box>
          )}
        </Box>

        <Box
          sx={{
            width: "100%",
            maxWidth: 400,
            mx: "auto",
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: "100%",
              aspectRatio: "1 / 1",
              overflow: "hidden",
              height: { xs: 300, sm: 400 },
              maxHeight: 400,
              maxWidth: 400,
              minWidth: 200,
              borderRadius: 2,
            }}
          >
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              style={{ objectFit: "cover" }}
              priority={priority}
              sizes="(max-width: 600px) 100vw, 400px"
            />
          </Box>

          <CardContent sx={{ px: 0, pt: 0, pb: 0 }}>
            <Typography
              variant="h6"
              component="h3"
              sx={{
                textAlign: "center",
                fontWeight: 600,
                color: "text.primary",
                fontSize: { xs: "1rem", sm: "1.1rem" },
                pt: 1,
              }}
            >
              {imageCaption}
            </Typography>
          </CardContent>
        </Box>
      </Box>
    </>
  );
}
