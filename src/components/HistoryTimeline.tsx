"use client";

import { Box, Typography, Chip, useTheme } from "@mui/material";
import { HistoryChapter } from "@/types/historia";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface HistoryTimelineProps {
  chapters: HistoryChapter[];
  currentChapter?: string;
}

export default function HistoryTimeline({
  chapters,
  currentChapter,
}: HistoryTimelineProps) {
  const theme = useTheme();
  const router = useRouter();
  const [hoveredChapter, setHoveredChapter] = useState<string | null>(null);

  const handleChapterClick = (chapterSlug: string) => {
    router.push(`/historia/${chapterSlug}`);
  };

  const getChapterPosition = (index: number) => {
    const totalChapters = chapters.length;
    return (index / (totalChapters - 1)) * 100;
  };

  const getChapterColor = (chapter: HistoryChapter, index: number) => {
    if (chapter.color) return chapter.color;

    // Colores predeterminados por era
    const colors = [
      "#8B0000", // Rojo oscuro - Orígenes
      "#4A0E4E", // Púrpura - Ascenso y caos
      "#DAA520", // Dorado - Éxito masivo
      "#8B4513", // Marrón - Crisis
      "#1E90FF", // Azul - Renacimiento
      "#FF6347", // Tomate - Despedida
    ];
    return colors[index % colors.length];
  };

  const isSmallScreen = theme.breakpoints.down("lg");

  return (
    <Box sx={{ position: "relative", py: 10, px: 2, height: "200px" }}>
      {/* Línea principal del timeline */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "10%",
          right: "10%",
          height: "4px",
          background: `linear-gradient(90deg, ${chapters
            .map(
              (chapter, index) =>
                `${getChapterColor(chapter, index)} ${getChapterPosition(
                  index
                )}%`
            )
            .join(", ")})`,
          borderRadius: 2,
          transform: "translateY(-50%)",
          zIndex: 1,
        }}
      />

      {/* Puntos y tarjetas de capítulos */}
      <Box sx={{ position: "relative", zIndex: 2 }}>
        {chapters.map((chapter, index) => {
          const leftPosition = 10 + getChapterPosition(index) * 0.8;
          const isActive = currentChapter === chapter.slug;
          const isHovered = hoveredChapter === chapter.slug;
          const chapterColor = getChapterColor(chapter, index);

          return (
            <Box
              key={chapter.id}
              sx={{
                position: "absolute",
                left: `${leftPosition}%`,
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              {/* Punto del timeline */}
              <Box
                sx={{
                  width: isActive ? 20 : isHovered ? 16 : 12,
                  height: isActive ? 20 : isHovered ? 16 : 12,
                  borderRadius: "50%",
                  backgroundColor: chapterColor,
                  border: `3px solid ${theme.palette.background.paper}`,
                  boxShadow: isActive
                    ? `0 0 20px ${chapterColor}50`
                    : "0 4px 12px rgba(0,0,0,0.2)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  position: "relative",
                  zIndex: 3,
                  "&:hover": {
                    transform: "scale(1.2)",
                    boxShadow: `0 0 25px ${chapterColor}70`,
                  },
                }}
                onClick={() => handleChapterClick(chapter.slug)}
                onMouseEnter={() => setHoveredChapter(chapter.slug)}
                onMouseLeave={() => setHoveredChapter(null)}
              />

              {/* Tarjeta de información */}
              <Box
                sx={{
                  position: "absolute",
                  top: index % 2 === 0 ? "-140px" : "70px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "260px",
                  opacity: isHovered || isActive ? 1 : 0.7,
                  transition: "all 0.3s ease",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 2,
                  cursor: "pointer",
                  "&:hover": {
                    opacity: 1,
                    transform: "translateX(-50%) translateY(-2px)",
                  },
                }}
                onClick={() => handleChapterClick(chapter.slug)}
                onMouseEnter={() => setHoveredChapter(chapter.slug)}
                onMouseLeave={() => setHoveredChapter(null)}
              >
                <Box
                  sx={{
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: 2,
                    padding: 1.5,
                    boxShadow: isActive
                      ? `0 6px 20px ${chapterColor}30`
                      : "0 3px 12px rgba(0,0,0,0.1)",
                    border: isActive ? `2px solid ${chapterColor}` : "none",
                    transition: "all 0.3s ease",
                  }}
                >
                  {/* Icono y período */}
                  <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                    <Chip
                      label={chapter.period}
                      size="small"
                      sx={{
                        backgroundColor: `${chapterColor}20`,
                        color: chapterColor,
                        fontWeight: 600,
                        fontSize: "0.6rem",
                        height: "18px",
                      }}
                    />
                  </Box>

                  {/* Título */}
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      color: theme.palette.text.primary,
                      mb: 0.3,
                      lineHeight: 1.2,
                    }}
                  >
                    {chapter.title}
                  </Typography>

                  {/* Subtítulo */}
                  {chapter.subtitle && (
                    <Typography
                      variant="body2"
                      sx={{
                        color: chapterColor,
                        fontWeight: 500,
                        fontSize: "0.7rem",
                        mb: 0.5,
                        fontStyle: "italic",
                      }}
                    >
                      {chapter.subtitle}
                    </Typography>
                  )}

                  {/* Resumen */}
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.secondary,
                      fontSize: "0.7rem",
                      lineHeight: 1.3,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {chapter.summary}
                  </Typography>

                  {/* Indicador de flecha */}
                  <Box
                    sx={{
                      position: "absolute",
                      left: "50%",
                      [index % 2 === 0 ? "bottom" : "top"]: "-8px",
                      transform: "translateX(-50%)",
                      width: 0,
                      height: 0,
                      borderLeft: "8px solid transparent",
                      borderRight: "8px solid transparent",
                      [index % 2 === 0
                        ? "borderTop"
                        : "borderBottom"]: `8px solid ${theme.palette.background.paper}`,
                    }}
                  />
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Años de inicio y fin */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: 4,
          px: "10%",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: "text.secondary" }}
        >
          {chapters[0]?.yearStart}
        </Typography>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: "text.secondary" }}
        >
          {chapters[chapters.length - 1]?.yearEnd}
        </Typography>
      </Box>
    </Box>
  );
}
