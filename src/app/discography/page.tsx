import DiscographyGrid from "@/components/DiscographyGrid";
import studioAlbums from "../../constants/discography.json";
import liveAlbums from "../../constants/liveAlbums.json";
import compilations from "../../constants/compilations.json";
import eps from "../../constants/eps.json";
import ContainerGradient from "../../components/atoms/ContainerGradient";
import { Typography, Box } from "@mui/material";
import type { Album } from "@/types/album";
import { useTranslations } from "next-intl";

export const metadata = {
  title: "Discografía — Megadeth Fan",
  description:
    "Discografía completa de Megadeth: álbumes de estudio, en vivo, compilaciones, EPs, portadas, productores y links a streaming.",
};

export default function AlbumsPage() {
  const t = useTranslations("discography");

  return (
    <ContainerGradient>
      {/* Álbumes de Estudio */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontSize: { xs: "2rem", md: "3rem" },
            fontWeight: "bold",
            textAlign: "center",
            mb: 4,
            background: "linear-gradient(45deg, #ff6b6b, #4ecdc4)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {t("studioAlbums")}
        </Typography>
        <DiscographyGrid albums={studioAlbums as unknown as Album[]} />
      </Box>

      {/* Álbumes en Vivo */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h2"
          component="h2"
          sx={{
            fontSize: { xs: "2rem", md: "3rem" },
            fontWeight: "bold",
            textAlign: "center",
            mb: 4,
            background: "linear-gradient(45deg, #ff9800, #e91e63)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {t("liveAlbums")}
        </Typography>
        <DiscographyGrid albums={liveAlbums as unknown as Album[]} />
      </Box>

      {/* Compilaciones */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h2"
          component="h2"
          sx={{
            fontSize: { xs: "2rem", md: "3rem" },
            fontWeight: "bold",
            textAlign: "center",
            mb: 4,
            background: "linear-gradient(45deg, #9c27b0, #673ab7)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {t("compilations")}
        </Typography>
        <DiscographyGrid albums={compilations as unknown as Album[]} />
      </Box>

      {/* EPs */}
      <Box>
        <Typography
          variant="h2"
          component="h2"
          sx={{
            fontSize: { xs: "2rem", md: "3rem" },
            fontWeight: "bold",
            textAlign: "center",
            mb: 4,
            background: "linear-gradient(45deg, #795548, #ff5722)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {t("eps")}
        </Typography>
        <DiscographyGrid albums={eps as unknown as Album[]} />
      </Box>
    </ContainerGradient>
  );
}
