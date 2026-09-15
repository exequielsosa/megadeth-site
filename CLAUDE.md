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

### Completado (Jun 2026) — SEO home (nuevo Hero) + Tour

**SEO del nuevo Hero (`Hero.tsx` + `HeroTabs.tsx`)**
- Links del tracklist: se quitó el prefijo `/${locale}/` (daba 404; el sitio no tiene routing por locale).
- `TabPanel` ahora renderiza SIEMPRE el contenido y oculta solo con `hidden` (antes `value === index && children` dejaba 4 de 5 tabs fuera del DOM → no indexables).
- Fondos de tabs migrados de `background-image` CSS a `next/image` (`fill`) vía helper `TabBackground`; `priority` solo en el tab visible (LCP). Overlay y recorte preservados.
- `AnimatedCounter` reescrito con `IntersectionObserver` → anima al entrar en viewport y se resetea al salir (re-anima al cambiar de tab). Antes animaba al montar.
- Stat de Presentación: `63` "Álbumes y releases" → `17` "Álbumes de estudio" (coherente con el resto). Key `heroTabs.stats.albums` en ambos `messages`.

**Title/Description de la home (`layout.tsx`) acortados para SERP**
- Regla: title ≤ 60 car, description ~150-155 (lo clave en los primeros ~130).
- Title ES: "Megadeth Argentina 2026 — Gira Final y Todo en Español" (55) / EN: "Megadeth Worldwide — Final Tour 2026, News & Lyrics" (51).
- Desc ES 153 car (Argentina/LATAM) / EN 143 car ("worldwide"). `og:*` reusan estos valores.

**`src/constants/tourDates.ts` actualizado**
- Cómo funciona: tourDates solo alimenta PRÓXIMOS shows (filtro `date >= today`) en /tour tab 0, `UpcomingToursWidget` y tab Shows del Hero. Los PASADOS de /tour vienen de setlist.fm (`PastShowsGrid` → `/api/tour`), NO de tourDates.
- Limpiadas fechas pasadas + agregadas 17 nuevas (Europa jul, USA jul-ago, Oceanía nov). Corregida 2ª noche de LA (26→27 sep). Total: 34 shows, orden cronológico, con estado/provincia en ciudades US/CA.

### Completado (Feb 2026)

**Auto-posting a redes sociales (`scripts/post-social.js`)**
- Facebook ✅ y Instagram ✅ funcionando — se ejecuta como paso en `.github/workflows/scrape-news.yml`
- X (Twitter) ⚠️ pausado — error 402 por plan pay-per-use sin créditos
- OG tags de páginas de noticias corregidos (canonical, og:url, imagen con URL absoluta, fb:app_id)
- Columna `social_posted_at` en `news_articles` para anti-duplicados
- Token de Facebook expira **22 abril 2026** — renovar antes de esa fecha

**Dark mode FOUC eliminado**
- Solución: cookie `color-mode` leída en el servidor (`layout.tsx` con `cookies()` de `next/headers`)
- `initialMode` pasado al `ColorModeProvider` — SSR renderiza directamente en el modo correcto
- Toggle escribe localStorage + cookie (max-age 1 año)

**Bug i18n: traducciones perdidas en 21 rutas (Feb 2026)**
- Causa: `export const dynamic = "force-static"` en páginas con contenido traducido
- En build-time no hay request headers → `accept-language` vacío → locale siempre `'en'`
- Fix aplicado: eliminado `force-static` de las 21 páginas afectadas → SSR dinámico por request
- Páginas afectadas: discography, shows, videos, dvds, bootlegs, entrevistas, historia, formaciones, miembros, songs y sus rutas dinámicas

**Footer — iconos de redes sociales (Feb 2026)**
- Agregados `FacebookIcon` e `InstagramIcon` de `@mui/icons-material` en la barra de copyright
- Diseño: copyright a la izquierda, iconos a la derecha (mobile: apilados centrados)
- Hover: azul Facebook `#1877F2`, rosa Instagram `#E4405F`
- URLs: `facebook.com/profile.php?id=939019079302919` y `instagram.com/megadeth_arg_fan/`
- Schema.org `sameAs` actualizado: solo contiene nuestras páginas fan (se removieron las cuentas oficiales de Megadeth)
- Keys de traducción agregadas: `footer.followFacebook` y `footer.followInstagram` en `messages/es.json` y `messages/en.json`

### Revisado (5 sep 2026) — Warnings de datos estructurados en GSC

**`uploadDate` sin timezone (VideoObject) — ya corregido, falta validar**
- Causa: `/videos/[slug]` emitía `uploadDate: "${year}-01-01"` (fecha cruda, sin hora ni TZ).
- Fix ya en producción desde el commit `0c403e9` (18 jul 2026): `new Date(...).toISOString()`.
- Verificado en prod: watch pages devuelven `...T00:00:00.000Z` y la galería `...+00:00`.
- Los rastreos del informe GSC son del 12/18 jul (previos al deploy). **Acción pendiente: pulsar "Validar corrección" en Search Console.** No hay nada que tocar en el código.

**Warnings de `offers` y `organizer` (MusicEvent) — decisión: NO tocar**
- 34 elementos = las 34 fechas de `tourDates.ts`, schema en `src/app/[locale]/tour/layout.tsx`.
- Faltan `price`, `priceCurrency`, `validFrom` y `organizer`: son campos *recomendados*, no obligatorios. Los eventos siguen siendo válidos y elegibles para rich results.
- No se completan porque no hay datos reales (las 34 fechas comparten un ticketLink genérico a la web oficial). Inventar `price` viola las políticas de datos estructurados de Google y arriesga perder la elegibilidad entera — peor que el warning.
- **Decisión tomada: dejar los warnings visibles en GSC.** Si en el futuro se quieren datos reales, hay que agregar price/priceCurrency/validFrom por show en `tourDates.ts`.

**Schema de videos — 3 correcciones (aplicadas)**
- `src/utils/absoluteUrl.ts` (nuevo): URL absoluta con prefijo de locale, misma convención que `i18nAlternates`. Para JSON-LD, donde el `url` debe coincidir con el canonical.
- **Galería `/videos`**: emitía los 53 `VideoObject` completos inline, sin `url`. Google veía los videos alojados en la galería (que no tiene reproductor) y no encontraba su watch page — candidato al "69 de 76 videos sin indexar" del brief. Ahora el `ItemList` lleva solo `ListItem` + `url` a cada `/videos/[slug]`; el `VideoObject` completo queda únicamente en la watch page. **No volver a poner VideoObject completos en la galería.**
- **`url` del JSON-LD vs canonical**: la watch page hardcodeaba `megadeth.com.ar/videos/[slug]` sin `/es`, mientras el canonical sí lo llevaba. Solo afectaba a la versión ES. Ahora usa `absoluteUrl`.
- **`description` del JSON-LD**: usaba `video.description.es` fijo; en la versión EN la meta iba en inglés y el JSON-LD en español. Ahora recibe `lang`.
- Verificado con dev server: galería con 53 ListItem y 0 VideoObject, canonical == jsonld `url` en ES y EN, meta desc == jsonld desc en ambos, y las 53 URLs del ItemList responden 200.

**`duration` real por video (aplicada)**
- Reemplaza el `PT3M30S` inventado que compartían los 53. El usuario aportó la tabla de duraciones; se cargaron en `videos.json` como campo `duration` en ISO 8601 y `Video` (en `src/types/video.ts`) lo declara requerido.
- La watch page lo emite en su `VideoObject`. Verificado: las 53 declaran `"duration":"PT..."`.
- Precisión: la mayoría venían marcadas como aproximadas. Contraste puntual contra YouTube (`lengthSeconds` del HTML de watch): Train of Consequences daba 214s = 3:34 vs 3:33 de la tabla. Margen de ~1s, aceptable. Si alguna vez se quieren exactas, la API de YouTube (`videos?part=contentDetails`) las da en ISO 8601 directo.

**Pendiente de esa revisión (decisión del usuario)**
- `startDate`/`endDate` de los eventos en `tour/layout.tsx` son fechas sin hora ni timezone. No genera warning hoy; requeriría saber el horario de cada show. El `endDate` idéntico al `startDate` se podría directamente omitir.

### Completado (13 sep 2026) — Autohomenaje: sitio original "Megadeth Argentina"

**Qué es**
- Sección antes del footer, en TODAS las páginas (`src/app/[locale]/layout.tsx`, entre `</main>` y `<Footer />`): cuenta que megadeth.com.ar continúa la página "Megadeth Argentina" que el usuario hacía en los 90.
- Componente: `src/components/LegacySiteTribute.tsx` (client). Screenshot real del sitio viejo en sepia (`public/images/megadeth-argentina-2000.webp`, 800×600) + texto + CTA rojo. Click → `Dialog` con el sitio original funcionando en un iframe de 960×600 (un toque más ancho que los 800×600 originales, pedido del usuario; constantes `VIEWER_WIDTH`/`VIEWER_HEIGHT`, separadas de `SCREENSHOT_*` del hero).
- Textos en `messages/{es,en}.json`, namespace `legacySite`.

**El sitio viejo**
- Origen: `G:/Personal/Paginas Web/Paginas Viejas/Megadeth`. Copia en `public/archivo/megadeth-argentina/` (1801 archivos, 25 MB).
- El visor abre `home.htm` (frameset: menú | menú superior | contenido), NO `index.htm` (intro en Flash cuyo `.swf` ni siquiera existe).
- **Excluidos de la copia**: todos los `WS_FTP.LOG` (datos del servidor FTP), `clave.txt`, `hugo.txt`, `nota rubros.txt`, `*.jbf` (cache de Paint Shop Pro) y la carpeta `wavs/` completa (audios con copyright; decisión del usuario). Sus links quedan rotos, como en cualquier archivo viejo.
- **Parches mínimos sobre el HTML original** (solo funcionales, contenido intacto):
  - Los 147 `.htm` convertidos de cp1252 a UTF-8 (137 meta charset reemplazados, 10 insertados). Next/Vercel sirven `.htm` como `charset=UTF-8`; sin esto todas las tildes salían rotas.
  - 14 `target="_top"` a dominios externos → `_blank` (dentro del iframe sacaban al usuario de megadeth.com.ar). 1 interno (`menu2.htm` → `index.htm`) → `_parent`.
  - 2 links absolutos a `members.xoom.com/_XMCM/Megarg/home.htm` → `home.htm` relativo.
- **Decisión del usuario**: los 13 emails de fans de terceros (clasif, cdr2, concu, encues, fanzone) quedan tal cual. Se le advirtió del riesgo de spam.
- `next.config.ts` → `headers()` para `/archivo/:path*`: `X-Robots-Tag: noindex, nofollow` (147 páginas de época con links muertos no deben indexarse) + CSP que bloquea todo recurso externo (contadores/banners de LinkExchange, Nedstat, GeoCities, Xoom apuntan a dominios abandonados).

**Mobile**
- `getViewerScale()` achica la ventana 960×600 para que entre completa (390px → escala 0,37; nunca agranda por encima de 1). Botón "abrir a tamaño real" (pestaña nueva) y "volver al inicio" (remonta el iframe).
- Gotcha: el iframe mide 960px reales (se achica con `transform: scale`, que no cambia su caja) dentro de una caja más chica. Con `overflow: hidden` esa caja es desplazable por programa (foco, scrollIntoView) y el sitio viejo se corría de costado en mobile (reportado por el usuario en DevTools). Se usa `overflow: clip` con `hidden` de fallback vía `@supports`. Verificado: forzar `scrollLeft = 300` queda en 0. Además la escala se calcula en `openViewer` antes de abrir, así el primer render no sale a 960px.
- Gotcha: el Paper del `Dialog` de MUI trae `max-width: calc(100% - 64px)` por defecto y recortaba el visor en mobile. Se sobreescriben `width` (= ancho del visor), `maxWidth` y `maxHeight` para que coincidan con el margen y con el gutter del cálculo de escala.

**Verificado** (dev server + Chrome headless vía CDP)
- Headers OK en `/archivo`; `wavs/` → 404; sección presente en ES y EN antes del `<footer>`; el iframe NO viene en el HTML inicial (se monta al abrir).
- Popup en 1280×900, 1366×650, 390×844 y 375×667: Paper == iframe, sin recortes, los 3 frames cargan, título con tildes correctas.
- Modo claro y oscuro de la sección OK en desktop y mobile. `tsc` limpio, lint sin errores nuevos.

**Pendiente / para que decida el usuario**
- `home.htm` abre `info.htm`, que es contenido de **feb 2002** (Rude Awakening, remaster de Killing Is My Business y el cartel "está siendo totalmente renovada, vuelve pronto"). El texto nuevo dice "activa hasta Capitol Punishment" (elección del usuario). Los archivos muestran: contador desde ene 1999, restyling dic 2000, última actualización feb 2002. No se tocó.
- Los links a `hijosdelsol.cjb.net` / `members.xoom.com/hijosdelsol` (dominios muertos) podrían apuntar hoy a hijosdelsol.com.ar. No se cambiaron (material de época).
- Textos del homenaje escritos como borrador; el usuario los ajusta mirando el render.
- Sin commit.

### Pendiente
- Renovar `FACEBOOK_PAGE_ACCESS_TOKEN` antes del 22 de abril de 2026
- Decidir si comprar créditos en X para activar Twitter posting
- **i18n routing definitivo**: migrar a URLs por locale (`/es/...`, `/en/...`) con middleware next-intl
  - Permite `generateStaticParams` con ambos locales → cero Function invocations en Vercel
  - Fix permanente para el problema de `force-static` vs locale detection
  - Requiere: agregar `middleware.ts`, reestructurar rutas a `/[locale]/...`, actualizar todos los links internos