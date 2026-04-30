import { clinic } from "@/lib/data";

const SITE_URL = "https://jbismiledesign.md";

/**
 * JSON-LD pentru rich results în Google.
 * Combină Dentist + LocalBusiness cu geo, opening hours, servicii, rating.
 * Validează la https://validator.schema.org/ și https://search.google.com/test/rich-results
 */
export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    "@id": `${SITE_URL}/#clinic`,
    name: clinic.name,
    description: clinic.shortDescription,
    url: SITE_URL,
    image: `${SITE_URL}/images/jbi-logo.png`,
    logo: `${SITE_URL}/images/jbi-logo.png`,
    telephone: clinic.phone.international,
    email: clinic.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: clinic.address.street,
      addressLocality: clinic.address.city,
      postalCode: clinic.address.postalCode,
      addressCountry: "MD",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 47.0105,
      longitude: 28.8638,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "19:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "10:00",
        closes: "15:00",
      },
    ],
    sameAs: [
      clinic.socials.facebook,
      clinic.socials.instagram,
      clinic.socials.youtube,
      clinic.socials.linkedin,
    ].filter((url) => url && url !== "#"),
    areaServed: { "@type": "City", name: "Chișinău" },
    availableLanguage: ["ro", "en", "ru"],
    medicalSpecialty: "Dentistry",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      reviewCount: "12",
      bestRating: "5",
      worstRating: "1",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Servicii stomatologice",
      itemListElement: [
        "Terapie dentară",
        "Endodonție",
        "Ortodonție",
        "Implantologie dentară",
        "Protetică dentară",
        "Tratamente parodontale",
        "Stomatologie pediatrică",
        "Estetică dentară",
      ].map((service) => ({
        "@type": "Offer",
        itemOffered: { "@type": "MedicalProcedure", name: service },
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
