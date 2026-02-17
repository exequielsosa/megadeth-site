# Sistema de Cache Automático para Shows

## 🎯 Problema Resuelto

El endpoint `/api/last-show` necesita hacer 2 llamadas a setlist.fm:
1. **latest**: Último show de Megadeth
2. **yearsAgoPrev**: Show de hace 20 años

Para evitar rate limits y mejorar UX, implementamos un sistema de cache con warming automático.

---

## ⚙️ Arquitectura

### 1. **Endpoint de Cron** `/api/cron/warm-shows`
- Se ejecuta **automáticamente cada 6 horas** vía Vercel Cron
- Llama a `/api/last-show?warm=1` para precalentar el cache
- Verifica que los datos se carguen correctamente

### 2. **Cache en Vercel KV**
- **latest**: Cache fresco por 24h, retenido 7 días
- **yearsAgoPrev**: Cache fresco por 24h, retenido 7 días
- Si el cron falla, se sirve cache "stale" como fallback

### 3. **Componente Cliente**
- Primera carga: usa cache (instantáneo)
- Si cache está frío: hace warm request de respaldo
- **99% del tiempo** los datos están listos gracias al cron

---

## 🚀 Configuración

### Variables de Entorno (Opcional)

```env
# Opcional: Secret para proteger el endpoint de cron
CRON_SECRET=tu_secret_aqui_aleatorio
```

Si configuras `CRON_SECRET`, el endpoint solo aceptará requests con:
```
Authorization: Bearer tu_secret_aqui_aleatorio
```

### Vercel Cron Setup

El archivo `vercel.json` ya está configurado:

```json
{
  "crons": [
    {
      "path": "/api/cron/warm-shows",
      "schedule": "0 */6 * * *"  // Cada 6 horas
    }
  ]
}
```

**Nota**: Vercel Cron está disponible en todos los planes (Free, Pro, Enterprise).

---

## 🧪 Testing

### 1. Test Local (Dev)

Llama manualmente al endpoint:

```bash
# Sin autenticación (si no hay CRON_SECRET)
curl http://localhost:3000/api/cron/warm-shows

# Con autenticación
curl -H "Authorization: Bearer tu_secret" http://localhost:3000/api/cron/warm-shows
```

Respuesta esperada:
```json
{
  "success": true,
  "timestamp": "2026-02-17T...",
  "data": {
    "hasLatest": true,
    "hasYearsAgo": true,
    "latestDate": "15-02-2026",
    "yearsAgoDate": "24-09-2006",
    "targetYear": "2006",
    "cacheKeys": { ... }
  }
}
```

### 2. Test en Producción

Una vez deployado en Vercel:

```bash
curl https://tu-dominio.vercel.app/api/cron/warm-shows
```

### 3. Verificar Cache

```bash
# Ver si el cache está caliente
curl http://localhost:3000/api/last-show

# Debería retornar yearsAgoPrev sin needsWarm flag
```

---

## 📊 Monitoreo

### Logs en Vercel

1. Ve a tu proyecto en Vercel
2. **Deployments** > Selecciona tu deployment
3. **Functions** > Busca `/api/cron/warm-shows`
4. Revisa los logs para ver las ejecuciones del cron

### Logs esperados

```
[Cron] Warming shows cache at 2026-02-17T12:00:00.000Z
[Cron] Cache warmed successfully {
  hasLatest: true,
  hasYearsAgo: true,
  targetYear: '2006',
  cacheStatus: { latestStatus: 'refreshed', yearsStatus: 'refreshed' }
}
```

---

## 🔧 Troubleshooting

### El cron no se ejecuta

**Causa**: Vercel Cron solo funciona en **producción**, no en Preview deployments.

**Solución**: 
1. Deploy a production (`main` branch)
2. O ejecuta manualmente el endpoint para testing

### Error 401 Unauthorized

**Causa**: Configuraste `CRON_SECRET` pero no pasas el header correcto.

**Solución**:
```bash
curl -H "Authorization: Bearer tu_secret" https://...
```

### Error 429 (Rate Limit)

**Causa**: Demasiadas llamadas a setlist.fm.

**Solución**: 
- El cron ya está configurado para 6 horas (4 veces/día)
- El cache stale funciona como fallback
- Considera aumentar el intervalo si es necesario

---

## 🎛️ Configuraciones Alternativas

### Cambiar frecuencia del cron

Edita `vercel.json`:

```json
"schedule": "0 */12 * * *"  // Cada 12 horas
"schedule": "0 0 * * *"     // Una vez al día (medianoche)
"schedule": "0 6,18 * * *"  // Dos veces al día (6am y 6pm)
```

Sintaxis cron: `minute hour day month weekday`

### Desactivar autenticación

Remueve `CRON_SECRET` de las variables de entorno.

---

## 📈 Beneficios

✅ **UX instantánea**: Cache siempre caliente  
✅ **Sin rate limits**: Solo 4 requests/día a setlist.fm  
✅ **Resiliente**: Fallback a cache stale si falla  
✅ **SEO friendly**: Data lista en primer request  
✅ **Observable**: Logs centralizados en Vercel  

---

## 🔄 Flujo Completo

```
1. Vercel Cron ejecuta cada 6h
   ↓
2. /api/cron/warm-shows
   ↓
3. Llama a /api/last-show?warm=1
   ↓
4. Cache en KV se actualiza
   ↓
5. Usuario visita la página
   ↓
6. LastShowsCards hace fetch
   ↓
7. Cache está CALIENTE ✨
   ↓
8. Muestra ambas cards instantáneamente
```

---

## 📝 Notas

- El primer deploy necesitará 1 ejecución manual del cron
- Después de eso, todo es automático
- El cache sobrevive 7 días sin refreshes
- La primera visita después de un deploy frío hará warm automático
