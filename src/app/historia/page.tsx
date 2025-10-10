import { Metadata } from "next";
import HistoriaClient from "./HistoriaClient";
import historiaData from "@/constants/historia.json";
import ContainerGradient from "@/components/atoms/ContainerGradient";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `${historiaData.title} | Megadeth`,
    description: historiaData.introduction.substring(0, 160),
    keywords: [
      "Megadeth historia",
      "Dave Mustaine biografía",
      "thrash metal historia",
      "Big Four",
      "Metallica",
      "timeline Megadeth",
      "cronología metal",
      "historia del metal",
      "1983-2026",
      "Rust in Peace",
      "Countdown to Extinction",
      "Peace Sells",
      "Dystopia",
    ].join(", "),
    openGraph: {
      title: `${historiaData.title} | Megadeth`,
      description: historiaData.introduction.substring(0, 160),
      type: "article",
      images: [
        {
          url: "/images/historia/megadeth-timeline-hero.jpg",
          width: 1200,
          height: 630,
          alt: "Historia completa de Megadeth 1983-2026",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${historiaData.title} | Megadeth`,
      description: historiaData.introduction.substring(0, 160),
      images: ["/images/historia/megadeth-timeline-hero.jpg"],
    },
    alternates: {
      canonical: "/historia",
      languages: {
        es: "/es/historia",
        en: "/en/historia",
      },
    },
  };
}

export default function HistoriaPage() {
  return (
    <ContainerGradient>
      <HistoriaClient />
    </ContainerGradient>
  );
}
