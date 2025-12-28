# Megadeth Fan Site - AI Development Guide

## Architecture Overview

This is a Next.js 15 App Router project with Material-UI theming and international routing. The site is a Megadeth fan hub featuring discography, tour dates, videos, and DVDs.

**Key Tech Stack:**

- Next.js 15 with App Router and TypeScript
- Material-UI v6 with custom theming and color mode switching
- next-intl for i18n (English/Spanish) with automatic locale detection
- Static data from JSON files in `src/constants/`

## Project Structure & Data Flow

**Content Management:**

- All content is static JSON in `src/constants/`: discography, live albums, compilations, eps, dvds, videos, tour dates
- Translations in `messages/` directory (es.json, en.json)
- Types defined in `src/types/` - always check existing types before creating new ones

**Routing Pattern:**

- Dynamic routes use `[param]` folders with `generateStaticParams()` for SSG
- Example: `discography/[albumId]/page.tsx` searches across ALL album JSON files
- Always implement proper metadata generation for SEO

## Critical Development Patterns

**Internationalization:**

- Use `next-intl` hooks: `useTranslations()`, `getLocale()`, `getMessages()`
- Locale switching via `useRouter()` from `next-intl/                                                                                                                                                                                                                                                                                                     `
- All user-facing text must support es/en locales
- Content descriptions often have `{es: "", en: ""}` structure in JSON

**Material-UI Integration:**

- Custom theme in `src/theme/createTheme.ts` with light/dark variants
- ThemeRegistry wraps app with emotion/SSR compatibility
- Color mode via custom hook `useColorMode()` with localStorage persistence
- Use MUI Grid v2 syntax: `<Grid size={{ xs: 12, md: 6 }}>`

**Data Handling:**

- Search functions check multiple data sources (see `getAlbumById()` in `[albumId]/page.tsx`)
- Sort by year DESC for chronological displays
- Use TypeScript types from `src/types/` for all data structures

## Component Conventions

**Common Patterns:**

- Components are functional with TypeScript props interfaces
- Client components marked with `"use client"` when using hooks/events
- Container wrapping with Material-UI `<Container maxWidth="lg">`
- Grid layouts for responsive card displays

**Image Handling:**

- Static images in `public/images/` with organized subdirectories
- Album covers, DVD images, and other assets use descriptive naming
- WebP format preferred for optimization

## Development Commands

```bash
npm run dev          # Development server on localhost:3000
npm run build        # Production build with static generation
npm run start        # Start production server
npm run lint         # ESLint check
```

## Key Files for Extension

- `src/constants/` - Add new content data here
- `src/types/` - Define TypeScript interfaces
- `src/components/` - Reusable UI components
- `messages/` - Add translations for new features
- `src/app/` - Add new pages following existing patterns

When adding new features, follow the established patterns for i18n, theming, and data structure. Always implement proper TypeScript typing and responsive design.
