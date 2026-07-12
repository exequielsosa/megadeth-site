// Fallback global para URLs que no matchean NINGÚN segmento [locale] (ej.
// una ruta que no existe en absoluto). Next.js genera una única ruta
// `_not-found` a nivel raíz que renderiza a través del layout.tsx raíz real
// (el shell mínimo sin <html>/<body>) — este archivo tiene que proveer su
// propio <html>/<body>/fuentes, porque no hereda nada de [locale]/layout.tsx.
// No puede saber el locale (no matcheó ninguna ruta con ese segmento), así
// que queda fijo en inglés (mismos textos que messages/en.json → notFound) —
// es un último recurso, no reemplaza al not-found.tsx traducido de
// [locale]/not-found.tsx, que cubre los notFound() llamados desde adentro
// de una ruta real. Visualmente es un clon de ese, con textos fijos en vez
// de t().
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Box, Container, Typography, Button, Stack } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import ThemeRegistry from "@/theme/ThemeRegistry";
import { ColorModeProvider } from "@/theme/useColorMode";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "404 - Page not found",
  description:
    "Sorry, the page you are looking for does not exist or has been moved.",
  robots: { index: false, follow: true },
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={poppins.variable} suppressHydrationWarning>
      <body
        style={{
          margin: 0,
          padding: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ColorModeProvider initialMode="dark">
          <ThemeRegistry>
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
                    alt="404 - Page not found"
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
                  Page not found
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
                  Sorry, the page you are looking for does not exist or has
                  been moved.
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
                  You may have mistyped the address or the page may have been
                  removed.
                </Typography>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                  <Link href="/" style={{ textDecoration: "none" }}>
                    <Button
                      variant="contained"
                      size="large"
                      sx={{
                        px: 4,
                        py: 1.5,
                        fontSize: { xs: 14, md: 16 },
                        fontWeight: 600,
                      }}
                    >
                      Go to home
                    </Button>
                  </Link>

                  <Link href="/discography" style={{ textDecoration: "none" }}>
                    <Button
                      variant="outlined"
                      size="large"
                      sx={{
                        px: 4,
                        py: 1.5,
                        fontSize: { xs: 14, md: 16 },
                        fontWeight: 600,
                      }}
                    >
                      View discography
                    </Button>
                  </Link>

                  <Link href="/contacto" style={{ textDecoration: "none" }}>
                    <Button
                      variant="outlined"
                      size="large"
                      sx={{
                        px: 4,
                        py: 1.5,
                        fontSize: { xs: 14, md: 16 },
                        fontWeight: 600,
                      }}
                    >
                      Contact
                    </Button>
                  </Link>
                </Stack>
              </Box>
            </Container>
          </ThemeRegistry>
        </ColorModeProvider>
      </body>
    </html>
  );
}
