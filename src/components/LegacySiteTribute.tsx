"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  Box,
  Button,
  Container,
  Dialog,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

// El sitio original se sirve estático desde public/archivo. Se abre home.htm
// (el frameset con el menú) y no index.htm, que era la intro en Flash.
const LEGACY_SITE_URL = "/archivo/megadeth-argentina/home.htm";
// Ventana del visor: un toque más ancha que los 800×600 originales, así el
// frame de contenido respira sin cambiar el alto.
const VIEWER_WIDTH = 960;
const VIEWER_HEIGHT = 600;
// Dimensiones reales del screenshot del hero (distintas del visor).
const SCREENSHOT_WIDTH = 800;
const SCREENSHOT_HEIGHT = 600;
// Alto aproximado de la barra de título + la nota inferior del diálogo.
const DIALOG_CHROME_HEIGHT = 96;
// Tratamiento de material de archivo: desaturado, sin blur.
const ARCHIVE_FILTER = "grayscale(1) sepia(0.55) contrast(1.05)";

// Escala para que la ventana del visor entre completa en pantalla (en mobile
// queda achicada), sin agrandarla nunca por encima del tamaño real.
function getViewerScale() {
  const gutter = window.innerWidth < 600 ? 16 : 32;
  return Math.min(
    1,
    (window.innerWidth - gutter * 2) / VIEWER_WIDTH,
    (window.innerHeight - gutter * 2 - DIALOG_CHROME_HEIGHT) / VIEWER_HEIGHT,
  );
}

export default function LegacySiteTribute() {
  const t = useTranslations("legacySite");
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(1);
  // Cambiar la key remonta el iframe y lo devuelve a home.htm.
  const [viewerKey, setViewerKey] = useState(0);

  useEffect(() => {
    if (!open) return;
    const update = () => setScale(getViewerScale());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [open]);

  // La escala se calcula antes de abrir: si el primer render del popup usara
  // escala 1, en mobile aparecería un instante a 960px de ancho.
  const openViewer = () => {
    setScale(getViewerScale());
    setOpen(true);
  };

  const viewerWidth = Math.floor(VIEWER_WIDTH * scale);
  const viewerHeight = Math.floor(VIEWER_HEIGHT * scale);

  return (
    <Box
      component="section"
      aria-labelledby="legacy-site-title"
      sx={{
        py: { xs: 6, md: 8 },
        borderTop: 1,
        borderColor: "divider",
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "#0a0a0b" : "#f4f4f5",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.1fr 1fr" },
            gap: { xs: 4, md: 6 },
            alignItems: "center",
          }}
        >
          <Box component="figure" sx={{ m: 0 }}>
            <Box
              component="button"
              type="button"
              onClick={openViewer}
              aria-label={t("cta")}
              sx={{
                display: "block",
                width: "100%",
                p: 0,
                border: (theme) =>
                  `2px solid ${
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.12)"
                      : "rgba(0, 0, 0, 0.12)"
                  }`,
                borderRadius: 1,
                overflow: "hidden",
                bgcolor: "#000",
                cursor: "pointer",
                boxShadow: "0 12px 32px rgba(0, 0, 0, 0.35)",
                transition: "border-color 0.3s ease, transform 0.3s ease",
                "& img": {
                  filter: ARCHIVE_FILTER,
                  transition: "filter 0.5s ease",
                },
                "&:hover, &:focus-visible": {
                  borderColor: "rgba(220, 20, 60, 0.7)",
                  transform: "translateY(-2px)",
                },
                "&:hover img, &:focus-visible img": { filter: "none" },
                "&:focus-visible": { outline: "2px solid #dc143c" },
              }}
            >
              <Image
                src="/images/megadeth-argentina-2000.webp"
                alt={t("imageAlt")}
                width={SCREENSHOT_WIDTH}
                height={SCREENSHOT_HEIGHT}
                sizes="(max-width: 900px) 100vw, 600px"
                style={{ display: "block", width: "100%", height: "auto" }}
              />
            </Box>
            <Typography
              component="figcaption"
              variant="caption"
              sx={{
                display: "block",
                mt: 1.5,
                color: "text.secondary",
                fontStyle: "italic",
              }}
            >
              {t("quote")}
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="overline"
              sx={{
                display: "block",
                letterSpacing: 2,
                fontWeight: 700,
                color: (theme) =>
                  theme.palette.mode === "dark" ? "#ff4444" : "#dc143c",
              }}
            >
              {t("eyebrow")}
            </Typography>
            <Typography
              id="legacy-site-title"
              variant="h2"
              component="h2"
              sx={{ fontSize: { xs: 28, md: 40 }, fontWeight: 800, mb: 2 }}
            >
              {t("title")}
            </Typography>
            {(["paragraph1", "paragraph2", "paragraph3"] as const).map(
              (key) => (
                <Typography
                  key={key}
                  variant="body1"
                  sx={{ color: "text.secondary", mb: 2, lineHeight: 1.7 }}
                >
                  {t(key)}
                </Typography>
              ),
            )}
            <Button
              variant="contained"
              size="large"
              onClick={openViewer}
              sx={{
                mt: 1,
                background: (theme) =>
                  theme.palette.mode === "dark"
                    ? "linear-gradient(135deg, #8b0000 0%, #dc143c 100%)"
                    : "linear-gradient(135deg, #dc143c 0%, #ff4444 100%)",
                color: "white",
                fontWeight: 700,
                px: 3,
                borderRadius: 2,
                textTransform: "none",
                "&:hover": {
                  background: (theme) =>
                    theme.palette.mode === "dark"
                      ? "linear-gradient(135deg, #a00000 0%, #ff4444 100%)"
                      : "linear-gradient(135deg, #c00000 0%, #dc143c 100%)",
                },
              }}
            >
              {t("cta")}
            </Button>
          </Box>
        </Box>
      </Container>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth={false}
        aria-labelledby="legacy-site-dialog-title"
        slotProps={{
          paper: {
            sx: {
              m: { xs: 1, sm: 2 },
              // Ancho exacto del visor: si no, el título largo estira el
              // Paper y queda una franja vacía al costado del sitio.
              width: viewerWidth,
              // MUI limita el Paper a calc(100% - 64px) por defecto, que en
              // mobile recorta la ventana escalada. Tiene que coincidir con el
              // margen de arriba y con el gutter de getViewerScale.
              maxWidth: { xs: "calc(100% - 16px)", sm: "calc(100% - 32px)" },
              maxHeight: { xs: "calc(100% - 16px)", sm: "calc(100% - 32px)" },
              bgcolor: "#000",
              border: "1px solid rgba(220, 20, 60, 0.6)",
              borderRadius: 1,
              overflow: "hidden",
            },
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            px: 1.5,
            py: 0.5,
            bgcolor: "#151517",
            borderBottom: "1px solid rgba(220, 20, 60, 0.4)",
          }}
        >
          <Typography
            id="legacy-site-dialog-title"
            variant="subtitle2"
            noWrap
            sx={{ flex: 1, color: "#fff", fontWeight: 600 }}
          >
            {t("dialogTitle")}
          </Typography>
          <Tooltip title={t("home")}>
            <IconButton
              size="small"
              aria-label={t("home")}
              onClick={() => setViewerKey((key) => key + 1)}
              sx={{ color: "#fff" }}
            >
              <HomeIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("openFullSize")}>
            <IconButton
              size="small"
              component="a"
              href={LEGACY_SITE_URL}
              target="_blank"
              rel="noopener"
              aria-label={t("openFullSize")}
              sx={{ color: "#fff" }}
            >
              <OpenInNewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("close")}>
            <IconButton
              size="small"
              aria-label={t("close")}
              onClick={() => setOpen(false)}
              sx={{ color: "#fff" }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <Box
          sx={{
            width: viewerWidth,
            height: viewerHeight,
            // clip y no hidden: el iframe mide 960px reales dentro de esta caja
            // más chica, y con hidden la caja se puede desplazar (foco,
            // scrollIntoView) y correr el sitio de costado. clip no es
            // desplazable. hidden queda como fallback para Safari < 16.
            overflow: "hidden",
            "@supports (overflow: clip)": { overflow: "clip" },
            bgcolor: "#000",
          }}
        >
          <Box
            key={viewerKey}
            component="iframe"
            src={LEGACY_SITE_URL}
            title={t("iframeTitle")}
            sx={{
              display: "block",
              width: VIEWER_WIDTH,
              height: VIEWER_HEIGHT,
              border: 0,
              transform: `scale(${scale})`,
              transformOrigin: "0 0",
            }}
          />
        </Box>

        <Typography
          variant="caption"
          sx={{
            display: "block",
            width: viewerWidth,
            px: 1.5,
            py: 1,
            color: "rgba(255, 255, 255, 0.6)",
            bgcolor: "#151517",
          }}
        >
          {t("archiveNote")}
        </Typography>
      </Dialog>
    </Box>
  );
}
