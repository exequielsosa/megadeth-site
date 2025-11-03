import type { Metadata } from "next";
import { getLocale } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const title = locale === "es"
    ? "Términos y condiciones | Megadeth Fan Site"
    : "Terms and Conditions | Megadeth Fan Site";
  const description = locale === "es"
    ? "Lee los términos y condiciones de uso del sitio de fans de Megadeth. Información legal y derechos."
    : "Read the terms and conditions for using the Megadeth fan site. Legal information and rights.";
  const keywords = locale === "es"
    ? ["Megadeth", "términos", "condiciones", "legal", "fan site", "uso"]
    : ["Megadeth", "terms", "conditions", "legal", "fan site", "usage"];
  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      siteName: "Megadeth Fan Site",
      type: "website",
      locale: locale === "es" ? "es_AR" : "en_US",
      images: [
        {
          url: "/images/megadeth-megadeth.jpg",
          width: 1200,
          height: 630,
          alt: "Megadeth Términos",
        },
      ],
    },
    twitter: { card: "summary_large_image" },
    metadataBase: new URL("https://megadeth.com.ar"),
  };
}
