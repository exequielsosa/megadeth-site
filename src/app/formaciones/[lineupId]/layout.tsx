import { LineupFormation } from "@/types";
import lineupsData from "@/constants/lineups.json";
import { Metadata } from "next";

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
  const lineups: LineupFormation[] = lineupsData.lineups;
  const lineup = lineups.find((l) => l.id === lineupId);

  if (!lineup) {
    return {
      title: "Formación no encontrada",
    };
  }

  const title = lineup.title.es; // Default to Spanish for metadata
  const description = lineup.description.es;

  return {
    title: `${title} - Formaciones Megadeth`,
    description: description,
    openGraph: {
      title: `${title} - Megadeth`,
      description: description,
      images: [lineup.image],
    },
  };
}

export default function LineupLayout(props: unknown) {
  return <>{(props as { children: React.ReactNode }).children}</>;
}
