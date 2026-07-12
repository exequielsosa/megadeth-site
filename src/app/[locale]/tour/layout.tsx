import { getLocale } from "next-intl/server";
import type { Metadata } from "next";
import { tourDates } from "@/constants/tourDates";
import { i18nAlternates } from "@/utils/i18nAlternates";

function buildTourEventsJsonLd(locale: string) {
  const eventNamePrefix = locale === "es" ? "Megadeth en" : "Megadeth in";

  return {
    "@context": "https://schema.org",
    "@graph": tourDates.map((show) => ({
      "@type": "MusicEvent",
      name: `${eventNamePrefix} ${show.city}`,
      startDate: show.date,
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: {
        "@type": "Place",
        name: show.venue,
        address: {
          "@type": "PostalAddress",
          addressLocality: show.city,
          addressCountry: show.country,
        },
      },
      performer: { "@type": "MusicGroup", name: "Megadeth" },
      image: "https://megadeth.com.ar/images/megadeth-megadeth.jpg",
      offers: {
        "@type": "Offer",
        url: show.ticketLink,
      },
    })),
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  const keywordsByLocale = {
    es: [
      "Megadeth tour",
      "conciertos Megadeth",
      "entradas Megadeth",
      "gira 2026",
      "Dave Mustaine concierto",
      "tour fechas",
      "metal en vivo",
      "thrash metal tour",
    ],
    en: [
      "Megadeth tour",
      "Megadeth concerts",
      "Megadeth tickets",
      "tour 2026",
      "Dave Mustaine concert",
      "tour dates",
      "live metal",
      "thrash metal tour",
    ],
  };

  const titleByLocale = {
    es: "Megadeth Tour 2026 - Fechas y Entradas",
    en: "Megadeth Tour 2026 - Dates and Tickets",
  };

  const descriptionByLocale = {
    es: "Fechas oficiales de la gira 2026 de Megadeth: conciertos en Europa, Norteamérica y Oceanía. Entradas y venues actualizados.",
    en: "Official Megadeth 2026 tour dates: concerts across Europe, North America and Oceania. Updated tickets and venues.",
  };

  return {
    title:
      titleByLocale[locale as keyof typeof titleByLocale] || titleByLocale.es,
    description:
      descriptionByLocale[locale as keyof typeof descriptionByLocale] ||
      descriptionByLocale.es,
    keywords:
      keywordsByLocale[locale as keyof typeof keywordsByLocale] ||
      keywordsByLocale.es,
    authors: [{ name: "Exequiel Sosa" }],
    openGraph: {
      title:
        titleByLocale[locale as keyof typeof titleByLocale] || titleByLocale.es,
      description:
        descriptionByLocale[locale as keyof typeof descriptionByLocale] ||
        descriptionByLocale.es,
      siteName: "Megadeth Fan",
      type: "website",
      locale: locale === "es" ? "es_AR" : "en_US",
      images: [
        {
          url: "/images/megadeth-megadeth.jpg",
          width: 1200,
          height: 630,
          alt: "Megadeth Tour 2026",
        },
      ],
    },
    twitter: { card: "summary_large_image" },
    alternates: i18nAlternates("/tour", locale),
  };
}

export default async function TourLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildTourEventsJsonLd(locale)),
        }}
      />
      {children}
    </>
  );
}
