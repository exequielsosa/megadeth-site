"use client";

import { useState, useEffect } from "react";
import { Fab, useTheme } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const theme = useTheme();

  const toggleVisibility = () => {
    setIsVisible(window.scrollY > 300);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <Fab
      onClick={scrollToTop}
      aria-label="scroll to top"
      sx={{
        position: "fixed",
        bottom: { xs: 24, md: 32 },
        right: { xs: 24, md: 32 },
        opacity: isVisible ? 0.7 : 0,
        pointerEvents: isVisible ? "auto" : "none",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        backgroundColor: theme.palette.mode === "dark"
          ? "rgba(255, 255, 255, 0.1)"
          : "rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(8px)",
        border: `1px solid ${theme.palette.divider}`,
        width: { xs: 48, md: 56 },
        height: { xs: 48, md: 56 },
        "&:hover": {
          opacity: 1,
          backgroundColor: theme.palette.mode === "dark"
            ? "rgba(255, 255, 255, 0.2)"
            : "rgba(0, 0, 0, 0.15)",
          transform: "translateY(-4px)",
        },
        color: theme.palette.text.primary,
      }}
    >
      <KeyboardArrowUpIcon sx={{ fontSize: { xs: 24, md: 28 } }} />
    </Fab>
  );
}
