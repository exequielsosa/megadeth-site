import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import YouTubeEmbed from "@/components/YouTubeEmbed";

export default function MusicaPage() {
  return (
    <Container sx={{ py: 6 }}>
      <Typography
        variant="h3"
        sx={{ mb: 2, fontFamily: "var(--font-heading)" }}
      >
        Música
      </Typography>
      <Typography sx={{ mb: 4, color: "text.secondary" }}>
        Reproductor con playlists curatoradas y videos destacados.
      </Typography>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card elevation={0} sx={{ borderRadius: 3, overflow: "hidden" }}>
            <Box sx={{ position: "relative", paddingTop: "80%" }}>
              <iframe
                src="https://open.spotify.com/embed/playlist/37i9dQZF1DX5EY9z1Yrg1Z"
                width="100%"
                height="100%"
                style={{ border: 0, position: "absolute", top: 0, left: 0 }}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              />
            </Box>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                This Is Taylor Swift — Playlist oficial
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card elevation={0} sx={{ borderRadius: 3, overflow: "hidden" }}>
            <YouTubeEmbed
              videoId="e-ORhEE9VVg"
              title="Taylor Swift - Blank Space"
            />
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Video destacado
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
