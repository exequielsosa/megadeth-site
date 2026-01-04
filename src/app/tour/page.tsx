/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Grid,
  Button,
  CardActions,
  Tabs,
  Tab,
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import Breadcrumb from "@/components/Breadcrumb";
import PastShowsGrid from "@/components/PastShowsGrid";
import { tourDates } from "@/constants/tourDates";
import ContainerGradientNoPadding from "@/components/atoms/ContainerGradientNoPadding";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tour-tabpanel-${index}`}
      aria-labelledby={`tour-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function TourPage() {
  const t = useTranslations("tour");
  const tb = useTranslations("breadcrumb");
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setSearchQuery(""); // Limpiar búsqueda al cambiar de tab
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // Obtener fecha actual
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Función para filtrar conciertos por búsqueda
  const filterConcerts = (concerts: typeof tourDates, query: string) => {
    if (!query.trim()) return concerts;

    const lowerQuery = query.toLowerCase();
    return concerts.filter(
      (show) =>
        show.city.toLowerCase().includes(lowerQuery) ||
        show.venue.toLowerCase().includes(lowerQuery) ||
        show.country.toLowerCase().includes(lowerQuery)
    );
  };

  // Función para ordenar conciertos
  const sortConcerts = (concerts: typeof tourDates, order: "asc" | "desc") => {
    return [...concerts].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return order === "asc" ? dateA - dateB : dateB - dateA;
    });
  };

  // Filtrar y ordenar conciertos próximos
  const upcomingConcerts = useMemo(() => {
    const upcoming = tourDates.filter((show) => new Date(show.date) >= today);
    const filtered = filterConcerts(upcoming, searchQuery);
    return sortConcerts(filtered, sortOrder);
  }, [searchQuery, sortOrder, today]);

  // Filtrar y ordenar conciertos pasados
  const pastConcerts = useMemo(() => {
    const past = tourDates.filter((show) => new Date(show.date) < today);
    const filtered = filterConcerts(past, searchQuery);
    return sortConcerts(filtered, sortOrder);
  }, [searchQuery, sortOrder]);

  const renderConcerts = (concerts: typeof tourDates) => (
    <Grid container spacing={3}>
      {concerts.map((show, index) => (
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
              <Typography variant="body1" color="text.secondary" gutterBottom>
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
  );

  return (
    <ContainerGradientNoPadding>
      <Box pt={{ xs: 2, md: 4 }} px={{ xs: 2, md: 0 }} pb={{ xs: 0, md: 0 }}>
        <Breadcrumb items={[{ label: tb("tour") }]} />
      </Box>
      <Container maxWidth={false} sx={{ maxWidth: 1440, mx: "auto", py: 4 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h1"
            component="h1"
            gutterBottom
            sx={{ fontSize: { xs: 28, md: 56 }, fontWeight: 700 }}
          >
            {t("title")}
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ mb: 4, fontSize: { xs: 18, md: 24 } }}
          >
            {t("subtitle")}
          </Typography>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="tour tabs"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              "& .MuiTab-root": {
                fontSize: { xs: "0.9rem", md: "1.1rem" },
                fontWeight: 600,
                textTransform: "uppercase",
                px: { xs: 2, md: 4 },
              },
            }}
          >
            <Tab
              label={`${t("upcoming")} (${upcomingConcerts.length})`}
              id="tour-tab-0"
              aria-controls="tour-tabpanel-0"
            />
            <Tab
              label={t("past")}
              id="tour-tab-1"
              aria-controls="tour-tabpanel-1"
            />
          </Tabs>
        </Box>

        {/* Buscador y botón de ordenamiento - solo para próximos shows */}
        {activeTab === 0 && (
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              mb: 3,
              alignItems: "center",
            }}
          >
            <TextField
              fullWidth
              placeholder={
                locale === "es"
                  ? "Buscar por ciudad, venue o país..."
                  : "Search by city, venue or country..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ flexGrow: 1 }}
            />
            <IconButton
              onClick={toggleSortOrder}
              color="primary"
              sx={{
                border: 1,
                borderColor: "primary.main",
                minWidth: 48,
                height: 48,
                "&:hover": {
                  backgroundColor: "primary.main",
                  color: "white",
                },
              }}
              title={
                locale === "es"
                  ? sortOrder === "asc"
                    ? "Ordenar descendente"
                    : "Ordenar ascendente"
                  : sortOrder === "asc"
                  ? "Sort descending"
                  : "Sort ascending"
              }
            >
              {sortOrder === "asc" ? (
                <ArrowUpwardIcon />
              ) : (
                <ArrowDownwardIcon />
              )}
            </IconButton>
          </Box>
        )}

        <TabPanel value={activeTab} index={0}>
          {upcomingConcerts.length > 0 ? (
            renderConcerts(upcomingConcerts)
          ) : (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <Typography variant="h6" color="text.secondary">
                {locale === "es"
                  ? "No hay próximos conciertos programados"
                  : "No upcoming concerts scheduled"}
              </Typography>
            </Box>
          )}
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <PastShowsGrid />
        </TabPanel>

        <Box sx={{ textAlign: "center", mt: 6 }}>
          <Typography variant="body1" color="text.secondary">
            {t("moreInfo")}
          </Typography>
        </Box>
      </Container>
    </ContainerGradientNoPadding>
  );
}
