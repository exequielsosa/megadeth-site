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
      "metal",
      "thrash metal",
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
    ],
    en: [
      "Megadeth",
      "metal",
      "thrash metal",
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
    ],
  };

  const titleByLocale = {
    es: "Megadeth — Gira Final 'This Was Our Life Tour' y Álbum de Despedida",
    en: "Megadeth — Final Tour 'This Was Our Life Tour' and Farewell Album",
  };

  const descriptionByLocale = {
    es: "Megadeth anuncia su gira final 'This Was Our Life Tour' por Sudamérica. Noticias, fechas y adelantos del álbum de despedida. Burnation, Portals to Oblivion y más. Fan site no oficial.",
    en: "Megadeth announces final tour 'This Was Our Life Tour' through South America. News, dates and previews of the farewell album. Burnation, Portals to Oblivion and more. Unofficial fan site.",
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
