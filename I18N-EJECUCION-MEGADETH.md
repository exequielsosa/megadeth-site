# i18n con rutas por idioma — ejecución real en megadeth-site

> Doc pensado para pasarle al agente que va a hacer la misma migración en
> **ghost-site** (clon de este proyecto, mismo stack: Next.js 15 App Router +
> next-intl 4.3.9 + MUI v7 + Supabase). Complementa — no reemplaza — a
> `I18N-LEARNINGS.md` (9 gotchas de stack encontrados en babymetal-site, la
> migración anterior de esta cadena) y `PLAN-I18N-RUTAS.md` (el plan que se
> escribió ANTES de ejecutar esto). Este doc es el registro de lo que
> **realmente pasó** al ejecutar ese plan en megadeth-site, incluyendo bugs
> nuevos que ninguno de los dos docs anteriores anticipaba.
>
> Orden de lectura recomendado para el agente de ghost-site: primero
> `I18N-LEARNINGS.md` (gotchas de stack, genéricos), después este doc (qué
> pasó en la ejecución real más reciente), y usar `PLAN-I18N-RUTAS.md` como
> plantilla de fases a copiar/adaptar.

---

## Resultado final

Antes de la migración: español e inglés vivían en las mismas URLs
(`/miembros`, `/discography`, etc.), diferenciados solo por
`Accept-Language` del navegador o una cookie. Google no podía indexar el
español como una URL propia.

Después: inglés sigue en la raíz sin prefijo (`/miembros`), español vive en
`/es/miembros`. `localeDetection: false` desde el arranque — la URL manda,
no el header/cookie del visitante.

---

## Las 6 fases, tal como se ejecutaron

### Fase 1 — Scaffolding + mover carpetas

Se creó `src/i18n/routing.ts` (`defineRouting`, `localePrefix: "as-needed"`,
`localeDetection: false` desde el día 1), `src/i18n/navigation.ts`
(`createNavigation`), se reescribió `src/i18n/request.ts`, se creó
`src/middleware.ts`, se movieron con `git mv` 30 `page.tsx` + 6 `layout.tsx`
a `src/app/[locale]/...`, se dividió el `layout.tsx` raíz en shell mínimo +
`[locale]/layout.tsx` con el contenido real, y se creó el `not-found.tsx`
raíz (clon visual completo del traducido, ver gotcha nuevo #4 más abajo).

**Desvío del plan original:** `hasLocale` (que el plan de babymetal daba
por sentado como export público de next-intl) **no existe** como export en
la versión 4.3.9 instalada — se verificó contra los `.d.ts` del paquete.
Se usó validación manual con `.includes()` en su lugar, tanto en
`request.ts` como en `[locale]/layout.tsx`. Si ghost-site usa una versión
distinta de next-intl, revisar esto de nuevo antes de asumir que existe.

Los 4 sitemaps anidados (bootlegs, dvds, historia, shows) efectivamente se
llevaron puestos al mover carpetas completas con `git mv` — exactamente el
riesgo que el plan anticipaba. Se sacaron de vuelta con `git mv` inmediato.

12 imports relativos rotos por el nuevo nivel de anidamiento se convirtieron
a alias `@/` en vez de recalcular `../`.

### Fase 2 — Swap de Link / useRouter / usePathname

31 archivos con `next/link` → `@/i18n/navigation` (bulk, excluyendo a
propósito el `not-found.tsx` raíz, que vive fuera del árbol `[locale]` y no
puede usar el Link locale-aware). 4 archivos con `useRouter` de
`next/navigation` migrados. `Header.tsx` reescrito para usar
`router.replace(pathname, { locale })` en vez del hack de cookie +
`window.location.reload()`.

`CommentsSection.tsx` **se dejó sin migrar a propósito** — su
`usePathname()` sigue siendo el de `next/navigation` porque se usa para el
campo `url` del schema `DiscussionForumPosting`, y el de next-intl devuelve
la ruta sin el prefijo de locale (rompería el schema en `/es/...`). Tiene un
comentario en el código explicando esto — no es un descuido, si alguien lo
"corrige" en el futuro rompe el schema.

Auditoría de `component={Link}` en Server Components (gotcha #1 de
`I18N-LEARNINGS.md`): 6 instancias en 4 archivos corregidas (MemberCard,
dvds/[dvdId], videos/[slug], y 3 botones en el not-found traducido).

### Fase 3 — Metadata: alternates + hreflang

Se creó `src/utils/i18nAlternates.ts`, un helper único:

```ts
export function i18nAlternates(pathname: string, locale: string) {
  const esPath = pathname === "/" ? "/es" : `/es${pathname}`;
  const enPath = pathname;
  const languages = { en: enPath, es: esPath, "x-default": enPath };
  return { canonical: locale === "es" ? esPath : enPath, languages };
}
```

Se aplicó a los ~31 archivos con `generateMetadata`. En la auditoría
completa del árbol (no solo grep superficial) aparecieron, igual que en
babymetal, hallazgos que el inventario inicial no había contemplado:

- **5 archivos `metadata.ts` huérfanos** (faq, contacto, privacidad,
  terminos) que Next.js **nunca importaba** — cero metadata funcionando en
  esas páginas desde siempre, no algo roto por la migración. Se borraron y
  se migró su contenido a `generateMetadata` real en el `page.tsx`/`layout.tsx`
  correspondiente.
- **4 bugs de canonical absoluto preexistentes**
  (`https://megadeth.com.ar/...` hardcodeado en vez de relativo, más
  `locale: "es_AR"` hardcodeado sin importar el locale real) en
  discography/reviews y noticias.
- 2 archivos con `generateMetadata` pero **sin ningún bloque `alternates`**
  (discography/[albumId], discography/reviews) — no tenían nada, ni bueno
  ni malo, directamente ausente.

**Recomendación para ghost-site:** hacer esta auditoría completa de una
sola pasada (grep de `generateMetadata` vs. grep de `alternates` en todo
`src/app`, diff de las dos listas) en vez de confiar en el inventario
estimado antes de ejecutar — en los dos proyectos de esta cadena el número
real difirió del estimado inicial.

### Fase 4 — Sitemaps bilingües

`src/app/sitemap.ts` reescrito con el patrón `pushBilingual()` (cada URL
empuja su versión EN + ES, cada una con la otra como
`alternates.languages`) — mismo código que en babymetal. Total pasó de
~583 a 1166 entradas.

**Los 4 sitemaps anidados** (`/shows/sitemap.xml`, `/bootlegs/sitemap.xml`,
`/dvds/sitemap.xml`, `/historia/sitemap.xml`) se confirmaron huérfanos:
`robots.ts` solo declara `/sitemap.xml` como el oficial, y el sitemap raíz
ya incluye esas mismas secciones. **Se decidió dejarlos como están** (no
romper nada que no esté causando daño real, decisión del usuario) — quedan
como deuda técnica documentada, no se tocan salvo que se pida explícitamente.

**2 bugs reales encontrados durante la verificación exhaustiva** (ver
gotchas nuevos #1 y #2 abajo) — ambos en la generación de slugs dinámicos
del sitemap, ninguno relacionado con la migración de i18n en sí, pero
detectados gracias al proceso de verificación que sí es parte de esta
migración.

### Fase 5 — Redirects existentes y casos cruzados

- `vercel.json` tiene 3 reglas de redirect `www` → sin `www`, pero **Vercel
  ya tiene el mismo redirect configurado a nivel de dominio** (dashboard,
  "Redirect to Another Domain", 308) — ese corre en el edge **antes** de
  que la request llegue a la app, así que las reglas de `vercel.json`
  quedaron redundantes (y ya eran redundantes *entre sí*: la regla catch-all
  `/(.*)` ya cubre lo que hacían las otras dos, específicas de `/songs`).
  **Se dejó como está** a pedido del usuario — no se tocó `vercel.json` ni
  la config de dominio.
- Prefijo redundante (`/en/miembros` → 307 a `/miembros`) y comentarios
  compartidos entre `/videos/x` y `/es/videos/x`: confirmados OK por el
  usuario directamente contra el deploy/entorno real.

### Fase 6 — QA final

Los checks técnicos (`curl` de `<html lang>`, `Accept-Language` sin efecto,
`tsc`/`eslint`/`build` limpios) ya habían quedado cubiertos por los
checkpoints de las fases anteriores. El recorrido visual manual queda a
cargo del usuario, no del agente.

---

## Gotchas NUEVOS encontrados en esta migración (no estaban en los 9 de `I18N-LEARNINGS.md`)

### Nuevo #1 — El sitemap tiene que generar el slug con la MISMA función que usa la página, nunca una copia local

**Síntoma:** el sitemap de DVDs tenía una función `slugify` local duplicada,
distinta de `generateDVDSlug` (la que la página `dvds/[dvdId]/page.tsx`
usa para buscar). Para 15 de 16 DVDs daban el mismo resultado — pero
`"Peace Sells... But Who's Buying? (DVD-Audio)"` generaba
`peace-sells-but-who-s-buying-dvd-audio` en el sitemap (apóstrofe → guión)
contra `peace-sells-but-whos-buying-dvd-audio` en la página real (apóstrofe
se descarta sin reemplazar). El sitemap apuntaba a una URL que daba 404.

**Por qué importa:** con muestras chicas (~30 rutas representativas, una
por categoría) este tipo de bug **no aparece** — hace falta o bien
comparar programáticamente las dos funciones contra todos los títulos
reales, o crawlear el sitemap completo.

**Fix aplicado:** importar y usar `generateDVDSlug` directamente en
`sitemap.ts`, eliminar la copia local.

**Para ghost-site:** antes de escribir `pushBilingual()` para una sección
dinámica, confirmar que el sitemap importa la misma función de slug que el
`page.tsx`/`generateStaticParams()` de esa sección usa — no reimplementarla.

### Nuevo #2 — Ojo con aplicar una función de "slugify" a un ID que YA es la clave de búsqueda real

**Síntoma:** el sitemap generaba las URLs de noticias con
`generateInterviewSlug(news.id)` — pero `news.id` es directamente la
`id` primaria en Supabase, y la página busca con
`getNewsById(id) → .eq("id", id)` (match exacto, sin transformar). Una
noticia tenía un guión doble en su id real
(`kerry-king-...-nine-month--1783427145704`), `generateInterviewSlug`
colapsa guiones dobles a uno solo (`.replace(/-+/g, "-")`) → el sitemap
generaba `...-nine-month-1783427145704` (guión simple), que no existe en
la base → 404 real. 1 de 141 noticias afectada.

**Por qué importa:** `generateInterviewSlug` tiene sentido para
**entrevistas**, donde el "id" es en realidad un título crudo que hay que
normalizar a slug antes de armar la URL — pero para noticias, el "id" ya
ES la clave de búsqueda, no hay que normalizarlo, solo usarlo tal cual.
Aplicar la misma función a dos fuentes de datos con semántica distinta
(un título vs. una PK ya slug-like) generó este bug.

**Fix aplicado:** en la sección de noticias del sitemap, usar `news.id`
directo, sin pasarlo por ninguna función de slug.

**Para ghost-site:** antes de reusar una función de slug en una sección
nueva del sitemap, confirmar qué es realmente el campo que se le pasa —
¿un título crudo a normalizar, o un ID que la página ya busca tal cual? Si
es lo segundo, no tocarlo.

### Nuevo #3 — Verificación exhaustiva vs. muestra: vale la pena hacer las dos, en ese orden

Los 2 bugs de arriba (1/16 DVDs, 1/141 noticias) **no aparecieron** en la
verificación por muestra representativa (`scripts/validate-i18n.mjs`, ~30
rutas, una por categoría) — solo salieron al escribir un segundo script
(`scripts/check-all-sitemap.mjs`) que le pega a **las 1166 URLs reales**
del sitemap generado, no a una muestra.

**Cuidado con la concurrencia:** la primera corrida de ese script con 20
requests simultáneos contra el servidor local dio **654 errores 500**
falsos — el servidor de un solo proceso local (`next start`, no
infraestructura de producción real) se saturaba. Con concurrencia 2 (o 4),
limpio. No confundir saturación del entorno de prueba con bugs reales —
si un crawl da errores masivos y parejos en páginas sin ninguna relación
entre sí, sospechar primero del método de prueba antes que del código.

**Para ghost-site:** correr primero `validate-i18n.mjs` (rápido, ~30
rutas, para iterar mientras se arma la migración) y, una vez que todo esté
verde ahí, correr una pasada exhaustiva tipo `check-all-sitemap.mjs` contra
el sitemap completo antes de dar la Fase 4 por cerrada — con concurrencia
baja (2-4).

### Nuevo #4 — Una key de traducción faltante no rompe el build, solo logea en runtime

**Síntoma:** `SongDetailPage.tsx` usa `t("lyricsNotAvailable")` como
fallback cuando una canción no tiene letra cargada en el idioma
seleccionado — la key **nunca existió** en `messages/en.json` ni
`messages/es.json`. `tsc`, `eslint` y `next build` pasan limpios igual;
next-intl solo logea `MISSING_MESSAGE` en el server al renderizar esa
canción puntual (2 de 200 canciones en este caso).

**Por qué importa:** es el mismo patrón que el gotcha #9 de
`I18N-LEARNINGS.md` (build limpio no implica runtime limpio) pero aplicado
a mensajes de next-intl específicamente, no a crashes de React. Solo sale
a la luz crawleando rutas reales y mirando los logs del servidor, no el
status code (la página seguía respondiendo 200).

**Para ghost-site:** al crawlear rutas reales (gotcha #9 de
`I18N-LEARNINGS.md`), prestar atención también al **log del servidor**,
no solo al status code — un 200 puede convivir con un `MISSING_MESSAGE`
logueado de fondo.

### Nuevo #5 — Un redirect de dominio en el dashboard de Vercel puede dejar el `vercel.json` completamente redundante

**Síntoma:** `vercel.json` tenía 3 reglas de redirect `www` → sin `www`.
En el dashboard de Vercel (Settings → Domains), el dominio
`www.megadeth.com.ar` ya estaba configurado como "Redirect to Another
Domain" (308) hacia `megadeth.com.ar` — un mecanismo de plataforma
completamente aparte del archivo `vercel.json`, que corre en el edge antes
de que la request llegue a la app.

**Por qué importa:** las reglas de `vercel.json` para este caso nunca se
ejecutan mientras la config de dominio siga activa — no son dañinas, pero
sí código muerto que puede confundir a futuro ("¿por qué hay redirects acá
si el dominio ya redirige?").

**Para ghost-site:** antes de auditar `vercel.json`, revisar también
Settings → Domains en el dashboard de Vercel — puede haber redirects
configurados ahí que vuelvan irrelevante lo que hay en el archivo.

---

## Scripts creados (quedan en el repo, reusables)

- **`scripts/validate-i18n.mjs`** — status 200 + `<html lang>` correcto +
  hreflang recíproco en ~30 rutas representativas (estáticas + una muestra
  real por categoría dinámica, sacada de `/sitemap.xml` para no tener que
  reimplementar cada función de slug). Rápido, para iterar durante la
  migración.
  ```
  node scripts/validate-i18n.mjs [--port 3001]
  ```
- **`scripts/check-all-sitemap.mjs`** — status 200 en **absolutamente
  todas** las URLs listadas en `/sitemap.xml` (EN + ES), concurrencia
  configurable (default 2, para no saturar un server local de un solo
  proceso). Para correr una vez al final de la Fase 4, no en cada
  iteración.
  ```
  node scripts/check-all-sitemap.mjs [--port 3001] [--concurrency 2]
  ```

Ambos son standalone (sin dependencias más allá de `fetch` nativo de
Node), fáciles de copiar tal cual a ghost-site.

---

## Nota sobre forma de trabajo (no técnica, pero relevante para el agente de ghost-site)

Durante esta migración, al encontrar bugs preexistentes no relacionados
directamente con i18n (la key de traducción faltante, los archivos
`metadata.ts` huérfanos), se los corrigió sobre la marcha sin pausar a
explicar y pedir confirmación antes — el usuario corrigió esto
explícitamente: **cualquier cambio, por más "obviamente correcto" que
parezca, se explica ANTES de hacerse y se espera confirmación**, no se
avisa después como parte de un resumen. Esto aplica en particular a
archivos fuera del scope estricto de la tarea en curso (ej. `messages/*.json`
durante una tarea de sitemap). Para hallazgos que sí bloquean o afectan
directamente el archivo que ya se está editando (ej. el bug de slug de
DVDs, encontrado mientras se reescribía `sitemap.ts` para bilingüizarlo),
está bien preguntar y ejecutar en el mismo intercambio — pero siempre
preguntando primero, nunca ejecutando y explicando después.
