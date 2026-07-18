# InterviewDetailPage — Módulo "Otras entrevistas" (contenido relacionado)

> Guía técnica del bloque de contenido relacionado agregado en **ghost-site**
> a la página de detalle de entrevista (`/entrevistas/[interviewId]`), para
> replicarlo en los sitios hermanos (babymetal-site, megadeth-site).
>
> **Cómo usarlo:** abrir una sesión del agente en el repo destino y pasarle
> este archivo. El agente puede además **leer el archivo ya corregido** en
> `G:\TRABAJO\ghost-site\src\components\InterviewDetailPage.tsx` (buscar
> `getRelatedInterviews` y la sección "Otras entrevistas") como referencia
> exacta.

---

## 1. Contexto — por qué esto importa para SEO

Google puede descubrir páginas (vía sitemap) pero nunca rastrearlas si no
tienen suficientes señales de relevancia/enlaces entrantes. Las páginas de
detalle de entrevista suelen depender 100% de la navegación (header/footer)
para ser alcanzadas — sin ningún link contextual entre sí. Agregar un bloque
de "otras entrevistas" al pie de cada página de detalle da interlinking real
entre páginas de contenido, no solo nav.

Este es el mismo patrón general ya aplicado en otras partes del sitio
(discography→songs, historia→entrevistas) — ver `BRIEF-ALBUM-SONGS-
INTERLINKING.md` y `BRIEF-HISTORIA-ENTREVISTAS-INTERLINKING.md` en este
mismo repo para los otros dos casos.

---

## 2. Criterio de matching: las 4 más cercanas por fecha

**Importante — decisión tomada tras probar otra alternativa:** en Ghost se
evaluó primero agrupar por "era" (mismo rango de año que los capítulos de
historia, igual que el fix de Historia→Entrevistas). Se descartó porque casi
todas las entrevistas de esta banda son del mismo entrevistado (Tobias
Forge, fundador/frontman), y agrupar por era generaba grupos poco
diferenciados. **El criterio final, más simple y sin casos borde raros:**
las 4 entrevistas cuya fecha está más cerca de la actual, sin importar si
son anteriores o posteriores, sin filtrar por era ni por entrevistado.

```tsx
// Las 4 entrevistas más cercanas en fecha a la actual (antes o después),
// sin filtrar por era.
function getRelatedInterviews(current: Interview): Interview[] {
  const currentTime = new Date(current.date).getTime();

  return (interviewsData as Interview[])
    .filter((iv) => iv.id !== current.id)
    .sort(
      (a, b) =>
        Math.abs(new Date(a.date).getTime() - currentTime) -
        Math.abs(new Date(b.date).getTime() - currentTime)
    )
    .slice(0, 4);
}
```

**Por qué "más cercanas" y no "las 4 siguientes cronológicamente":** con
"siguientes" (solo hacia adelante en el tiempo), la entrevista más reciente
de todo el dataset se quedaría sin ninguna relacionada (no hay ninguna
posterior). Con "más cercanas en cualquier dirección" siempre hay 4
resultados, sin importar si la entrevista actual es la más vieja o la más
nueva del set.

Antes de portar: si el sitio destino tiene múltiples entrevistados distintos
(no un solo frontman como en Ghost), evaluar si conviene agregar
entrevistado como criterio adicional de relevancia — en Ghost no aplicaba.

---

## 3. La card: imagen + título + medio/tipo + año

```tsx
{relatedInterviews.map((relatedInterview) => {
  const videoId = relatedInterview.youtube_url
    ? getYouTubeVideoId(relatedInterview.youtube_url)
    : null;

  return (
    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={relatedInterview.id}>
      <Card sx={{ height: "100%" }}>
        <CardActionArea
          component={Link}
          href={`/entrevistas/${generateInterviewSlug(relatedInterview.id)}`}
          sx={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "stretch" }}
        >
          {videoId && (
            <Box sx={{ position: "relative", width: "100%", height: 160, flexShrink: 0 }}>
              <Image
                src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                alt={getInterviewTitle(relatedInterview, locale)}
                fill
                style={{ objectFit: "cover" }}
              />
              <Chip
                label={new Date(relatedInterview.date).getFullYear()}
                size="small"
                color="primary"
                sx={{ position: "absolute", top: 8, right: 8, fontWeight: 700 }}
              />
            </Box>
          )}
          <CardContent>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 600,
                mb: 0.5,
                minHeight: "2.6em",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {getInterviewTitle(relatedInterview, locale)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {relatedInterview.media.name} ·{" "}
              {relatedInterview.type === "video" ? t("video") : t("text")}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
})}
```

### Gotchas de diseño encontrados en QA visual (no saltear)

1. **Imagen con alto fijo en px, no aspect-ratio por porcentaje.** La
   primera versión usaba `pt: "56.25%"` (padding-top como % del ancho). Se
   cambió a `height: 160` fijo + `flexShrink: 0` — más simple y predecible
   entre cards de distinto ancho de columna.

2. **Título con `line-clamp` a 2 líneas + `minHeight` fijo.** Sin esto, cards
   con títulos de 1 línea quedan más bajas que las de 2-3 líneas, y el texto
   de "medio · tipo" de abajo queda desalineado entre columnas. El
   `-webkit-line-clamp: 2` + `minHeight: "2.6em"` garantiza que todos los
   títulos —cortos o largos— ocupen el mismo espacio vertical.

3. **Imagen del thumbnail:** se deriva de `youtube_url` con el helper
   compartido `getYouTubeVideoId` (ya existente en el proyecto, en Ghost
   ubicado en `@/types/show.ts` aunque el nombre del archivo sugiera que es
   solo para shows — es genérico, reutilizable). **No reinventar el regex de
   extracción de video ID** — buscar si el sitio destino ya tiene un helper
   equivalente antes de escribir uno nuevo.
   Patrón de thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
   — confirmar que `img.youtube.com` esté en `remotePatterns` de
   `next.config.ts`/`.js` (en Ghost ya estaba whitelisteado de antes).

4. **Chip de año** superpuesto en la esquina de la imagen (no como texto
   aparte) — no ocupa espacio vertical extra, no rompe el alineado logrado
   en el punto 2. **Nota:** en la implementación de Ghost, el chip está
   condicionado a que exista imagen (`{videoId && (...)}`). Si el sitio
   destino tiene entrevistas sin video (tipo texto, sin `youtube_url`), el
   chip de año tampoco se mostraría para esas — evaluar si conviene sacar el
   chip de ese gate y mostrarlo siempre, independiente de si hay imagen.

---

## 4. Pasos para el agente (portado)

1. Confirmar que el JSON de entrevistas del sitio destino tiene un campo de
   fecha (`date`) por entrevista — es el único dato que requiere este
   approach.
2. Ubicar el componente de detalle de entrevista (`InterviewDetailPage.tsx`
   o equivalente).
3. Copiar la función `getRelatedInterviews` (sección 2), ajustando el nombre
   del import del JSON de entrevistas si difiere.
4. Agregar el render de la sección (sección 3) al pie de la página, antes
   del botón de "volver"/CTA final.
5. Confirmar/agregar el helper de extracción de YouTube video ID (buscar si
   ya existe uno en el proyecto antes de escribir uno nuevo) y verificar que
   `img.youtube.com` esté whitelisteado en la config de imágenes de Next.
6. Aplicar los 4 gotchas de diseño de la sección 3 (alto fijo de imagen,
   line-clamp de título, chip de año superpuesto).
7. Validar: revisar visualmente que las cards con títulos de distinto largo
   queden alineadas entre sí, y que el link de cada card lleve a la
   entrevista correcta.

---

## 5. Errores para no repetir

- **No agrupar por "era" o categoría si casi todo el contenido cae en el
  mismo entrevistado/categoría** — el criterio queda inútil (grupos no
  diferenciados). Evaluar primero cuántos valores distintos tiene el campo
  candidato a criterio de match antes de implementarlo (en Ghost, los 11
  registros tenían el mismo entrevistado — se descartó ese criterio a
  tiempo).
- **No dejar el matching "solo hacia adelante en el tiempo"** sin verificar
  qué pasa con el ítem más reciente del dataset (queda con 0 relacionados).
- **No dejar que títulos de distinto largo desalineen las cards** — siempre
  aplicar `line-clamp` + altura mínima si el título es de longitud variable.
- **No reinventar el regex de extracción de YouTube video ID** — buscar el
  helper compartido existente primero.
