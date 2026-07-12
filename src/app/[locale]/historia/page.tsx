import { Metadata } from "next";
import HistoriaClient from "./HistoriaClient";
import { getTranslations, getLocale } from "next-intl/server";
import ContainerGradientNoPadding from "@/components/atoms/ContainerGradientNoPadding";
import { i18nAlternates } from "@/utils/i18nAlternates";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("historyPage");
  const locale = await getLocale();

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    openGraph: {
      title: t("title"),
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
      title: t("title"),
      description: t("description"),
      images: ["/images/historia/megadeth-timeline-hero.jpg"],
    },
    alternates: i18nAlternates("/historia", locale),
  };
}

export default function HistoriaPage() {
  return (
    <ContainerGradientNoPadding>
      <HistoriaClient />
    </ContainerGradientNoPadding>
  );
}
