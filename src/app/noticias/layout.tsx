import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("news");

  return {
    title: t("pageTitle"),
    description: t("pageDescription"),
    keywords: "Megadeth, noticias, news, metal, thrash metal, Dave Mustaine, actualidad, últimas noticias, tour, conciertos",
    openGraph: {
      title: t("pageTitle"),
      description: t("pageDescription"),
      url: "https://megadeth.com.ar/noticias",
      siteName: "Megadeth Argentina",
      locale: "es_AR",
      type: "website",
      images: [
        {
          url: "https://megadeth.com.ar/logo-megadeth.png",
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
      images: ["https://megadeth.com.ar/logo-megadeth.png"],
    },
    alternates: {
      canonical: "https://megadeth.com.ar/noticias",
      languages: {
        "es": "https://megadeth.com.ar/es/noticias",
        "en": "https://megadeth.com.ar/en/noticias",
      },
    },
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
