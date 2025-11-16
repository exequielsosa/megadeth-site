import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Entrevistas | Megadeth",
  description: "Colección completa de entrevistas a los miembros de Megadeth a lo largo de su historia. Desde los inicios en 1983 hasta la actualidad, accede a conversaciones exclusivas, declaraciones históricas y momentos únicos de Dave Mustaine, David Ellefson y todos los integrantes de la banda.",
  keywords: [
    "Megadeth entrevistas",
    "Dave Mustaine entrevista",
    "David Ellefson entrevista", 
    "Megadeth interviews",
    "thrash metal entrevistas",
    "metal interviews",
    "Marty Friedman entrevista",
    "Nick Menza entrevista",
    "Kiko Loureiro entrevista",
    "Dirk Verbeuren entrevista",
    "James LoMenzo entrevista",
    "Teemu Mäntysaari entrevista",
    "entrevistas históricas metal",
    "declaraciones Megadeth",
  ],
  openGraph: {
    title: "Entrevistas | Megadeth",
    description: "Colección completa de entrevistas a los miembros de Megadeth a lo largo de su historia.",
    url: "/entrevistas",
    siteName: "Megadeth Fan Site",
    type: "website",
    images: [
      {
        url: "/images/entrevistas/rp1992.jpg",
        width: 1200,
        height: 630,
        alt: "Entrevistas de Megadeth - Colección completa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Entrevistas | Megadeth",
    description: "Colección completa de entrevistas a los miembros de Megadeth a lo largo de su historia.",
    images: ["/images/entrevistas/rp1992.jpg"],
    creator: "@MegadethFanSite",
  },
  alternates: {
    canonical: "/entrevistas",
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