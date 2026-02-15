# 📰 Sistema de Noticias - Migración a Supabase

## 🎯 Fase 1: Migración de datos (ACTUAL)

Esta fase migra las noticias del archivo `news.json` a Supabase para poder gestionarlas dinámicamente.

---

## 📋 Pasos de configuración

### 1. Configurar Supabase

1. Ve a tu proyecto en [Supabase](https://app.supabase.com)
2. En el panel lateral, ve a **SQL Editor**
3. Copia y pega el contenido del archivo `scripts/supabase-schema.sql`
4. Ejecuta el script para crear las tablas

### 2. Obtener las credenciales

1. Ve a **Project Settings** > **API**
2. Copia los siguientes valores:
   - **Project URL** → `SUPABASE_URL`
   - **anon/public key** → `SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_KEY` (⚠️ mantener en secreto)

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
# Supabase
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-anon-key-aqui
SUPABASE_SERVICE_KEY=tu-service-role-key-aqui
```

> ⚠️ **IMPORTANTE**: NUNCA subas el archivo `.env.local` a Git. Ya está en el `.gitignore`.

### 4. Ejecutar la migración

```bash
npm run migrate:news
```

Este script:
- Lee todas las noticias de `news.json`
- Las inserta en Supabase
- Muestra un resumen de la migración
- Verifica que todo esté correcto

### 5. Verificar en Supabase

1. Ve a **Table Editor** en Supabase
2. Abre la tabla `news_articles`
3. Deberías ver todas tus noticias migradas

---

## 🧪 Probar la integración

```bash
npm run dev
```

Visita:
- `/noticias` - Listado de noticias (ahora desde Supabase)
- `/noticias/[id]` - Detalle de noticia

---

## 📁 Archivos creados/modificados

### Nuevos archivos:
- `scripts/supabase-schema.sql` - Schema de base de datos
- `scripts/migrate-news.js` - Script de migración
- `src/lib/supabase.ts` - Cliente y funciones helper
- `src/types/supabase.ts` - Tipos TypeScript generados
- `.env.example` - Ejemplo de variables de entorno
- `SUPABASE_MIGRATION.md` - Este archivo

### Archivos modificados:
- `src/types/news.ts` - Agregados tipos y transformers
- `src/app/noticias/page.tsx` - Consume desde Supabase
- `src/app/noticias/[id]/page.tsx` - Consume desde Supabase
- `package.json` - Agregado script de migración

---

## 🔄 Próximas fases

### Fase 2: API para agregar noticias manualmente (PRÓXIMA)
- Endpoint POST `/api/news` para crear noticias
- Validación de datos
- Manejo de imágenes

### Fase 3: Automatización con IA
- Cron job para buscar noticias 2x semana
- Integración con Google Gemini
- Scraping de fuentes
- Generación automática de traducciones

---

## ❓ Troubleshooting

### Error: "Cannot find module @supabase/supabase-js"
```bash
npm install @supabase/supabase-js
```

### Error: "Missing environment variables"
Asegurate de tener todas las variables en `.env` (o `.env.local`) y reinicia el servidor de desarrollo.

### Las noticias no aparecen
1. Verifica que las tablas existan en Supabase
2. Verifica que la migración se haya ejecutado correctamente
3. Revisa la consola del navegador para errores
4. Verifica las políticas de RLS en Supabase (deben permitir lectura pública)

### Error en la migración
Si necesitas volver a ejecutar la migración, el script usa `upsert` así que podes ejecutarlo múltiples veces sin problemas.

---

## 📞 Soporte

Si tenés problemas, revisá:
1. Logs de la consola del navegador (F12)
2. Logs de Supabase (Logs Explorer)
3. Variables de entorno configuradas correctamente
