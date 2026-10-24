import { unstable_cache } from "next/cache";
import { supabase, getAllNews, getLatestNews, getNewsById } from "@/lib/supabase";
import { NewsArticle } from "@/types/news";

// Cache de datos de Next para las consultas de noticias. Funciona aunque la
// página sea dinámica (el layout lee cookies), así que Supabase recibe una
// consulta por período y no una por visita. /api/news/create invalida el tag.
// Motivo: el plan Free de Supabase se suspendió por egress (oct 2026).
export const NEWS_TAG = "news";
const REVALIDATE_SECONDS = 3600;

// Las funciones de supabase.ts devuelven [] si falla la consulta. Lanzar acá
// evita que ese [] quede cacheado: se sigue sirviendo la última versión buena.
function nonEmpty<T>(items: T[], label: string): T[] {
  if (items.length === 0) throw new Error(`Supabase devolvió 0 filas (${label})`);
  return items;
}

const cachedAllNews = unstable_cache(
  async () => nonEmpty(await getAllNews(), "all"),
  ["news-all"],
  { revalidate: REVALIDATE_SECONDS, tags: [NEWS_TAG] },
);

const cachedLatestNews = unstable_cache(
  async (limit: number) => nonEmpty(await getLatestNews(limit), "latest"),
  ["news-latest"],
  { revalidate: REVALIDATE_SECONDS, tags: [NEWS_TAG] },
);

const cachedNewsById = unstable_cache(getNewsById, ["news-by-id"], {
  revalidate: REVALIDATE_SECONDS,
  tags: [NEWS_TAG],
});

// Solo id + fecha: para el sitemap y generateStaticParams no hace falta el contenido.
const cachedNewsIndex = unstable_cache(
  async () => {
    const { data, error } = await supabase
      .from("news_articles")
      .select("id, published_date")
      .order("published_date", { ascending: false });
    if (error) throw error;
    return nonEmpty(data, "index");
  },
  ["news-index"],
  { revalidate: REVALIDATE_SECONDS, tags: [NEWS_TAG] },
);

async function orEmpty<T>(fn: () => Promise<T[]>, label: string): Promise<T[]> {
  try {
    return await fn();
  } catch (error) {
    console.error(`Error cargando noticias (${label}):`, error);
    return [];
  }
}

export function getAllNewsCached(): Promise<NewsArticle[]> {
  return orEmpty(cachedAllNews, "all");
}

export function getLatestNewsCached(limit: number): Promise<NewsArticle[]> {
  return orEmpty(() => cachedLatestNews(limit), "latest");
}

export function getNewsByIdCached(id: string): Promise<NewsArticle | null> {
  return cachedNewsById(id);
}

export function getNewsIndexCached(): Promise<{ id: string; published_date: string }[]> {
  return orEmpty(cachedNewsIndex, "index");
}
