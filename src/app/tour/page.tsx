import { useTranslations } from "next-intl";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import ContainerGradient from "@/components/atoms/ContainerGradient";

export default function TourPage() {
  const t = useTranslations("tour");

  const tourDates = [
    {
      date: "2024-03-15",
      city: "Los Angeles",
      venue: "Hollywood Bowl",
      country: "USA",
    },
    {
      date: "2024-03-18",
      city: "New York",
      venue: "Madison Square Garden",
      country: "USA",
    },
    {
      date: "2024-03-22",
      city: "Londres",
      venue: "Wembley Arena",
      country: "UK",
    },
    {
      date: "2024-03-25",
      city: "París",
      venue: "AccorHotels Arena",
      country: "Francia",
    },
    {
      date: "2024-03-28",
      city: "Buenos Aires",
      venue: "Estadio River Plate",
      country: "Argentina",
    },
  ];

  return (
    <ContainerGradient>
      <Container maxWidth={false} sx={{ maxWidth: 1440, mx: "auto" }}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography variant="h1" component="h1" gutterBottom>
            {t("title")}
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
            {t("subtitle")}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {tourDates.map((show, index) => (
            <Grid key={index} size={{ xs: 12, md: 6, lg: 4 }}>
              <Card
                sx={{
                  height: "100%",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    component="h3"
                    gutterBottom
                    color="primary"
                  >
                    {new Date(show.date).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </Typography>
                  <Typography variant="h5" gutterBottom>
                    {show.city}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    gutterBottom
                  >
                    {show.venue}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {show.country}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: "center", mt: 6 }}>
          <Typography variant="body1" color="text.secondary">
            {t("moreInfo")}
          </Typography>
        </Box>
      </Container>
    </ContainerGradient>
  );
}
