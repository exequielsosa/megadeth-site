import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ThemeRegistry from "@/theme/ThemeRegistry";
import { ColorModeProvider } from "@/theme/useColorMode";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Megadeth — Último disco y gira final",
  description:
    "Noticias, fechas y discografía de Megadeth (fan site no oficial).",
  metadataBase: new URL("https://megadeth-site.example.com"),
  openGraph: {
    title: "Megadeth — Fan Site",
    description: "Último disco y gira final: fechas, noticias y discos.",
    siteName: "Megadeth Fan",
    type: "website",
    locale: "es_AR",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.variable} suppressHydrationWarning>
      <body
        style={{
          margin: 0,
          padding: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ColorModeProvider>
          <ThemeRegistry>
            <Header />
            <main style={{ flex: 1 }}>{children}</main>
            <Footer />
          </ThemeRegistry>
        </ColorModeProvider>
      </body>
    </html>
  );
}
