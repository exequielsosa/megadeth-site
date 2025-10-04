"use client";

import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations("hero");

  return (
    <Box
      sx={{
        py: { xs: 8, md: 14 },
        background:
          "radial-gradient(60% 80% at 50% 0%, rgba(239,83,80,0.15), transparent 60%)",
      }}
    >
      <Container
        maxWidth={false}
        sx={{ maxWidth: 1440, mx: "auto", px: { xs: 2, sm: 3 } }}
      >
        <Stack spacing={3} alignItems="start">
          <Typography variant="h1" sx={{ fontSize: { xs: 36, md: 56 } }}>
            {t("title")}
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ maxWidth: 720 }}
          >
            {t("description")}
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="contained">{t("viewDates")}</Button>
            <Button variant="outlined">{t("listenSingle")}</Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
