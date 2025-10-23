import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";
import ThemeRegistry from "@/theme/ThemeRegistry";
import { ColorModeProvider } from "@/theme/useColorMode";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
    ],
  };

  const titleByLocale = {
    es: "Megadeth + Iron Maiden + Anthrax — Gira 'Run For Your Lives' y Despedida",
    en: "Megadeth + Iron Maiden + Anthrax — 'Run For Your Lives' Tour & Farewell",
  };

  const descriptionByLocale = {
    es: "Megadeth se une a Iron Maiden y Anthrax para la gira 'Run For Your Lives' por Norteamérica y Europa, como parte de su despedida. Noticias, fechas, álbum final y adelantos exclusivos. Fan site no oficial.",
    en: "Megadeth joins Iron Maiden and Anthrax for the 'Run For Your Lives' tour across North America and Europe, as part of their farewell. News, dates, final album and exclusive previews. Unofficial fan site.",
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
