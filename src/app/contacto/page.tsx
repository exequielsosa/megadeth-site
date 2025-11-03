import { useTranslations } from "next-intl";
import { Container, Typography, Box, Button } from "@mui/material";

export default function ContactPage() {
  const t = useTranslations("contact");
  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        color="primary"
        fontWeight={700}
      >
        {t("title")}
      </Typography>
      <Box sx={{ mt: 4, mb: 2 }}>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {t("description")}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          href="mailto:megadethargentina77@gmail.com"
          sx={{ fontWeight: 600 }}
        >
          {t("emailButton")}
        </Button>
      </Box>
    </Container>
  );
}
