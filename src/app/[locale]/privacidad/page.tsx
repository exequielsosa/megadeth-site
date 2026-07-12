import { useTranslations } from "next-intl";
import { Container, Typography, Box } from "@mui/material";
import Breadcrumb from "@/components/Breadcrumb";
import ContainerGradientNoPadding from "@/components/atoms/ContainerGradientNoPadding";
import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { i18nAlternates } from "@/utils/i18nAlternates";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const title =
    locale === "es"
      ? "Política de privacidad | Megadeth Fan Site"
      : "Privacy Policy | Megadeth Fan Site";
  const description =
    locale === "es"
      ? "Lee la política de privacidad del sitio de fans de Megadeth. Protección de datos y derechos de los usuarios."
      : "Read the privacy policy for the Megadeth fan site. Data protection and user rights.";
  const keywords =
    locale === "es"
      ? ["Megadeth", "privacidad", "política", "datos", "fan site", "usuarios"]
      : ["Megadeth", "privacy", "policy", "data", "fan site", "users"];

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      siteName: "Megadeth Fan Site",
      type: "website",
      locale: locale === "es" ? "es_AR" : "en_US",
      images: [
        {
          url: "/images/megadeth-megadeth.jpg",
          width: 1200,
          height: 630,
          alt: "Megadeth Privacidad",
        },
      ],
    },
    twitter: { card: "summary_large_image" },
    alternates: i18nAlternates("/privacidad", locale),
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default function PrivacyPage() {
  const t = useTranslations("privacy");
  const tb = useTranslations("breadcrumb");
  return (
    <ContainerGradientNoPadding>
      <Box pt={{ xs: 2, md: 4 }} px={{ xs: 2, md: 0 }} pb={{ xs: 0, md: 0 }}>
        <Breadcrumb items={[{ label: tb("privacy") }]} />
      </Box>
      <Container maxWidth={false} sx={{ maxWidth: 1440, mx: "auto", py: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          color="primary"
          fontWeight={700}
          sx={{ fontSize: { xs: "1.75rem", md: "3rem" } }}
        >
          {t("title")}
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}
          >
            {t("body")}
          </Typography>
        </Box>
      </Container>
    </ContainerGradientNoPadding>
  );
}
