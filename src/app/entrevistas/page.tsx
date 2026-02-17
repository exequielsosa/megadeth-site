export const dynamic = "force-static";
import { getLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import InterviewsListPage from "@/components/InterviewsListPage";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("interviews");

  const title = `${t("listTitle")} | Megadeth`;
  const description = t("listDescription");
  const keywords = [
    "Megadeth",
    "entrevistas",
    "interviews",
    "thrash metal",
    "metal",
    "Dave Mustaine",
    "David Ellefson",
    "Marty Friedman",
    "Nick Menza",
    "Kiko Loureiro",
    "Dirk Verbeuren",
    "James LoMenzo",
    "Teemu Mäntysaari",
    "declaraciones",
    "statements",
    "conversaciones",
    "conversations",
  ];

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: "/entrevistas",
      siteName: "Megadeth Fan Site",
      locale: locale === "es" ? "es_ES" : "en_US",
      type: "website",
      images: [
        {
          url: "/images/entrevistas/og-interviews.jpg",
          width: 1200,
          height: 630,
          alt:
            locale === "es"
              ? "Entrevistas de Megadeth - Colección completa"
              : "Megadeth Interviews - Complete Collection",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/entrevistas/og-interviews.jpg"],
      creator: "@MegadethFanSite",
    },
    alternates: {
      canonical: "/entrevistas",
      languages: {
        es: "/entrevistas",
        en: "/entrevistas",
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default function InterviewsPage() {
  return <InterviewsListPage />;
}
