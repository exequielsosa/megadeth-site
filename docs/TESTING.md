# 🧪 GUÍA DE PRUEBAS - SISTEMA DE SCRAPING AUTOMATIZADO

## 📋 PREPARACIÓN

### 1. Verificar Variables de Entorno

Primero, verifica que todas las variables necesarias estén configuradas:

```bash
npm run check:config
```

**Variables requeridas:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY`
- `NEWS_API_KEY`
- `NEWS_API_URL` (debe ser `http://localhost:3000/api/news/create` para pruebas locales)
- `GEMINI_API_KEY`

Si falta alguna, copia el archivo de ejemplo:
```bash
cp .env.example .env
```

Y edita `.env` con tus valores reales.

---

## 🚀 PRUEBA LOCAL

### Paso 1: Iniciar el Servidor de Desarrollo

En una terminal PowerShell:

```powershell
npm run dev
```

Espera a que aparezca:
```
✓ Ready in 2.3s
○ Local:        http://localhost:3000
```

**⚠️ IMPORTANTE:** Deja esta terminal abierta durante toda la prueba.

---

### Paso 2: Ejecutar el Scraper

En una **SEGUNDA terminal PowerShell** (nueva ventana):

```powershell
npm run scrape:news
```

---

## 📊 QUÉ VAS A VER

### Salida Esperada del Scraper:

```
🤖 Scraper de Noticias de Megadeth - Inicio
================================================
🎯 Feeds a procesar: 4

📡 Procesando feed: https://www.blabbermouth.net/feed/
   Encontrados 20 items
   🔍 Analizando: "Dave Mustaine talks about new album..."
   ✅ Relevante para Megadeth
   🔍 Analizando: "Metallica announces tour dates..."
   ⏭️  No es relevante
   
🤖 Procesando con Gemini AI: "Dave Mustaine talks about new album..."
   ✅ Procesamiento AI completado

📤 Creando noticia: "Dave Mustaine habla sobre el nuevo álbum..."
   ✅ Noticia creada exitosamente: dave-mustaine-talks-about-new-alb-1739433600000

================================================
📊 RESUMEN FINAL
================================================
✅ Noticias encontradas relevantes: 5
✅ Noticias creadas exitosamente: 3
⏭️  Noticias duplicadas (omitidas): 2
❌ Errores: 0
```

---

## ✅ VERIFICACIÓN DE RESULTADOS

### 1. Verificar en el Sitio Web

1. Ve a http://localhost:3000/noticias
2. Deberías ver las nuevas noticias creadas
3. Los títulos deben estar en español e inglés
4. Las descripciones deben ser completas (200-400 palabras)

### 2. Verificar en Supabase

1. Ve a https://supabase.com/dashboard
2. Abre tu proyecto → Table Editor → `news_articles`
3. Verifica que aparecen las nuevas filas
4. Campos importantes:
   - `is_automated = true`
   - `source_url` debe tener la URL original del RSS
   - `image_url` debe tener imagen o fallback `/images/band.webp`
   - `youtube_video_id` si la noticia tenía video embebido

---

## 🔧 TROUBLESHOOTING

### Error: "API Key inválida"
```
❌ Error 401: API Key inválida o no proporcionada
```

**Solución:** Verifica que `NEWS_API_KEY` en `.env` coincida con el valor configurado.

---

### Error: "Gemini API Key not configured"
```
❌ Error: Gemini API Key not configured
```

**Solución:** 
1. Ve a https://makersuite.google.com/app/apikey
2. Crea una API Key
3. Agrégala a `.env` como `GEMINI_API_KEY=tu-key-aqui`

---

### Error: "Connection refused"
```
❌ Error: fetch failed - ECONNREFUSED
```

**Solución:** El servidor de desarrollo no está corriendo. Ejecuta `npm run dev` en otra terminal.

---

### No encuentra noticias relevantes
```
📊 RESUMEN: Noticias encontradas relevantes: 0
```

**Causas posibles:**
1. Los feeds RSS no tienen noticias recientes sobre Megadeth
2. Las keywords son demasiado estrictas (poco probable con 55+ keywords)
3. Gemini AI está siendo muy conservador

**Solución:** Ejecuta de nuevo en unos días o cuando haya noticias frescas de Megadeth.

---

### Todas las noticias son duplicadas
```
⏭️  Noticias duplicadas (omitidas): 5
```

**Normal:** Las noticias ya fueron scrapeadas antes (por `source_url`).

**Para probar de nuevo:** 
1. Borra las noticias de prueba en Supabase
2. Ejecuta de nuevo `npm run scrape:news`

---

## 📈 MÉTRICAS DE RENDIMIENTO

**Tiempo estimado:**
- 4 feeds RSS: ~5-10 segundos para descargar
- Filtrado keywords: instantáneo
- Gemini AI relevancia (5-10 noticias): ~10-20 segundos
- Gemini AI procesamiento (3-5 relevantes): ~15-30 segundos
- Creación API (3-5 noticias): ~2-5 segundos

**Total: 30-60 segundos por ejecución**

---

## 🎯 PRÓXIMO PASO: ACTIVAR AUTOMATIZACIÓN

Una vez que todo funciona localmente, configura GitHub Actions:

```bash
# 1. Push a GitHub
git add .
git commit -m "feat: add automated news scraping system"
git push origin develop

# 2. Configurar GitHub Secrets
Repository → Settings → Secrets and variables → Actions → New repository secret

Agregar:
- NEWS_API_URL: https://tu-dominio.com/api/news/create
- NEWS_API_KEY
- GEMINI_API_KEY
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_KEY

# 3. Activar workflow
Actions → Scrape Megadeth News → Run workflow
```

---

## 📅 CALENDARIO AUTOMÁTICO

Una vez configurado GitHub Actions:
- 🗓️ **Martes 10:00 AM UTC**: Ejecución automática
- 🗓️ **Viernes 10:00 AM UTC**: Ejecución automática
- ⚡ **Manual**: Cualquier momento desde GitHub Actions

---

¿Listo para probar? Ejecuta:
```bash
npm run check:config
```
