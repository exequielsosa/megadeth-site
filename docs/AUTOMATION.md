# Automatización de Noticias con IA - Fase 3

## 🤖 Descripción

Sistema automático que busca, procesa y publica noticias sobre Megadeth 2 veces por semana usando:
- **RSS Feeds** de sitios de metal (Blabbermouth, Loudwire, Metal Injection, MetalSucks)
- **Google Gemini AI** para filtrado, traducción y optimización
- **GitHub Actions** para ejecución programada

## 📅 Programación

El scraper se ejecuta automáticamente:
- **Martes a las 10:00 AM UTC** (7:00 AM Argentina)
- **Viernes a las 10:00 AM UTC** (7:00 AM Argentina)

También puede ejecutarse manualmente desde GitHub Actions.

## 🔧 Configuración Inicial

### 1. Configurar Secrets en GitHub

Ve a tu repositorio en GitHub → Settings → Secrets and variables → Actions → New repository secret

Agrega estos secrets:

| Secret Name | Valor | Descripción |
|-------------|-------|-------------|
| `NEWS_API_URL` | `https://megadeth.com.ar/api/news/create` | URL de tu API en producción |
| `NEWS_API_KEY` | `tu_clave_api` | La misma que generaste en Fase 2 |
| `GEMINI_API_KEY` | `AIzaSyCQH2MtgBGNzDqh7je3mvvfj9AFtu88ybE` | Tu API key de Google Gemini |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://anaxeiizlbfuycwnjwkw.supabase.co` | URL de tu proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `tu_anon_key` | Anon key de Supabase |
| `SUPABASE_SERVICE_KEY` | `tu_service_key` | Service key de Supabase |

### 2. Activar GitHub Actions

Las GitHub Actions están habilitadas por defecto, pero si no funcionan:

1. Ve a tu repositorio → Actions
2. Si hay un mensaje "Workflows aren't being run", click "I understand, enable them"
3. Verifica que veas el workflow "Scrape Megadeth News"

## 🚀 Uso

### Ejecución Automática

No necesitas hacer nada. El sistema se ejecutará automáticamente los Martes y Viernes.

### Ejecución Manual

**Opción 1: Desde GitHub (recomendado)**
1. Ve a tu repositorio → Actions
2. Click en "Scrape Megadeth News"
3. Click en "Run workflow" → "Run workflow"
4. Espera a que termine (1-5 minutos)
5. Revisa los logs

**Opción 2: Localmente (para desarrollo)**
```bash
# Asegúrate de tener todas las variables en .env
npm run scrape:news
```

## 📊 Monitoreo

### Ver Logs de Ejecuciones

1. GitHub → Actions → "Scrape Megadeth News"
2. Click en cualquier ejecución para ver los logs detallados
3. Los logs se guardan como artifacts por 30 días

### Logs incluyen:
- ✅ Feeds procesados
- 🔍 Noticias analizadas
- ✅ Noticias relevantes encontradas
- 🤖 Procesamiento con Gemini AI
- ✅ Noticias creadas exitosamente
- ⏭️ Noticias omitidas (duplicadas)

## 🛠️ Flujo del Sistema

```
┌─────────────────────┐
│   RSS Feeds         │
│ - Blabbermouth      │
│ - Loudwire          │
│ - Metal Injection   ├──┐
│ - MetalSucks        │  │
└─────────────────────┘  │
                         │
                         ▼
                    ┌────────────┐
                    │  Filtrado  │
                    │  Keywords  │
                    │  Megadeth  │
                    └─────┬──────┘
                          │
                          ▼
                    ┌────────────┐
                    │ Gemini AI  │
                    │ Validación │
                    │ Relevancia │
                    └─────┬──────┘
                          │
                          ▼
                    ┌────────────┐
                    │ Gemini AI  │
                    │ Traducción │
                    │ ES ↔ EN    │
                    └─────┬──────┘
                          │
                          ▼
                    ┌────────────┐
                    │  API POST  │
                    │ /news/     │
                    │  create    │
                    └─────┬──────┘
                          │
                          ▼
                    ┌────────────┐
                    │  Supabase  │
                    │  Database  │
                    └────────────┘
```

## 🎯 Características

### Filtrado Inteligente
- ✅ Palabras clave: "megadeth", "dave mustaine", "kiko loureiro", etc.
- ✅ Validación con IA para evitar menciones irrelevantes
- ✅ Solo noticias de interés para fans

### Procesamiento con IA
- 📝 Títulos optimizados (EN y ES)
- 📝 Descripciones completas (200-400 palabras)
- 📝 Resúmenes cortos (50-80 palabras)
- 🌐 Traducción automática al español
- 🎯 Preserva nombres propios y datos exactos

### Control de Calidad
- ✅ Evita duplicados (verificación por ID)
- ✅ Marca noticias como automatizadas (`is_automated: true`)
- ✅ Incluye URL fuente original
- ✅ Fallback en caso de error de IA

## 🔍 Troubleshooting

### El workflow no se ejecuta

**Problema:** GitHub Actions deshabilitadas
**Solución:** Settings → Actions → General → Allow all actions

**Problema:** Secrets no configurados
**Solución:** Verifica que todos los secrets estén configurados correctamente

### No encuentra noticias relevantes

**Problema:** Feeds sin contenido nuevo sobre Megadeth
**Solución:** Es normal, no siempre hay noticias nuevas cada ejecución

### Error de Gemini API

**Problema:** Cuota excedida o API key inválida
**Solución:** 
- Verifica tu API key en https://aistudio.google.com/app/apikey
- Revisa el uso en Google Cloud Console
- El sistema tiene fallback: usa contenido original

### Noticias duplicadas

**Problema:** El ID genera colisiones
**Solución:** El sistema ya maneja esto, solo reporta error pero no falla

## 📈 Optimizaciones Futuras

- [ ] Agregar más fuentes RSS
- [ ] Implementar caché de noticias ya procesadas
- [ ] Mejorar extracción de imágenes
- [ ] Agregar notificaciones (Discord/Slack) cuando se crean noticias
- [ ] Dashboard de estadísticas de scraping
- [ ] Soporte para videos de YouTube embebidos

## 🔐 Seguridad

- ✅ API Keys nunca en código
- ✅ Secrets manejados por GitHub
- ✅ Validación de entrada en la API
- ✅ Rate limiting automático (pausas entre requests)
- ✅ Logs no exponen keys sensibles

## 📝 Logs de Ejemplo

```
╔═══════════════════════════════════════════════╗
║  Megadeth News Scraper - Automatización IA   ║
╚═══════════════════════════════════════════════╝

📅 Fecha: 2026-02-14T10:00:00.000Z
🎯 Feeds a procesar: 4

📡 Procesando feed: https://www.blabbermouth.net/feed/
   Encontrados 20 items
   🔍 Analizando: "MEGADETH's DAVE MUSTAINE: 'I Don't Know How Much Longer..."
   ✅ Relevante para Megadeth
   🔍 Analizando: "METALLICA Announces 2026 Tour Dates"
   ⏭️  No es relevante

🤖 Procesando con Gemini AI: "MEGADETH's DAVE MUSTAINE..."
   📝 Título EN: Dave Mustaine Announces Farewell Tour
   📝 Título ES: Dave Mustaine Anuncia Gira de Despedida
   ✅ Noticia creada exitosamente

╔═══════════════════════════════════════════════╗
║              RESUMEN DE EJECUCIÓN             ║
╚═══════════════════════════════════════════════╝
📊 Noticias relevantes encontradas: 3
✅ Noticias creadas exitosamente:   3
⏭️  Noticias omitidas/duplicadas:   0

🎉 Proceso completado a las 2/14/2026, 10:05:00 AM
```

## 🎓 Testing Local

Para probar el scraper localmente antes de hacer push:

```bash
# 1. Asegúrate de tener todas las variables en .env
cat .env

# 2. Ejecuta el scraper
npm run scrape:news

# 3. Verifica las noticias creadas en:
# http://localhost:3000/noticias
```

## 📞 Soporte

Si el sistema falla:
1. Revisa los logs en GitHub Actions
2. Verifica que los secrets estén configurados
3. Prueba ejecutar manualmente el workflow
4. Si persiste, revisa los logs de Supabase

---

**¡Sistema de automatización completo!** 🎸🤘
