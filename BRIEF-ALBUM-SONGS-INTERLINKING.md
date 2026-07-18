# AlbumDetail — Fix de interlinking álbum → canciones

> Guía técnica del fix aplicado en **ghost-site** al tracklist de la página de
> detalle de álbum (`/discography/[albumId]`), para replicarlo en los sitios
> hermanos (babymetal-site, megadeth-site).
>
> **Cómo usarlo:** abrir una sesión del agente en el repo destino y pasarle
> este archivo. El agente puede además **leer el archivo ya corregido** en
> `G:\TRABAJO\ghost-site\src\components\AlbumDetail.tsx` (buscar el bloque
> `album.tracks.map`) como referencia exacta.

---

## 1. El problema (verificar primero si aplica en el destino)

En la página de detalle de álbum, el tracklist de cada canción tenía (o podía
tener) un ícono de "ver detalle de la canción" que linkeaba a `/songs/[slug]`.
El link se armaba **a mano, con un regex inline**, en vez de usar el `id` real
de la canción:

```tsx
// PATRÓN CON BUG — buscar este patrón en el destino
<Link
  href={`/songs/${track.title
    .toLowerCase()
    .replace(/[^a-z0-9 ]/gi, "")
    .replace(/ /g, "-")}`}
>
```

**Por qué falla:** ese regex no normaliza tildes/diacríticos antes de
eliminar caracteres especiales (`replace(/[^a-z0-9 ]/gi, "")` borra la "ö",
"é", etc. en vez de convertirlas a su letra base). Si el `id` real de la
canción en el JSON de canciones del sitio (generado en otro momento, con otra
lógica) no coincide exactamente con este regex casero, **el link apunta a una
URL que no existe** (404 silencioso, el usuario ni Google nunca llegan a la
página real de la canción).

En Ghost, ejemplo concreto del bug: para la canción "Spöksonat", el regex
generaba un slug distinto al `id` real registrado en `songs.json` (que a su
vez también había perdido la tilde en su propia generación, resultando en un
slug con una letra faltante). Verificar en el sitio destino si existe el
mismo patrón de regex inline y si hay discrepancias reales comparando
títulos de `discography.json`/álbumes contra los `id` de `songs.json`.

Además, el link solía estar condicionado a un campo tipo `track.lyrics`
(¿tiene letra cargada?), que **no es lo mismo** que "¿existe una página
`/songs/[id]` para esta canción?". Son dos preguntas distintas — puede haber
letra sin página propia, o viceversa.

---

## 2. La solución aplicada

En vez de regenerar el slug con regex, **buscar la canción real** en los
datos de canciones del sitio (por título) y usar su `id` verdadero:

```tsx
import songsData from "@/constants/songs.json"; // ajustar path/nombre real

// dentro del .map de tracks:
const matchedSong = songsData.find((s) => s.title === track.title);
```

El link (y el gate de si se muestra o no) pasa a depender de `matchedSong`,
no de `track.lyrics` ni de un slug adivinado:

```tsx
{matchedSong && (
  <Link href={`/songs/${matchedSong.id}`}>
    {/* ícono o lo que sea que dispare el link */}
  </Link>
)}
```

Esto garantiza que el link **siempre** apunte a una página que existe de
verdad, sin importar cómo se generó el `id` en el JSON de canciones.

### Caso borde: canciones sin match
No todas las canciones del tracklist del álbum van a tener match exacto por
título contra el JSON de canciones (en Ghost: 1 de 66 canciones de álbumes de
estudio no matcheó — un cover/bonus track que no está en el listado principal
de canciones). Es esperable y está bien: simplemente no se muestra el link
para esa canción puntual (`matchedSong` da `undefined`, el `&&` no renderiza
nada). Verificar el % de match en el sitio destino antes de asumir que el
fix funciona al 100% — correr algo como:

```js
node -e "
const songs = require('./src/constants/songs.json');
const disc = require('./src/constants/discography.json');
let missing = 0, total = 0;
for (const album of disc) {
  for (const track of (album.tracks || [])) {
    total++;
    if (!songs.find(s => s.title === track.title)) { missing++; console.log('SIN MATCH:', album.title, '->', track.title); }
  }
}
console.log('Total:', total, '| Sin match:', missing);
"
```

Ajustar los nombres de archivo/paths según la estructura real del sitio
destino.

### Mejora adicional: título de la canción clickeable
De paso, se hizo que el **título de la canción** en el tracklist sea
clickeable (no solo el ícono chiquito de info) — más peso de interlinking
real para SEO y mejor UX. Patrón usado (adaptar estilos al tema del sitio
destino):

```tsx
{matchedSong ? (
  <Typography
    component={Link}
    href={`/songs/${matchedSong.id}`}
    variant="body1"
    sx={{
      fontWeight: 500,
      color: "text.primary",
      textDecoration: "none",
      "&:hover": { color: "primary.main", textDecoration: "underline" },
    }}
  >
    {track.title}
  </Typography>
) : (
  <Typography variant="body1" sx={{ fontWeight: 500 }}>
    {track.title}
  </Typography>
)}
```

Esto es una decisión de diseño, no un fix obligatorio — si el sitio destino
prefiere mantener el título como texto plano y solo arreglar el link del
ícono, es válido saltear esta parte.

---

## 3. Qué NO tocar

- La lógica de `track.lyrics` / `handleTrackClick` que abre un modal con las
  letras completas dentro de la misma página — es una feature aparte, no
  relacionada con el link a `/songs/[id]`. No fusionar ambos gates.
- El resto del diseño del tracklist (número de track, duración, compositores).

---

## 4. Pasos para el agente (portado)

1. Ubicar el componente de detalle de álbum del sitio destino (buscar
   `tracklist` o el render de `album.tracks.map` — en Ghost es
   `AlbumDetail.tsx`).
2. Confirmar si existe el mismo patrón de bug: regex inline para armar el
   slug de la canción, en vez de usar su `id` real.
3. Si aplica, importar el JSON de canciones del sitio y agregar el
   `matchedSong = songsData.find((s) => s.title === track.title)` dentro del
   `.map` de tracks.
4. Reemplazar el `href` armado con regex por `/songs/${matchedSong.id}`, y el
   gate `track.lyrics &&` (o el que exista) por `matchedSong &&`.
5. Correr el script de verificación de la sección 2 para confirmar el % de
   match título-a-título.
6. Opcional: aplicar el título clickeable (sección 2, "Mejora adicional").
7. Validar: `npx tsc --noEmit` y `npx eslint` limpios en el archivo tocado;
   `npm run dev` y clickear varios álbumes/canciones distintas (especialmente
   títulos con tildes o caracteres especiales) para confirmar que cada link
   lleva a la página de canción correcta.

---

## 5. Errores para no repetir

- **No armar slugs con regex inline duplicando lógica que ya existe en otro
  lado** (el sitio puede tener un `slugify()` util compartido — pero incluso
  usar ese util no garantiza el match si el `id` real del JSON de canciones
  se generó con otra lógica en otro momento). La única forma robusta de
  enlazar es **buscar la canción real por título y usar su `id` tal cual
  está guardado**, no regenerar el slug.
- **No confundir "tiene letra cargada" con "tiene página propia"** — son
  condiciones distintas, cada una con su propio gate.
- **No asumir 100% de match** entre tracklist del álbum y el JSON de
  canciones — verificar con el script antes de dar el fix por completo.
