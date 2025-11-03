import { useTranslations } from "next-intl";
import { Container, Typography, Box } from "@mui/material";

export default function PrivacyPage() {
  const t = useTranslations("privacy");
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        color="primary"
        fontWeight={700}
      >
        {t("title")}
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Typography variant="body1" color="text.secondary">
          {t("body")}
        </Typography>
      </Box>
    </Container>
  );
}
