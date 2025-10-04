"use client";

import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LanguageIcon from "@mui/icons-material/Language";
import { useColorMode } from "@/theme/useColorMode";
import { useState } from "react";
import Image from "next/image";

export default function Header() {
  const { mode, toggle } = useColorMode();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentLocale, setCurrentLocale] = useState("en");

  const handleLanguageClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (locale: string) => {
    setCurrentLocale(locale);
    document.cookie = `NEXT_LOCALE=${locale}; max-age=31536000; path=/`;
    window.location.reload();
    handleLanguageClose();
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="transparent"
      sx={{ padding: 1 }}
    >
      <Container maxWidth={false} sx={{ maxWidth: 1440, mx: "auto" }}>
        <Toolbar sx={{ gap: 2, px: { xs: 2, sm: 3 } }}>
          <Typography variant="h6" sx={{ fontWeight: 800, flexGrow: 1 }}>
            <Image
              src="/logo-megadeth.png"
              alt="Megadeth"
              width={200}
              height={47}
            />
          </Typography>

          <Button
            startIcon={<LanguageIcon />}
            onClick={handleLanguageClick}
            sx={{ textTransform: "uppercase", minWidth: "auto" }}
          >
            {currentLocale}
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleLanguageClose}
          >
            <MenuItem onClick={() => handleLanguageChange("en")}>
              English
            </MenuItem>
            <MenuItem onClick={() => handleLanguageChange("es")}>
              Español
            </MenuItem>
          </Menu>

          <IconButton onClick={toggle} aria-label="Cambiar tema" edge="end">
            {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
