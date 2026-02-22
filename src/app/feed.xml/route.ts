import { getLatestNews } from "@/lib/supabase";

export const revalidate = 3600; // Regenerar cada hora

const BASE_URL = "https://megadeth.com.ar";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const articles = await getLatestNews(50);

  const items = articles
    .map((article) => {
      const url = `${BASE_URL}/noticias/${article.id}`;
      const pubDate = new Date(article.publishedDate).toUTCString();
      const title = escapeXml(article.title.es);
      const description = escapeXml(article.description.es.slice(0, 400));

      return `    <item>
      <title>${title}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${description}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Megadeth Fan Site — Noticias</title>
    <link>${BASE_URL}</link>
    <description>Últimas noticias sobre Megadeth: giras, álbumes, Dave Mustaine y más. Sitio de fans no oficial.</description>
    <language>es-AR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${BASE_URL}/images/band.webp</url>
      <title>Megadeth Fan Site</title>
      <link>${BASE_URL}</link>
    </image>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
