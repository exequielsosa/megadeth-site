export const revalidate = 300;

import Hero from "@/components/Hero";
import { getLatestNews } from "@/lib/supabase";

export default async function HomePage() {
  // Pedir solo las 5 últimas (ya vienen ordenadas por fecha desc).
  // Antes se traían todas las noticias cada 5 min solo para usar 5.
  const latestNews = await getLatestNews(5);
  return <Hero latestNews={latestNews} />;
}
