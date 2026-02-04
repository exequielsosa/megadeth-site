'use client';

import { createTheme, ThemeOptions } from '@mui/material/styles';

export const getDesignTokens = (mode: 'light' | 'dark'): ThemeOptions => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
        primary: { main: '#B57EDC' }, // lavanda elegante
        secondary: { main: '#FFB7C5' }, // rosa suave
        background: { default: '#FFF8F0', paper: '#FFFFFF' }, // crema cálido
      }
      : {
        primary: { main: '#C3A6E8' },
        secondary: { main: '#FFC2CF' },
        background: { default: '#1C1F2B', paper: '#24283A' }, // azul oscuro elegante
      }),
  },
  typography: {
    fontFamily: ['var(--font-body)', 'Inter', 'system-ui', 'Arial'].join(','),
    h1: { fontFamily: 'var(--font-heading)', fontWeight: 700, letterSpacing: -0.5 },
    h2: { fontFamily: 'var(--font-heading)', fontWeight: 600 },
    h3: { fontFamily: 'var(--font-heading)', fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  shape: { borderRadius: 10 },
});

export const makeTheme = (mode: 'light' | 'dark') => createTheme(getDesignTokens(mode));
