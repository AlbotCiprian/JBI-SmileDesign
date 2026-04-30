import { clinic } from "@/lib/data";

export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: "JBI Smile Design",
    url: "https://jbismiledesign.md",
    image: "https://jbismiledesign.md/images/jbi-logo.png",
    telephone: clinic.phone.international,
    email: clinic.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Grenoble 257",
      addressLocality: "Chisinau",
      postalCode: "2072",
      addressCountry: "MD",
    },
    sameAs: [clinic.socials.facebook],
    areaServed: "Chisinau, Moldova",
    medicalSpecialty: "Dentistry",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
