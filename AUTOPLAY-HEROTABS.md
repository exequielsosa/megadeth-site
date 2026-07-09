# Autoplay en HeroTabs — Briefing para babymetal-site

> Documento de referencia. Explica el autoplay que se agregó al `HeroTabs` en
> **megadeth-site** para replicarlo en **babymetal-site** (mismo componente,
> portado entre ambos proyectos).
>
> Para usarlo: abrir una sesión del agente apuntando a `G:\TRABAJO\babymetal-site`
> y pasarle el contenido de este archivo.

---

## Qué se pidió

Agregar rotación automática entre los tabs del Hero (autoplay), cada **8 segundos**,
con buenas prácticas de UX/accesibilidad: pausable y respetuoso del usuario.

## Comportamiento implementado

- Cada 8s avanza al siguiente tab; después del último vuelve al primero (loop).
- **Se pausa** con hover del mouse o foco de teclado (Tab) dentro de la sección
  del Hero — así no le cambia el contenido a alguien que está leyendo.
- **Respeta `prefers-reduced-motion`**: si el usuario tiene esa preferencia de
  accesibilidad en su SO, el autoplay no arranca nunca.
- Si el usuario **clickea un tab manualmente**, el timer se reinicia desde ahí
  (le da los 8s completos al tab elegido antes de seguir rotando solo).

## ⚠️ Adaptación necesaria para babymetal (diferencia clave)

En megadeth el Hero tiene **5 tabs** (Presentación, Noticias, Shows, Historia,
Canciones). En **babymetal son 6** (se agregó "Kami Band"). El autoplay debe
ciclar sobre **6**, no 5. Ajustar la constante `TABS_COUNT` acorde.

Además, el `HeroTabs.tsx` de babymetal **ya tiene** un estado `mounted` (fix de
parpadeo del fade-in en SSR, con su propio `useEffect`) que **no existe** en
megadeth. Hay que integrar el autoplay sin pisar ese código: agregar el nuevo
estado/efecto al lado del existente, no reemplazarlo.

---

## Cambios exactos hechos en megadeth-site (`src/components/HeroTabs.tsx`)

### 1. Import de `useEffect`
```diff
-import { useState } from "react";
+import { useState, useEffect } from "react";
```
(En babymetal `useEffect` **ya está importado** por el fix de `mounted` — no
hace falta tocar el import.)

### 2. Constantes + estado + efecto de autoplay, arriba del componente y al
   inicio del cuerpo de la función:

```tsx
const TABS_COUNT = 5; // en babymetal: 6 (Presentación, Noticias, Shows, Historia, Canciones, Kami Band)
const AUTOPLAY_INTERVAL_MS = 8000;

export default function HeroTabs() {
  const t = useTranslations("heroTabs");
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Autoplay: rota al siguiente tab cada AUTOPLAY_INTERVAL_MS. Se reinicia
  // cada vez que activeTab cambia (auto o manual), y se detiene con hover o
  // foco de teclado, o si el usuario prefiere menos movimiento en pantalla.
  useEffect(() => {
    if (isPaused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % TABS_COUNT);
    }, AUTOPLAY_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [activeTab, isPaused]);

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{ maxWidth: 1440 }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
```

**En babymetal**, el `Container` ya tiene un `sx` con lógica de `mounted`. Hay
que **agregar** los 4 handlers (`onMouseEnter/Leave/Focus/Blur`) a ese mismo
`Container` sin tocar su `sx` existente, algo así:

```tsx
<Container
  maxWidth={false}
  disableGutters
  sx={{
    maxWidth: 1440,
    ...(!mounted && {
      "& *": { animationPlayState: "paused !important" },
    }),
  }}
  onMouseEnter={() => setIsPaused(true)}
  onMouseLeave={() => setIsPaused(false)}
  onFocus={() => setIsPaused(true)}
  onBlur={() => setIsPaused(false)}
>
```

Y el estado `isPaused` + la constante `AUTOPLAY_INTERVAL_MS`/`TABS_COUNT` (con
`TABS_COUNT = 6`) + el `useEffect` de autoplay se agregan **junto al** `mounted`
existente, no en su lugar.

---

## Verificación hecha en megadeth (repetir en babymetal)

```bash
npx tsc --noEmit
npx eslint src/components/HeroTabs.tsx
```
Ambos limpios. Luego `npm run dev` y confirmar visualmente: los tabs rotan
solos cada 8s, se detienen al pasar el mouse o hacer foco, y un click manual
en un tab no es "peleado" por el autoplay (reinicia el conteo desde ahí).

Resultado en megadeth: **"se ve perfecto"** (validado por el usuario).
