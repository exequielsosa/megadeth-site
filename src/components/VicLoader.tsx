"use client";

import { Box } from "@mui/material";

interface VicLoaderProps {
  size?: number; // Tamaño en píxeles (default: 150)
}

/**
 * Loader animado de Vic Rattlehead (mascota de Megadeth)
 * Animación en 3 fases: dibujado (outline) → relleno → fade out
 */
export default function VicLoader({ size = 150 }: VicLoaderProps) {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100%"
    >
      <Box
        sx={{
          width: size,
          height: size,
          "& .vic-svg": {
            width: "100%",
            height: "100%",
            display: "block",
            overflow: "visible",
          },
          "& .vic-path": {
            fill: "transparent",
            stroke: "#444",
            strokeWidth: 2,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeDasharray: 400,
            strokeDashoffset: 400,
            animation: "vic-cycle 4s ease-in-out infinite",
          },
          "& .vic-details": {
            strokeWidth: 2.5,
          },
          "@keyframes vic-cycle": {
            "0%": {
              strokeDashoffset: 400,
              fill: "transparent",
              opacity: 0,
            },
            "10%": {
              opacity: 1,
            },
            "40%": {
              strokeDashoffset: 0,
              fill: "transparent",
              stroke: "#444",
            },
            "50%": {
              fill: "#e5e4e2",
              stroke: "#000",
            },
            "75%": {
              fill: "#e5e4e2",
              stroke: "#000",
              opacity: 1,
            },
            "90%": {
              opacity: 0,
              fill: "#e5e4e2",
            },
            "100%": {
              opacity: 0,
              strokeDashoffset: 400,
              fill: "transparent",
            },
          },
        }}
      >
        <svg
          className="vic-svg"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g>
            {/* Cráneo */}
            <path
              className="vic-path"
              d="M 25,30 Q 50,5 75,30 L 75,60 Q 75,95 50,95 Q 25,95 25,60 Z"
            />

            {/* Visera */}
            <path
              className="vic-path vic-details"
              d="M 18,35 L 82,35 L 78,52 L 22,52 Z"
            />

            {/* Ojos (líneas) */}
            <path
              className="vic-path"
              d="M 25,44 L 25,44 M 75,44 L 75,44"
              strokeWidth={3}
            />

            {/* Boca */}
            <path className="vic-path" d="M 35,75 L 65,75" />
            <path
              className="vic-path vic-details"
              d="M 40,68 L 40,82 M 50,68 L 50,82 M 60,68 L 60,82"
            />

            {/* Tornillos laterales */}
            <circle cx="18" cy="55" r="4" className="vic-path" />
            <circle cx="82" cy="55" r="4" className="vic-path" />
          </g>
        </svg>
      </Box>
    </Box>
  );
}
