# Addendum a BRIEF-SONGS-SEO-FIX.md — las filas necesitan `<a href>` real, no `onClick`

> Hallazgo posterior a aplicar `BRIEF-SONGS-SEO-FIX.md` en megadeth-site.
> **Aplica también a la versión ya "corregida" en ghost-site** — el bug de
> este addendum estaba presente en el archivo de referencia
> (`G:\TRABAJO\ghost-site\src\components\SongsListPage.tsx`) que el brief
> original señalaba como ejemplo a copiar. No es un bug introducido por el
> agrupado por álbum, es anterior a eso — pero conviene arreglarlo junto
> con el resto del fix, ya que se está tocando el mismo archivo.

---

## 1. El problema

`BRIEF-SONGS-SEO-FIX.md` resuelve que las canciones **aparezcan** en el
HTML inicial (agrupadas por álbum, sin paginación oculta). Pero al
verificar con `curl` cuántos `<a href="/songs/...">` reales había en el
HTML servido, la respuesta era **cero**:

```tsx
// Tanto en <TableRow> (desktop) como en <CardActionArea> (mobile)
onClick={() => (window.location.href = `/songs/${song.id}`)}
```

Esto navega perfecto para un usuario con JS habilitado, pero **no es un
link que un crawler pueda seguir**. Google puede ejecutar JS en muchos
casos, pero un `onClick` sobre un `<tr>`/`<div>` no es un mecanismo de
navegación confiable ni recomendado — el estándar es un `<a href>` real.

**Por qué importa incluso con `BRIEF-SONGS-SEO-FIX.md` ya aplicado:** las
200 canciones ya están indexables por separado (vía `sitemap.xml`), pero
la página `/songs` — la de más autoridad/enlaces entrantes de toda la
sección — no le estaba pasando esa señal de enlace interno a ninguna de
sus 200 páginas de detalle. Con el fix de este addendum, si el sitio
destino tiene 200 canciones, hay que confirmar 200 `<a href>` reales en
el HTML, no 0.

**Cómo se detectó:** no con `tsc`/`eslint`/`build` (todos pasan limpio
igual, `onClick` es código válido) — hace falta bajar el HTML real
servido y contar:

```bash
curl -s http://localhost:3000/songs -o /tmp/songs.html
grep -oE 'href="/songs/[a-z0-9-]+"' /tmp/songs.html | sort -u | wc -l
# antes del fix: 0 — después: la cantidad total de canciones del sitio
```

---

## 2. La solución — 3 patrones distintos según el elemento

Este componente ya es `"use client"` de punta a punta (`SongsListPage.tsx`
entero), así que usar `component={Link}` acá es seguro — **no aplica el
gotcha de que `component={Link}` crashea**, eso solo pasa cuando se usa
desde un Server Component (ver gotcha #1 de `I18N-LEARNINGS.md`). Acá no
hay ningún límite Server→Client de por medio.

### 2.1 — Cards con `component={Link}` (Top 10 y cards mobile)

El caso simple: `Card` y `CardActionArea` de MUI son polimórficos, aceptan
`component` + `href` directamente:

```tsx
// Card del Top 10 (antes tenía onClick + cursor:pointer)
<Card
  component={Link}
  href={`/songs/${item.song.id}`}
  sx={{
    display: "block",
    textDecoration: "none",
    color: "inherit",
    cursor: "pointer",
    // ...resto de los estilos igual
  }}
>
  <CardContent>...</CardContent>
</Card>

// CardActionArea de las cards mobile (antes tenía onClick)
<CardActionArea component={Link} href={`/songs/${song.id}`}>
  <CardContent>...</CardContent>
</CardActionArea>
```

Importante: agregar `display: "block"`, `textDecoration: "none"`,
`color: "inherit"` al `Card` que pasa a ser un `<a>` — por default un
`<a>` es `inline` y hereda estilos de link del navegador (subrayado, color
azul), hay que resetearlo explícitamente. `CardActionArea` no necesita
esto porque ya tiene sus propios estilos base que no dependen del tag.

### 2.2 — Filas de tabla: NO se puede hacer lo mismo (HTML inválido)

Un `<tr>` no puede ser reemplazado por un `<a>` — un `<a>` no es un hijo
válido de `<table>`/`<tbody>`, y `component={Link}` en `TableRow`
rompería la semántica de tabla (aunque compile).

**Fix: "stretched link"** — un `<a>` real vive dentro de la primera
`<td>`, posicionado absoluto para cubrir visualmente toda la fila:

```tsx
<TableRow
  key={song.id}
  hover
  sx={{ cursor: "pointer", height: 55, position: "relative" }}
  // sin onClick — la navegación la hace el <a> de abajo
>
  <TableCell>
    <Link
      href={`/songs/${song.id}`}
      aria-label={song.title}
      style={{ position: "absolute", inset: 0 }}
    />
    <Box display="flex" alignItems="center" gap={1}>
      <Typography fontWeight={500}>{song.title}</Typography>
      {/* resto del contenido de la celda, sin cambios */}
    </Box>
  </TableCell>
  {/* resto de las TableCell, sin cambios */}
</TableRow>
```

**Por qué funciona:** `position: absolute` con `inset: 0` se posiciona
relativo al ancestro posicionado más cercano — por eso el `position:
relative` va en el `<tr>` (no en el `<td>`), así el `<a>` se estira para
cubrir el ancho completo de la fila (todas las columnas), no solo la
primera celda. El `<a>` no tiene contenido visible ni fondo, así que no
tapa nada visualmente — solo agrega el área clickeable + el link real
para el crawler.

**Verificar después de aplicar** (con el navegador, no solo curl): hacer
click en cualquier parte de la fila (no solo donde está el texto) debe
seguir navegando igual que antes.

---

## 3. Checklist de verificación

1. `npx tsc --noEmit` y `npx eslint <archivo>` — limpios.
2. Levantar el server real (`npm run dev` o `npm start`) y confirmar con
   `curl` que la cantidad de `<a href="/songs/...">` (o la ruta
   equivalente del sitio destino) en el HTML servido es igual a la
   cantidad total de canciones — no 0, no un número parcial.
3. Repetir el mismo check en la versión `/es/...` si el sitio tiene
   routing por locale.
4. Visualmente: click en cualquier zona de una fila de tabla (no solo el
   texto) debe navegar — confirma que el `position: relative` en el
   `<TableRow>` quedó bien aplicado y el link cubre toda la fila.
5. Si el `<tr>` no tiene `position: relative` en el CSS generado (se
   puede inspeccionar con devtools o grepeando el HTML servido por la
   clase de Emotion), el `<a>` se va a posicionar relativo a un ancestro
   más lejano (ej. la tabla completa) y el área clickeable queda mal —
   confirmar explícitamente este punto, no asumir que "position:
   relative" quedó en el nivel correcto solo por estar en el `sx` del
   componente correcto en el JSX.
