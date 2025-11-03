import type { Metadata } from "next";
import { getLocale } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const title = locale === "es"
    ? "Política de privacidad | Megadeth Fan Site"
    : "Privacy Policy | Megadeth Fan Site";
  const description = locale === "es"
    ? "Lee la política de privacidad del sitio de fans de Megadeth. Protección de datos y derechos de los usuarios."
    : "Read the privacy policy for the Megadeth fan site. Data protection and user rights.";
  const keywords = locale === "es"
    ? ["Megadeth", "privacidad", "política", "datos", "fan site", "usuarios"]
    : ["Megadeth", "privacy", "policy", "data", "fan site", "users"];
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
          alt: "Megadeth Privacidad",
        },
      ],
    },
    twitter: { card: "summary_large_image" },
    metadataBase: new URL("https://megadeth.com.ar"),
  };
}
