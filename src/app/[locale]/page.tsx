export const revalidate = 300;

import Hero from "@/components/Hero";
import { getLatestNewsCached } from "@/lib/news";

export default async function HomePage() {
  // Solo las 5 últimas, desde el cache de datos (ver lib/news.ts).
  const latestNews = await getLatestNewsCached(5);
  return <Hero latestNews={latestNews} />;
}
