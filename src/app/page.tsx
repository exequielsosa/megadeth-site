import Hero from "@/components/Hero";
import { Container, Typography } from "@mui/material";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Bienvenido
        </Typography>
        <Typography color="text.secondary">
          Pronto: noticias, fechas y discos.
        </Typography>
      </Container>
    </>
  );
}
