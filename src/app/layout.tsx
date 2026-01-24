import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";
import ThemeRegistry from "@/theme/ThemeRegistry";
import { ColorModeProvider } from "@/theme/useColorMode";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { GoogleAnalytics } from "@next/third-parties/google";

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
      "Megadeth en Argentina 2026",
      "Megadeth Lima",
      "Megadeth Bogotá",
      "Megadeth Buenos Aires",
      "Megadeth São Paulo",
      "Megadeth Santiago",
      "Megadeth México",
      "I don't care",
      "nuevo single Megadeth",
      "álbum Megadeth 2026",
      "Megadeth ultimo concierto en el espacio",
      "Nuevo Single anunciado",
      "Escucha el nuevo álbum de Megadeth antes que nadie",
      "Megadeth en el cine",
      "Entradas Argentina Tu Ticket 10/12 preventa",
      "Estreno BEHIND THE MASK en Argentina",
      "Let there be Shread",
      "Shows en vivo de Megadeth",
      "Megadeth bootlegs",
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
      "Megadeth in Argentina 2026",
      "Megadeth Lima",
      "Megadeth Bogotá",
      "Megadeth Buenos Aires",
      "Megadeth São Paulo",
      "Megadeth Santiago",
      "Megadeth Mexico",
      "I don't care",
      "new Megadeth single",
      "Megadeth 2026 album",
      "Megadeth last concert in space",
      "BEHIND THE MASK premiere",
      "Hear the new Megadeth album before anyone else",
      "Megadeth in cinema",
      "Argentina tickets Tu Ticket 10/12 presale",
      "Let there be Shread",
      "Live shows Megadeth",
      "Megadeth bootlegs",
    ],
  };

  const titleByLocale = {
    es: "MEGADETH: Argentina 2026, Noticias, actualidad, shows, letras, discografia, bootlegs y adelantos del álbum final & gira 2026 Argentina / LATAM — Iron Maiden + Anthrax",
    en: "MEGADETH: Argentina 2026, News, updates, shows, lyrics, discography, bootlegs and previews of the final album & 2026 tour Argentina / LATAM — Iron Maiden + Anthrax",
  };

  const descriptionByLocale = {
    es: "Todo sobre MEGADETH: Argentina 2026, Noticias, actualidad, discografía, shows, letras, bootlegs y adelantos del álbum final 'Megadeth' que se lanza el 23 de enero de 2026. Además, gira en Argentina, Lima, Bogotá, Buenos Aires, São Paulo, Santiago y México con Iron Maiden y Anthrax. Noticias, fechas y adelantos exclusivos. Sitio no oficial de fans.",
    en: "All about MEGADETH: Argentina 2026, News, updates, discography, shows, lyrics, bootlegs and previews of the final album 'Megadeth' releasing on January 23, 2026. Also, tour in Argentina, Lima, Bogotá, Buenos Aires, São Paulo, Santiago and Mexico with Iron Maiden and Anthrax. Exclusive news, dates and previews. Unofficial fan site.",
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
      type: "article",
      locale: locale === "es" ? "es_AR" : "en_US",
      publishedTime: "2025-11-01T00:00:00Z",
      modifiedTime: "2026-01-24T00:00:00Z",
      images: [
        {
          url: "/images/meg-argentina.jpg",
          width: 1200,
          height: 630,
          alt: "Megadeth Argentina",
        },
      ],
    },
    twitter: { card: "summary_large_image" },
    alternates: {
      canonical: "/",
    },
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
        <link rel="icon" type="image/webp" href="/icon.webp" />
        {/* Schema.org MusicGroup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MusicGroup",
              name: "Megadeth",
              genre: ["Heavy Metal", "Thrash Metal", "Speed Metal"],
              foundingDate: "1983",
              foundingLocation: {
                "@type": "Place",
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "Los Angeles",
                  addressRegion: "CA",
                  addressCountry: "US",
                },
              },
              member: [
                {
                  "@type": "Person",
                  name: "Dave Mustaine",
                  roleName: "Lead Vocals, Rhythm & Lead Guitar",
                },
                {
                  "@type": "Person",
                  name: "James LoMenzo",
                  roleName: "Bass",
                },
                {
                  "@type": "Person",
                  name: "Dirk Verbeuren",
                  roleName: "Drums",
                },
                {
                  "@type": "Person",
                  name: "Teemu Mäntysaari",
                  roleName: "Lead Guitar",
                },
              ],
              url: "https://megadeth.com.ar",
              sameAs: [
                "https://www.facebook.com/Megadeth",
                "https://twitter.com/Megadeth",
                "https://www.instagram.com/megadeth",
                "https://www.youtube.com/megadeth",
                "https://en.wikipedia.org/wiki/Megadeth",
              ],
              description:
                locale === "es"
                  ? "Megadeth es una banda estadounidense de thrash metal fundada en 1983 por Dave Mustaine. Con 16 álbumes de estudio y más de 38 millones de copias vendidas, es una de las bandas más influyentes del heavy metal."
                  : "Megadeth is an American thrash metal band founded in 1983 by Dave Mustaine. With 16 studio albums and over 38 million copies sold, it is one of the most influential heavy metal bands.",
            }),
          }}
        />

        {/* Preconnect a recursos externos críticos */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://img.youtube.com" />

        {/* Script para inicializar color mode antes de hidratar React */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var mode = localStorage.getItem('color-mode');
                  if (!mode) {
                    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                      mode = 'dark';
                    } else {
                      mode = 'light';
                    }
                  }
                  document.documentElement.setAttribute('data-color-mode', mode);
                } catch(e) {}
              })();
            `,
          }}
        />
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
              <main style={{ flex: 1 }}>
                {children}
                <GoogleAnalytics gaId="G-3MT8DZR057" />
              </main>
              <Footer />
            </ThemeRegistry>
          </ColorModeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
