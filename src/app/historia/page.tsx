export const dynamic = "force-static";
import { Metadata } from "next";
import HistoriaClient from "./HistoriaClient";
import { getTranslations } from "next-intl/server";
import ContainerGradientNoPadding from "@/components/atoms/ContainerGradientNoPadding";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("historyPage");

  return {
    title: `${t("title")} | Megadeth`,
    description: t("description"),
    keywords: t("keywords"),
    openGraph: {
      title: `${t("title")} | Megadeth`,
      description: t("description"),
      type: "article",
      images: [
        {
          url: "/images/historia/megadeth-timeline-hero.jpg",
          width: 1200,
          height: 630,
          alt: t("imageAlt"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${t("title")} | Megadeth`,
      description: t("description"),
      images: ["/images/historia/megadeth-timeline-hero.jpg"],
    },
    alternates: {
      canonical: "/historia",
      languages: {
        es: "/historia",
        en: "/historia",
      },
    },
  };
}

export default function HistoriaPage() {
  return (
    <ContainerGradientNoPadding>
      <HistoriaClient />
    </ContainerGradientNoPadding>
  );
}
