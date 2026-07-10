Brief técnico SEO para Claude Code — megadeth.com.ar

Contexto: fan site de Megadeth en Next.js (SSR, apex sin www). GSC 9/4–8/7/2026: 5.850 clics, 678K impresiones, CTR 0,9 %, posición media 7,7. CWV excelente. Tráfico actual dominado por la gira Argentina 2026 (transitorio). Informe completo en INFORME-SEO-megadeth.md.

Instrucción general: verificá cada diagnóstico en el código antes de implementar (el análisis se hizo desde navegador + GSC, sin acceso al repo). Si algo no aplica, anotalo y seguí.

Nota: este sitio comparte varios problemas estructurales con babymetal.com.ar (ver su brief). Si ya implementaste algo allá, reutilizá el patrón.


TAREA 1 — Optimizar /miembros y fichas de músicos (QUICK WIN, máximo retorno)

Datos: /miembros = 107.372 impresiones (16 % del sitio), CTR 0,2 %, posición 7,0. Queries: "megadeth members" (17.961 imp), "members of megadeth" (9.777), "miembros de megadeth" (8.696), "membros do megadeth" (3.273), "megadeth üyeleri" (2.391), "mitglieder von megadeth" (2.165, 0 clics), "megadeth band members" (1.649), "megadeth lineup" (813), "megadeth current lineup" (809), "megadeth original members" (700), "megadeth guitarist" (2.837), "megadeth vocalist" (610).

Página actual: title Miembros | Megadeth, description "Conoce a todos los músicos que han formado parte de Megadeth a lo largo de su historia", H1 "Miembros", ~4.100 caracteres, 27 links a fichas.

Cambios:


Title propuesto: Miembros de Megadeth 2026: formación actual y todos los ex integrantes (cuando exista /en: Megadeth Members: Current Lineup 2026 & All Former Members).
Description 150-160 chars con nombres (Dave Mustaine, y la formación actual) + gancho ("los 27 músicos que pasaron por la banda").
Contenido: bloque "Formación actual" arriba con año de ingreso e instrumento; sección "Ex miembros" agrupada por instrumento; respuesta directa a "who is the guitarist/vocalist/drummer". Interlink fuerte con /formaciones (ya existe y es oro para "lineup") y con cada ficha.
Schema MusicGroup: verificar member/alumni (Person con startDate/endDate).


Fichas de músicos (/miembros/[slug]): "gar samuelson" 7.614 imp/0,1 % · "chuck behler" 2.061/0,4 % · "teemu mäntysaari" 2.090/0,2 % · "james macdonough" 1.738/0,7 %. En cambio greg-handevidt: pos 2,6, CTR 4,5 % — el formato funciona cuando el snippet responde.


Title patrón: {Nombre}: {instrumento} de Megadeth ({años}) — biografía, discos y qué fue de él.
Description por ficha: quién es, período, álbumes en los que tocó, dato distintivo (p. ej. para Samuelson: fallecimiento 1999).
Schema Person por ficha con memberOf.


TAREA 2 — 301s para los 154 × 404 (higiene urgente)

Datos GSC: 154 URLs 404, primera detección 1/11/25, sin resolver. Patrones observados: /noticias/{slug}-{timestamp} (p. ej. /noticias/angra-reunites-1777891298286, /noticias/anthrax-teases-new-song-1772446699036) y /en/noticias/{slug}-{timestamp} (versión EN eliminada). También 2 errores de redirección, 2 soft 404, 10 "página con redirección" con validación en Error.

Cambios:


Identificar el mapeo viejo→nuevo: si las noticias siguen existiendo con otro slug, 301 uno a uno (middleware o redirects() en next.config); si el contenido ya no existe, 301 al índice /noticias o dejar 410.
Regla genérica sugerida: /noticias/:slug-:timestamp(\\d{13}) → /noticias/:slug si existe, sino /noticias.
/en/* → 301 a la ruta ES equivalente (hasta que exista /en de nuevo — ver Tarea 3; si se restaura EN, estos 301 cambian a la nueva versión EN).
Investigar los 2 soft 404 y los redirect errors (posibles cadenas o loops).
Tras el deploy: en GSC, "Validar corrección" en los informes de 404 y redirecciones.


TAREA 3 — Restaurar versión EN con rutas /en/ + hreflang

Datos: EE.UU. 162.662 imp (más que Argentina) con CTR 0,5 %; +Canadá +UK ≈ 206K imp. Los 404 de /en/noticias/... confirman que existió una versión EN y fue eliminada. Hoy no hay ningún hreflang en el sitio.

Cambios: misma arquitectura que se definió para babymetal.com.ar pero con la lógica invertida:


Raíz = español (es lo que Google tiene indexado y el mercado #1 actual es AR).
/en/ = inglés, hreflang recíproco por página, x-default → evaluar (candidato: /en/ por volumen global, pero medir impacto en AR; alternativa segura: x-default → raíz ES).
Verificar si quedan diccionarios/contenido EN de la versión eliminada en el repo (bajaría muchísimo el costo).
Sitemap con ambas versiones.
Prioridad de traducción si se hace incremental: /miembros y fichas → /discography → /songs/[slug] del último álbum → /historia.


Factibilidad a evaluar: por qué se eliminó /en (¿problemas de mantenimiento? ¿contenido a medio traducir?). Si fue por duplicación con dynamic serving, la solución con rutas separadas no tiene ese problema.

TAREA 4 — Titles/descriptions de canciones clásicas

Datos: las páginas /songs/[slug] de clásicos rankean top 10 pero no convierten: "tornado of souls" 6.697 imp/0,2 % (además "tornado of souls meaning" 607 imp/1,8 % pos 3,9 — la intención "meaning" YA nos elige), "skin of my teeth" 13.515 imp de página/0,3 %, "mechanix" 13.236/0,4 %, "a tout le monde" 3.403/0,1 %, "in my darkest hour" 2.055/0 %. Contraste: canciones nuevas convierten 6-10 % (nobodys-hero, bloodlust).

Cambios:


Title patrón para clásicos: {Song} de Megadeth: significado, historia y créditos ({álbum}, {año}) — apunta a la intención informativa donde el sitio puede ganar (no compite contra letras ni streaming).
Description: 1 dato curioso + álbum/año + invitación ("la historia detrás de...").
Primer párrafo de cada página debe responder "¿de qué trata?" directamente (featured-snippet friendly).
Interlinking contextual: cada song → álbum en /discography, músicos que la grabaron (fichas), y versiones en vivo (/bootlegs si aplica).


TAREA 5 — Watch pages para videos

Datos GSC: 69 de 76 videos sin indexar — "el vídeo no está en una página de visualización". Mismo problema y misma solución que babymetal.com.ar: ruta /videos/[slug] con el video above-the-fold, metadata propia y schema VideoObject; la galería pasa a linkear las watch pages; sumar al sitemap.

TAREA 6 — Plan post-gira (preparar ahora, ejecutar cuando termine el ciclo)

Datos: la home concentra 36 % de los clics con intención "megadeth argentina 2026". Ese tráfico desaparece después del show. Además "megadeth tour" (2.007 imp) rankea pos 14,6 y "megadeth" genérico (20.295 imp) pos 11,4.

Cambios:


Crear/consolidar una página /tour permanente (historial de giras + próximas fechas) para capturar "megadeth tour" genérico todo el año.
Definir el title alternativo de la home para después de la gira (foco: "Megadeth en español: noticias, discografía...").
La sección de la gira AR se archiva como página propia (setlist, crónica, fotos) — las queries "setlist megadeth argentina" siguen activas meses después del show.


TAREA 7 — Higiene GSC y schema (rápida)


Manual (para el dueño, no código): en GSC → Sitemaps, eliminar el sitemap https://www.megadeth.com.ar/sitemap.xml (duplicado legacy) y la entrada errónea discography/reviews/megadeth-final-album-review-2026 (es un artículo, no un sitemap).
Schema DiscussionForumPosting: agregar el campo url faltante (3 elementos con warning).
Crawled-not-indexed incluye .woff2 y /_next/image?...: opcionalmente X-Robots-Tag: noindex en respuestas de /_next/image vía headers en next.config. Prioridad baja, no bloquear assets necesarios para render.
Las 2 "duplicadas sin canonical": identificarlas y fijar canonical.


Fuera de código


Backlinks: 13 externos. Para un fansite con este contenido es facilísimo mejorar: comunidades (r/Megadeth), agregadores de noticias metal, intercambio con fanzines/webs de metal en español, notas de prensa por la cobertura de la gira AR.
Discover está habilitado y en 0: los Article schema ya existen; con imágenes grandes (1200px+) y max-image-preview:large el contenido de noticias puede entrar a Discover. Verificar ese meta.


Orden sugerido


Tarea 1 (horas, máximo retorno inmediato)
Tarea 2 (horas)
Tarea 7 (una hora)
Tarea 4 (1-2 días, se puede automatizar por template)
Tarea 6 (preparar ya, activar post-gira)
Tarea 5 (1-2 días)
Tarea 3 (el proyecto grande, días)


Métricas de éxito (GSC, 4-6 semanas post-deploy)


/miembros: CTR 0,2 % → ≥1,5 % (a igual posición ≈ +1.400 clics/trimestre).
Fichas de músicos: gar-samuelson de 0,1 % → ≥2 %.
404: de 154 → <10; validación de corrección completada en GSC.
Canciones clásicas: tornado-of-souls de 0,3 % → ≥1,5 %.
Videos indexados: 7 → 50+.
Post /en: CTR EE.UU. de 0,5 % → ≥1 %.