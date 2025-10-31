import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";
import ThemeRegistry from "@/theme/ThemeRegistry";
import { ColorModeProvider } from "@/theme/useColorMode";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  const keywordsByLocale = {
    es: [
      "Megadeth",
      "Iron Maiden",
      "Anthrax",
      "Run For Your Lives Tour",
      "gira conjunta",
      "gira norteamericana",
      "gira final",
      "despedida",
      "This Was Our Life Tour",
      "última gira",
      "tour",
      "Dave Mustaine",
      "conciertos",
      "música",
      "heavy metal",
      "Argentina",
      "Brasil",
      "Chile",
      "México",
      "Sudamérica",
      "álbum final",
      "adelantos",
      "Burnation",
      "Portals to Oblivion",
      "Sector 11",
      "Tyranny of the Masses",
      "Lethal Weapon",
      "Alchemist",
      "filtraciones",
      "nuevas canciones",
      "YouTube shorts",
      "último tour",
      "farewell tour",
      "retiro",
      "fin de una era",
      "invitados especiales",
      "colaboración metal",
      "Ride The Lightning",
      "Metallica",
      "versión Megadeth",
      "cover Metallica",
      "James Hetfield",
      "Dave Mustaine Metallica",
      "noticia Ride The Lightning",
      "gira Argentina",
      "Megadeth en Argentina",
      "Megadeth Lima",
      "Megadeth Bogotá",
      "Megadeth Buenos Aires",
      "Megadeth São Paulo",
      "Megadeth Santiago",
      "Megadeth México",
    ],
    en: [
      "Megadeth",
      "Iron Maiden",
      "Anthrax",
      "Run For Your Lives Tour",
      "joint tour",
      "North American tour",
      "final tour",
      "farewell",
      "This Was Our Life Tour",
      "last tour",
      "tour",
      "concert",
      "Dave Mustaine",
      "music",
      "heavy metal",
      "live shows",
      "Argentina",
      "Brazil",
      "Chile",
      "Mexico",
      "South America",
      "final album",
      "previews",
      "Burnation",
      "Portals to Oblivion",
      "Sector 11",
      "Tyranny of the Masses",
      "Lethal Weapon",
      "Alchemist",
      "leaks",
      "new songs",
      "YouTube shorts",
      "retirement",
      "end of an era",
      "goodbye tour",
      "special guests",
      "metal collaboration",
      "Ride The Lightning",
      "Metallica",
      "Megadeth version",
      "Metallica cover",
      "James Hetfield",
      "Dave Mustaine Metallica",
      "Ride The Lightning news",
      "Megadeth Argentina tour",
      "Megadeth in Argentina",
      "Megadeth Lima",
      "Megadeth Bogotá",
      "Megadeth Buenos Aires",
      "Megadeth São Paulo",
      "Megadeth Santiago",
      "Megadeth Mexico",
    ],
  };

  const titleByLocale = {
    es: "Megadeth: Gira Argentina, Ride The Lightning y Run For Your Lives — Iron Maiden + Anthrax",
    en: "Megadeth: Argentina Tour, Ride The Lightning & Run For Your Lives — Iron Maiden + Anthrax",
  };

  const descriptionByLocale = {
    es: "Megadeth anuncia gira por Argentina, Lima, Bogotá, Buenos Aires, São Paulo, Santiago y México en 2026. Además, publicará una versión de Ride The Lightning de Metallica en su álbum despedida. Toda la info de la gira 'Run For Your Lives' junto a Iron Maiden y Anthrax, fechas, noticias y adelantos exclusivos. Fan site no oficial.",
    en: "Megadeth announces tour in Argentina, Lima, Bogotá, Buenos Aires, São Paulo, Santiago and Mexico in 2026. Also, will release a version of Metallica's Ride The Lightning on their farewell album. All info about the 'Run For Your Lives' tour with Iron Maiden and Anthrax, dates, news and exclusive previews. Unofficial fan site.",
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
    metadataBase: new URL("https://megadeth.com.ar"),
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
          alt: "Megadeth",
        },
      ],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();
  const locale = await getLocale();

  return (
    <html lang={locale} className={poppins.variable} suppressHydrationWarning>
      <head>
        <GoogleAnalytics />
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <NextIntlClientProvider messages={messages}>
          <ColorModeProvider>
            <ThemeRegistry>
              <Header />
              <main style={{ flex: 1 }}>{children}</main>
              <Footer />
            </ThemeRegistry>
          </ColorModeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
