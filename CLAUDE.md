# Megadeth Site — Claude Code Context

## Descripción
Sitio web fan/informativo de Megadeth con noticias automatizadas por IA, setlists en tiempo real, discografía, historia de la banda y contenido multiidioma (ES/EN).

---

## Stack Tecnológico

| Categoría | Tecnología |
|---|---|
| Framework | Next.js 15 — App Router + Edge Runtime |
| Lenguaje | TypeScript 5 (strict mode) |
| UI | React 19 + MUI v7 + Emotion |
| Base de datos | Supabase (PostgreSQL) |
| Cache/KV | Vercel KV (Redis) |
| IA | Google Gemini 2.5-flash + Groq SDK |
| i18n | next-intl v4 — EN y ES |
| Scraping | RSS Parser + News API |
| Analytics | Google Analytics GA4 |
| Deploy | Vercel (Edge Functions + Cron) |
| Validación | Zod |

---

## Estructura de Directorios

```
src/
├── app/
│   ├── api/
│   │   ├── comments/route.ts       # GET/POST comentarios (rate limit, honeypot)
│   │   ├── cron/warm-shows/        # Cron para pre-calentar cache (6 AM UTC)
│   │   ├── last-show/route.ts      # Último show + show de hace 20 años
│   │   ├── news/create/route.ts    # POST crear noticias (requiere API key)
│   │   ├── show/route.ts           # Detalle de show individual
│   │   └── tour/route.ts           # Lista de fechas de tour paginada
│   ├── [sección]/                  # Páginas: discography, shows, noticias, miembros, etc.
│   ├── layout.tsx                  # Root layout con ThemeRegistry, Header, Footer, GA
│   ├── page.tsx                    # Homepage — ISR cada 5 min, muestra top 5 noticias
│   ├── sitemap.ts                  # Sitemap dinámico
│   └── robots.ts
├── components/                     # ~40 componentes React
│   └── atoms/                      # Componentes UI base
├── constants/                      # JSON estáticos: discography, members, shows, reviews, etc.
├── data/                           # Datos raw: shows.raw.json, songs.meta.json
├── lib/
│   ├── supabase.ts                 # Cliente Supabase + helpers
│   ├── gemini.ts                   # Integración Gemini AI
│   ├── kv.ts                       # Wrapper Vercel KV
│   ├── ai.ts                       # Utilidades AI genéricas
│   └── validations/                # Schemas Zod
├── types/                          # Types TypeScript (supabase.ts autogenerado)
├── theme/                          # MUI theme, ThemeRegistry, dark mode
├── i18n/                           # config.ts y request.ts para next-intl
├── utils/                          # Helpers varios
└── scripts/                        # Scripts client-side

scripts/                            # Scripts Node.js para CLI
├── supabase-schema.sql             # Schema de la DB
├── scrape-news.js                  # Scraping RSS
├── migrate-news.js                 # Migrar noticias a Supabase
├── verify-supabase.js
├── check-config.js
└── test-gemini.js

messages/
├── en.json                         # Traducciones inglés
└── es.json                         # Traducciones español

docs/                               # Documentación del proyecto
```

---

## Convenciones

### Routing y Componentes
- **Siempre App Router**. Nunca Pages Router.
- **Server Components por defecto**. Añadir `"use client"` solo para interactividad, hooks de estado o eventos del browser.
- **MUI para UI**. Nunca CSS modules ni Tailwind.

### Internacionalización
- Todo texto visible al usuario via **next-intl** (`useTranslations()`).
- Archivos de mensajes en `/messages/en.json` y `/messages/es.json`.
- **Nunca hardcodear** strings en inglés o español directamente en componentes.

### TypeScript
- **No usar `var`** — preferir `const` y `let`.
- Strict mode activo — todos los tipos deben ser correctos.
- Path alias: `@/*` → `./src/*`.

### Modo Oscuro
- Todos los componentes que se hagan deben mantener los patrones de estilo que usamos y soportar el modo oscuro.

---

## Base de Datos (Supabase)

### Tablas Principales
- `news_articles` — Noticias con campos bilingües (título, contenido EN/ES)
- `news_external_links` — Links externos asociados a artículos
- `comments` — Comentarios de usuarios con RLS y moderación
- Vista: `news_articles_with_links` — Join de artículos con sus links

### Reglas de Seguridad
- En servidor: usar `SUPABASE_SERVICE_KEY` (permisos completos).
- En cliente: usar `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- **NUNCA** exponer `SUPABASE_SERVICE_KEY` al cliente ni en variables `NEXT_PUBLIC_`.
- RLS (Row-Level Security) habilitado en todas las tablas.

---

## Estrategia de Cache

### Capas de Cache
1. **CDN (Vercel Edge)**: headers `Cache-Control` en respuestas HTTP.
2. **KV (Redis)**: cache persistente con patrones fresh/stale.
3. **ISR (Next.js)**: páginas con `export const revalidate = N`.

### Patrón Fresh/Stale en KV
- Datos guardados con timestamp. Si están dentro del período "fresh" → usar directamente.
- Si están "stale" (vencidos pero dentro del período de retención) → devolver stale y refrescar en background.
- Si no hay cache → llamar API externa, guardar en KV.
- Fallback graceful: si la API externa falla (ej. 429 de setlist.fm) → usar cache stale.

### TTLs por Endpoint
| Endpoint | Fresh | Stale/Retención |
|---|---|---|
| `/api/tour` | 60s–24h (según página) | 7d |
| `/api/last-show` | 24h | 30d |
| `/api/show` | 24h | 30d |
| `/api/comments` | 60s (version-based) | — |
| Homepage ISR | 5 min | — |

### Cache Warming
- Cron job en `/api/cron/warm-shows` se ejecuta diariamente a las **6 AM UTC**.
- Configurado en `vercel.json`.

---

## Pipeline de Noticias

1. **Scraping** → RSS de 20+ fuentes (Blabbermouth, Loudwire, Metal Injection, etc.) o input manual.
2. **Validación de relevancia** → Gemini AI verifica que el contenido sea sobre Megadeth.
3. **Procesamiento** → Gemini traduce, genera títulos y resume en ES/EN.
4. **Almacenamiento** → Supabase con links externos separados.
5. **Display** → Componentes bilingües via next-intl.

---

## API Routes

| Ruta | Método | Runtime | Propósito |
|---|---|---|---|
| `/api/comments` | GET/POST | Node.js | Comentarios — rate limit 10/hora por IP |
| `/api/last-show` | GET | Edge | Último show + show de hace 20 años |
| `/api/show?id=` | GET | Edge | Detalle de show con setlist |
| `/api/tour?page=` | GET | Edge | Fechas de tour paginadas |
| `/api/news/create` | POST | Node.js | Crear noticia (requiere `NEWS_API_KEY`) |
| `/api/cron/warm-shows` | GET | Edge | Calentar cache (requiere `CRON_SECRET`) |

---

## Variables de Entorno

```bash
# Públicas (NEXT_PUBLIC_)
NEXT_PUBLIC_GA_ID                  # Google Analytics 4
NEXT_PUBLIC_SUPABASE_URL           # URL Supabase (cliente)
NEXT_PUBLIC_SUPABASE_ANON_KEY      # Anon key Supabase (cliente)

# Solo servidor
SUPABASE_URL                       # URL Supabase (servidor)
SUPABASE_ANON_KEY                  # Anon key Supabase (servidor)
SUPABASE_SERVICE_KEY               # Service role key — NUNCA al cliente
SETLISTFM_API_KEY                  # API setlist.fm
MEGADETH_MBID                      # MusicBrainz ID de Megadeth
KV_REST_API_TOKEN                  # Vercel KV (escritura)
KV_REST_API_READ_ONLY_TOKEN        # Vercel KV (solo lectura)
KV_REST_API_URL                    # URL REST de Vercel KV
KV_URL / REDIS_URL                 # URL de conexión Redis
GEMINI_API_KEY                     # Google Gemini AI
GROQ_API_KEY                       # Groq AI
NEWS_API_KEY                       # Autenticación endpoint de noticias
NEWS_API_URL                       # URL del endpoint de noticias
CRON_SECRET                        # Bearer token para proteger endpoint cron
PRODUCTION_URL                     # URL base de producción (usado por cron)
```

---

## Scripts

```bash
npm run dev              # Servidor de desarrollo
npm run build            # Build de producción
npm run lint             # ESLint
npm run scrape:news      # Scrapear noticias desde RSS
npm run migrate:news     # Migrar noticias locales a Supabase
npm run verify:supabase  # Verificar conexión con Supabase
npm run check:config     # Validar configuración de variables de entorno
npm run test:gemini      # Probar integración con Gemini AI
npm run add:news         # Agregar noticias manualmente via CLI
```

---

## Seguridad

- Endpoints POST requieren autenticación por API key o Bearer token.
- Rate limiting en comentarios: 10 por hora por IP.
- Honeypot field para detección de spam en formularios.
- Sanitización de input del usuario (strip HTML, URLs, normalización).
- No exponer claves privadas en variables `NEXT_PUBLIC_`.

---

## Qué NO hacer

- No usar **Pages Router** — siempre App Router.
- No usar **CSS modules ni Tailwind** — solo MUI.
- No exponer **`SUPABASE_SERVICE_KEY`** al cliente.
- No **hardcodear strings de UI** — siempre next-intl.
- No usar **`var`** — solo `const` y `let`.
- No añadir comentarios, docstrings ni anotaciones de tipo a código que no se modificó.
- No agregar manejo de errores para escenarios imposibles — solo validar en boundaries del sistema.
- No crear abstracciones prematuras — preferir código directo y simple.


## Instrucciones para Claude
- Al final de cada sesión de trabajo, actualiza la sección "Estado actual" de este archivo con un resumen de lo que se hizo y qué queda pendiente.

## Estado actual