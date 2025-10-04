'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type ColorMode = 'light' | 'dark';
type Ctx = { mode: ColorMode; toggle: () => void };

const ColorModeContext = createContext<Ctx | undefined>(undefined);
export const useColorMode = () => {
  const ctx = useContext(ColorModeContext);
  if (!ctx) throw new Error('useColorMode must be used within ColorModeProvider');
  return ctx;
};

export const ColorModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<ColorMode>('light');

  useEffect(() => {
    const saved = window.localStorage.getItem('color-mode') as ColorMode | null;
    if (saved) setMode(saved);
    else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setMode('dark');
    }
  }, []);

  const toggle = () =>
    setMode(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      window.localStorage.setItem('color-mode', next);
      return next;
    });

  const value = useMemo(() => ({ mode, toggle }), [mode]);
  return <ColorModeContext.Provider value={value}>{children}</ColorModeContext.Provider>;
};
