"use client";
import { Box, Container, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        mt: "auto",
        backgroundColor: "background.paper",
        borderTop: 1,
        borderColor: "divider",
      }}
    >
      <Container
        maxWidth={false}
        sx={{ maxWidth: 1440, mx: "auto", px: { xs: 2, sm: 3 } }}
      >
        <Typography variant="body2" color="text.secondary">
          {t("disclaimer", { year: new Date().getFullYear() })}
        </Typography>
      </Container>
    </Box>
  );
}
