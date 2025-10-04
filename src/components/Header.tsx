"use client";

import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Container,
} from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useColorMode } from "@/theme/useColorMode";
import Image from "next/image";

export default function Header() {
  const { mode, toggle } = useColorMode();

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
          <IconButton onClick={toggle} aria-label="Cambiar tema" edge="end">
            {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
