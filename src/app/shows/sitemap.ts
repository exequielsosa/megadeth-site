import { MetadataRoute } from "next";
import showsData from "@/constants/shows.json";
import { Show, generateShowSlug } from "@/types/show";

export default function sitemap(): MetadataRoute.Sitemap {
  const shows = showsData as Show[];

  const showEntries = shows.map((show) => ({
    url: `https://megadeth-site.vercel.app/shows/${generateShowSlug(show)}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: "https://megadeth-site.vercel.app/shows",
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    ...showEntries,
  ];
}
