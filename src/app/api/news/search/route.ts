import { NextResponse } from "next/server";
import { getAllNewsCached } from "@/lib/news";

// Índice para el buscador del Header: solo los campos que filtra y muestra.
// Sale del cache de datos + CDN, así abrir el buscador no consulta Supabase.
export async function GET() {
  const news = await getAllNewsCached();
  const items = news.map(({ id, title, description }) => ({ id, title, description }));

  return NextResponse.json(items, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
