import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("reviews");

  return {
    title: t("pageTitle"),
    description: t("pageDescription"),
    keywords:
      "Megadeth, reviews, críticas, reseñas, análisis, álbumes, discos, metal, thrash metal, Dave Mustaine, opinión, valoración",
    openGraph: {
      title: t("pageTitle"),
      description: t("pageDescription"),
      url: "https://megadeth.com.ar/discography/reviews",
      siteName: "Megadeth Argentina",
      locale: "es_AR",
      type: "website",
      images: [
        {
          url: "https://megadeth.com.ar/logo-megadeth.png",
          width: 1200,
          height: 630,
          alt: "Megadeth Reviews",
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
      canonical: "https://megadeth.com.ar/discography/reviews",
      languages: {
        es: "https://megadeth.com.ar/discography/reviews",
        en: "https://megadeth.com.ar/discography/reviews",
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

export default function ReviewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
