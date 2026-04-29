import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "JBI Smile Design | Clinică stomatologică în Chișinău",
  description:
    "Clinică stomatologică modernă în Chișinău. Terapie dentară, endodonție, ortodonție, implantologie, protetică și estetică dentară.",
  applicationName: "JBI Smile Design",
  authors: [{ name: "JBI Smile Design" }],
  keywords: [
    "stomatolog Chișinău",
    "clinică stomatologică",
    "implant dentar",
    "ortodonție Chișinău",
    "estetică dentară",
    "JBI Smile Design",
  ],
  openGraph: {
    title: "JBI Smile Design | Clinică stomatologică în Chișinău",
    description:
      "Servicii stomatologice complete în Chișinău. Programări rapide, comunicare RO / EN / RU.",
    url: "https://jbismiledesign.md",
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro" className={`${inter.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  );
}
