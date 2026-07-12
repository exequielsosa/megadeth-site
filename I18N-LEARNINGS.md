# Aprendizajes — migración a rutas por idioma (Next.js 15 + next-intl + MUI)

Doc portable con los bugs/gotchas encontrados al migrar de detección de idioma
por cookie/header a rutas explícitas por locale (`/` = inglés, `/es/*` =
español) en babymetal-site. Pensado para copiar a otro proyecto con el mismo
stack (Next.js 15 App Router + next-intl + MUI) antes de hacer la misma
migración, para no volver a pisar los mismos problemas.

No incluye nada específico de contenido/rutas de babymetal-site — son
gotchas de stack, no de negocio.

---

## 1. `next-intl` + MUI: `component={Link}` crashea en runtime, no en build

**Síntoma:** una `Card` (u otro componente MUI) usado así desde un Server
Component:

```tsx
<Card component={Link} href="/algo">...</Card>
```

compila perfecto con `next build`, pero en runtime tira 500 con un error del
estilo *"Functions cannot be passed directly to Client Components... render:
function Link"*. `next build` no lo detecta porque el error es de
serialización RSC (Server→Client boundary), no de tipos.

**Por qué pasa:** el `Link` de `next-intl` (`@/i18n/navigation`) es un
Client Component. Pasarlo como **valor de la prop `component`** (no como
hijo JSX) obliga a React a serializar la función `Link` misma a través del
límite Server→Client, lo cual no está permitido.

**Fix:** usar `Link` como elemento padre en vez de como prop:

```tsx
// Mal (crashea)
<Card component={Link} href="/algo">...</Card>

// Bien
<Link href="/algo" style={{ display: "block", textDecoration: "none", color: "inherit" }}>
  <Card>...</Card>
</Link>
```

**Cómo detectarlo:** `next build` no alcanza. Hay que levantar el server
(dev o prod) y pegarle con `curl` a las rutas reales, leyendo el log de
terminal del server — el status code solo (`curl -o /dev/null -w
"%{http_code}"`) puede no ser suficiente si el error queda enmascarado;
conviene también mirar el body de la respuesta.

---

## 2. `localeDetection` de next-intl viene activado por default

**Síntoma:** aunque las URLs estén bien separadas por locale, un visitante
nuevo (sin cookie de idioma todavía) que pega en `/miembros` con
`Accept-Language: es` en el navegador es **redirigido automáticamente** a
`/es/miembros` (307) — pasa en **cualquier ruta del sitio**, no solo en una
puntual.

**Por qué importa:** rompe la premisa central de migrar a rutas por
idioma ("la URL determina el contenido, no el header/cookie del visitante").
Concretamente:
- Alguien comparte un link a la versión en un idioma específico y el
  destinatario ve la otra versión sin darse cuenta.
- Googlebot (u otras herramientas de Google) puede recibir contenido
  distinto en la misma URL según qué `Accept-Language` mande en cada crawl,
  lo cual es inconsistente con lo que declara el `hreflang`.

**Fix:**

```ts
// src/i18n/routing.ts
export const routing = defineRouting({
  locales: ["en", "es"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  localeDetection: false, // la URL manda, no el header/cookie
});
```

**Trade-off a aceptar:** un visitante nuevo con navegador en español que
entra directo a la raíz del sitio **ya no cae solo en `/es`** — ve la
versión del `defaultLocale` y tiene que usar el selector de idioma una vez.
Si el público es mayormente de un idioma no-default, vale la pena discutirlo
antes de aplicar el fix a ciegas.

---

## 3. Bug de doble slash en la raíz al armar URLs por locale

**Síntoma:** un helper que arma la URL en español concatenando el prefijo,
tipo `` `/es${pathname}` ``, genera `/es/` (con slash final) cuando
`pathname` es `"/"`. Si el proyecto tiene `trailingSlash: false` en
`next.config`, esa URL devuelve **308** hacia `/es` (sin slash) — o sea, el
propio `canonical`/`hreflang` de la home en español apuntaba a una URL que
el sitio redirige, en vez de sí misma.

**Fix:** casear la raíz explícitamente en cualquier lugar donde se arme la
URL localizada (metadata alternates, sitemap):

```ts
const esPath = pathname === "/" ? "/es" : `/es${pathname}`;
```

Aplica tanto al helper de `alternates.languages` en metadata como a la
generación del sitemap — son dos lugares distintos con la misma lógica de
concatenación, hay que arreglarlo en los dos.

---

## 4. Sitemap bilingüe: Next.js 15 soporta `alternates.languages` nativo

`MetadataRoute.Sitemap` acepta un campo `alternates.languages` por entrada.
El patrón correcto para un sitemap bilingüe **no** es una sola entrada por
página con un mapa de idiomas — es **dos entradas** (una por locale), cada
una declarando a la otra como alternate:

```ts
function pushBilingual(sitemap, path, entry) {
  const enUrl = `${base}${path}`;
  const esUrl = path === "/" ? `${base}/es` : `${base}/es${path}`;
  const languages = { en: enUrl, es: esUrl };
  sitemap.push({ url: enUrl, alternates: { languages }, ...entry });
  sitemap.push({ url: esUrl, alternates: { languages }, ...entry });
}
```

Resultado esperado: el total de URLs del sitemap es ~2x la cantidad de
páginas lógicas (mitad en cada idioma). Sirve como checksum rápido de que
el patrón se aplicó bien: si el total no es par o no se parte 50/50, algo
quedó sin bilingüizar.

---

## 5. La ruta `_not-found` de Next.js es única y global — no hereda el layout de idioma

**Síntoma:** con el patrón split de next-intl (root layout mínimo sin
`<html>/<body>`, y el layout real con `<html>/<body>` un nivel abajo en
`[locale]/layout.tsx`), una página 404 traducida en
`src/app/[locale]/not-found.tsx` funciona perfecto para llamadas explícitas
a `notFound()` **dentro** del árbol de rutas — pero **no** cubre una URL que
no matchea ninguna ruta en absoluto. Next.js genera exactamente **una** ruta
`_not-found` a nivel global, que renderiza a través del root layout
verdadero (el que a propósito no tiene `<html>/<body>` en este patrón), y
eso rompe con un error de hidratación tipo "missing html/body".

**Por qué no es un bug de la migración:** es una restricción de arquitectura
de Next.js App Router, no algo introducido por next-intl — afecta a
cualquier URL 100% inexistente, en cualquier idioma, por igual.

**Fix:** un `src/app/not-found.tsx` mínimo en la raíz de verdad, con su
propio `<html>/<body>`, su propio theme provider, y su propio font loader
(las variables CSS de fuente seteadas en `[locale]/layout.tsx` — ej.
`--font-poppins` — no existen en este `<html>` separado, hay que volver a
cargarlas ahí). Queda fijo en un solo idioma (no puede saber el locale
porque no matcheó ninguna ruta con segmento `[locale]`) — es un fallback de
últimísima instancia, no reemplaza al `not-found.tsx` traducido de adentro
del árbol.

---

## 6. `vercel.json` → `redirects` no lo interpreta `next dev`

**Síntoma:** un redirect declarado en `vercel.json` (ej. `/vieja-ruta` →
`/ruta-nueva`) da **200** (sirve la página normal) al probarlo contra
`localhost:3000` con `next dev`, en vez de redirigir.

**Por qué:** los redirects de `vercel.json` son una feature de la
plataforma Vercel (edge), no algo que Next.js interprete en su propio dev
server. Solo se activan en el deploy real, o corriendo `vercel dev` en vez
de `next dev`.

**No confundir con:** los redirects que genera el **middleware de
next-intl** (ej. prefijo de locale redundante, `/en/miembros` → `/miembros`
cuando `en` es el default) — esos sí corren dentro de Next.js y se pueden
probar normalmente contra `next dev`.

---

## 7. MUI Grid (v6/v7 unificado): los items no se achican por debajo del contenido

**Síntoma:** una imagen responsive (`width: 100%`) adentro de una card
adentro de un `Grid` item se corta/desborda en pantallas angostas en vez de
achicarse proporcionalmente.

**Por qué:** el `Grid` de MUI es flexbox, y los items flex tienen
`min-width: auto` por default — no se achican por debajo del tamaño
intrínseco de su contenido, aunque los hijos tengan `width: 100%`.

**Fix:**

```tsx
<Grid size={{ xs: 12, sm: 6, md: 4 }} sx={{ minWidth: 0 }}>
```

---

## 8. Imagen responsive con aspect-ratio FIJO (no el del archivo original)

**Síntoma:** al hacer responsive una `next/image` que antes tenía
`width={400} height={400}` fijo (cambiando a `style={{ width: "100%",
height: "auto" }}`), las fotos dejan de recortarse uniformemente — cada una
usa su propia proporción original (una sale angosta/alta, otra ancha),
rompiendo el alineado de una grilla de cards.

**Por qué:** `height: "auto"` hace que el browser derive el alto de la
proporción **natural del archivo**, no de los props `width`/`height` del
componente `Image`.

**Fix:** usar `fill` en vez de `width`/`height`, adentro de un contenedor
con `aspect-ratio` fijo explícito:

```tsx
<Box sx={{ position: "relative", width: "100%", aspectRatio: "1 / 1", overflow: "hidden", borderRadius: "16px" }}>
  <Image
    src={...}
    alt={...}
    fill
    sizes="(max-width: 599px) 100vw, (max-width: 899px) 50vw, 33vw"
    style={{ objectFit: "cover" }}
  />
</Box>
```

El `sizes` tiene que reflejar los breakpoints reales del `Grid` (cuántas
columnas ocupa la card en cada tamaño de pantalla) para que Next sirva el
tamaño de imagen correcto — copiarlo sin ajustar a los breakpoints del
proyecto nuevo da imágenes de más o menos resolución de la necesaria.

---

## 9. Validación: build limpio no alcanza, hay que pegarle a rutas reales

Los checks de `tsc --noEmit` / `eslint` / `next build` no detectan ninguno
de los bugs #1, #2 o #5 de esta lista — son todos de comportamiento en
runtime. La validación real necesita un servidor corriendo (dev o un build
de producción con `next start`) y requests reales:

- `curl` con `-w "%{http_code}"` para status.
- `curl` leyendo el `<head>` para confirmar `<link rel="alternate"
  hreflang=...>` correcto y recíproco entre ambas versiones de idioma.
- Reintentar con `Accept-Language: es` para confirmar que la URL (no el
  header) determina el idioma servido.

Vale la pena escribir un script chico (Node, sin dependencias) que pegue a
~30 rutas representativas (estáticas + una muestra real de cada tipo
dinámico) en los dos idiomas y valide status + reciprocidad de hreflang de
una — mucho más rápido que ir ruta por ruta a mano, y queda reutilizable en
el repo.
