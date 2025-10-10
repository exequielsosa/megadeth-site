"use client";

import { Box, Button, Typography, useTheme } from "@mui/material";
import { ArrowBack, ArrowForward, Timeline } from "@mui/icons-material";
import { HistoryChapter } from "@/types/historia";
import { useRouter } from "next/navigation";

interface HistoryNavigationProps {
  currentChapter: HistoryChapter;
  previousChapter?: HistoryChapter;
  nextChapter?: HistoryChapter;
  allChapters: HistoryChapter[];
}

export default function HistoryNavigation({
  currentChapter,
  previousChapter,
  nextChapter,
  allChapters,
}: HistoryNavigationProps) {
  const theme = useTheme();
  const router = useRouter();

  const currentIndex = allChapters.findIndex(
    (ch) => ch.slug === currentChapter.slug
  );
  const progress = ((currentIndex + 1) / allChapters.length) * 100;

  const handlePrevious = () => {
    if (previousChapter) {
      router.push(`/historia/${previousChapter.slug}`);
    }
  };

  const handleNext = () => {
    if (nextChapter) {
      router.push(`/historia/${nextChapter.slug}`);
    }
  };

  const handleTimeline = () => {
    router.push("/historia");
  };

  return (
    <Box
      sx={{
        position: "sticky",
        bottom: 0,
        backgroundColor: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`,
        boxShadow: "0 -4px 20px rgba(0,0,0,0.1)",
        p: 2,
        zIndex: 100,
      }}
    >
      {/* Barra de progreso */}
      <Box sx={{ mb: 2 }}>
        <Box
          sx={{
            width: "100%",
            height: "4px",
            backgroundColor: theme.palette.grey[200],
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              width: `${progress}%`,
              height: "100%",
              backgroundColor:
                currentChapter.color || theme.palette.primary.main,
              borderRadius: 2,
              transition: "width 0.5s ease",
            }}
          />
        </Box>
        <Typography
          variant="caption"
          sx={{
            display: "block",
            textAlign: "center",
            mt: 0.5,
            color: theme.palette.text.secondary,
          }}
        >
          Capítulo {currentIndex + 1} de {allChapters.length}
        </Typography>
      </Box>

      {/* Navegación */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        {/* Botón anterior */}
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={handlePrevious}
          disabled={!previousChapter}
          sx={{
            minWidth: "120px",
            borderColor: currentChapter.color,
            color: currentChapter.color,
            "&:hover": {
              borderColor: currentChapter.color,
              backgroundColor: `${currentChapter.color}10`,
            },
            "&.Mui-disabled": {
              borderColor: theme.palette.grey[300],
              color: theme.palette.grey[400],
            },
          }}
        >
          <Box sx={{ textAlign: "left" }}>
            <Typography variant="caption" display="block">
              Anterior
            </Typography>
            {previousChapter && (
              <Typography
                variant="body2"
                sx={{
                  fontSize: "0.75rem",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "100px",
                }}
              >
                {previousChapter.title}
              </Typography>
            )}
          </Box>
        </Button>

        {/* Botón timeline central */}
        <Button
          variant="contained"
          startIcon={<Timeline />}
          onClick={handleTimeline}
          sx={{
            backgroundColor: currentChapter.color,
            "&:hover": {
              backgroundColor: currentChapter.color,
              filter: "brightness(0.9)",
            },
            minWidth: "140px",
            fontWeight: 600,
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" display="block">
              Timeline
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              Ver todo
            </Typography>
          </Box>
        </Button>

        {/* Botón siguiente */}
        <Button
          variant="outlined"
          endIcon={<ArrowForward />}
          onClick={handleNext}
          disabled={!nextChapter}
          sx={{
            minWidth: "120px",
            borderColor: currentChapter.color,
            color: currentChapter.color,
            "&:hover": {
              borderColor: currentChapter.color,
              backgroundColor: `${currentChapter.color}10`,
            },
            "&.Mui-disabled": {
              borderColor: theme.palette.grey[300],
              color: theme.palette.grey[400],
            },
          }}
        >
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="caption" display="block">
              Siguiente
            </Typography>
            {nextChapter && (
              <Typography
                variant="body2"
                sx={{
                  fontSize: "0.75rem",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "100px",
                }}
              >
                {nextChapter.title}
              </Typography>
            )}
          </Box>
        </Button>
      </Box>

      {/* Información del capítulo actual */}
      <Box sx={{ textAlign: "center", mt: 2 }}>
        <Typography
          variant="body2"
          sx={{
            color: currentChapter.color,
            fontWeight: 600,
          }}
        >
          {currentChapter.icon} {currentChapter.title} ({currentChapter.period})
        </Typography>
      </Box>
    </Box>
  );
}
