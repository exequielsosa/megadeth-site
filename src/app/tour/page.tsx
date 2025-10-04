import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { getLocale } from "next-intl/server";
import type { Metadata } from "next";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Grid,
  Button,
  CardActions,
} from "@mui/material";
import ContainerGradient from "@/components/atoms/ContainerGradient";
import { tourDates } from "@/constants/tourDates";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  const keywordsByLocale = {
    es: [
      "Megadeth tour",
      "conciertos Megadeth",
      "entradas Megadeth",
      "gira 2025",
      "Dave Mustaine concierto",
      "tour fechas",
      "metal en vivo",
      "thrash metal tour",
    ],
    en: [
      "Megadeth tour",
      "Megadeth concerts",
      "Megadeth tickets",
      "tour 2025",
      "Dave Mustaine concert",
      "tour dates",
      "live metal",
      "thrash metal tour",
    ],
  };

  const titleByLocale = {
    es: "Megadeth Tour 2025 - Fechas y Entradas",
    en: "Megadeth Tour 2025 - Dates and Tickets",
  };

  const descriptionByLocale = {
    es: "Fechas oficiales del tour de Megadeth 2025. Encuentra entradas para los conciertos en Europa y América.",
    en: "Official Megadeth 2025 tour dates. Find tickets for concerts in Europe and America.",
  };

  return {
    title:
      titleByLocale[locale as keyof typeof titleByLocale] || titleByLocale.es,
    description:
      descriptionByLocale[locale as keyof typeof descriptionByLocale] ||
      descriptionByLocale.es,
    keywords:
      keywordsByLocale[locale as keyof typeof keywordsByLocale] ||
      keywordsByLocale.es,
    authors: [{ name: "Exequiel Sosa" }],
    openGraph: {
      title:
        titleByLocale[locale as keyof typeof titleByLocale] || titleByLocale.es,
      description:
        descriptionByLocale[locale as keyof typeof descriptionByLocale] ||
        descriptionByLocale.es,
      siteName: "Megadeth Fan",
      type: "website",
      locale: locale === "es" ? "es_AR" : "en_US",
      images: [
        {
          url: "/images/megadeth-megadeth.jpg",
          width: 1200,
          height: 630,
          alt: "Megadeth Tour 2025",
        },
      ],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default function TourPage() {
  const t = useTranslations("tour");
  const locale = useLocale();

  return (
    <ContainerGradient>
      <Container maxWidth={false} sx={{ maxWidth: 1440, mx: "auto" }}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography variant="h1" component="h1" gutterBottom>
            {t("title")}
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
            {t("subtitle")}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {tourDates.map((show, index) => (
            <Grid key={index} size={{ xs: 12, md: 6, lg: 4 }}>
              <Card
                sx={{
                  height: "100%",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    component="h3"
                    gutterBottom
                    color="primary"
                  >
                    {new Date(show.date).toLocaleDateString(
                      locale === "es" ? "es-ES" : "en-US",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </Typography>
                  <Typography variant="h5" gutterBottom>
                    {show.city}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    gutterBottom
                  >
                    {show.venue}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {show.country}
                  </Typography>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    href={show.ticketLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      textTransform: "uppercase",
                      fontWeight: 600,
                      py: 1.5,
                    }}
                  >
                    {t("buyTickets")}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: "center", mt: 6 }}>
          <Typography variant="body1" color="text.secondary">
            {t("moreInfo")}
          </Typography>
        </Box>
      </Container>
    </ContainerGradient>
  );
}
