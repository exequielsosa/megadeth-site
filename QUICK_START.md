# ⚡ Guía Rápida - Migración Fase 1

## 🚀 Pasos para ejecutar la migración

### 1. Instalar dependencias necesarias
```bash
npm install
```

### 2. Configurar Supabase

#### En Supabase Dashboard:
1. Ve a https://app.supabase.com
2. Selecciona tu proyecto
3. Ve a **SQL Editor** (icono de base de datos en el sidebar)
4. Click en **New Query**
5. Copia TODO el contenido de `scripts/supabase-schema.sql`
6. Pega en el editor y click en **Run**
7. Deberías ver: "Success. No rows returned"

#### Obtener las credenciales:
1. Ve a **Project Settings** (engranaje abajo del sidebar)
2. Click en **API**
3. Copia y guarda:
   - **Project URL**
   - **anon public** key (en la sección "Project API keys")
   - **service_role** key (⚠️ Show para verla, es secreta)

### 3. Crear archivo .env.local

En la raíz del proyecto, crea `.env.local` con:

```bash
SUPABASE_URL=https://xxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Reemplazá con tus valores reales.

### 4. Verificar configuración
```bash
npm run verify:supabase
```

Deberías ver:
```
✅ SUPABASE_URL: https://...
✅ SUPABASE_ANON_KEY: eyJh...
✅ SUPABASE_SERVICE_KEY: eyJh...
✅ Conexión exitosa a Supabase
✅ Tabla news_articles existe
✅ Permisos de escritura OK
```

### 5. Ejecutar migración
```bash
npm run migrate:news
```

Verás algo como:
```
📰 Encontradas XX noticias en news.json
✅ Migrado: megadeth-play-ride-the-lightning-2026
✅ Migrado: megadeth-billboard-200-number-one
...
📊 Resumen de migración:
✅ Exitosas: XX
❌ Errores: 0
```

### 6. Verificar en Supabase Dashboard

1. Ve a **Table Editor**
2. Selecciona tabla `news_articles`
3. Deberías ver todas tus noticias

### 7. Probar el sitio
```bash
npm run dev
```

Visita http://localhost:3000/noticias

---

## 🎉 ¡Listo! Fase 1 completada

Ahora tus noticias están en Supabase y el sitio las consume desde ahí.

### Próximos pasos:
- **Fase 2**: API REST para agregar noticias manualmente
- **Fase 3**: Automatización con IA y scraping

---

## ❌ Si algo sale mal

### npm run verify:supabase falla
- Revisá que el archivo `.env` esté en la raíz
- Verificá que las credenciales sean correctas
- Asegurate de haber ejecutado el SQL schema

### npm run migrate:news da error
- Ejecutá primero `npm run verify:supabase`
- Revisá que news.json exista en `src/constants/`

### Las noticias no aparecen en el sitio
- Verificá la consola del navegador (F12)
- Revisá que Supabase tenga las políticas RLS correctas
- El script SQL ya configura las políticas, pero podés verificar en Supabase: Table Editor > news_articles > RLS debe estar ON

---

## 📞 ¿Dudas?

Revisá el archivo completo: `SUPABASE_MIGRATION.md`
