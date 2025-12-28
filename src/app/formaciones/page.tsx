import { getLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import ContainerGradientNoPadding from "@/components/atoms/ContainerGradientNoPadding";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("lineups");

  const title = `${t("title")} | Megadeth`;
  const description = t("subtitle");
  const keywords = [
    "Megadeth",
    "formaciones",
    "alineaciones",
    "lineups",
    "miembros Megadeth",
    "Dave Mustaine",
    "thrash metal",
    "bandas metal",
    "historia Megadeth",
    "músicos Megadeth",
    "Nick Menza",
    "Marty Friedman",
    "David Ellefson",
    "James LoMenzo",
    "Dirk Verbeuren",
    "Teemu Mäntysaari",
  ];

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: "/formaciones",
      siteName: "Megadeth Fan Site",
      locale: locale === "es" ? "es_ES" : "en_US",
      type: "website",
      images: [
        {
          url: "/images/lineups/og-lineups.jpg",
          width: 1200,
          height: 630,
          alt:
            locale === "es"
              ? "Formaciones de Megadeth - Evolución histórica de la banda"
              : "Megadeth Lineups - Historical evolution of the band",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/lineups/og-lineups.jpg"],
      creator: "@MegadethFanSite",
    },
    alternates: {
      canonical: "/formaciones",
      languages: {
        es: "/es/formaciones",
        en: "/en/formaciones",
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
} from "@mui/material";
import { useTranslations, useLocale } from "next-intl";
import { LineupFormation, BilingualText } from "@/types";
import lineupsData from "@/constants/lineups.json";
import Image from "next/image";
import Link from "next/link";

export default function LineupsPage() {
  const t = useTranslations("lineups");
  const locale = useLocale() as "es" | "en";

  const lineups: LineupFormation[] = lineupsData.lineups;

  const getLocalizedText = (text: BilingualText): string => {
    return text[locale] || text.es;
  };

  return (
    <ContainerGradientNoPadding>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box textAlign="center" mb={6}>
          <Typography
            variant="h1"
            component="h1"
            gutterBottom
            sx={{ fontSize: { xs: "3rem", sm: "4rem", md: "5rem" } }}
            fontWeight={600}
          >
            {t("title")}
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 800, mx: "auto" }}
          >
            {t("subtitle")}
          </Typography>
        </Box>

        {/* Timeline */}
        <Box mb={6}>
          <Box position="relative" sx={{ mt: 4 }}>
            {/* Timeline line */}
            <Box
              sx={{
                position: "absolute",
                left: "50%",
                top: 0,
                bottom: 0,
                width: 2,
                backgroundColor: "primary.main",
                transform: "translateX(-50%)",
                zIndex: 0,
              }}
            />

            {/* Timeline items */}
            {lineups.map((lineup, index) => (
              <Box key={lineup.id} sx={{ position: "relative", mb: 6 }}>
                {/* Timeline dot */}
                <Box
                  sx={{
                    position: "absolute",
                    left: "50%",
                    top: 20,
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    backgroundColor: "primary.main",
                    border: "3px solid",
                    borderColor: "background.paper",
                    transform: "translateX(-50%)",
                    zIndex: 2,
                  }}
                />

                {/* Content card */}
                <Grid container spacing={3}>
                  <Grid
                    size={{ xs: 12, md: 6 }}
                    order={{ xs: 1, md: index % 2 === 0 ? 1 : 2 }}
                  >
                    <Link
                      href={`/formaciones/${lineup.id}`}
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                      }}
                    >
                      <Card
                        sx={{
                          height: "100%",
                          transition: "transform 0.2s, box-shadow 0.2s",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: 8,
                          },
                        }}
                      >
                        <CardContent
                          sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 2,
                              flexDirection: "column",
                              justifyContent: "center",
                              width: "100%",
                            }}
                          >
                            <Image
                              src={lineup.image}
                              alt={getLocalizedText(lineup.title)}
                              width={532}
                              height={300}
                              style={{
                                borderRadius: "8px",
                                objectFit: "cover",
                              }}
                            />
                            <Box
                              sx={{
                                flex: 1,
                                display: "flex",
                                justifyContent: "flex-start",
                                alignItems: "center",
                                mt: 2,
                                gap: 2,
                                width: "100%",
                              }}
                            >
                              <Typography
                                variant="h5"
                                sx={{
                                  marginBottom: 0,
                                  "&:hover": {
                                    color: "primary.main",
                                  },
                                }}
                                gutterBottom
                              >
                                {getLocalizedText(lineup.title)}
                              </Typography>

                              <Chip
                                label={lineup.period}
                                color="primary"
                                size="small"
                              />
                            </Box>
                          </Box>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2, flex: 1 }}
                          >
                            {getLocalizedText(lineup.description)}
                          </Typography>

                          <Divider sx={{ my: 1 }} />

                          {/* Lista de miembros con links */}
                          <Box sx={{ mb: 2 }}>
                            <Typography
                              variant="subtitle2"
                              color="primary"
                              gutterBottom
                            >
                              {t("formation.members")}:
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 0.5,
                              }}
                            >
                              {lineup.members.map((member) => (
                                <Link
                                  key={member.id}
                                  href={`/miembros/${member.id}`}
                                  style={{
                                    textDecoration: "none",
                                    color: "inherit",
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      cursor: "pointer",
                                      "&:hover": {
                                        color: "primary.main",
                                        textDecoration: "underline",
                                      },
                                    }}
                                  >
                                    <strong>{member.name}</strong> -{" "}
                                    {getLocalizedText(member.instrument)}
                                  </Typography>
                                </Link>
                              ))}
                            </Box>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "flex-end",
                              alignItems: "center",
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              {t("formation.albums")}: {lineup.albums.length}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Link>
                  </Grid>

                  {/* Empty space for opposite side */}
                  <Grid
                    size={{ xs: 0, md: 6 }}
                    order={{ xs: 2, md: index % 2 === 0 ? 2 : 1 }}
                  />
                </Grid>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Current and Classic Lineups Highlight */}
        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              sx={{
                height: "100%",
                backgroundColor: "primary.main",
                color: "primary.contrastText",
              }}
            >
              <CardContent>
                <Typography variant="h4" component="h3" gutterBottom>
                  {t("currentLineup")}
                </Typography>
                <Typography variant="body1">
                  Dave Mustaine, James LoMenzo, Dirk Verbeuren, Teemu Mäntysaari
                </Typography>
                <Typography variant="body2" sx={{ mt: 2, opacity: 0.9 }}>
                  2023 – presente
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              sx={{
                height: "100%",
                backgroundColor: "secondary.main",
                color: "secondary.contrastText",
              }}
            >
              <CardContent>
                <Typography variant="h4" component="h3" gutterBottom>
                  {t("classicLineup")}
                </Typography>
                <Typography variant="body1">
                  Dave Mustaine, David Ellefson, Marty Friedman, Nick Menza
                </Typography>
                <Typography variant="body2" sx={{ mt: 2, opacity: 0.9 }}>
                  1990 – 1998
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </ContainerGradientNoPadding>
  );
}
