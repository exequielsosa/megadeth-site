import type { Metadata } from "next";
import { getLocale } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const title = locale === "es"
    ? "Contacto | Megadeth Fan Site"
    : "Contact | Megadeth Fan Site";
  const description = locale === "es"
    ? "Formulario de contacto para el sitio de fans de Megadeth. Envía tus dudas, sugerencias o comentarios."
    : "Contact form for the Megadeth fan site. Send your questions, suggestions or comments.";
  const keywords = locale === "es"
    ? ["Megadeth", "contacto", "fan site", "formulario", "dudas", "sugerencias", "comentarios"]
    : ["Megadeth", "contact", "fan site", "form", "questions", "suggestions", "comments"];
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
          alt: "Megadeth Contacto",
        },
      ],
    },
    twitter: { card: "summary_large_image" },
    alternates: {
      canonical: "/contacto",
    },
  };
}
