import { LineupFormation } from "@/types";
import lineupsData from "@/constants/lineups.json";
import { Metadata } from "next";
import { getLocale } from "next-intl/server";

// Generate static params for all lineups
export async function generateStaticParams() {
  const lineups: LineupFormation[] = lineupsData.lineups;

  return lineups.map((lineup) => ({
    lineupId: lineup.id,
  }));
}

// Generate metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lineupId: string }>;
}): Promise<Metadata> {
  const { lineupId } = await params;
  const locale = await getLocale();
  const lineups: LineupFormation[] = lineupsData.lineups;
  const lineup = lineups.find((l) => l.id === lineupId);

  if (!lineup) {
    return {
      title: locale === "en" ? "Lineup not found" : "Formación no encontrada",
    };
  }

  const lang = (locale === "en" ? "en" : "es") as "es" | "en";
  const title = lineup.title[lang] || lineup.title.es;
  const description = lineup.description[lang] || lineup.description.es;

  return {
    title: `${title} - ${
      locale === "en" ? "Megadeth Lineups" : "Formaciones Megadeth"
    }`,
    description,
    openGraph: {
      title: `${title} - Megadeth`,
      description,
      images: [lineup.image],
    },
    alternates: {
      canonical: `/formaciones/${lineupId}`,
    },
  };
}

export default function LineupLayout(props: unknown) {
  return <>{(props as { children: React.ReactNode }).children}</>;
}
