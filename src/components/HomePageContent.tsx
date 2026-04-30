import { LoadingScreen } from "@/components/LoadingScreen";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { AboutClinic } from "@/components/AboutClinic";
import { TeamTrust } from "@/components/TeamTrust";
import { ProcessSteps } from "@/components/ProcessSteps";
import { VideoSection } from "@/components/VideoSection";
import { GoogleReviewsSection } from "@/components/GoogleReviewsSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { JsonLd } from "@/components/JsonLd";

export function HomePageContent() {
  return (
    <>
      <JsonLd />
      <LoadingScreen />
      <Header />
      <main id="acasa">
        <Hero />
        <Services />
        <AboutClinic />
        <TeamTrust />
        <ProcessSteps />
        <VideoSection />
        <GoogleReviewsSection />
        <ContactSection />
      </main>
      <Footer />
      <CookieConsent />
    </>
  );
}
