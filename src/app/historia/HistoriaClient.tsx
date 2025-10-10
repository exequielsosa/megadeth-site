"use client";

import { Box, Container, Typography, Button, Chip } from "@mui/material";
import HistoryTimeline from "@/components/HistoryTimeline";
import historiaData from "@/constants/historia.json";
import { HistoryData } from "@/types/historia";
import { History, AutoStories, Timeline } from "@mui/icons-material";

export default function HistoriaClient() {
  const data = historiaData as HistoryData;

  // Estadísticas interesantes
  const stats = [
    { label: "Años activos", value: "43", detail: "1983-2026" },
    { label: "Álbumes de estudio", value: "17", detail: "Incluyendo el final" },
    { label: "Cambios de formación", value: "20+", detail: "Múltiples eras" },
    { label: "Ventas mundiales", value: "38M", detail: "Discos vendidos" },
  ];

  return (
    <Box
      display={"flex"}
      alignItems="center"
      width={"100%"}
      flexDirection={"column"}
    >
      <Box sx={{ maxWidth: "1440px", padding: 0 }} width={"100%"}>
        {/* Hero Section */}
        <Box
          sx={{
            textAlign: "center",
            mb: 8,
            background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
            color: "white",
            borderRadius: { xs: 0, md: 4 },
            p: { xs: 2, md: 6 },
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'url("/images/historia/vic_v2.webp")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.3,
              zIndex: 0,
            },
          }}
        >
          <Box sx={{ position: "relative", zIndex: 1 }}>
            {/* Título principal */}
            <Typography
              variant="h1"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "2.5rem", md: "4rem" },
                mb: 2,
                textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
              }}
            >
              {data.title}
            </Typography>

            {/* Subtítulo */}
            <Typography
              variant="h4"
              sx={{
                fontWeight: 300,
                fontSize: { xs: "1.2rem", md: "1.8rem" },
                mb: 4,
                textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
                opacity: 0.9,
              }}
            >
              {data.subtitle}
            </Typography>

            {/* Introducción */}
            <Typography
              variant="h6"
              sx={{
                maxWidth: "900px",
                mx: "auto",
                mb: 4,
                lineHeight: 1.6,
                textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
                fontSize: { xs: "1rem", md: "1.1rem" },
              }}
            >
              {data.introduction}
            </Typography>

            {/* Estadísticas */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, 1fr)",
                  md: "repeat(4, 1fr)",
                },
                gap: 3,
                mt: 4,
                maxWidth: "800px",
                mx: "auto",
              }}
            >
              {stats.map((stat, index) => (
                <Box
                  key={index}
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.1)",
                    backdropFilter: "blur(10px)",
                    borderRadius: 2,
                    p: 2,
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 900,
                      color: "#ff6b35",
                      fontSize: { xs: "1.5rem", md: "2rem" },
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {stat.label}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    {stat.detail}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Sección de Timeline */}
        <Box sx={{ mb: 8 }}>
          <Box sx={{ textAlign: "center", mb: "150px" }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: "2rem", md: "3rem" },
              }}
            >
              Timeline Interactivo
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "text.secondary",
                maxWidth: "700px",
                mx: "auto",
                mb: 3,
              }}
            >
              Explora cuatro décadas de historia a través de nuestro timeline
              interactivo. Haz clic en cualquier período para conocer los
              detalles.
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <Chip
                icon={<AutoStories />}
                label="6 Capítulos épicos"
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
              <Chip
                icon={<History />}
                label="43 años de historia"
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
              <Chip
                label="Contenido multimedia"
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
            </Box>
          </Box>

          {/* Timeline Component */}
          <HistoryTimeline chapters={data.chapters} />
        </Box>

        {/* Información adicional */}
        <Box
          sx={{
            borderRadius: { xs: 0, md: 4 },
            p: 4,
            textAlign: "center",
            marginTop: "150px",
            backgroundColor: "background.paper",
            boxShadow: "0 3px 12px rgba(0,0,0,0.1)",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
            Una historia que trasciende generaciones
          </Typography>

          <Typography
            variant="body1"
            sx={{ mb: 4, lineHeight: 1.8, maxWidth: "800px", mx: "auto" }}
          >
            Desde los humildes comienzos en 1983 hasta el anunciado adiós en
            2026, Megadeth ha sido testigo y protagonista de la evolución del
            metal. Esta es más que una biografía: es el relato de cómo una banda
            cambió para siempre el panorama musical mundial.
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              size="large"
              href="/historia/origenes"
              sx={{
                backgroundColor: "#8B0000",
                "&:hover": { backgroundColor: "#a00000" },
                fontWeight: 600,
              }}
            >
              Comenzar la historia
            </Button>
            <Button
              variant="outlined"
              size="large"
              href="/historia/actualidad-despedida"
              sx={{ fontWeight: 600 }}
            >
              Ver el final
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
