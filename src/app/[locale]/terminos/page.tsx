import { useTranslations } from "next-intl";
import { Container, Typography, Box } from "@mui/material";
import ContainerGradientNoPadding from "@/components/atoms/ContainerGradientNoPadding";
import Breadcrumb from "@/components/Breadcrumb";
import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { i18nAlternates } from "@/utils/i18nAlternates";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const title =
    locale === "es"
      ? "Términos y condiciones | Megadeth Fan Site"
      : "Terms and Conditions | Megadeth Fan Site";
  const description =
    locale === "es"
      ? "Lee los términos y condiciones de uso del sitio de fans de Megadeth. Información legal y derechos."
      : "Read the terms and conditions for using the Megadeth fan site. Legal information and rights.";
  const keywords =
    locale === "es"
      ? ["Megadeth", "términos", "condiciones", "legal", "fan site", "uso"]
      : ["Megadeth", "terms", "conditions", "legal", "fan site", "usage"];

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
          alt: "Megadeth Términos",
        },
      ],
    },
    twitter: { card: "summary_large_image" },
    alternates: i18nAlternates("/terminos", locale),
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default function TermsPage() {
  const t = useTranslations("terms");
  const tb = useTranslations("breadcrumb");
  return (
    <ContainerGradientNoPadding>
      <Box pt={{ xs: 2, md: 4 }} px={{ xs: 2, md: 0 }} pb={{ xs: 0, md: 0 }}>
        <Breadcrumb items={[{ label: tb("terms") }]} />
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
