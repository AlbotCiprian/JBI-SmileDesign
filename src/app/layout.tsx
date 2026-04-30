import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { getLocale } from "next-intl/server";
import { AnalyticsGate } from "@/components/AnalyticsGate";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const SITE_URL = getSiteUrl();

const inter = Inter({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "JBI Smile Design | Clinica stomatologica in Chisinau",
  description:
    "Clinica stomatologica moderna in Chisinau. Terapie dentara, endodontie, ortodontie, implantologie, protetica si estetica dentara.",
  applicationName: "JBI Smile Design",
  authors: [{ name: "JBI Smile Design" }],
  keywords: [
    "stomatolog Chisinau",
    "clinica stomatologica",
    "implant dentar",
    "ortodontie Chisinau",
    "estetica dentara",
    "JBI Smile Design",
  ],
  openGraph: {
    title: "JBI Smile Design | Clinica stomatologica in Chisinau",
    description:
      "Servicii stomatologice complete in Chisinau. Programari rapide, comunicare RO / EN / RU.",
    url: SITE_URL,
    siteName: "JBI Smile Design",
    locale: "ro_RO",
    type: "website",
    images: [{ url: "/images/jbi-logo.png", width: 1200, height: 630, alt: "JBI Smile Design" }],
  },
  icons: {
    icon: "/images/jbi-logo.png",
    apple: "/images/jbi-logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B1F3A",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();

  return (
    <html lang={locale} className={`${inter.variable} ${playfair.variable}`}>
      <body>
        {children}
        <AnalyticsGate />
      </body>
    </html>
  );
}
