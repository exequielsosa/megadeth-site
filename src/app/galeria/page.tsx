import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";

const images = [
  {
    src: "https://i.scdn.co/image/ab6761610000e5eb3b4ac16c96c8d5dff71f87e6",
    title: "Taylor en vivo",
  },
  {
    src: "https://i.scdn.co/image/ab67616d0000b2734f1c1b5e3b2b1c9e36f5a6f3",
    title: "1989 (Taylor's Version)",
  },
  {
    src: "https://i.scdn.co/image/ab67616d0000b273f3c8c6a48d74f5be0a98a5c5",
    title: "Midnights",
  },
  {
    src: "https://i.scdn.co/image/ab67616d0000b273d1c3482f38d7ec37a5e593ad",
    title: "Folklore",
  },
  {
    src: "https://i.scdn.co/image/ab67616d0000b273ad5e1ebef1bae634fc8880ec",
    title: "Evermore",
  },
];

export default function GaleriaPage() {
  return (
    <Container sx={{ py: 6 }}>
      <Typography
        variant="h3"
        sx={{ mb: 2, fontFamily: "var(--font-heading)" }}
      >
        Galería
      </Typography>
      <Typography sx={{ mb: 4, color: "text.secondary" }}>
        Conciertos y sesiones fotográficas de alta calidad. Estética pastel y
        moderna.
      </Typography>
      <Grid container spacing={3}>
        {images.map((img, idx) => (
          <Grid key={idx} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                bgcolor: "background.paper",
              }}
            >
              <CardMedia
                component="img"
                image={img.src}
                alt={img.title}
                sx={{ height: 280, objectFit: "cover" }}
              />
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {img.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
