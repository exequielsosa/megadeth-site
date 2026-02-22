import { useTranslations } from "next-intl";
import { Container, Typography, Box } from "@mui/material";
import ContainerGradientNoPadding from "@/components/atoms/ContainerGradientNoPadding";
import Breadcrumb from "@/components/Breadcrumb";

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
