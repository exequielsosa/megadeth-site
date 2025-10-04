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
  Box,
} from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LanguageIcon from "@mui/icons-material/Language";
import { useColorMode } from "@/theme/useColorMode";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const { mode, toggle } = useColorMode();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const currentLocale = useLocale();
  const t = useTranslations("navigation");
  const pathname = usePathname();

  const navigationItems = [
    { label: t("home"), href: "/" },
    { label: t("tour"), href: "/tour" },
  ];

  const handleLanguageClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (locale: string) => {
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
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
              <Image
                src="/logo-megadeth.png"
                alt="Megadeth"
                width={200}
                height={47}
              />
            </Link>
          </Typography>

          {/* Navegación centrada */}
          <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
            <Box sx={{ display: "flex", gap: 1 }}>
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Button
                    key={item.href}
                    component={Link}
                    href={item.href}
                    sx={{
                      position: "relative",
                      color: "text.primary",
                      textTransform: "uppercase",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      letterSpacing: "0.5px",
                      px: 3,
                      py: 1,
                      transition: "all 0.3s ease",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        bottom: 0,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: isActive ? "80%" : "0%",
                        height: "2px",
                        backgroundColor: "primary.main",
                        transition: "width 0.3s ease",
                      },
                      "&:hover": {
                        backgroundColor: "transparent",
                        color: "primary.main",
                        "&::after": {
                          width: "80%",
                        },
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Box>
          </Box>

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
