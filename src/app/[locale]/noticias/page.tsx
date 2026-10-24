import NoticiasPageClient from "@/components/NoticiasPageClient";
import { getAllNewsCached } from "@/lib/news";

// Las noticias se leen en el servidor desde el cache de datos (lib/news.ts).
// Antes las pedía el navegador directo a Supabase: ~1 MB de egress por visita.
export default async function NoticiasPage() {
  const newsData = await getAllNewsCached();
  return <NoticiasPageClient newsData={newsData} />;
}
