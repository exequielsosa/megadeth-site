"use client";
import { Box, Container, Typography, Divider } from "@mui/material";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <Box
      component="footer"
      role="contentinfo"
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
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "flex-start", md: "center" },
            justifyContent: "space-between",
            gap: 2,
            mb: 2,
          }}
        >
          <Box sx={{ mb: { xs: 2, md: 0 } }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              {t("siteDescription")}
            </Typography>
          </Box>
          <Box component="nav" aria-label="Footer navigation">
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Typography
                component="a"
                href="/faq"
                variant="body2"
                color="primary"
                sx={{ textDecoration: "none", fontWeight: 500 }}
              >
                {t("faq")}
              </Typography>
              <Typography
                component="a"
                href="/terminos"
                variant="body2"
                color="primary"
                sx={{ textDecoration: "none", fontWeight: 500 }}
              >
                {t("terms")}
              </Typography>
              <Typography
                component="a"
                href="/privacidad"
                variant="body2"
                color="primary"
                sx={{ textDecoration: "none", fontWeight: 500 }}
              >
                {t("privacy")}
              </Typography>
              <Typography
                component="a"
                href="/contacto"
                variant="body2"
                color="primary"
                sx={{ textDecoration: "none", fontWeight: 500 }}
              >
                {t("contact")}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontWeight: 400 }}
          >
            {t("disclaimer", { year: new Date().getFullYear() })}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
