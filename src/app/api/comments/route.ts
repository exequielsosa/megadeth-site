import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const MAX_PER_HOUR = 10;
const WINDOW_SECONDS = 60 * 60;

const GET_CACHE_TTL_SECONDS = 60; // cache corto para no pegarle siempre a Supabase

function getIP(req: Request) {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0].trim();
  return req.headers.get("x-real-ip") || req.headers.get("cf-connecting-ip") || "unknown";
}

function stripHtml(input: string) {
  return input.replace(/<[^>]*>/g, "");
}

function stripUrls(input: string) {
  return input.replace(/https?:\/\/\S+/gi, "").replace(/\bwww\.\S+/gi, "");
}

function normalizeText(input: string) {
  return input
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function sanitizeContent(raw: string) {
  const noHtml = stripHtml(raw);
  const noUrls = stripUrls(noHtml);
  const normalized = normalizeText(noUrls);
  return normalized.slice(0, 2000);
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function rateLimitOrThrow(ip: string) {
  const key = `rl:comments:${ip}`;
  const count = await kv.incr(key);
  if (count === 1) await kv.expire(key, WINDOW_SECONDS);
  if (count > MAX_PER_HOUR) throw new Error("RATE_LIMIT");
}

/** Versionado por página para invalidar cache sin borrar por patrón */
function pageVersionKey(pageType: string, pageId: string) {
  return `comments:v:${pageType}:${pageId}`;
}
function pageCacheKey(pageType: string, pageId: string, version: number, limit: number, offset: number) {
  return `comments:cache:${pageType}:${pageId}:v${version}:l${limit}:o${offset}`;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const pageType = (searchParams.get("pageType") || "").trim();
  const pageId = (searchParams.get("pageId") || "").trim();

  if (!pageType || !pageId) {
    return NextResponse.json({ error: "Missing pageType/pageId" }, { status: 400 });
  }

  const limit = Math.min(Number(searchParams.get("limit") || "20"), 50);
  const offset = Math.max(Number(searchParams.get("offset") || "0"), 0);

  // 1) obtener versión actual (si no existe, 0)
  const vKey = pageVersionKey(pageType, pageId);
  const version = (await kv.get<number>(vKey)) ?? 0;

  // 2) intentar cache
  const cKey = pageCacheKey(pageType, pageId, version, limit, offset);
  const cached = await kv.get<{ items: any[] }>(cKey);

  if (cached) {
    const res = NextResponse.json(cached, { status: 200 });
    res.headers.set("x-comments-cache", "HIT");
    res.headers.set("x-comments-version", String(version));
    return res;
  }

  // 3) ir a Supabase (RLS ya filtra published, igual dejo el filtro explícito)
  const { data, error } = await supabase
    .from("comments")
    .select("id,page_type,page_id,name,content,created_at")
    .eq("page_type", pageType)
    .eq("page_id", pageId)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const payload = { items: data ?? [] };

  // 4) guardar cache
  await kv.set(cKey, payload, { ex: GET_CACHE_TTL_SECONDS });

  const res = NextResponse.json(payload, { status: 200 });
  res.headers.set("x-comments-cache", "MISS");
  res.headers.set("x-comments-version", String(version));
  res.headers.set("x-comments-cache-ttl", String(GET_CACHE_TTL_SECONDS));
  return res;
}

export async function POST(req: Request) {
  const ip = getIP(req);

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const pageType = String(body.pageType || "").trim();
  const pageId = String(body.pageId || "").trim();
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const contentRaw = String(body.content || "");
  const honeypot = String(body.website || "").trim(); // campo trampa

  // Honeypot: si lo completan, respondé OK silencioso
  if (honeypot) {
    const res = NextResponse.json({ ok: true }, { status: 200 });
    res.headers.set("x-comments-honeypot", "TRIPPED");
    return res;
  }

  if (!pageType || !pageId || !name || !email || !contentRaw) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const content = sanitizeContent(contentRaw);
  if (content.length < 3) {
    return NextResponse.json({ error: "Comment too short" }, { status: 400 });
  }

  // Rate limit por IP
  try {
    await rateLimitOrThrow(ip);
  } catch (e: any) {
    if (e?.message === "RATE_LIMIT") {
      const res = NextResponse.json({ error: "Too many comments. Try later." }, { status: 429 });
      res.headers.set("x-rl-limit", String(MAX_PER_HOUR));
      res.headers.set("x-rl-window", String(WINDOW_SECONDS));
      return res;
    }
    return NextResponse.json({ error: "Rate limit error" }, { status: 500 });
  }

  // Insert (policy exige status='published')
  const { data, error } = await supabase
    .from("comments")
    .insert({
      page_type: pageType,
      page_id: pageId,
      name,
      email,
      content,
      status: "published",
    })
    .select("id,page_type,page_id,name,content,created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Invalidación: subir versión de esa página (rompe cache automáticamente)
  const vKey = pageVersionKey(pageType, pageId);
  const newVersion = await kv.incr(vKey);

  const res = NextResponse.json({ item: data }, { status: 201 });
  res.headers.set("x-comments-cache", "PURGE");
  res.headers.set("x-comments-version", String(newVersion));
  return res;
}
