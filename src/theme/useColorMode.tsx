"use client";

import { createContext, useContext, useMemo, useState } from "react";

type ColorMode = "light" | "dark";
type Ctx = { mode: ColorMode; toggle: () => void };

const ColorModeContext = createContext<Ctx | undefined>(undefined);
export const useColorMode = () => {
  const ctx = useContext(ColorModeContext);
  if (!ctx)
    throw new Error("useColorMode must be used within ColorModeProvider");
  return ctx;
};

export const ColorModeProvider = ({
  children,
  initialMode = "dark",
}: {
  children: React.ReactNode;
  initialMode?: ColorMode;
}) => {
  const [mode, setMode] = useState<ColorMode>(initialMode);

  const toggle = () =>
    setMode((prev) => {
      const next = prev === "light" ? "dark" : "light";
      window.localStorage.setItem("color-mode", next);
      document.cookie = `color-mode=${next};max-age=31536000;path=/`;
      return next;
    });

  const value = useMemo(() => ({ mode, toggle }), [mode]);
  return (
    <ColorModeContext.Provider value={value}>
      {children}
    </ColorModeContext.Provider>
  );
};
