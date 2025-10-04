import Hero from "@/components/Hero";
import { Container, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("home");

  return (
    <>
      <Hero />
      <Container
        maxWidth={false}
        sx={{ maxWidth: 1440, mx: "auto", py: 6, px: { xs: 2, sm: 3 } }}
      >
        <Typography variant="h4" sx={{ mb: 2 }}>
          {t("welcome")}
        </Typography>
        <Typography color="text.secondary">{t("comingSoon")}</Typography>
      </Container>
    </>
  );
}
