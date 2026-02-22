import { notFound } from "next/navigation";
import {
  Container,
  Typography,
  Box,
  Chip,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { Launch } from "@mui/icons-material";
import ContainerGradientNoPadding from "@/components/atoms/ContainerGradientNoPadding";
import DVDImage from "../../../components/DVDImage";
import DVDYouTubeButton from "../../../components/DVDYouTubeButton";
import dvdsData from "../../../constants/dvd.json";
import {
  getDVDExtendedDescription,
  generateDVDSlug,
  type DVDDataItem,
} from "@/types/dvd";
import { getLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import RandomSectionBanner from "@/components/NewsBanner";
import { CommentsSection } from "@/components/CommentsSection";

interface DVDPageProps {
  params: Promise<{
    dvdId: string;
  }>;
}

// Función para encontrar DVD por slug
function findDVDBySlug(slug: string): DVDDataItem | null {
  const dvd = (dvdsData as DVDDataItem[]).find((d) => {
    const title = d.title || d.album_title;
    return title && generateDVDSlug(title) === slug;
  });
  return dvd || null;
}

export async function generateMetadata({
  params,
}: DVDPageProps): Promise<Metadata> {
  const { dvdId } = await params;
  const locale = await getLocale();
  const dvd = findDVDBySlug(dvdId);

  if (!dvd) {
    return {
      title: "DVD no encontrado | Megadeth Fan Site",
    };
  }

  const dvdTitle = dvd.title || dvd.album_title || "Unknown DVD";
  const dvdYear = dvd.year || dvd.release_year || 2000;

  const titleByLocale = {
    es: `${dvdTitle} (${dvdYear}) | DVD de Megadeth`,
    en: `${dvdTitle} (${dvdYear}) | Megadeth DVD`,
  };

  const description = getDVDExtendedDescription(dvd.description || {}, locale);

  // Generar keywords más específicos
  const keywordsByLocale = {
    es: [
      dvdTitle,
      `Megadeth ${dvdYear}`,
      `DVD ${dvdTitle}`,
      dvd.label || "Unknown Label",
      dvd.format || "DVD",
      "thrash metal",
      "Dave Mustaine",
      "videos musicales",
      "documentales metal",
      "conciertos en vivo",
      `${dvdTitle} completo`,
      `Megadeth ${dvdYear} DVD`,
    ],
    en: [
      dvdTitle,
      `Megadeth ${dvdYear}`,
      `${dvdTitle} DVD`,
      dvd.label || "Unknown Label",
      dvd.format || "DVD",
      "thrash metal",
      "Dave Mustaine",
      "music videos",
      "metal documentaries",
      "live concerts",
      `${dvdTitle} full`,
      `Megadeth ${dvdYear} DVD`,
    ],
  };

  return {
    title:
      titleByLocale[locale as keyof typeof titleByLocale] || titleByLocale.es,
    description,
    keywords:
      keywordsByLocale[locale as keyof typeof keywordsByLocale] ||
      keywordsByLocale.es,
    authors: [{ name: "Megadeth Fan Site" }],
    creator: "Megadeth Fan Site",
    publisher: "Megadeth Fan Site",
    category: "entertainment",
    classification: "Thrash Metal DVD",
    alternates: {
      canonical: `/dvds/${dvdId}`,
      languages: {
        es: `/dvds/${dvdId}`,
        en: `/dvds/${dvdId}`,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title:
        titleByLocale[locale as keyof typeof titleByLocale] || titleByLocale.es,
      description,
      url: `/dvds/${dvdId}`,
      siteName: "Megadeth Fan Site",
      locale: locale === "es" ? "es_ES" : "en_US",
      type: "article",
      images: [
        {
          url: `/images/dvds/${dvdTitle
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "-")}.jpg`,
          width: 800,
          height: 600,
          alt: `${dvdTitle} DVD cover`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title:
        titleByLocale[locale as keyof typeof titleByLocale] || titleByLocale.es,
      description,
      images: [
        dvd.cover_image || `/images/dvds/${generateDVDSlug(dvdTitle)}.jpg`,
      ],
    },
  };
}

export default async function DVDPage({ params }: DVDPageProps) {
  const { dvdId } = await params;
  const locale = await getLocale();
  const tb = await getTranslations("breadcrumb");
  const dvd = findDVDBySlug(dvdId);

  if (!dvd) {
    notFound();
  }

  const dvdTitle = dvd.title || dvd.album_title || "Unknown DVD";
  const dvdYear = dvd.year || dvd.release_year || 2000;
  const extendedDescription = getDVDExtendedDescription(
    dvd.description || {},
    locale,
  );
  // Usar cover_image si está disponible, sino generar usando el título
  const imageUrl = dvd.cover_image || `${generateDVDSlug(dvdTitle)}.jpg`;

  // Datos estructurados para SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: dvdTitle,
    description: extendedDescription,
    datePublished: `${dvdYear}-01-01`,
    publisher: {
      "@type": "Organization",
      name: dvd.label || "Unknown Label",
    },
    creator: {
      "@type": "MusicGroup",
      name: "Megadeth",
      member: {
        "@type": "Person",
        name: "Dave Mustaine",
      },
    },
    genre: ["Thrash Metal", "Heavy Metal"],
    inLanguage: locale === "es" ? "es-ES" : "en-US",
    image: dvd.cover_image
      ? `https://megadeth.com.ar${dvd.cover_image}`
      : `https://megadeth.com.ar/images/dvds/${generateDVDSlug(dvdTitle)}.jpg`,
    url: `https://megadeth.com.ar/dvds/${generateDVDSlug(dvdTitle)}`,
    ...(dvd.tracks &&
      dvd.tracks.length > 0 && {
        hasPart: dvd.tracks.map((track) => ({
          "@type": "VideoObject",
          name: track.title,
          position: track.n,
        })),
      }),
  };

  return (
    <>
      {/* Datos estructurados JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <ContainerGradientNoPadding>
        {/* Breadcrumb */}
        <Box pt={{ xs: 2, md: 4 }} px={{ xs: 2, md: 0 }} pb={{ xs: 2, md: 4 }}>
          <Breadcrumb
            items={[{ label: tb("dvds"), href: "/dvds" }, { label: dvdTitle }]}
          />
        </Box>
        <Container
          maxWidth={false}
          sx={{ maxWidth: 1440, mx: "auto", marginBottom: 4 }}
        >
          <Grid container spacing={4}>
            {/* Portada y información básica */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ mb: 3 }}>
                <DVDImage src={imageUrl} alt={`${dvdTitle} DVD cover`} />
              </Card>

              {/* Información técnica */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {locale === "es" ? "Información" : "Information"}
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {locale === "es" ? "Año:" : "Year:"}
                      </Typography>
                      <Typography variant="body2">{dvdYear}</Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {locale === "es" ? "Sello:" : "Label:"}
                      </Typography>
                      <Typography variant="body2">
                        {dvd.label || "Unknown"}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {locale === "es" ? "Duración:" : "Duration:"}
                      </Typography>
                      <Typography variant="body2">
                        {dvd.duration || "Unknown"}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {locale === "es" ? "Formato:" : "Format:"}
                      </Typography>
                      <Typography variant="body2">
                        {dvd.format || "DVD"}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {locale === "es" ? "Discos:" : "Discs:"}
                      </Typography>
                      <Typography variant="body2">
                        {dvd.dvdQuantity || 1}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Botón de YouTube */}
                  {dvd.streaming?.youtube && (
                    <DVDYouTubeButton
                      youtubeUrl={dvd.streaming.youtube}
                      locale={locale}
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Contenido principal */}
            <Grid size={{ xs: 12, md: 8 }}>
              {/* Título y chips */}
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    fontSize: { xs: "2rem", md: "3rem" },
                    fontWeight: "bold",
                    mb: 2,
                    background: "linear-gradient(45deg, #ff6b6b, #4ecdc4)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {dvdTitle}
                </Typography>

                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  <Chip label={dvdYear} color="primary" />
                  <Chip label={dvd.label || "Unknown"} variant="outlined" />
                  <Chip label={dvd.format || "DVD"} variant="outlined" />
                </Box>
              </Box>

              {/* Descripción */}
              <Card sx={{ mb: 4 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {locale === "es" ? "Descripción" : "Description"}
                  </Typography>
                  <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                    {extendedDescription}
                  </Typography>
                </CardContent>
              </Card>

              {/* Tracklist */}
              {dvd.tracks && dvd.tracks.length > 0 && (
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {locale === "es" ? "Contenido" : "Contents"}
                    </Typography>
                    <List dense>
                      {dvd.tracks.map((track, index) => (
                        <Box key={index}>
                          <ListItem>
                            <ListItemText
                              primary={
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      minWidth: 24,
                                      textAlign: "center",
                                      color: "text.secondary",
                                    }}
                                  >
                                    {track.n}
                                  </Typography>
                                  <Typography variant="body1">
                                    {track.title}
                                  </Typography>
                                </Box>
                              }
                            />
                          </ListItem>
                          {index < (dvd.tracks?.length || 0) - 1 && <Divider />}
                        </Box>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              )}
            </Grid>
          </Grid>

          {/* Botón volver */}
          <Box sx={{ mt: 6, textAlign: "center" }}>
            <Button
              component={Link}
              href="/dvds"
              variant="outlined"
              startIcon={<Launch />}
            >
              {locale === "es" ? "Volver a DVDs" : "Back to DVDs"}
            </Button>
          </Box>
          <Box mt={4}>
            <RandomSectionBanner currentSection="dvds" />
          </Box>

          <CommentsSection
            pageType="article"
            pageId={`dvd-${dvdId}`}
            title={dvdTitle}
          />
        </Container>
      </ContainerGradientNoPadding>
    </>
  );
}

// Generar rutas estáticas para mejor SEO
export async function generateStaticParams() {
  return (dvdsData as DVDDataItem[])
    .filter((item) => item.title || item.album_title) // Solo elementos con título
    .map((dvd) => ({
      dvdId: generateDVDSlug(dvd.title || dvd.album_title),
    }));
}
