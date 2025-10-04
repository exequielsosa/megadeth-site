import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Grid,
  Button,
  CardActions,
} from "@mui/material";
import ContainerGradient from "@/components/atoms/ContainerGradient";
import { tourDates } from "@/constants/tourDates";

export default function TourPage() {
  const t = useTranslations("tour");
  const locale = useLocale();

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
                    {new Date(show.date).toLocaleDateString(
                      locale === "es" ? "es-ES" : "en-US",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
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
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {show.country}
                  </Typography>
                </CardContent>
                
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    href={show.ticketLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      textTransform: "uppercase",
                      fontWeight: 600,
                      py: 1.5,
                    }}
                  >
                    {t("buyTickets")}
                  </Button>
                </CardActions>
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
