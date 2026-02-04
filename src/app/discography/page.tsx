import DiscographyGrid from "@/components/DiscographyGrid";
import studioAlbums from "../../constants/taylor_discography.json";
const liveAlbums: any[] = [];
const compilations: any[] = [];
const eps: any[] = [];
import { Typography, Box } from "@mui/material";
import type { Album } from "@/types/album";
import { useTranslations } from "next-intl";
import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import Breadcrumb from "@/components/Breadcrumb";
import ContainerGradientNoPadding from "@/components/atoms/ContainerGradientNoPadding";
import RandomSectionBanner from "@/components/NewsBanner";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  const titleByLocale = {
    es: "Discografía Completa de Taylor Swift | Álbumes de estudio y Taylor's Version",
    en: "Complete Taylor Swift Discography | Studio Albums and Taylor's Version",
  };

  const descriptionByLocale = {
    es: "Discografía completa de Taylor Swift: desde Taylor Swift (2006) hasta Midnights (2022), incluyendo Taylor's Version. Portadas, años, sellos y enlaces.",
    en: "Complete Taylor Swift discography: from Taylor Swift (2006) to Midnights (2022), including Taylor's Version releases. Covers, years, labels and links.",
  };

  const keywordsByLocale = {
    es: [
      "Taylor Swift discografía",
      "álbumes Taylor Swift",
      "Fearless",
      "Speak Now",
      "Red",
      "1989",
      "Reputation",
      "Lover",
      "Folklore",
      "Evermore",
      "Midnights",
      "Taylor's Version",
    ],
    en: [
      "Taylor Swift discography",
      "Taylor Swift albums",
      "Fearless",
      "Speak Now",
      "Red",
      "1989",
      "Reputation",
      "Lover",
      "Folklore",
      "Evermore",
      "Midnights",
      "Taylor's Version",
    ],
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
    authors: [{ name: "Taylor Swift Fan Site" }],
    creator: "Taylor Swift Fan Site",
    publisher: "Taylor Swift Fan Site",
    alternates: {
      canonical: "/discography",
      languages: {
        es: "/discography",
        en: "/discography",
      },
    },
    openGraph: {
      title:
        titleByLocale[locale as keyof typeof titleByLocale] || titleByLocale.es,
      description:
        descriptionByLocale[locale as keyof typeof descriptionByLocale] ||
        descriptionByLocale.es,
      url: "/discography",
      siteName: "Taylor Swift Fan Site",
      locale: locale === "es" ? "es_ES" : "en_US",
      type: "website",
      images: [
        {
          url: "/og-discography.jpg",
          width: 1200,
          height: 630,
          alt:
            locale === "es"
              ? "Discografía de Taylor Swift"
              : "Taylor Swift Discography",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title:
        titleByLocale[locale as keyof typeof titleByLocale] || titleByLocale.es,
      description:
        descriptionByLocale[locale as keyof typeof descriptionByLocale] ||
        descriptionByLocale.es,
      images: ["/og-discography.jpg"],
      creator: "@TaylorSwiftFanSite",
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

export default function AlbumsPage() {
  const t = useTranslations("discography");
  const tb = useTranslations("breadcrumb");

  return (
    <ContainerGradientNoPadding>
      <Box pt={{ xs: 2, md: 4 }} px={{ xs: 2, md: 0 }} pb={{ xs: 2, md: 4 }}>
        <Breadcrumb items={[{ label: tb("discography") }]} />
      </Box>
      {/* Álbumes de Estudio */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontSize: { xs: "2rem", md: "3rem" },
            fontWeight: "bold",
            textAlign: "center",
            mb: 4,
            background: "linear-gradient(45deg, #ff6b6b, #4ecdc4)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {t("studioAlbums")}
        </Typography>
        <DiscographyGrid albums={studioAlbums as unknown as Album[]} />
      </Box>

      {/* Álbumes en Vivo */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h2"
          component="h2"
          sx={{
            fontSize: { xs: "2rem", md: "3rem" },
            fontWeight: "bold",
            textAlign: "center",
            mb: 4,
            background: "linear-gradient(45deg, #ff9800, #e91e63)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {t("liveAlbums")}
        </Typography>
        <DiscographyGrid albums={liveAlbums as unknown as Album[]} />
      </Box>

      {/* Compilaciones */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h2"
          component="h2"
          sx={{
            fontSize: { xs: "2rem", md: "3rem" },
            fontWeight: "bold",
            textAlign: "center",
            mb: 4,
            background: "linear-gradient(45deg, #9c27b0, #673ab7)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {t("compilations")}
        </Typography>
        <DiscographyGrid albums={compilations as unknown as Album[]} />
      </Box>

      {/* EPs */}
      <Box mb={4}>
        <Typography
          variant="h2"
          component="h2"
          sx={{
            fontSize: { xs: "2rem", md: "3rem" },
            fontWeight: "bold",
            textAlign: "center",
            mb: 4,
            background: "linear-gradient(45deg, #795548, #ff5722)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {t("eps")}
        </Typography>
        <DiscographyGrid albums={eps as unknown as Album[]} />
        <Box
          mt={4}
          sx={{
            px: { xs: 2, sm: 2, md: 0 },
          }}
        >
          <RandomSectionBanner currentSection="discography" />
        </Box>
      </Box>
    </ContainerGradientNoPadding>
  );
}
