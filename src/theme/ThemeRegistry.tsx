"use client";

import * as React from "react";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { makeTheme } from "./createTheme";
import { useColorMode } from "./useColorMode";

const createEmotionCache = () => {
  return createCache({ key: "mui", prepend: true });
};

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const cache = React.useMemo(() => createEmotionCache(), []);
  const { mode } = useColorMode();

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={makeTheme(mode)}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
