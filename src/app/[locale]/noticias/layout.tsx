import { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { i18nAlternates } from "@/utils/i18nAlternates";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("news");
  const locale = await getLocale();

  return {
    title: t("pageTitle"),
    description: t("pageDescription"),
    keywords:
      "Megadeth, noticias, news, metal, thrash metal, Dave Mustaine, actualidad, últimas noticias, tour, conciertos",
    openGraph: {
      title: t("pageTitle"),
      description: t("pageDescription"),
      url: i18nAlternates("/noticias", locale).canonical,
      siteName: "Megadeth Argentina",
      locale: locale === "es" ? "es_AR" : "en_US",
      type: "website",
      images: [
        {
          url: "https://megadeth.com.ar/images/band.webp",
          width: 1200,
          height: 630,
          alt: "Megadeth",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("pageTitle"),
      description: t("pageDescription"),
      images: ["https://megadeth.com.ar/images/band.webp"],
    },
    alternates: i18nAlternates("/noticias", locale),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
