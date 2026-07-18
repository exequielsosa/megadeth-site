# SongsListPage — Fix de indexación SEO (agrupado por álbum)

> Guía técnica del fix aplicado a la página `/songs` en **ghost-site**, para
> replicarlo en los sitios hermanos (babymetal-site, megadeth-site).
>
> **Cómo usarlo:** abrir una sesión del agente en el repo destino y pasarle este
> archivo. El agente puede además **leer el archivo fuente ya corregido** en
> `G:\TRABAJO\ghost-site\src\components\SongsListPage.tsx` como referencia
> exacta.

---

## 1. El problema (verificar primero si aplica en el destino)

La página de listado de canciones (`/songs` o equivalente) mostraba todas las
canciones en **una tabla plana con paginación controlada por estado de React**
(`useState` + `.slice(startIndex, endIndex)`), 10 canciones por página en
desktop, y un botón "Cargar más" en mobile.

**Por qué es un problema de SEO:** Next.js renderiza el HTML inicial (SSR) con
el estado inicial del componente — es decir, **solo la primera página** (10
canciones). El resto de las canciones (en Ghost eran 71 de 81) sólo aparecen
tras un click que cambia el estado de React (`setPageDesktop`, `loadMoreMobile`).
Google jamás ve esas canciones en el HTML servido: quedan fuera del índice.

**Antes de aplicar este fix en el sitio destino**, confirmar que su
`SongsListPage.tsx` (o el nombre equivalente) tiene el mismo patrón:
paginación via `useState`/`.slice()` que oculta contenido detrás de clicks.
Si el listado de canciones ya es plano y completo (sin paginación oculta), no
hace falta este fix — pasar directo al Task 4 de abajo (agrupado por álbum es
una mejora de estructura, no necesariamente urgente si no hay problema de
indexación).

---

## 2. La solución aplicada

Agrupar las canciones por álbum (más reciente primero, igual criterio que
`discography.json`) y renderizar **todas** de una, sin paginación:

```
<h2>Skeletá (2025)</h2>
  [tabla con sus 10 canciones — todas presentes, sin paginar]
<h2>Impera (2022)</h2>
  [tabla con sus 12 canciones]
...
```

Esto resuelve el problema de indexación (las 81 canciones quedan en el HTML
inicial) y de paso mejora la estructura semántica (headings `<h2>` por álbum,
mejor señal temática para rankear tanto la query genérica "[banda] songs" como
búsquedas de canciones de álbumes específicos).

### Se mantiene igual (no tocar)
- El buscador (`TextField` + `filter` state) — sigue siendo client-side, pero
  ahora filtra sobre el listado ya completo, no sobre datos ocultos.
- El bloque "Top 10 canciones más tocadas" (si el sitio destino tiene un
  equivalente basado en counts de setlist.fm).
- Los links de cada fila a `/songs/[id]` (o su ruta de detalle).
- El diseño de tabla MUI (`Table`/`TableContainer`) — no se reemplaza por un
  diseño distinto, solo se repite por sección de álbum.
- Las columnas Álbum y Año **se mantienen en la tabla** aunque sean
  redundantes con el heading de la sección — decisión de diseño del dueño del
  sitio, no simplificar/quitarlas.

### Se elimina
- Toda la lógica de paginación: constantes `ITEMS_PER_PAGE_*`, estados
  `pageDesktop`/`displayCountMobile`, cálculos `totalPagesDesktop`,
  `startIndexDesktop`/`endIndexDesktop`, `displayedDesktop`/`displayedMobile`,
  `hasMoreMobile`, función `loadMoreMobile`.
- El componente `Pagination` de MUI y el botón "Cargar más".

---

## 3. Función de agrupado (adaptar nombres de campos si difieren)

```tsx
interface AlbumGroup {
  title: string;
  year: number;
  songs: Song[];
}

// Agrupa las canciones por álbum (más reciente primero) para que todas
// queden presentes en el HTML desde el primer render, sin paginación oculta
// detrás de clicks que Google nunca llega a ver.
function groupByAlbum(songs: Song[]): AlbumGroup[] {
  const groups = new Map<string, AlbumGroup>();

  for (const song of songs) {
    const key = song.album.title;
    if (!groups.has(key)) {
      groups.set(key, { title: key, year: song.album.year, songs: [] });
    }
    groups.get(key)!.songs.push(song);
  }

  return Array.from(groups.values())
    .sort((a, b) => b.year - a.year) // más reciente primero
    .map((group) => ({
      ...group,
      songs: group.songs.sort(
        (a, b) => a.details.track_number - b.details.track_number
      ),
    }));
}
```

Requiere que cada canción tenga `album.title`, `album.year` y
`details.track_number` embebidos (verificar en el JSON de canciones del sitio
destino — en Ghost está en `src/constants/songs.json`). Si el sitio destino
no tiene `track_number`, ordenar por otro criterio disponible (orden original
del array, o alfabético) o quitar ese `.sort()` interno.

El componente pasa a usar `groupByAlbum(filtered)` (donde `filtered` es el
resultado del buscador) en lugar de la lista plana + slice.

---

## 4. Detalle de implementación — anchos de columna consistentes

**Gotcha encontrado en QA visual:** al repetir una `<Table>` de MUI por cada
álbum (una tabla HTML independiente por sección), cada tabla autoajusta el
ancho de sus columnas al contenido de esa sección. Resultado: la columna
"Álbum" de la tabla de "Skeletá" queda con un ancho distinto a la de
"Phantomime", por ejemplo — se ve desalineado entre secciones.

**Fix:** fijar `tableLayout: "fixed"` en el `<Table>` y asignar un ancho fijo
(en %) a cada `TableCell` del `TableHead`, igual en todas las secciones:

```tsx
<Table size="small" sx={{ tableLayout: "fixed" }}>
  <TableHead sx={{ backgroundColor: "primary.main", height: 50 }}>
    <TableRow>
      <TableCell sx={{ width: "34%" }}>{t("title")}</TableCell>
      <TableCell sx={{ width: "20%" }}>{t("album")}</TableCell>
      <TableCell sx={{ width: "12%" }}>{t("year")}</TableCell>
      <TableCell sx={{ width: "16%" }}>{t("duration")}</TableCell>
      <TableCell align="center" sx={{ width: "18%" }}>
        {t("timesPlayed")}
      </TableCell>
    </TableRow>
  </TableHead>
  ...
</Table>
```

Los porcentajes deben sumar 100% y ajustarse a las columnas reales del sitio
destino (puede tener más/menos columnas). Con `tableLayout: fixed`, el ancho
del header determina el ancho de todas las filas del body — no hace falta
repetir el `width` en las celdas del body.

---

## 5. Title / metadata (ajuste menor, aparte del componente)

De paso se corrigió el `<title>` de la página (era genérico tipo "Listado de
canciones"), a uno más descriptivo y con la keyword objetivo, ej.:

- ES: "Todas las Canciones de Ghost por Álbum"
- EN: "All Ghost Songs by Album"

Adaptar al nombre de banda del sitio destino. Verificar primero si la key de
traducción usada es exclusiva de esta página o compartida con nav/footer
(`grep` la key en todo `src/` antes de editarla) — si es compartida, no
editar el valor: hardcodear un title literal por locale en el
`generateMetadata` de la página en su lugar, sin tocar la key compartida.

---

## 6. Pasos para el agente (portado)

1. Ubicar el componente de listado de canciones del sitio destino
   (`grep -r "songsData\|songs.json" src/` o similar) y confirmar si tiene el
   patrón de paginación oculta descrito en la sección 1.
2. Si aplica, copiar la función `groupByAlbum` (sección 3) adaptando nombres
   de campos al shape real de las canciones del sitio destino.
3. Reemplazar el render de tabla/cards plano por la iteración sobre
   `albumGroups`, con un `<h2>` por álbum antes de cada tabla/grid de
   canciones (ver estructura completa en
   `G:\TRABAJO\ghost-site\src\components\SongsListPage.tsx`, líneas 271-415).
4. Eliminar toda la lógica de paginación/estado que quede huérfana.
5. Aplicar el fix de anchos de columna (sección 4) si el diseño usa una
   `<Table>` de MUI repetida por sección.
6. Ajustar el title/description de la página (sección 5), verificando que la
   key de traducción no sea compartida antes de editarla.
7. Validar: `npx tsc --noEmit` y `npx eslint` limpios en el archivo tocado;
   `npm run dev` y revisar visualmente que las columnas alineen entre
   secciones y que el buscador siga filtrando correctamente.

---

## 7. Errores para no repetir

- **No dejar paginación de React ocultando contenido** — es exactamente el
  bug que se está arreglando; no reintroducirlo en otra forma (ej. un
  "mostrar más" con límite inicial bajo tendría el mismo problema).
- **No asumir que las columnas se alinean solas entre tablas repetidas** — sin
  `tableLayout: fixed` + anchos explícitos, cada `<Table>` de MUI se
  autoajusta a su propio contenido y quedan desalineadas visualmente.
- **No editar una key de traducción de title sin verificar que no sea
  compartida** con nav/footer/breadcrumb — puede tener otros usos en el
  sitio.
