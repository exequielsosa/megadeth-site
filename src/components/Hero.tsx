"use client";

import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import ContainerGradient from "../components/atoms/ContainerGradient";
import Image from "next/image";

export default function Hero() {
  const t = useTranslations("hero");

  return (
    <ContainerGradient>
      <Container
        maxWidth={false}
        sx={{ maxWidth: 1440, mx: "auto", px: { xs: 2, sm: 3 } }}
      >
        <Stack spacing={3} alignItems="start">
          <Typography variant="h1" sx={{ fontSize: { xs: 36, md: 56 } }}>
            {t("title")}
          </Typography>
          <Box
            width="100%"
            gap={4}
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
          >
            <Image
              src="/images/megadeth-megadeth.jpg"
              alt="Megadeth"
              width={600}
              height={600}
            />
            <Box>
              <Stack spacing={2} sx={{ mt: 3 }}>
                <Typography
                  variant="h4"
                  color="primary"
                  sx={{ fontWeight: 700, mb: 1 }}
                >
                  Álbum 17 / Final de Megadeth
                </Typography>

                <Typography
                  variant="h5"
                  sx={{ fontWeight: 600, color: "text.primary" }}
                >
                  Titulado: &ldquo;Megadeth&rdquo;
                </Typography>

                <Stack spacing={1.5}>
                  <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                    <strong>Fecha de lanzamiento:</strong> 23 de enero de 2026
                  </Typography>

                  <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                    <strong>Primer single:</strong> &ldquo;Tipping Point&rdquo;
                    — ya lanzado
                  </Typography>

                  <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                    <strong>Producido por:</strong> Mustaine + Chris Rakestraw
                  </Typography>

                  <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                    <strong>Line-up final:</strong> Dave Mustaine, Dirk
                    Verbeuren, Teemu Mäntysaari y James LoMenzo
                  </Typography>

                  <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                    <strong>Incluye:</strong> Gira de despedida y libro de
                    Mustaine
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: "1.1rem",
                      mt: 1,
                    }}
                  >
                    <strong>Pre-order:</strong>{" "}
                    <Typography
                      component="a"
                      href="https://shop.megadeth.com/collections/megadeth"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: "primary.main",
                        textDecoration: "none",
                        fontWeight: 600,
                        fontSize: "1.1rem",
                        "&:hover": {
                          color: "primary.dark",
                          textDecoration: "underline",
                        },
                      }}
                    >
                      Tienda oficial de Megadeth
                    </Typography>
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Box>
        </Stack>
      </Container>
    </ContainerGradient>
  );
}
