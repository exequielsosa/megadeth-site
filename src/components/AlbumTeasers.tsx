"use client";

import { Box, Typography, Container, Link } from "@mui/material";
import { useTranslations } from "next-intl";
import YouTubeShortsGrid from "./YouTubeShortsGrid";
import Divider from "@mui/material/Divider";

// Datos de los shorts de YouTube con adelantos del álbum
const albumTeasers = [
  { videoId: "wGFXDH2icWo", title: "Burnation" },
  { videoId: "MgPxmHwngwY", title: "Portals to Oblivion" },
  { videoId: "OKTUGBSSgwk", title: "Sector 11" },
  { videoId: "CK_H8wdvf3U", title: "Tyranny of the Masses" },
  { videoId: "_sg3PZr0jBo", title: "Tyranny of the Masses" },
  { videoId: "TXESFifrU8I", title: "Lethal Weapon" },
  { videoId: "Va6xdEqEEH4", title: "Lethal Weapon" },
  { videoId: "AV3AHemom-A", title: "Alchemist" },
];

export default function AlbumTeasers() {
  const t = useTranslations("albumTeasers");

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth={false} sx={{ maxWidth: 1440, mx: "auto" }}>
        <Divider sx={{ marginBottom: 8 }} />
        <Typography variant="h3" sx={{ fontSize: { xs: 22, md: 48 } }}>
          {t("title") || "Album Previews"}
        </Typography>

        <Typography
          variant="h6"
          component="p"
          sx={{
            mb: 2,
            textAlign: "left",
            color: "text.secondary",
            maxWidth: 600,
            fontSize: { xs: 14, md: 20 },
          }}
        >
          {t("subtitle") ||
            "Exclusive previews and teasers from the upcoming final album"}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            mb: 4,
            textAlign: "left",
            color: "text.secondary",
            fontSize: { xs: 12, md: 14 },
          }}
        >
          {t("credits") || "Credits:"}{" "}
          <Link
            href="https://www.youtube.com/channel/UCM2fBHcpAgNAH9K07ySyzhA"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: "primary.main",
              textDecoration: "none",
              fontWeight: 600,
              "&:hover": {
                textDecoration: "underline",
                color: "primary.dark",
              },
            }}
          >
            @trolliumTV
          </Link>
        </Typography>

        <YouTubeShortsGrid shorts={albumTeasers} />
      </Container>
    </Box>
  );
}
