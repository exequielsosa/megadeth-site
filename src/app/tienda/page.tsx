import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
} from "@mui/material";
import Link from "next/link";

const products = [
  {
    title: "Sudadera Midnights",
    image: "https://store.taylorswift.com/cdn/shop/files/Midnights-Hoodie.jpg",
    url: "https://store.taylorswift.com/",
  },
  {
    title: "Vinilo 1989 (Taylor's Version)",
    image: "https://store.taylorswift.com/cdn/shop/files/1989TV-Vinyl.jpg",
    url: "https://store.taylorswift.com/",
  },
  {
    title: "Merch Folklore",
    image: "https://store.taylorswift.com/cdn/shop/files/Folklore-Merch.jpg",
    url: "https://store.taylorswift.com/",
  },
];

export default function TiendaPage() {
  return (
    <Container sx={{ py: 6 }}>
      <Typography
        variant="h3"
        sx={{ mb: 2, fontFamily: "var(--font-heading)" }}
      >
        Tienda Oficial
      </Typography>
      <Typography sx={{ mb: 4, color: "text.secondary" }}>
        Explora merchandising oficial. Compras se realizan en la tienda oficial
        de Taylor Swift.
      </Typography>
      <Grid container spacing={3}>
        {products.map((p, idx) => (
          <Grid key={idx} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card elevation={0} sx={{ borderRadius: 3, overflow: "hidden" }}>
              <CardMedia
                component="img"
                image={p.image}
                alt={p.title}
                sx={{ height: 280 }}
              />
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {p.title}
                </Typography>
                <Button
                  component={Link}
                  href={p.url}
                  target="_blank"
                  rel="noopener"
                  variant="contained"
                  color="primary"
                  sx={{ mt: 1 }}
                >
                  Comprar en tienda oficial
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
