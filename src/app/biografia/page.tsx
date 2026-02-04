import { Container, Typography, Box, Divider } from "@mui/material";

export default function BiografiaPage() {
  return (
    <Container sx={{ py: 6, maxWidth: 900 }}>
      <Typography
        variant="h3"
        sx={{ mb: 2, fontFamily: "var(--font-heading)" }}
      >
        Biografía
      </Typography>
      <Typography sx={{ mb: 4, color: "text.secondary" }}>
        La evolución artística de Taylor Swift: del country al pop y folk, con
        una narrativa íntima y elegante.
      </Typography>

      <Box sx={{ display: "grid", gap: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontFamily: "var(--font-heading)" }}>
            Inicios (2006–2010)
          </Typography>
          <Typography sx={{ mt: 1 }}>
            Taylor debutó con su álbum homónimo en 2006, seguido por Fearless
            (2008), consolidándose como la voz joven del country. Con una pluma
            confesional, conquistó audiencias y premios, cimentando su identidad
            narrativa.
          </Typography>
        </Box>
        <Divider />
        <Box>
          <Typography variant="h5" sx={{ fontFamily: "var(--font-heading)" }}>
            Transición al Pop (2012–2017)
          </Typography>
          <Typography sx={{ mt: 1 }}>
            Con Red (2012) y 1989 (2014), Taylor abrazó el pop sofisticado,
            explorando producción brillante y hooks memorables. Reputation
            (2017) mostró su faceta más oscura, integrando electrónica y
            estética audaz.
          </Typography>
        </Box>
        <Divider />
        <Box>
          <Typography variant="h5" sx={{ fontFamily: "var(--font-heading)" }}>
            Folk y madurez (2020–2022)
          </Typography>
          <Typography sx={{ mt: 1 }}>
            En 2020, Folklore y Evermore revelaron una paleta folk íntima,
            enfatizando historias y atmósferas cálidas. Con Midnights (2022),
            regresó al pop nocturno con elegancia y sutileza.
          </Typography>
        </Box>
        <Divider />
        <Box>
          <Typography variant="h5" sx={{ fontFamily: "var(--font-heading)" }}>
            Taylor's Version
          </Typography>
          <Typography sx={{ mt: 1 }}>
            La regrabación de sus álbumes como Taylor&apos;s Version significó
            control creativo y reivindicación de su catálogo, con nuevas pistas
            y producción refinada. Un hito de empoderamiento en la industria.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
