"use client";

import { Box, Button, Container, Stack, Typography } from "@mui/material";

export default function Hero() {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 14 },
        background:
          "radial-gradient(60% 80% at 50% 0%, rgba(239,83,80,0.15), transparent 60%)",
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3} alignItems="start">
          <Typography variant="h1" sx={{ fontSize: { xs: 36, md: 56 } }}>
            Último disco · Gira final
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ maxWidth: 720 }}
          >
            Noticias, fechas y discografía de Megadeth. Curado para fans.
            Rápido, simple y full responsive.
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="contained">Ver fechas</Button>
            <Button variant="outlined">Escuchar single</Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
