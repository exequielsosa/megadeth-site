# Seguimiento SEO mensual — megadeth.com.ar

Registro de revisiones mensuales de Google Search Console. Se actualiza cada vez
que se analizan capturas nuevas, para poder comparar mes contra mes.

**Recomendación de proceso:**
- Usar siempre el mismo rango de fechas en Search Console (28 días) para que los
  meses sean comparables entre sí. El reporte "3 meses" mezcla varios períodos y
  dificulta ver la tendencia mes a mes.
- Reporte a usar: **"Resultados de la búsqueda"** (no "Información/Insights" —
  ese no muestra posición ni impresiones). Activar los 4 checkboxes (Clics,
  Impresiones, CTR, Posición) y el botón **"Comparar"** contra el período anterior.

---

## Julio 2026 — primera revisión (baseline)

### Datos de contexto
- Vista de 3 meses (≈8/4/26 a 7/7/26): **5,87 mil clics** · **678 mil impresiones**
  · **0,9% CTR** · **7,7 posición media**.
- El gráfico muestra un **pico enorme de clics e impresiones entre el 28/4 y el
  2/5/2026**, coincidente con el show de Megadeth en Buenos Aires (Tecnópolis,
  30/4/2026). Después del pico, clics e impresiones vuelven a un nivel base
  estable similar al previo. El CTR cae durante el pico (esperable: muchas
  impresiones nuevas y menos relevantes bajan el CTR promedio).

### Hallazgo confirmado — página de Discografía
`src/app/discography/page.tsx` tiene el title/description desactualizados:
dicen **"16 Álbumes de Estudio... (1985-2022)"**, pero `discography.json` ya
tiene **17 álbumes** (incluye el álbum final de 2026). La metadata nunca se
actualizó cuando se sumó el álbum final. Probable causa de la caída de -19%
(-20 clics) en esa página — contenido "desactualizado" a ojos de Google justo
en el tema más candente de la banda.

**Pendiente de decidir:** actualizar el title/description a 17 álbumes y
rango 1985-2026.

### Hallazgo — caída del Home (-44%, -48 clics en el reporte de "Tu contenido")
Explicada por el pico post-show de Buenos Aires (ver gráfico arriba), no por un
problema real. La query que más cayó, *"megadeth en argentina 2026 entradas"*
(-69%, -45 clics), es consistente: el show ya pasó, la demanda de entradas
desapareció naturalmente.

**Detalle no resuelto:** el title del home (`layout.tsx`) sigue enmarcado en
*"Megadeth Argentina 2026 — Gira Final y Todo en Español"*, centrado en una
fecha/show que ya ocurrió. El resto de la gira (Europa, USA, Oceanía, ver
`tourDates.ts`) sigue activa. Evaluar si conviene reencuadrar el mensaje hacia
las fechas vigentes en vez de "Argentina 2026" puntual.

**Confirmado:** `ArgentinaConcertBanner` está comentado/inerte en `Hero.tsx` —
no hay un CTA roto de "comprá entradas" visible en el sitio. No es un bug de UI.

### Qué está funcionando (motor de crecimiento)
- **Páginas de canciones/letras**: mayor crecimiento relativo del sitio.
  Ejemplos: Nobody's Hero (+17), Five Magics (+14, 108%), Tornado of Souls (+12),
  Dread and the Fugitive Mind (+11, 110%), She-Wolf (+11), Puppet Parade
  (+10, 167%), Mechanix (+9), Family Tree (+7). Las queries que traen tráfico
  son de tipo *"[canción] meaning"* — la gente busca significado de letras.
- **Members/lineup**: query **#1 del sitio** es "megadeth members" (56 clics,
  +75%). Página `/miembros` es la de mayor crecimiento absoluto (+45, 82%).
  Miembro individual Teemu Mäntysaari +1100% (base chica, pero señal real).

### Otros datos relevantes
- **Geografía vs. enfoque del sitio**: tráfico real es 18% EE.UU., solo 6%
  Argentina (Canadá/México/Alemania empatados en 4%). Audiencia real más
  internacional/anglo de lo que el framing en español del home asume.
- **Backlinks**: solo 13 enlaces externos totales, de sitios chicos
  (idcrawl.com, rockcelebrities.net, accio.com, deaf-forever.de, erkansaka.net).
  Oportunidad de link-building (fuera del alcance del código).
- **Búsqueda de imágenes**: 61 clics — no despreciable, revisar `alt`/nombres
  de archivo de portadas e imágenes de miembros.
- **Branded vs. genérico**: 71% marca / 29% genérico — sano para un fan site.
  El crecimiento real está en contenido informativo long-tail (letras,
  members), coherente con lo de arriba.
- **Recap del show de Buenos Aires**: no existe todavía (no está en
  `shows.json`, que es el formato curado usado para shows históricos tipo
  "Obras Sanitarias 1994"). Requiere imagen + texto editorial bilingüe — no se
  arma con datos automáticos. Pendiente para cuando haya material propio
  (fotos, crónica); el setlist real puede obtenerse gratis vía setlist.fm.

### Acciones pendientes de decidir/priorizar
- [x] Actualizar metadata de `/discography` (17 álbumes, 1985-2026). ✅ Hecho 9/7/2026.
- [ ] Evaluar reencuadre del title/description del home (dejar de centrar todo
      en "Argentina 2026" ya vencido, resaltar más las fechas vigentes).
- [ ] Revisar `alt`/nombres de archivo de imágenes para SEO de imágenes.
- [ ] Cuando haya material: crear entrada de recap en `shows.json` para
      Buenos Aires 2026.
- [ ] Seguir invirtiendo en páginas de canciones (secciones de significado) y
      de miembros — es el motor de crecimiento comprobado.

---

## Julio 2026 — ejecución de `SEO-MEJORAS-BRIEF.md`

Brief técnico externo con datos GSC más granulares (por query/página). Cada
tarea se verificó contra el código antes de implementar (varias no aplicaban
tal cual estaban escritas). Detalle completo en `SEO-MEJORAS-BRIEF.md`.

### Hecho
- **Tarea 4** (canciones clásicas): title/description nuevos para las 187
  canciones anteriores a 2026 (patrón "significado e historia"), sin tocar las
  13 del álbum final que ya convertían bien. De paso, se encontró y sacó un
  `MusicRecording` JSON-LD duplicado y con bugs en `SongDetailPage.tsx` que
  competía con el que se había agregado en `songs/[songId]/page.tsx`.
- **Tarea 1** (`/miembros`): title/description de la página y de las 27 fichas
  individuales (se encontró un bug real: 11/27 fichas mostraban el nombre
  repetido en el title por `fullName === name`). Se agregó schema `Person` por
  ficha (no existía ninguno). Se agregó un párrafo de respuesta directa
  ("la formación actual está compuesta por...") y se agruparon los 23
  ex-miembros por instrumento (antes un solo grid sin orden temático).
- **Tarea 7** (higiene, parcial): se agregó el campo `url` faltante al schema
  `DiscussionForumPosting` de `CommentsSection.tsx` usando `usePathname()`.
  *Nota: ese mismo schema depende de comentarios cargados client-side, así que
  en el HTML inicial no se renderiza — mismo patrón de bug que tenía el
  FAQPage antes de arreglarlo. No se resolvió de fondo (requiere traer
  comentarios server-side), solo el fix puntual del `url`.*

### Pendiente — Tarea 2 (redirects 404), guardada para después
El brief pedía 2 reglas: `/en/*` → ES (esta sí es una regla estática simple,
sin riesgo) y `/noticias/:slug-:timestamp` → `/noticias` si el artículo no
existe. **La segunda no se puede hacer como regla de `next.config.ts`**: ese
mismo patrón de URL (`slug-timestamp`) lo usan TODAS las noticias, activas y
borradas — una regex ciega redirigiría también las noticias que sí funcionan.
La solución correcta es puntual: en `noticias/[id]/page.tsx`, cuando
`getNewsById` no encuentra el artículo, hoy llama a `notFound()` (correcto,
devuelve 404 real) — cambiarlo por `permanentRedirect("/noticias")` en su
lugar. Es un cambio de una línea, pero se decidió no tocarlo todavía por si
el criterio cambia más adelante (ej. si se consigue la lista real de las 154
URLs desde GSC y conviene armar un mapeo 1:1 en vez del redirect genérico a
`/noticias`).

### Pendiente — Tarea 6 (decisión, no código)
Definir el title/description alternativo del home para después de que termine
el ciclo de shows actual (reencuadre "Argentina 2026" → mensaje vigente). Ya
está anotado más arriba en el bloque de julio, sigue sin resolverse.

### Sin empezar
- **Tarea 5** (watch pages para videos): confirmado que no existen páginas
  individuales `/videos/[slug]` — los 76 videos viven en una sola `/videos`
  con la grilla completa, por eso 69/76 no indexan. Requiere ruta nueva +
  schema `VideoObject` + actualizar sitemap. Es el trabajo más grande después
  de la migración de locale — no arrancado todavía.
- **Tarea 3** (restaurar `/en/` con hreflang): descartada explícitamente por
  el usuario (es la migración a routing por locale). Sigue fuera del plan
  salvo que se reconsidere.

---

<!-- Próxima revisión: agregar acá un nuevo bloque "## [Mes] 2026 — revisión N"
     con el mismo formato, y comparar contra el bloque anterior. -->
