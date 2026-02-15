/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export const runtime = "edge";

const BASE_URL = "https://api.setlist.fm/rest/1.0";

/** =======================
 * Helpers de fecha
 * ======================= */
function ddmmyyyyToISO(ddmmyyyy: string): string | null {
  const m = /^(\d{2})-(\d{2})-(\d{4})$/.exec(ddmmyyyy);
  if (!m) return null;
  const [, dd, mm, yyyy] = m;
  return `${yyyy}-${mm}-${dd}`;
}

function isoToDate(iso: string): Date {
  // validación dura
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return new Date("invalid");
  return new Date(`${iso}T00:00:00.000Z`);
}

function addYearsISO(iso: string, deltaYears: number): string {
  const d = isoToDate(iso);
  if (Number.isNaN(d.getTime())) {
    throw new Error(`Invalid ISO date for addYearsISO(): "${iso}"`);
  }
  const y = d.getUTCFullYear() + deltaYears;
  const m = d.getUTCMonth();
  const day = d.getUTCDate();
  const shifted = new Date(Date.UTC(y, m, day));
  if (Number.isNaN(shifted.getTime())) {
    throw new Error(`Invalid shifted date in addYearsISO() from "${iso}"`);
  }
  return shifted.toISOString().slice(0, 10);
}

/** =======================
 * Normalización
 * ======================= */
type NormalizedShow = {
  id: string;
  eventDate: string;
  eventDateISO: string;
  lastUpdated?: string | null;
  tour?: string | null;
  venue: { id: string; name: string; url?: string | null };
  city: {
    name: string;
    state?: string | null;
    countryCode?: string | null;
    countryName?: string | null;
    coords?: { lat: number; long: number } | null;
  };
  songs: Array<{ name: string; tape: boolean; info?: string | null; cover?: any | null }>;
  url?: string | null;
  attribution?: { text: string; url?: string | null };
};

function normalizeSetlistItem(item: any): NormalizedShow | null {
  const iso = ddmmyyyyToISO(item?.eventDate);
  if (!item?.id || !iso) return null;

  const set0 = item?.sets?.set?.[0];
  const songsRaw: any[] = Array.isArray(set0?.song) ? set0.song : [];
  const songs = songsRaw
    .map((s) => ({
      name: s?.name ?? "",
      tape: Boolean(s?.tape),
      info: s?.info ?? null,
      cover: s?.cover ?? null,
    }))
    .filter((s) => s.name);

  const venue = item?.venue ?? {};
  const city = venue?.city ?? {};
  const country = city?.country ?? {};

  return {
    id: item.id,
    eventDate: item.eventDate,
    eventDateISO: iso,
    lastUpdated: item.lastUpdated ?? null,
    tour: item?.tour?.name ?? null,
    venue: { id: venue?.id ?? "", name: venue?.name ?? "", url: venue?.url ?? null },
    city: {
      name: city?.name ?? "",
      state: city?.state ?? null,
      countryCode: country?.code ?? null,
      countryName: country?.name ?? null,
      coords: city?.coords ? { lat: Number(city.coords.lat), long: Number(city.coords.long) } : null,
    },
    songs,
    url: item?.url ?? null,
    attribution: item?.url ? { text: "Source: setlist.fm", url: item.url } : undefined,
  };
}

function pickClosestInSameMonth(shows: NormalizedShow[], targetISO: string): NormalizedShow | null {
  const target = isoToDate(targetISO);
  if (Number.isNaN(target.getTime())) return null;

  const ty = target.getUTCFullYear();
  const tm = target.getUTCMonth();

  const inMonth = shows.filter((s) => {
    const d = isoToDate(s.eventDateISO);
    return !Number.isNaN(d.getTime()) && d.getUTCFullYear() === ty && d.getUTCMonth() === tm;
  });

  if (!inMonth.length) return null;

  const tms = target.getTime();
  return inMonth
    .slice()
    .sort((a, b) => {
      const da = Math.abs(isoToDate(a.eventDateISO).getTime() - tms);
      const db = Math.abs(isoToDate(b.eventDateISO).getTime() - tms);
      return da - db;
    })[0];
}

/**
 * Encuentra el show más cercano a una fecha objetivo
 * Estrategia de búsqueda:
 * 1. Mismo mes y año
 * 2. Mismo año (cualquier mes)
 * 3. Año anterior o posterior
 */
function pickClosestToDate(shows: NormalizedShow[], targetISO: string): NormalizedShow | null {
  if (!shows.length) return null;
  
  const target = isoToDate(targetISO);
  if (Number.isNaN(target.getTime())) return null;

  const ty = target.getUTCFullYear();
  const tm = target.getUTCMonth();
  const tms = target.getTime();

  // 1. Primero: buscar en el mismo mes y año
  const inSameMonth = shows.filter((s) => {
    const d = isoToDate(s.eventDateISO);
    return !Number.isNaN(d.getTime()) && d.getUTCFullYear() === ty && d.getUTCMonth() === tm;
  });

  if (inSameMonth.length > 0) {
    return inSameMonth
      .slice()
      .sort((a, b) => {
        const da = Math.abs(isoToDate(a.eventDateISO).getTime() - tms);
        const db = Math.abs(isoToDate(b.eventDateISO).getTime() - tms);
        return da - db;
      })[0];
  }

  // 2. Si no hay en el mismo mes, buscar en el mismo año
  const inSameYear = shows.filter((s) => {
    const d = isoToDate(s.eventDateISO);
    return !Number.isNaN(d.getTime()) && d.getUTCFullYear() === ty;
  });

  if (inSameYear.length > 0) {
    return inSameYear
      .slice()
      .sort((a, b) => {
        const da = Math.abs(isoToDate(a.eventDateISO).getTime() - tms);
        const db = Math.abs(isoToDate(b.eventDateISO).getTime() - tms);
        return da - db;
      })[0];
  }

  // 3. Si no hay en el mismo año, buscar el más cercano en general
  return shows
    .slice()
    .sort((a, b) => {
      const da = Math.abs(isoToDate(a.eventDateISO).getTime() - tms);
      const db = Math.abs(isoToDate(b.eventDateISO).getTime() - tms);
      return da - db;
    })[0];
}

/**
 * Encuentra el show más reciente que tenga setlist (canciones)
 * Busca en los primeros N shows hasta encontrar uno con songs
 */
function findLatestWithSetlist(setlists: any[]): any | null {
  if (!Array.isArray(setlists) || !setlists.length) return null;
  
  // Buscar el primer show que tenga canciones
  for (const show of setlists) {
    const set0 = show?.sets?.set?.[0];
    const songsRaw: any[] = Array.isArray(set0?.song) ? set0.song : [];
    
    // Si tiene al menos 1 canción, usarlo
    if (songsRaw.length > 0) {
      return show;
    }
  }
  
  // Si ninguno tiene setlist, devolver el más reciente de todos modos
  return setlists[0];
}

/** =======================
 * Upstream fetch
 * ======================= */
async function upstreamFetch(pathWithQuery: string) {
  const apiKey = process.env.SETLISTFM_API_KEY;
  if (!apiKey) throw new Error("Missing SETLISTFM_API_KEY");

  const res = await fetch(`${BASE_URL}${pathWithQuery}`, {
    headers: { "x-api-key": apiKey, Accept: "application/json" },
  });

  const bodyText = !res.ok ? await res.text().catch(() => "") : null;

  if (res.status === 429) return { ok: false as const, status: 429, bodyText };
  if (!res.ok) return { ok: false as const, status: res.status, bodyText };

  const json = await res.json();
  return { ok: true as const, status: res.status, json };
}

/** =======================
 * KV cache con "stale"
 * Guardamos { value, expiresAt } con TTL largo
 * ======================= */
type KVEntry<T> = { value: T; expiresAt: number };

async function kvGet<T>(key: string): Promise<{ value: T | null; stale: boolean }> {
  const entry = await kv.get<KVEntry<T>>(key);
  if (!entry) return { value: null, stale: false };
  const stale = Date.now() > entry.expiresAt;
  return { value: entry.value ?? null, stale };
}

async function kvSet<T>(key: string, value: T, freshForSeconds: number, keepSeconds: number) {
  const entry: KVEntry<T> = {
    value,
    expiresAt: Date.now() + freshForSeconds * 1000,
  };
  await kv.set(key, entry, { ex: keepSeconds });
}

/** =======================
 * Handler
 * ======================= */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const mbid = searchParams.get("mbid") || "a9044915-8be3-4c7e-b11f-9e2d2ea0a91e";
  const yearsAgo = Number(searchParams.get("yearsAgo") || "20");

  // “warm” solo para forzar el segundo fetch si falta cache
  const warm = searchParams.get("warm") === "1";  
  // "force" para bypass cache y forzar refresh (útil para debugging/invalidación manual)
  const force = searchParams.get("force") === "1";
  const latestKey = `setlist:latest:${mbid}:p1`;
  const latestFreshSeconds = 24 * 60 * 60;     // 24h fresco (refresca 1 vez al día)
  const latestKeepSeconds = 7 * 24 * 60 * 60;  // guardo 7 días para servir stale si hay rate limit

  const yearsKeepSeconds = 7 * 24 * 60 * 60; // guardo una semana
  const yearsFreshSeconds = 24 * 60 * 60;    // fresco 24h

  try {
    /** 1) LATEST desde KV (o upstream) */
    let latestObj: NormalizedShow | null = null;
    let cacheStatus = "miss";
    const latestCached = await kvGet<NormalizedShow>(latestKey);

    // Si hay cache fresco (< 24h) Y NO es force, usarlo sin llamar a la API
    if (latestCached.value && !latestCached.stale && !force) {
      latestObj = latestCached.value;
      cacheStatus = "fresh";
    } else {
      // Cache expirado, no existe, o force=1 → intentar refrescar desde setlist.fm
      if (force && latestCached.value) {
        cacheStatus = "force-refresh";
      }
      try {
        const latestRes = await upstreamFetch(`/artist/${mbid}/setlists?p=1`);
        if (!latestRes.ok) {
          // Si falla pero hay cache stale, usarlo como fallback
          if (latestCached.value) {
            latestObj = latestCached.value;
            cacheStatus = "stale-fallback";
            console.warn(`Using stale cache for ${latestKey} due to upstream error ${latestRes.status}`);
          } else {
            return NextResponse.json(
              { latest: null, yearsAgoPrev: null, error: "Upstream error", details: latestRes.bodyText },
              { status: latestRes.status }
            );
          }
        } else {
          const setlists = latestRes.json?.setlist ?? [];
          const latestRaw = findLatestWithSetlist(setlists);
          latestObj = normalizeSetlistItem(latestRaw);
          if (!latestObj) {
            // Si falla normalización pero hay cache viejo, usarlo
            if (latestCached.value) {
              latestObj = latestCached.value;
              cacheStatus = "stale-fallback";
            } else {
              return NextResponse.json(
                { latest: null, yearsAgoPrev: null, error: "Latest not found/invalid" },
                { status: 404 }
              );
            }
          } else {
            // Guardamos el nuevo dato fresco
            await kvSet(latestKey, latestObj, latestFreshSeconds, latestKeepSeconds);
            cacheStatus = "refreshed";
          }
        }
      } catch (fetchError) {
        // Error de red/timeout → usar cache stale si existe
        if (latestCached.value) {
          latestObj = latestCached.value;
          cacheStatus = "stale-fallback";
          console.warn(`Using stale cache for ${latestKey} due to fetch error:`, fetchError);
        } else {
          throw fetchError;
        }
      }
    }

    // validación dura
    if (!latestObj?.eventDateISO || Number.isNaN(isoToDate(latestObj.eventDateISO).getTime())) {
      return NextResponse.json(
        { latest: latestObj ?? null, yearsAgoPrev: null, error: "Invalid latest.eventDateISO" },
        { status: 500 }
      );
    }

    /** 2) yearsAgoPrev key depende del target YYYY-MM */
    const targetISO = addYearsISO(latestObj.eventDateISO, -yearsAgo);
    const targetYear = targetISO.slice(0, 4);
    const targetMonth = targetISO.slice(5, 7);

    const yearsKey = `setlist:yearsAgo:${mbid}:${yearsAgo}:p1:${targetYear}-${targetMonth}`;

    // intento KV
    const yearsCached = await kvGet<NormalizedShow | null>(yearsKey);
    if (yearsCached.value !== null) {
      return NextResponse.json(
        {
          latest: latestObj,
          yearsAgoPrev: yearsCached.value,
          meta: { targetISO, targetYear, targetMonth, cache: { latestKey, yearsKey, latestStatus: cacheStatus, yearsStatus: yearsCached.stale ? 'stale' : 'fresh' } },
        },
        { status: 200 }
      );
    }

    // si no está cacheado y no es warm, no hago 2do request (evita 429)
    if (!warm) {
      const response = NextResponse.json(
        {
          latest: latestObj,
          yearsAgoPrev: null,
          needsWarm: true,
          meta: { targetISO, targetYear, targetMonth, cache: { latestStatus: cacheStatus }, hint: "Call same endpoint with ?warm=1 to cache yearsAgoPrev." },
        },
        { status: 200 }
      );
      // Caché HTTP corto porque falta yearsAgoPrev
      response.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
      return response;
    }

    /** 3) warm: hago el 2do upstream call */
    const yearRes = await upstreamFetch(`/search/setlists?artistMbid=${mbid}&year=${targetYear}&p=1`);

    if (!yearRes.ok) {
      // si rate limited, igual dejo cacheado null “fresco” un rato para no martillar
      if (yearRes.status === 429) {
        await kvSet(yearsKey, null, 10 * 60, yearsKeepSeconds); // 10 min
      }
      return NextResponse.json(
        { latest: latestObj, yearsAgoPrev: null, error: "Upstream error", details: yearRes.bodyText },
        { status: yearRes.status }
      );
    }

    const yearSetlists: any[] = Array.isArray(yearRes.json?.setlist) ? yearRes.json.setlist : [];
    const normalized = yearSetlists.map(normalizeSetlistItem).filter(Boolean) as NormalizedShow[];

    const yearsAgoPrev = pickClosestToDate(normalized, targetISO);

    // cacheo (incluso null) por 24h fresco y 7 días retenido
    await kvSet(yearsKey, yearsAgoPrev ?? null, yearsFreshSeconds, yearsKeepSeconds);

    const response = NextResponse.json(
      {
        latest: latestObj,
        yearsAgoPrev: yearsAgoPrev ?? null,
        meta: { targetISO, targetYear, targetMonth, cache: { latestKey, yearsKey, latestStatus: cacheStatus, yearsStatus: 'refreshed' }, warmUsed: true },
      },
      { status: 200 }
    );
    
    // Caché HTTP largo porque combina ambos datasets
    response.headers.set("Cache-Control", "public, s-maxage=600, stale-while-revalidate=3600");
    
    return response;
  } catch (e: any) {
    return NextResponse.json(
      { latest: null, yearsAgoPrev: null, error: "Unexpected error", details: String(e?.message ?? e) },
      { status: 500 }
    );
  }
}
