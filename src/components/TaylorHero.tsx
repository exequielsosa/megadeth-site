import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import Link from "next/link";

export default function TaylorHero() {
  return (
    <Box
      sx={{
        bgcolor: "transparent",
        pt: { xs: 8, md: 12 },
        pb: { xs: 6, md: 10 },
        background:
          "radial-gradient(1200px 600px at 10% -20%, rgba(181,126,220,0.25), transparent), radial-gradient(800px 400px at 90% -10%, rgba(255,183,197,0.25), transparent)",
      }}
    >
      <Container>
        <Typography
          variant="h2"
          sx={{
            fontFamily: "var(--font-heading)",
            fontWeight: 700,
            letterSpacing: 0.5,
            mb: 2,
          }}
        >
          Taylor Swift
        </Typography>
        <Typography sx={{ color: "text.secondary", mb: 3, maxWidth: 720 }}>
          Discografía completa, biografía detallada, galería, noticias y
          playlists curatoradas. Diseño pastel, elegante y totalmente
          responsive.
        </Typography>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 6 }}>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            href="/discography"
          >
            Ver discografía
          </Button>
          <Button variant="outlined" component={Link} href="/biografia">
            Leer biografía
          </Button>
          <Button variant="outlined" component={Link} href="/musica">
            Escuchar playlists
          </Button>
        </Box>

        <Grid container spacing={3}>
          {[
            {
              title: "Galería",
              href: "/galeria",
              desc: "Conciertos y sesiones fotográficas",
            },
            {
              title: "Noticias",
              href: "/noticias",
              desc: "Actualizaciones y eventos",
            },
            { title: "Tienda", href: "/tienda", desc: "Merchandising oficial" },
          ].map((item) => (
            <Grid key={item.title} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <CardContent>
                  <Typography
                    variant="h5"
                    sx={{ fontFamily: "var(--font-heading)" }}
                  >
                    {item.title}
                  </Typography>
                  <Typography sx={{ color: "text.secondary", mt: 1 }}>
                    {item.desc}
                  </Typography>
                  <Button component={Link} href={item.href} sx={{ mt: 2 }}>
                    Explorar
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
