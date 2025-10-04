"use client";

import { AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useColorMode } from "@/theme/useColorMode";

export default function Header() {
  const { mode, toggle } = useColorMode();

  return (
    <AppBar position="sticky" elevation={0} color="transparent">
      <Toolbar sx={{ gap: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, flexGrow: 1 }}>
          Megadeth • Fan
        </Typography>
        <IconButton onClick={toggle} aria-label="Cambiar tema" edge="end">
          {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
