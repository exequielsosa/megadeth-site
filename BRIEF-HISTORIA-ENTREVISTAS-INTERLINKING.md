# Historia → Entrevistas — Interlinking automático por año

> Guía técnica del fix aplicado en **ghost-site** a la página de detalle de
> capítulo de historia (`/historia/[capitulo]`), para replicarlo en los
> sitios hermanos (babymetal-site, megadeth-site).
>
> **Cómo usarlo:** abrir una sesión del agente en el repo destino y pasarle
> este archivo. El agente puede además **leer el archivo ya corregido** en
> `G:\TRABAJO\ghost-site\src\app\historia\[capitulo]\page.tsx` como
> referencia exacta.

---

## 1. El problema

Google descubre muchas páginas del sitio (vía sitemap) pero nunca las
rastrea/indexa ("Descubierta: actualmente sin indexar"). Una causa: los
únicos enlaces internos son de navegación (header/footer), siempre los
mismos en todas las páginas. Falta **interlinking contextual**: contenido
que, dentro del texto, linkee a páginas relacionadas específicas.

En Ghost, un gap concreto: los capítulos de `/historia` (la narrativa
histórica de la banda, dividida por eras) no linkeaban a las entrevistas
(`/entrevistas/*`) de esa misma época, a pesar de que ambos datasets ya
existen en el proyecto.

---

## 2. La solución: matching automático por año, sin curación manual

**Idea central:** si los capítulos de historia tienen un rango de años
(`yearStart`/`yearEnd`) y las entrevistas tienen una fecha (`date`), se puede
armar el interlinking calculando qué entrevistas caen dentro del rango de
cada capítulo — **sin tener que curar a mano** qué entrevista va con qué
era.

```tsx
// Entrevistas cuyo año cae dentro del rango del capítulo. El último capítulo
// (era actual) queda sin tope superior, para no perder entrevistas más
// recientes que la fecha de cierre declarada en historia.json.
function getRelatedInterviews(
  chapter: HistoryData["chapters"][number],
  allChapters: HistoryData["chapters"]
): Interview[] {
  const isLatestChapter =
    chapter.yearEnd === Math.max(...allChapters.map((c) => c.yearEnd));

  return (interviewsData as Interview[]).filter((interview) => {
    const year = new Date(interview.date).getFullYear();
    return (
      year >= chapter.yearStart &&
      (isLatestChapter || year <= chapter.yearEnd)
    );
  });
}
```

**Requisitos de datos para que esto funcione en el sitio destino:**
- Los capítulos de historia deben tener `yearStart`/`yearEnd` (o un campo
  equivalente de rango de años) — verificar en el JSON de historia del sitio
  destino.
- Las entrevistas deben tener un campo `date` (fecha completa o al menos
  año) — verificar en el JSON de entrevistas del sitio destino.

Si cualquiera de los dos no existe, este approach no es viable tal cual;
habría que evaluar otro criterio de match (tags manuales, por ejemplo) o
agregar esos campos a los datos primero.

### Gotcha: el último capítulo debe quedar "abierto"
Si la era actual está declarada como `yearEnd: 2025` pero aparece una
entrevista de 2026 (siguen dando entrevistas después de esa fecha), con un
filtro estricto esa entrevista queda huérfana, sin capítulo. Por eso el
capítulo con el `yearEnd` más alto de todos se trata como sin tope superior
(`isLatestChapter`) — cualquier entrevista posterior sigue cayendo ahí.

### No forzar contenido donde no hay match real
En Ghost, los capítulos de los primeros años (2010-2017) no tienen ninguna
entrevista real en ese rango — la base de entrevistas del sitio empieza
recién en 2018. **Está bien que esos capítulos no muestren la sección** en
absoluto (gate por `relatedInterviews.length > 0`). No inventar ni forzar
links débiles solo para rellenar.

---

## 3. El render (adaptar a los componentes/imports del sitio destino)

Se agrega **después** del contenido del capítulo (`HistoryChapterComponent`
o equivalente) y **antes** de cualquier navegación sticky de capítulos, un
grid de cards linkeando a cada entrevista relacionada:

```tsx
{relatedInterviews.length > 0 && (
  <Box sx={{ mt: 6 }}>
    <Typography component="h2" variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
      {locale === "es" ? "Entrevistas de esta era" : "Interviews from this era"}
    </Typography>
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
        gap: 2,
      }}
    >
      {relatedInterviews.map((interview) => (
        <Card key={interview.id} variant="outlined">
          <CardActionArea
            component={Link}
            href={`/entrevistas/${generateInterviewSlug(interview.id)}`}
            sx={{ p: 2, height: "100%" }}
          >
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
              {getInterviewTitle(interview, locale)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {interview.media.name} · {new Date(interview.date).getFullYear()}
            </Typography>
          </CardActionArea>
        </Card>
      ))}
    </Box>
  </Box>
)}
```

`generateInterviewSlug` y `getInterviewTitle` son helpers que ya existían en
`@/types/interview.ts` en Ghost (generación de slug desde el `id`, y
obtención bilingüe del título). Si el sitio destino no tiene equivalentes,
adaptar al patrón real de slugs/rutas de sus entrevistas — el punto
importante es usar el `id`/slug **real** de la entrevista, no reconstruirlo
a mano (ver `BRIEF-ALBUM-SONGS-INTERLINKING.md` para el mismo error ya
encontrado en otro lugar del sitio).

---

## 4. Pasos para el agente (portado)

1. Confirmar que el sitio destino tiene ambos datasets con los campos
   necesarios: capítulos de historia con rango de años, entrevistas con
   fecha. Si no, evaluar alternativa antes de continuar.
2. Ubicar la página de detalle de capítulo de historia
   (`historia/[capitulo]/page.tsx` o equivalente).
3. Copiar/adaptar la función `getRelatedInterviews` (sección 2) con los
   nombres de campos reales del sitio destino.
4. Calcular `relatedInterviews` en el componente de página y pasarlo al
   render (sección 3), ubicado después del contenido del capítulo.
5. Verificar manualmente (o con un script Node rápido) cuántas entrevistas
   caen en cada capítulo, para confirmar que el matching tiene sentido y que
   no queden todas concentradas en un solo capítulo de forma rara.
6. Validar: `npx tsc --noEmit` limpio; revisar visualmente un capítulo
   antiguo (sin entrevistas — no debe mostrar la sección) y uno reciente
   (con entrevistas — debe mostrar el grid con links funcionando).

---

## 5. Errores para no repetir

- **No forzar la sección "vacía" o con texto genérico** en capítulos sin
  entrevistas reales en su rango — simplemente no renderizar nada ahí.
- **No dejar el último capítulo con tope superior estricto** — pierde
  contenido reciente que todavía no se reflejó en el `yearEnd` declarado.
- **No reconstruir el slug/URL de la entrevista a mano** — usar el
  helper/slug real del sitio, mismo motivo que en
  `BRIEF-ALBUM-SONGS-INTERLINKING.md`.
