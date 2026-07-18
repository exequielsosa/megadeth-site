# Auditoría: navegación con onClick/router vs. `<a href>` real

> Guía técnica de un bug de SEO encontrado y corregido en **ghost-site** en
> 6 componentes distintos, para replicar la auditoría y el fix en los
> sitios hermanos (babymetal-site, megadeth-site).
>
> **Origen:** este hallazgo nació de un addendum a `BRIEF-SONGS-SEO-FIX.md`
> detectado al aplicar ese brief en megadeth-site (ver
> `BRIEF-SONGS-SEO-FIX-ADDENDUM-LINKS.md` en este repo). Acá se generaliza:
> el mismo bug apareció en **6 componentes distintos** de ghost-site, no
> solo en el listado de canciones.

---

## 1. El problema

Un elemento clickeable con `onClick={() => window.location.href = "..."}`
o `onClick={() => router.push("...")}` **navega perfecto para un usuario
con JS habilitado**, pero no es un link real: no hay ningún `<a href="...">`
en el HTML. Google puede ejecutar JS en muchos casos, pero un `onClick`
sobre un `<div>`/`<tr>`/`<Button>` no es un mecanismo de navegación
confiable ni recomendado — el estándar es un `<a href>` real, y sin eso:

- La página de destino **no recibe la señal de enlace interno** de la
  página que la linkea (aunque esté indexada por separado vía sitemap).
- Un crawler que no ejecuta JS (o que limita cuánto JS ejecuta) **no puede
  descubrir la página** siguiendo ese link.

**No lo detectan `tsc`/`eslint`/`build`** — el código compila perfecto,
`onClick` es válido. Hace falta:

1. Grepear el código buscando el patrón (sección 2).
2. Verificar con el HTML servido real (sección 5) cuántos `<a href>` reales
   hay — no alcanza con "funciona al clickear en el navegador".

---

## 2. Cómo detectar el patrón (correr esto primero en el sitio destino)

```bash
grep -rn "window\.location\.href" src/
grep -rn "router\.push(" src/
```

En ghost-site esto encontró **6 archivos** con el problema (detalle en la
sección 4). Cualquier resultado de estos greps es candidato a revisar —
no todos son necesariamente un bug (podría haber casos legítimos de
navegación puramente interactiva sin valor de link, ej. cerrar un modal),
pero **todo lo que navega a una URL de contenido real del sitio** (una
página de detalle, un capítulo, una sección) debería ser un `<a>` real.

---

## 3. Los 3 patrones de fix, según el contexto del elemento

### 3.1 — Box/Card/Button simple (el caso más común)

Si el elemento clickeable es un `<div>`/`Box`/`Card`/`Button` de MUI (todos
polimórficos, aceptan `component` + `href`), el fix es directo:

```tsx
// Antes
<Box onClick={() => router.push(target)} sx={{ cursor: "pointer", ... }}>
  {children}
</Box>

// Después
<Box component={Link} href={target} sx={{ display: "block", cursor: "pointer", ... }}>
  {children}
</Box>
```

**Gotcha importante:** agregar `display: "block"` (un `<a>` es `inline`
por default, así que `width`/`height`/layout explícitos dejan de aplicar
bien si no se fuerza el display). Si el elemento tiene texto visible,
también resetear `textDecoration: "none"` y `color: "inherit"` — por
default un `<a>` hereda estilos de link del navegador (subrayado, azul).

Para `MUI Button` con estados `disabled` (ej. botones "anterior/siguiente"
que a veces no tienen destino): usar un fallback `href="#"` cuando no hay
destino real, y dejar `disabled={condición}` — MUI aplica
`pointer-events: none` + estilos disabled incluso siendo `component={Link}`,
así que el link queda en el HTML (bueno para casos donde sí hay destino)
pero no es clickeable cuando `disabled` es true.

### 3.2 — Filas de tabla (`TableRow`): NO se puede hacer lo mismo

Un `<tr>` no puede ser reemplazado por un `<a>` — no es un hijo válido de
`<table>`/`<tbody>`, y forzarlo rompe la semántica de tabla aunque
compile. Acá el fix es el patrón **"stretched link"**: un `<a>` real vive
dentro de la primera `<td>`, posicionado absoluto para cubrir
visualmente toda la fila:

```tsx
<TableRow sx={{ cursor: "pointer", height: 55, position: "relative" }}>
  {/* sin onClick — la navegación la hace el <a> de abajo */}
  <TableCell>
    <Link
      href={target}
      aria-label={itemTitle}
      style={{ position: "absolute", inset: 0 }}
    />
    {/* resto del contenido de la celda, sin cambios */}
  </TableCell>
  {/* resto de las TableCell, sin cambios */}
</TableRow>
```

**Por qué funciona:** `position: absolute` con `inset: 0` se posiciona
relativo al ancestro posicionado más cercano — por eso `position: relative`
va en el `<TableRow>` (no en el `<TableCell>`), así el `<a>` se estira para
cubrir el ancho completo de la fila, no solo la primera celda. El `<a>` no
tiene contenido visible ni fondo, no tapa nada — solo agrega el área
clickeable + el link real para el crawler.

### 3.3 — Elementos "decorativos" sin texto (ej. un punto/marcador clickeable)

Si el elemento es puramente visual (un círculo, un ícono) sin texto hijo,
`component={Link}` funciona igual sin necesidad de `textDecoration`/`color`
— solo agregar `display: "block"` para que `width`/`height` se respeten.
Un `<a>` sin `children` (self-closing) es HTML válido en Next.js App
Router (no como en versiones viejas de `next/link` con `legacyBehavior`,
que exigían exactamente un hijo).

---

## 4. Los 6 casos encontrados y corregidos en ghost-site (referencia)

| Archivo | Elemento | Patrón usado |
|---|---|---|
| `SongsListPage.tsx` | Card Top 10, TableRow, CardActionArea mobile | 3.1 (Card/CardActionArea) + 3.2 (TableRow) |
| `ShowsListPage.tsx` | TableRow del listado de shows | 3.2 |
| `InterviewsListPage.tsx` | TableRow del listado de entrevistas | 3.2 |
| `NewsBanner.tsx` (`RandomSectionBanner`, usado en casi todas las páginas) | Box del banner completo | 3.1 |
| `HistoryNavigation.tsx` | Botones "capítulo anterior/siguiente" | 3.1 (con fallback `href="#"` + `disabled`) |
| `HistoryTimeline.tsx` | Card mobile, punto del timeline, tarjeta de info (3 elementos en el mismo archivo) | 3.1 + 3.3 (el punto) |

En todos los casos, las cards que **ya usaban** `CardActionArea
component={Link}` (ej. las cards mobile de Shows/Interviews, o
`DVDCard.tsx`) **ya estaban bien** — el bug era específico de dónde había
un `onClick`/`router.push` explícito, no de todo el sitio por igual.
Verificar caso por caso, no asumir que un componente entero está mal solo
porque otro similar lo estaba.

---

## 5. Checklist de verificación

1. `npx tsc --noEmit` y `npx eslint <archivo>` — limpios (no van a fallar
   por esto, pero confirman que no se rompió nada al tocar el archivo).
2. Levantar el server real (`npm run dev` o `npm start`) y verificar con
   `curl` o "Ver código fuente" (`Ctrl+U`) que la ruta de destino aparece
   como `href="..."` real en el HTML servido — no 0, no un número parcial.
   ```bash
   curl -s http://localhost:3000/songs -o /tmp/songs.html
   grep -oE 'href="/songs/[a-z0-9-]+"' /tmp/songs.html | sort -u | wc -l
   ```
3. Visualmente: click en distintas zonas del elemento (no solo donde está
   el texto) — tiene que seguir navegando igual que antes del fix.
4. Para el patrón de `TableRow` (3.2): confirmar con devtools que el
   `<tr>` realmente tiene `position: relative` en el CSS aplicado — si no,
   el `<a>` se posiciona relativo a un ancestro más lejano y el área
   clickeable queda mal. No asumir que quedó bien solo por estar en el
   `sx` del componente correcto en el JSX.

---

## 6. Pasos para el agente (portado)

1. Correr los dos greps de la sección 2 en el repo destino.
2. Para cada resultado, clasificar: ¿es navegación a contenido real del
   sitio (arreglar) o interacción puramente de UI sin valor de link
   (dejar como está)?
3. Para cada caso a arreglar, identificar qué patrón aplica (3.1, 3.2 o
   3.3) según si el contenedor es un elemento MUI polimórfico simple, una
   fila de tabla, o un elemento decorativo sin texto.
4. Aplicar el fix, verificar con la checklist de la sección 5.
5. Prestar atención especial a componentes que se usan en **muchas
   páginas** (como `NewsBanner`/`RandomSectionBanner` acá) — son el mayor
   impacto por unidad de esfuerzo, arreglarlos primero.

---

## 7. Errores para no repetir

- **No asumir que si compila y funciona al clickear, está bien** — este
  bug es invisible para `tsc`/`eslint`/testing manual en el navegador. Solo
  se detecta mirando el HTML servido real.
- **No poner `component={Link}` en un `TableRow`** — rompe la semántica de
  tabla. Usar el patrón stretched-link (3.2) ahí.
- **No olvidar `display: "block"`** al convertir un elemento a `<a>` — sin
  esto, `width`/`height` explícitos dejan de aplicarse bien (el default de
  `<a>` es `inline`).
- **No asumir que todo un componente está mal** solo porque otro similar
  lo estaba — verificar caso por caso (varias cards mobile en este mismo
  repo ya estaban bien hechas desde antes).
