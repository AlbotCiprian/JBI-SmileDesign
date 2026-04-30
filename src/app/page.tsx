import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { HomePageContent } from "@/components/HomePageContent";
import messages from "../../messages/ro.json";

export const metadata: Metadata = {
  title: messages.metadata.title,
  description: messages.metadata.description,
  keywords: messages.metadata.keywords,
  alternates: {
    canonical: "/",
    languages: {
      ro: "/",
      en: "/en",
      ru: "/ru",
      "x-default": "/",
    },
  },
};

export default function RootHomePage() {
  return (
    <NextIntlClientProvider locale="ro" messages={messages}>
      <HomePageContent />
    </NextIntlClientProvider>
  );
}
