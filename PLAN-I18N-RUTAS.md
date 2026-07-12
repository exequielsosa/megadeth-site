# Plan de migración — i18n con rutas por idioma (megadeth.com.ar)

> Adaptado de la migración ya completada en babymetal.com.ar (mismo stack:
> Next.js 15 App Router + next-intl 4.3.9 + MUI). Ver `I18N-LEARNINGS.md` para
> los 9 gotchas de stack ya encontrados y resueltos allá — este plan los
> incorpora de entrada en vez de esperar a redescubrirlos.
>
> Rama de trabajo: `feature/new-i18n` (creada desde `main`, 0 divergencia
> verificada). Un commit por fase, cada fase con checkpoint antes de avanzar.

---

## Decisiones ya tomadas (no reabrir sin motivo)

- **Raíz (`/`) = inglés** (default locale, sin prefijo). **`/es/*` = español**
  (prefijo). Coincide con `defaultLocale='en'` que ya está en
  `src/i18n/config.ts` hoy, y con que el tráfico real es mayoritariamente
  internacional (18% EE.UU. vs 6% Argentina, visto en la sesión de SEO).
- **`x-default` → la URL raíz** (inglés).
- **Comentarios compartidos entre idiomas** (un solo hilo por contenido) — a
  confirmar en Fase 0 que `pageId` en los ~13 usos de `CommentsSection` viene
  siempre de datos (`song.id`, `bootleg.id`, strings fijos), nunca del
  pathname, igual que en babymetal.
- **`CommentsSection.tsx` usa `usePathname()` de `next/navigation`** (agregado
  en la sesión de SEO de este mismo proyecto, para el `url` del schema
  `DiscussionForumPosting` — babymetal no tenía este uso cuando migró). El
  `usePathname` de next-intl devuelve la ruta **sin** el prefijo de locale;
  si se migra tal cual, el schema en `/es/...` quedaría con una URL sin
  `/es` — incorrecto. Este uso puntual **se deja con el `usePathname` de
  `next/navigation`**, no se migra a `@/i18n/navigation`.

---

## El mecanismo técnico

Idéntico razonamiento que en babymetal (mismo `next-intl` 4.3.9):

- `localePrefix: 'as-needed'` → el locale default (**en**) no lleva prefijo,
  **es** sí.
- `createNavigation(routing)` genera versiones locale-aware de `Link`,
  `useRouter`, `usePathname`, `redirect` con la misma API que
  `next/link`/`next/navigation` — en la mayoría de los archivos con
  `<Link href="/algo">` no hay que tocar ningún `href`, solo el import.
- `useTranslations()`/`getTranslations()` no necesitan cambios — siguen
  funcionando igual, derivando el locale del segmento de URL.

---

## Inventario del alcance (medido con grep/glob, 9/7)

| Qué | Cantidad |
|---|---|
| `page.tsx` a mover bajo `[locale]` | 30 |
| `layout.tsx` a mover bajo `[locale]` | 6 |
| Archivos con `import Link from "next/link"` | 33 |
| Archivos con `useRouter`/`redirect` de `next/navigation` | 4 (`HistoryNavigation.tsx`, `HistoryTimeline.tsx`, `NewsBanner.tsx`, `SiteUpdatesBanner.tsx`) |
| Archivos con `usePathname` de `next/navigation` | 2 (`Header.tsx` → migra; `CommentsSection.tsx` → **no migra**, ver arriba) |
| Bloques `alternates` en `src/app` | 31 (a auditar cuántos están rotos vs. simplemente ausentes, igual que en babymetal donde el conteo real difirió del estimado inicial) |
| Usos de `component={Link}` | 38 (a cruzar contra archivos sin `"use client"` en Fase 2 — en babymetal 25 usos dieron 7 instancias rotas en 5 archivos; acá el universo es más grande, esperar un número similar o mayor) |
| Rutas API (quedan fuera de `[locale]`) | `src/app/api/**`, no se tocan |
| Archivos `sitemap.ts` (raíz + anidados) | 5: `sitemap.ts`, `dvds/sitemap.ts`, `shows/sitemap.ts`, `historia/sitemap.ts`, `bootlegs/sitemap.ts` (mismos 4 nombres que babymetal — mismo código base) |
| `robots.ts`, `feed.xml/route.ts` | quedan fuera de `[locale]`, no se tocan |
| `middleware.ts` | no existe — se crea nuevo |
| `src/i18n/` actual | solo `config.ts` (locales + defaultLocale) y `request.ts` (detección por cookie/header) — se reescriben ambos |

---

## Riesgos identificados y cómo se mitigan

1. **`vercel.json` es más simple que el de babymetal**: solo tiene redirects
   `www.megadeth.com.ar` → sin `www` (3 reglas, todas del mismo patrón). No
   hay ningún redirect de slug tipo `/formaciones → /kami-band`. Menos
   superficie de riesgo en la Fase 5, pero igual se re-testea explícitamente
   (los redirects de `vercel.json` no los interpreta `next dev`, solo el
   deploy real o `vercel dev` — gotcha #6 de `I18N-LEARNINGS.md`).
2. **`CommentsSection.tsx` con `usePathname` sin migrar** (ver Decisiones
   arriba) — riesgo de que alguien en el futuro "corrija" ese import
   pensando que es un descuido. Se deja un comentario en el código
   explicando por qué es intencional.
3. **`localeDetection` de next-intl viene `true` por default** (gotcha #2) —
   se desactiva desde el arranque en `src/i18n/routing.ts`
   (`localeDetection: false`), no se espera a que falle el checklist de QA
   como pasó en babymetal. Trade-off aceptado de entrada: un visitante nuevo
   con navegador en español que entra a la raíz ve inglés (default) hasta
   que use el selector — mismo trade-off que ya se aceptó en babymetal.
4. **Bug de doble slash en la raíz** (gotcha #3) — el helper de
   `alternates.languages` se escribe desde el principio con el caso especial
   para `pathname === "/"`, no se espera a encontrarlo en producción.
5. **`_not-found.tsx` global no hereda el layout de idioma** (gotcha #5) — se
   planifica desde la Fase 1 un `src/app/not-found.tsx` mínimo con su propio
   `<html>/<body>` y sus propias fuentes, en paralelo al `not-found.tsx`
   traducido dentro de `[locale]/`.
6. **Nada se toca en `main` directamente.** Todo el trabajo va en
   `feature/new-i18n`, un commit por fase — si algo sale mal en la Fase N, se
   puede revertir solo esa fase.

---

## Las fases

Cada fase termina con un **checkpoint explícito** — no se pasa a la
siguiente hasta confirmarlo. A diferencia del plan de babymetal (escrito
como bitácora de lo ya hecho), este es un plan **a ejecutar** — los
checkboxes empiezan todos sin marcar.

### Fase 0 — Preparación (sin cambios de código de producto)

- [x] Rama dedicada `feature/new-i18n`, creada desde `main` — **ya hecho por
      el usuario**, 0 divergencia verificada.
- [ ] `npm run build` de línea base — confirmar limpio antes de tocar nada
      (ya se confirmó `tsc --noEmit` limpio; falta el build completo).
- [ ] Confirmar con grep que los ~13 usos de `CommentsSection` pasan
      `pageId` desde datos, nunca desde el pathname (mismo check que hizo
      babymetal, aplica igual acá).
- [ ] Decidir qué hacer con lo suelto sin commitear (`docs/SEO-TRACKING.md`,
      `.claude/settings.json`, los 2 docs de i18n) antes de que la Fase 1
      empiece a generar commits — no bloquea, pero conviene resolverlo para
      no mezclar diffs de distintas iniciativas en el mismo commit de fase.

### Fase 1 — Scaffolding de next-intl routing + mover carpetas

- [ ] `src/i18n/routing.ts` — `defineRouting` con `localePrefix: "as-needed"`
      y `localeDetection: false` desde el arranque (mitigación del riesgo 3).
- [ ] `src/i18n/navigation.ts` — `createNavigation(routing)`.
- [ ] `src/i18n/request.ts` — reescrito con `hasLocale` + `requestLocale`
      (reemplaza la detección por accept-language/cookie actual).
- [ ] `src/middleware.ts` — nuevo, matcher que excluye `api/`, `_next/`,
      `_vercel/` y archivos con extensión.
- [ ] Mover con `git mv` los 30 `page.tsx` + 6 `layout.tsx` a
      `src/app/[locale]/...`.
- [ ] Dividir `src/app/layout.tsx`: shell mínimo en la raíz, contenido real
      (`NextIntlClientProvider`, `Header`, `Footer`, GA, JSON-LD `MusicGroup`)
      a `src/app/[locale]/layout.tsx` + `generateStaticParams` + `notFound()`
      si el locale no es válido.
- [ ] Mover también `not-found.tsx` traducido a `[locale]/`, **y** crear un
      `src/app/not-found.tsx` nuevo y mínimo en la raíz real (mitigación del
      riesgo 5 — gotcha #5), con su propio `<html>/<body>` y fuentes.
- [ ] Verificar que los 4 sitemaps anidados **no** se muevan sin querer
      dentro de `[locale]/` al mover carpetas completas (pasó en babymetal
      por descuido de `git mv` recursivo — son metadata, no dependen del
      locale).
- [ ] Revisar imports relativos rotos por el nuevo nivel de anidamiento
      (ej. `"../../../components/X"`) — convertir a alias `@/` en vez de
      recalcular la cantidad de `../` (mismo criterio ya usado en este
      proyecto para el sitemap de DVDs).

**Checkpoint:**
- `npm run build`: compila limpio, cantidad de rutas estáticas ≈ 2x lo
  actual (en+es).
- `curl` contra dev server: `/miembros` → `<html lang="en">` sin prefijo;
  `/es/miembros` → `<html lang="es">`; `/en/miembros` → 307 a `/miembros`.

### Fase 2 — Swap de `Link` / `useRouter` / `usePathname`

- [ ] 33 archivos: `import Link from "next/link"` → `import { Link } from
      "@/i18n/navigation"`. Los `href` no se tocan.
- [ ] 4 archivos con `useRouter`/`redirect` → swap a `@/i18n/navigation`
      (`HistoryNavigation.tsx`, `HistoryTimeline.tsx`, `NewsBanner.tsx`,
      `SiteUpdatesBanner.tsx`).
- [ ] `Header.tsx`: `usePathname` + `Link` a `@/i18n/navigation`, agregar
      `useRouter`, reescribir el selector de idioma con
      `router.replace(pathname, { locale })` (reemplaza el hack de
      `document.cookie` + `window.location.reload()` actual).
- [ ] `CommentsSection.tsx`: **dejar sin tocar** su `usePathname` (decisión
      ya tomada arriba) — agregar comentario explicando el motivo.
- [ ] **Auditar los 38 usos de `component={Link}` contra cuáles NO tienen
      `"use client"`** (mitigación proactiva del gotcha #1 — en babymetal
      esto se descubrió recién en runtime con 500s). Para cada uno
      encontrado, cambiar de `<Card component={Link} href="...">` a
      `<Link href="..."><Card>...</Card></Link>`.

**Checkpoint:**
- `npm run build`: limpio.
- Levantar dev server real y pegarle con `curl` a **todas** las páginas que
  tenían `component={Link}` en un server component (no solo confiar en el
  build) — status 200 en ambos idiomas, no 500. Mirar el body de la
  respuesta, no solo el status code (gotcha #1: el error puede quedar
  enmascarado).
- hrefs en `/es/...`: confirmar que llevan `/es/` incluidos los links
  dinámicos generados en cards. hrefs en la versión EN: cero `/es/` de más.

### Fase 3 — Metadata: `alternates.languages` + `x-default`

- [ ] `src/utils/i18nAlternates.ts` — helper compartido:
      `i18nAlternates(pathname, locale)` con el caso especial para
      `pathname === "/"` ya resuelto de entrada (mitigación del riesgo 4,
      gotcha #3) — no esperar a encontrarlo después.
- [ ] Reemplazar los 31 bloques `alternates` encontrados en el inventario —
      confirmar con grep el número real durante la ejecución (en babymetal
      el conteo real difirió del estimado inicial, 22 en vez de 24).
- [ ] Auditar también rutas que **no tengan** bloque `alternates` para nada
      (no solo las que lo tienen roto) — en babymetal aparecieron 12 rutas
      así en una segunda pasada (páginas anidadas un nivel más, páginas
      sueltas que el grep inicial no cubrió, la home heredando el bug del
      layout). Hacer la auditoría completa del árbol `src/app` de una vez
      acá, no en dos pasadas.
- [ ] Normalizar cualquier URL absoluta hardcodeada (`https://megadeth.com.ar/...`)
      a ruta relativa donde `metadataBase` ya la resuelve.

**Checkpoint:**
- `curl` contra dev server en varias rutas (estáticas y dinámicas):
  hreflang recíproco correcto en ambos idiomas, incluida la home.
- Adaptar y correr un script tipo `scripts/validate-i18n.mjs` (el que se creó
  en babymetal) contra ~30 rutas representativas de megadeth — status 200 +
  reciprocidad de hreflang.
- `tsc --noEmit`, `eslint`, `npm run build`: limpios.

### Fase 4 — Sitemaps

- [ ] `src/app/sitemap.ts`: helper `pushBilingual()` — cada entrada (estática
      o dinámica) empuja dos items (en + es) con `alternates.languages`
      cruzado. Aplicar a todas las páginas estáticas y a las secciones
      dinámicas (songs, miembros, discography, dvds, historia, entrevistas,
      shows, bootlegs, videos, noticias — incluye las watch pages de video
      agregadas en la sesión de SEO).
- [ ] Los 4 sitemaps anidados (`dvds`, `shows`, `historia`, `bootlegs`):
      mismo patrón `bilingualEntries()` local a cada archivo.
- [ ] Confirmar si esos 4 sitemaps anidados están declarados en Search
      Console aparte del `sitemap.xml` raíz (si no, son redundantes con el
      raíz que ya incluye todo — no es necesario resolverlo en esta fase,
      solo dejarlo anotado).

**Checkpoint:**
- `/sitemap.xml`: total de URLs ≈ 2x las páginas lógicas, ~50% con `/es/`.
- Entradas de ejemplo con `hreflang` cruzado correcto, incluida la raíz sin
  el bug de doble slash.
- `tsc --noEmit`, `eslint`, `npm run build`: limpios.

### Fase 5 — Redirects existentes y casos cruzados

- [ ] Redirects de `vercel.json` (`www.megadeth.com.ar` → sin `www`, 3
      reglas): no verificables contra `next dev` (gotcha #6) — probar contra
      el deploy real o `vercel dev`.
- [ ] Prefijo redundante: `/en/miembros` → 307 a `/miembros`, `/en` → 307 a
      `/` (comportamiento esperado de `as-needed`, confirmar con curl).
- [ ] Comentarios compartidos entre `/videos/x` y `/es/videos/x`: confirmar
      que comparten la misma fila en Supabase (ya verificado en Fase 0 que
      `pageId` no depende del pathname).

**Checkpoint:** los 3 puntos confirmados contra dev server o deploy real
según corresponda.

### Fase 6 — QA final

- [ ] `curl -s http://localhost:3000/miembros | grep '<title>'` → inglés.
- [ ] `curl -s http://localhost:3000/es/miembros | grep '<title>'` → español.
- [ ] `curl -H "Accept-Language: es" http://localhost:3000/miembros | grep
      '<title>'` → sigue en **inglés** (confirma que `localeDetection: false`
      quedó bien aplicado desde la Fase 1, no como hallazgo tardío).
- [ ] `npm run build` completo: limpio.
- [ ] Recorrido visual manual de al menos una página de cada tipo de ruta
      (estática, dinámica, con comentarios) en ambos idiomas — a cargo del
      usuario.

**Después del deploy:**
- [ ] Actualizar el sitemap declarado en Search Console si hace falta.
- [ ] Pedir reindexación de páginas principales en ambos idiomas vía
      Inspección de URL.
- [ ] Monitorear Search Console 4-6 semanas — comparar contra el baseline ya
      guardado en `docs/SEO-TRACKING.md`.

---

## Qué NO se toca en esta tarea

- El contenido de `messages/es.json` / `en.json` — ya está completo.
- La decisión de renombrar slugs ES→EN en la raíz (ej. `/miembros` →
  `/members`) — agrega riesgo de 301s adicionales sin necesidad inmediata,
  se evalúa aparte una vez que la migración esté estable en producción.
- Cualquier tarea pendiente del `SEO-MEJORAS-BRIEF.md` (Tarea 2 — redirects
  404, Tarea 6 — title del Home post-gira) — quedan guardadas como estaban,
  esta rama es exclusivamente para el routing por locale.
