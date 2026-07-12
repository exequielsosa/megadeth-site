export const revalidate = 300;

import Hero from "@/components/Hero";
import { getAllNews } from "@/lib/supabase";

export default async function HomePage() {
  const news = await getAllNews();
  const latestNews = news
    .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
    .slice(0, 5);
  return <Hero latestNews={latestNews} />;
}
