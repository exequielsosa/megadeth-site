import { Box, Container, Typography, Button, Stack } from "@mui/material";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Image from "next/image";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("notFound");

  const title = t("title");
  const description = t("message");

  return {
    title,
    description,
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          py: 8,
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: { xs: 250, sm: 350, md: 600 },
            height: { xs: 250, sm: 350, md: 600 },
            mb: 0,
            borderRadius: 2,
          }}
        >
          <Image
            src="/images/404DOS.jpg"
            alt="404 - Página no encontrada"
            fill
            style={{
              objectFit: "cover",
              borderRadius: "16px",
            }}
            priority
          />
        </Box>

        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: 24, md: 40 },
            fontWeight: 600,
            mb: 3,
            mt: 2,
          }}
        >
          {t("heading")}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: 16, md: 20 },
            color: "text.secondary",
            mb: 2,
            maxWidth: 600,
          }}
        >
          {t("message")}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            fontSize: { xs: 14, md: 16 },
            color: "text.secondary",
            mb: 5,
            maxWidth: 600,
          }}
        >
          {t("suggestions")}
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          <Button
            component={Link}
            href="/"
            variant="contained"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              fontSize: { xs: 14, md: 16 },
              fontWeight: 600,
            }}
          >
            {t("goHome")}
          </Button>

          <Button
            component={Link}
            href="/discography"
            variant="outlined"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              fontSize: { xs: 14, md: 16 },
              fontWeight: 600,
            }}
          >
            {t("goDiscography")}
          </Button>

          <Button
            component={Link}
            href="/contacto"
            variant="outlined"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              fontSize: { xs: 14, md: 16 },
              fontWeight: 600,
            }}
          >
            {t("contact")}
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}
